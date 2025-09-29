import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { PrismaService } from '../prisma.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [LinkService, PrismaService],
  controllers: [LinkController],
  exports: [LinkService],
})
export class LinkModule {}
