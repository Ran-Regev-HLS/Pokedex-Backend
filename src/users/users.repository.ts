import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/users.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findByCognitoId(cognitoId: string): Promise<User | null> {
    return this.userModel.findOne({ cognitoId }).exec();
  }

  async findById(id:  Types.ObjectId): Promise<User | null> {
    return this.userModel.findById({ id }).exec();
  }

  async updateUser(cognitoId: string, updateData: Partial<User>): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ cognitoId }, { $set: updateData }, { new: true })
      .exec();
  }

}
