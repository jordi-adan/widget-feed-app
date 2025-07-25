import { Pool, PoolClient, QueryResult } from 'pg';
import { DatabaseConfig } from './DatabaseConfig';

export interface ConnectionStats {
    totalCount: number;
    idleCount: number;
    waitingCount: number;
}

export class DatabaseConnection {
    private pool: Pool;

    constructor(private config: DatabaseConfig) {
        if (!config.isPostgreSQL()) {
            throw new Error('DatabaseConnection only supports PostgreSQL databases');
        }

        this.pool = new Pool(config.getPoolConfig());
    }

    async getClient(): Promise<PoolClient> {
        return await this.pool.connect();
    }

    async query(text: string, params?: any[]): Promise<QueryResult> {
        return await this.pool.query(text, params);
    }

    async close(): Promise<void> {
        await this.pool.end();
    }

    getStats(): ConnectionStats {
        return {
            totalCount: this.pool.totalCount,
            idleCount: this.pool.idleCount,
            waitingCount: this.pool.waitingCount,
        };
    }
}
