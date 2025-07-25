export type DatabaseType = 'memory' | 'postgresql';

export interface PoolConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    max: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
}

export class DatabaseConfig {
    public readonly type: DatabaseType;
    public readonly host: string;
    public readonly port: number;
    public readonly database: string;
    public readonly user: string;
    public readonly password: string;

    constructor() {
        this.type = (process.env.DATABASE_TYPE as DatabaseType) || 'memory';
        this.host = process.env.POSTGRES_HOST || 'localhost';
        this.port = parseInt(process.env.POSTGRES_PORT || '5432', 10);
        this.database = process.env.POSTGRES_DB || 'widget_feed_dev';
        this.user = process.env.POSTGRES_USER || 'widget_user';
        this.password = process.env.POSTGRES_PASSWORD || 'widget_pass';

        this.validate();
    }

    private validate(): void {
        if (this.type === 'postgresql') {
            if (!process.env.POSTGRES_HOST || !process.env.POSTGRES_DB || 
                !process.env.POSTGRES_USER || !process.env.POSTGRES_PASSWORD) {
                throw new Error('PostgreSQL configuration requires host, database, user, and password');
            }
        }
    }

    public isPostgreSQL(): boolean {
        return this.type === 'postgresql';
    }

    public getConnectionString(): string {
        if (this.type !== 'postgresql') {
            throw new Error('Connection string not available for memory database');
        }

        return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    }

    public getPoolConfig(): PoolConfig {
        if (this.type !== 'postgresql') {
            throw new Error('Pool configuration not available for memory database');
        }

        return {
            host: this.host,
            port: this.port,
            database: this.database,
            user: this.user,
            password: this.password,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        };
    }
}
