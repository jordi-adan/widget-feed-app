import { DatabaseConfig } from '../DatabaseConfig';

describe('DatabaseConfig', () => {
    beforeEach(() => {
        // Clear environment variables
        delete process.env.DATABASE_TYPE;
        delete process.env.POSTGRES_HOST;
        delete process.env.POSTGRES_PORT;
        delete process.env.POSTGRES_DB;
        delete process.env.POSTGRES_USER;
        delete process.env.POSTGRES_PASSWORD;
    });

    describe('constructor', () => {
        it('should create config with default values when no environment variables set', () => {
            const config = new DatabaseConfig();

            expect(config.type).toBe('memory');
            expect(config.host).toBe('localhost');
            expect(config.port).toBe(5432);
            expect(config.database).toBe('widget_feed_dev');
            expect(config.user).toBe('widget_user');
            expect(config.password).toBe('widget_pass');
        });

        it('should create config from environment variables', () => {
            process.env.DATABASE_TYPE = 'postgresql';
            process.env.POSTGRES_HOST = 'db-server';
            process.env.POSTGRES_PORT = '5433';
            process.env.POSTGRES_DB = 'custom_db';
            process.env.POSTGRES_USER = 'custom_user';
            process.env.POSTGRES_PASSWORD = 'custom_pass';

            const config = new DatabaseConfig();

            expect(config.type).toBe('postgresql');
            expect(config.host).toBe('db-server');
            expect(config.port).toBe(5433);
            expect(config.database).toBe('custom_db');
            expect(config.user).toBe('custom_user');
            expect(config.password).toBe('custom_pass');
        });

        it('should validate required fields for postgresql type', () => {
            process.env.DATABASE_TYPE = 'postgresql';
            // Missing required fields

            expect(() => new DatabaseConfig()).toThrow('PostgreSQL configuration requires host, database, user, and password');
        });

        it('should accept postgresql type with all required fields', () => {
            process.env.DATABASE_TYPE = 'postgresql';
            process.env.POSTGRES_HOST = 'localhost';
            process.env.POSTGRES_DB = 'test_db';
            process.env.POSTGRES_USER = 'test_user';
            process.env.POSTGRES_PASSWORD = 'test_pass';

            expect(() => new DatabaseConfig()).not.toThrow();
        });
    });

    describe('isPostgreSQL', () => {
        it('should return true when type is postgresql', () => {
            process.env.DATABASE_TYPE = 'postgresql';
            process.env.POSTGRES_HOST = 'localhost';
            process.env.POSTGRES_DB = 'test_db';
            process.env.POSTGRES_USER = 'test_user';
            process.env.POSTGRES_PASSWORD = 'test_pass';

            const config = new DatabaseConfig();
            expect(config.isPostgreSQL()).toBe(true);
        });

        it('should return false when type is memory', () => {
            const config = new DatabaseConfig();
            expect(config.isPostgreSQL()).toBe(false);
        });
    });

    describe('getConnectionString', () => {
        it('should return connection string for postgresql', () => {
            process.env.DATABASE_TYPE = 'postgresql';
            process.env.POSTGRES_HOST = 'localhost';
            process.env.POSTGRES_PORT = '5432';
            process.env.POSTGRES_DB = 'test_db';
            process.env.POSTGRES_USER = 'test_user';
            process.env.POSTGRES_PASSWORD = 'test_pass';

            const config = new DatabaseConfig();
            const connectionString = config.getConnectionString();

            expect(connectionString).toBe('postgresql://test_user:test_pass@localhost:5432/test_db');
        });

        it('should throw error for memory type', () => {
            const config = new DatabaseConfig();
            
            expect(() => config.getConnectionString()).toThrow('Connection string not available for memory database');
        });
    });

    describe('getPoolConfig', () => {
        it('should return pool configuration for postgresql', () => {
            process.env.DATABASE_TYPE = 'postgresql';
            process.env.POSTGRES_HOST = 'localhost';
            process.env.POSTGRES_PORT = '5432';
            process.env.POSTGRES_DB = 'test_db';
            process.env.POSTGRES_USER = 'test_user';
            process.env.POSTGRES_PASSWORD = 'test_pass';

            const config = new DatabaseConfig();
            const poolConfig = config.getPoolConfig();

            expect(poolConfig).toEqual({
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

        it('should throw error for memory type', () => {
            const config = new DatabaseConfig();
            
            expect(() => config.getPoolConfig()).toThrow('Pool configuration not available for memory database');
        });
    });
});
