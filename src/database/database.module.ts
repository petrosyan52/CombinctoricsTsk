// database.module.ts
import { Module } from '@nestjs/common';
import { createPool } from 'mysql2/promise';

const dbProvider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async () => {
    return createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  },
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
