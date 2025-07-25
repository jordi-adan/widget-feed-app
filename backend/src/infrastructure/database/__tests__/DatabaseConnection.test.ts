import { Pool } from 'pg';
import { DatabaseConnection } from '../DatabaseConnection';
import { DatabaseConfig } from '../DatabaseConfig';

// Mock pg module
jest.mock('pg', () => ({
    Pool: jest.fn(),
}));

describe('DatabaseConnection', () => {
    let mockPool: any;
    let mockConfig: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock Pool
        mockPool = {
            connect: jest.fn(),
            end: jest.fn(),
            query: jest.fn(),
            totalCount: 10,
            idleCount: 5,
            waitingCount: 0,
        };

        (Pool as any).mockImplementation(() => mockPool);

        // Mock DatabaseConfig
        mockConfig = {
            isPostgreSQL: jest.fn(),
            getPoolConfig: jest.fn(),
            type: 'postgresql',
            host: 'localhost',
            port: 5432,
            database: 'test_db',
            user: 'test_user',
            password: 'test_pass',
        };
    });

    describe('constructor', () => {
        it('should create connection for PostgreSQL configuration', () => {
            mockConfig.isPostgreSQL.mockReturnValue(true);
            mockConfig.getPoolConfig.mockReturnValue({
                host: 'localhost',
                port: 5432,
                database: 'test_db',
                user: 'test_user',
                password: 'test_pass',
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });

            const connection = new DatabaseConnection(mockConfig);

            expect(mockConfig.isPostgreSQL).toHaveBeenCalled();
            expect(mockConfig.getPoolConfig).toHaveBeenCalled();
            expect(Pool).toHaveBeenCalledWith({
                host: 'localhost',
                port: 5432,
                database: 'test_db',
                user: 'test_user',
                password: 'test_pass',
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });
        });

        it('should throw error for memory database type', () => {
            mockConfig.isPostgreSQL.mockReturnValue(false);

            expect(() => new DatabaseConnection(mockConfig))
                .toThrow('DatabaseConnection only supports PostgreSQL databases');
        });
    });

    describe('getClient', () => {
        it('should return pool client', async () => {
            mockConfig.isPostgreSQL.mockReturnValue(true);
            mockConfig.getPoolConfig.mockReturnValue({
                host: 'localhost',
                port: 5432,
                database: 'test_db',
                user: 'test_user',
                password: 'test_pass',
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });

            const mockClient = { release: jest.fn() };
            mockPool.connect.mockResolvedValue(mockClient as any);

            const connection = new DatabaseConnection(mockConfig);
            const client = await connection.getClient();

            expect(mockPool.connect).toHaveBeenCalled();
            expect(client).toBe(mockClient);
        });

        it('should handle connection errors', async () => {
            mockConfig.isPostgreSQL.mockReturnValue(true);
            mockConfig.getPoolConfig.mockReturnValue({
                host: 'localhost',
                port: 5432,
                database: 'test_db',
                user: 'test_user',
                password: 'test_pass',
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });

            const connectionError = new Error('Connection failed');
            mockPool.connect.mockRejectedValue(connectionError);

            const connection = new DatabaseConnection(mockConfig);
            
            await expect(connection.getClient()).rejects.toThrow('Connection failed');
        });
    });

    describe('query', () => {
        beforeEach(() => {
            mockConfig.isPostgreSQL.mockReturnValue(true);
            mockConfig.getPoolConfig.mockReturnValue({
                host: 'localhost',
                port: 5432,
                database: 'test_db',
                user: 'test_user',
                password: 'test_pass',
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });
        });

        it('should execute query with parameters', async () => {
            const queryResult = { rows: [{ id: '1', name: 'test' }], rowCount: 1 };
            mockPool.query.mockResolvedValue(queryResult);

            const connection = new DatabaseConnection(mockConfig);
            const result = await connection.query('SELECT * FROM widgets WHERE id = $1', ['1']);

            expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM widgets WHERE id = $1', ['1']);
            expect(result).toEqual(queryResult);
        });

        it('should execute query without parameters', async () => {
            const queryResult = { rows: [{ count: 5 }], rowCount: 1 };
            mockPool.query.mockResolvedValue(queryResult);

            const connection = new DatabaseConnection(mockConfig);
            const result = await connection.query('SELECT COUNT(*) as count FROM widgets');

            expect(mockPool.query).toHaveBeenCalledWith('SELECT COUNT(*) as count FROM widgets', undefined);
            expect(result).toEqual(queryResult);
        });

        it('should handle query errors', async () => {
            const queryError = new Error('Query failed');
            mockPool.query.mockRejectedValue(queryError);

            const connection = new DatabaseConnection(mockConfig);
            
            await expect(connection.query('INVALID SQL')).rejects.toThrow('Query failed');
        });
    });

    describe('close', () => {
        it('should close the connection pool', async () => {
            mockConfig.isPostgreSQL.mockReturnValue(true);
            mockConfig.getPoolConfig.mockReturnValue({
                host: 'localhost',
                port: 5432,
                database: 'test_db',
                user: 'test_user',
                password: 'test_pass',
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });

            mockPool.end.mockResolvedValue(undefined);

            const connection = new DatabaseConnection(mockConfig);
            await connection.close();

            expect(mockPool.end).toHaveBeenCalled();
        });

        it('should handle close errors gracefully', async () => {
            mockConfig.isPostgreSQL.mockReturnValue(true);
            mockConfig.getPoolConfig.mockReturnValue({
                host: 'localhost',
                port: 5432,
                database: 'test_db',
                user: 'test_user',
                password: 'test_pass',
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });

            const closeError = new Error('Close failed');
            mockPool.end.mockRejectedValue(closeError);

            const connection = new DatabaseConnection(mockConfig);
            
            await expect(connection.close()).rejects.toThrow('Close failed');
        });
    });

    describe('getStats', () => {
        it('should return connection pool statistics', () => {
            mockConfig.isPostgreSQL.mockReturnValue(true);
            mockConfig.getPoolConfig.mockReturnValue({
                host: 'localhost',
                port: 5432,
                database: 'test_db',
                user: 'test_user',
                password: 'test_pass',
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });

            const connection = new DatabaseConnection(mockConfig);
            const stats = connection.getStats();

            expect(stats).toEqual({
                totalCount: 10,
                idleCount: 5,
                waitingCount: 0,
            });
        });
    });
});
