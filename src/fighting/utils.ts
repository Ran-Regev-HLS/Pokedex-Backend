import { Pokemon } from 'src/pokemons/schemas/pokemon.schema';
import {
  ATTACK_DEFENCE_DIFF_FACTOR,
  ATTACKER,
  BASE_ATTACK_DAMAGE,
  BASE_MISS_CHANCE,
  MISS_ACCURACY_FACTOR,
  MISS_SPEED_FACTOR,
  RANDOM_ATTACK_MULTIPLIER,
} from './constants';
import {
  BASE_CATCH_RATE,
  LOW_HP_CATCH_RATE_BONUS,
  LOW_HP_RATION_THRESHOLD,
} from './constants';
import { Fighting } from './schemas/fighting.schema';
import { ObjectId, Types } from 'mongoose';
import { checkPossibleSwitchProps } from './types';

export function calculateAttack(
  attacker: Pokemon,
  defender: Pokemon,
  defenderHP: number,
): number {
  if (didAttackMiss(attacker.Speed, defender.Speed)) {
    return defenderHP;
  }

  const randomFactor = getRandomFactor();

  const rawDamage =
    BASE_ATTACK_DAMAGE +
    Math.max(
      ATTACK_DEFENCE_DIFF_FACTOR * (attacker.Attack - defender.Defense),
      0,
    );

  const typeMultiplier = getTypeEffectivenessMultiplier(
    attacker.type,
    defender.type,
  );

  const finalDamage = Math.max(0, rawDamage * randomFactor * typeMultiplier);

  const newDefenderHP = Math.max(0, defenderHP - finalDamage);

  return newDefenderHP;
}

function didAttackMiss(
  attckerAccuracy: number,
  defenderSpeed: number,
): boolean {
  const speedEvasionFactor = defenderSpeed * MISS_SPEED_FACTOR;

  const missChance = Math.min(
    BASE_MISS_CHANCE +
      speedEvasionFactor -
      attckerAccuracy * MISS_ACCURACY_FACTOR,
    100,
  );

  return Math.random() * 100 < missChance;
}

function getRandomFactor(): number {
  const { MIN, MAX } = RANDOM_ATTACK_MULTIPLIER;
  return Math.random() * (MAX - MIN) + MIN;
}

export function getDefenderHpKey(attackerIdentifier: ATTACKER): keyof Fighting {
  return attackerIdentifier === ATTACKER.USER
    ? 'pcPokemonHP'
    : 'currentActivePokemonHP';
}

export function getAttackerId(
  isAttackerPC: boolean,
  fight: Fighting,
): Types.ObjectId {
  return isAttackerPC ? fight.pcPokemonId : fight.currentActivePokemonId;
}

function calculateCatchRate(currentHP: number, BaseHP: number): number {
  let catchRate = BASE_CATCH_RATE;
  if (currentHP < LOW_HP_RATION_THRESHOLD * BaseHP) {
    catchRate += LOW_HP_CATCH_RATE_BONUS;
  }
  return Math.min(catchRate, 1);
}

export function attemptCatch(opponentHp: number, BaseHP: number): boolean {
  const randomValue = Math.random();
  const catchRate = calculateCatchRate(opponentHp, BaseHP);
  return randomValue <= catchRate;
}

const TYPE_EFFECTIVENESS: Record<string, Record<string, number>> = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: {
    Grass: 2,
    Ice: 2,
    Bug: 2,
    Steel: 2,
    Fire: 0.5,
    Water: 0.5,
    Rock: 0.5,
    Dragon: 0.5,
  },
  Water: { Fire: 2, Ground: 2, Rock: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5 },
  Electric: {
    Water: 2,
    Flying: 2,
    Electric: 0.5,
    Grass: 0.5,
    Ground: 0,
    Dragon: 0.5,
  },
  Grass: {
    Water: 2,
    Ground: 2,
    Rock: 2,
    Fire: 0.5,
    Grass: 0.5,
    Poison: 0.5,
    Flying: 0.5,
    Bug: 0.5,
    Dragon: 0.5,
    Steel: 0.5,
  },
  Ice: {
    Grass: 2,
    Ground: 2,
    Flying: 2,
    Dragon: 2,
    Fire: 0.5,
    Water: 0.5,
    Ice: 0.5,
    Steel: 0.5,
  },
  Fighting: {
    Normal: 2,
    Ice: 2,
    Rock: 2,
    Dark: 2,
    Steel: 2,
    Poison: 0.5,
    Flying: 0.5,
    Psychic: 0.5,
    Bug: 0.5,
    Fairy: 0.5,
    Ghost: 0,
  },
  Poison: {
    Grass: 2,
    Fairy: 2,
    Poison: 0.5,
    Ground: 0.5,
    Rock: 0.5,
    Ghost: 0.5,
    Steel: 0,
  },
  Ground: {
    Fire: 2,
    Electric: 2,
    Poison: 2,
    Rock: 2,
    Steel: 2,
    Grass: 0.5,
    Bug: 0.5,
    Flying: 0,
  },
  Flying: {
    Grass: 2,
    Fighting: 2,
    Bug: 2,
    Electric: 0.5,
    Rock: 0.5,
    Steel: 0.5,
  },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
  Bug: {
    Grass: 2,
    Psychic: 2,
    Dark: 2,
    Fire: 0.5,
    Fighting: 0.5,
    Poison: 0.5,
    Flying: 0.5,
    Ghost: 0.5,
    Steel: 0.5,
    Fairy: 0.5,
  },
  Rock: {
    Fire: 2,
    Ice: 2,
    Flying: 2,
    Bug: 2,
    Fighting: 0.5,
    Ground: 0.5,
    Steel: 0.5,
  },
  Ghost: { Psychic: 2, Ghost: 2, Normal: 0, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
  Steel: {
    Ice: 2,
    Rock: 2,
    Fairy: 2,
    Fire: 0.5,
    Water: 0.5,
    Electric: 0.5,
    Steel: 0.5,
  },
  Fairy: {
    Fighting: 2,
    Dragon: 2,
    Dark: 2,
    Fire: 0.5,
    Poison: 0.5,
    Steel: 0.5,
  },
};

function getTypeEffectivenessMultiplier(
  attackerTypes: string[],
  defenderTypes: string[],
): number {
  let multiplier = 1;
  attackerTypes.forEach((attackerType) => {
    defenderTypes.forEach((defenderType) => {
      multiplier *= TYPE_EFFECTIVENESS[attackerType]?.[defenderType] || 1;
    });
  });
  return multiplier;
}


export const checkPossibleSwitch = ({
  userPokemons,
  currentActivePokemonId,
}: checkPossibleSwitchProps): boolean => {
  return userPokemons.some(
    (pokemon) =>
      !pokemon.pokemonId.equals(currentActivePokemonId) && pokemon.hp > 0,
  );
};
