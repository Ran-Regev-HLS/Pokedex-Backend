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

  const finalDamage = Math.max(0, rawDamage * randomFactor);

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

export function pokemonUneededData(field: string) {
  return {
    [`${field}._id`]: 0,
    [`${field}.weight`]: 0,
    [`${field}.height`]: 0,
    [`${field}.ability`]: 0,
    [`${field}.isOwned`]: 0,
    [`${field}.type`]: 0,
    [`${field}.species`]: 0,
    [`${field}.description`]: 0,
    [`${field}.Defense`]: 0,
    [`${field}.Speed`]: 0,
    [`${field}.Sp`]: 0,
    [`${field}.hp`]: 0,
  };
}
