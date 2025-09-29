import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { LinkModule } from './link/link.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, LinkModule],
  providers: [PrismaService],
})
export class AppModule {}
