import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fighting } from '../schemas/fighting.schema';

@Injectable()
export class FightingRepository {
  constructor(
    @InjectModel(Fighting.name) private readonly fightingModel: Model<Fighting>,
  ) {}

  async create(data: Partial<Fighting>): Promise<Fighting> {
    const fighting = new this.fightingModel(data);
    return fighting.save();
  }

  async findAll(): Promise<Fighting[]> {
    return this.fightingModel.find().exec();
  }

  async findOne(id: string): Promise<Fighting | null> {
    return this.fightingModel.findById(id).exec();
  }

  async update(
    id: string,
    updateData: Partial<Fighting>,
  ): Promise<Fighting | null> {
    return this.fightingModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Fighting | null> {
    return this.fightingModel.findByIdAndDelete(id).exec();
  }
}
