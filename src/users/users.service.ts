import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepository } from './users.repository';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(userData: Partial<User>): Promise<User> {
    return this.userRepository.createUser(userData);
  }

  async getUserByCognitoId(cognitoId: string): Promise<User> {
    const user = await this.userRepository.findByCognitoId(cognitoId);
    return user;
  }

  async getUserById(id: Types.ObjectId): Promise<User> {
    const user = await this.userRepository.findById(id);
    return user;
  }

  async updateUser(cognitoId: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userRepository.updateUser(cognitoId, updateData);
    if (!updatedUser) {
      throw new NotFoundException(`User with Cognito ID ${cognitoId} not found`);
    }
    return updatedUser;
  }
}