import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Fighting } from './schemas/fighting.schema';

@Injectable()
export class FightingRepository {
  constructor(
    @InjectModel(Fighting.name) private readonly fightingModel: Model<Fighting>,
  ) {}

  async create(data: Partial<Fighting>): Promise<Fighting> {
    return this.fightingModel.create(data);
  }

  async findAll(): Promise<Fighting[]> {
    return this.fightingModel.find().lean<Fighting[]>();
  }

  async findOne(id: string): Promise<Fighting | null> {
    return this.fightingModel.findById(id).lean<Fighting>();
  }

  async update(
    id: string,
    updateData: Partial<Fighting>,
  ): Promise<Fighting | null> {
    return this.fightingModel
      .findByIdAndUpdate(id, updateData, { new: true }).lean<Fighting>()
  }

  async remove(id: ObjectId): Promise<Fighting | null> {
    return this.fightingModel.findByIdAndDelete(id).lean<Fighting>();
  }
}
