import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

class Database {
  static instance: Database | undefined;
  prisma!: PrismaClient;

  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    this.prisma = new PrismaClient({
      errorFormat: 'minimal',
      adapter,
    });

    Database.instance = this;
  }
}

export default new Database();
