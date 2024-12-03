import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Fighting } from './schemas/fighting.schema';
import { pcPokemonStep, userPokemonMergeStep, userPokemonStep } from './fighting.aggregation';

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
    return this.fightingModel.findById(new Types.ObjectId(id)).lean<Fighting>();
  }

  async update(
    id: string,
    updateData: Partial<Fighting>,
  ): Promise<Fighting | null> {
    return this.fightingModel
      .findByIdAndUpdate(new Types.ObjectId(id) , updateData, { new: true }).lean<Fighting>()
  }

  async remove(id: ObjectId): Promise<Fighting | null> {
    return this.fightingModel.findByIdAndDelete(id).lean<Fighting>();
  }

  async getCurrentFightData(id: Types.ObjectId) {
    const pipeline = [
      ...pcPokemonStep(id),
      ...userPokemonStep,
      ...userPokemonMergeStep,
    ];
    return this.fightingModel.aggregate(pipeline);
  }

  
}
