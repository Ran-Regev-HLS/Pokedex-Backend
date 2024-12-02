import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Fighting } from './schemas/fighting.schema';
import { pokemonUneededData } from './utils';

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
      .findByIdAndUpdate(id, updateData, { new: true })
      .lean<Fighting>();
  }

  async remove(id: ObjectId): Promise<Fighting | null> {
    return this.fightingModel.findByIdAndDelete(id).lean<Fighting>();
  }

  async getCurrentFightData(id: Types.ObjectId) {
    const pipeline = [
      ...this.pcPokemonStep(id),
      ...this.userPokemonStep(),
      ...this.userPokemonMergeStep(),
    ];
    return this.fightingModel.aggregate(pipeline);
  }

  private pcPokemonStep(id: Types.ObjectId) {
    const pcProjectionFields = pokemonUneededData('pcPokemon');
    return [
      { $match: { _id: id } },
      {
        $lookup: {
          from: 'pokemons',
          localField: 'pcPokemonId',
          foreignField: '_id',
          as: 'pcPokemon',
        },
      },
      {
        $unwind: {
          path: '$pcPokemon',
        },
      },
      {
        $project: {
          ...pcProjectionFields,
        },
      },
    ];
  }

  private userPokemonStep() {
    const pokemonProjectionFields = pokemonUneededData('userPokemonsData');
    return [
      {
        $lookup: {
          from: 'pokemons',
          localField: 'userPokemons.pokemonId',
          foreignField: '_id',
          as: 'userPokemonsData',
        },
      },
      {
        $project: {
          ...pokemonProjectionFields,
        },
      },
    ];
  }

  private userPokemonMergeStep() {
    return [
      {
        $addFields: {
          userPokemons: {
            $map: {
              input: { $range: [0, { $size: '$userPokemons' }] },
              as: 'index',
              in: {
                $mergeObjects: [
                  { $arrayElemAt: ['$userPokemons', '$$index'] },
                  {
                    pokemonData: {
                      $arrayElemAt: ['$userPokemonsData', '$$index'],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          userPokemonsData: 0,
        },
      },
    ];
  }
}
