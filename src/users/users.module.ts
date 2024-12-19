import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), 
  ],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
