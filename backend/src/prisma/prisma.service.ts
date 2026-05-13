import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { join } from 'path';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: PrismaClient;

  constructor() {
    const dbPath = join(process.cwd(), 'prisma', 'dev.db');

    const adapter = new PrismaBetterSqlite3({
      url: `file:${dbPath}`,
    });

    this.client = new PrismaClient({ adapter });
  }

  get db() {
    return this.client;
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
