import { Types } from 'mongoose';
const fightingAggregationProjection = {
    _id: 1,
    pcPokemonId: 1,
    pcPokemonHP: 1,
    currentActivePokemonId: 1,
    currentActivePokemonHP: 1,
    status: 1,
    catchAttempts: 1,
    userTurn:1, 
    "userPokemons.pokemonId": 1,
    "userPokemons.hp": 1,
    ...pokemonProjectionData("userPokemons.pokemonData"),
    ...pokemonProjectionData("pcPokemonData"),
    ...pokemonProjectionData("currentActivePokemonData"),

};
export function pokemonProjectionData(field: string) {
  return {
    [`${field}.name`]: 1,
    [`${field}.image`]: 1,
    [`${field}.id`]: 1,
    [`${field}.Attack`]: 1,
    [`${field}.hp`]: 1,
  };
}

export const pcPokemonStep = (id: Types.ObjectId) => {
  return [
    { $match: { _id: id } },
    {
      $lookup: {
        from: 'pokemons',
        localField: 'pcPokemonId',
        foreignField: '_id',
        as: 'pcPokemonData',
      },
    },
    {
      $unwind: {
        path: '$pcPokemonData',
      },
    },
  ];
};

export const userPokemonStep = [
  {
    $lookup: {
      from: 'pokemons',
      localField: 'currentActivePokemonId',
      foreignField: '_id',
      as: 'currentActivePokemonData',
    },
  },
  {
    $unwind: {
      path: '$currentActivePokemonData',
    },
  },
  {
    $lookup: {
      from: 'pokemons',
      localField: 'userPokemons.pokemonId',
      foreignField: '_id',
      as: 'userPokemonsData',
    },
  },
];

export const userPokemonMergeStep = [
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
                pokemonData: { $arrayElemAt: ['$userPokemonsData', '$$index'] },
              },
            ],
          },
        },
      },
    },
  },
    {
      $project: {
       ...fightingAggregationProjection
      },
    },
];
