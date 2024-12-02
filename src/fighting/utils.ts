
import { Pokemon } from "src/pokemons/schemas/pokemon.schema";
import { ATTACK_DEFENCE_DIFF_FACTOR, ATTACKER, BASE_ATTACK_DAMAGE, BASE_MISS_CHANCE, MISS_ACCURACY_FACTOR, MISS_SPEED_FACTOR, RANDOM_ATTACK_MULTIPLIER } from "./constants";
import { BASE_CATCH_RATE, LOW_HP_CATCH_RATE_BONUS, LOW_HP_RATION_THRESHOLD } from "./constants";
import { Fighting } from "./schemas/fighting.schema";

export function calculateAttack(
    attacker: Pokemon,
    defender: Pokemon,
    defenderHP: number
): number {
    
    if (didAttackMiss(attacker.Speed, defender.Speed)) {
        return defenderHP; 
    }

    const randomFactor = getRandomFactor();

    const rawDamage = BASE_ATTACK_DAMAGE + Math.max(ATTACK_DEFENCE_DIFF_FACTOR *(attacker.Attack - defender.Defense),0);

    const finalDamage = Math.max(0, rawDamage * randomFactor);

    const newDefenderHP = Math.max(0, defenderHP - finalDamage);

    return newDefenderHP;
}

function didAttackMiss(attckerAccuracy: number, defenderSpeed: number): boolean {
 
    const speedEvasionFactor = defenderSpeed * MISS_SPEED_FACTOR ; 

    const missChance = Math.min(
        BASE_MISS_CHANCE + speedEvasionFactor - attckerAccuracy * MISS_ACCURACY_FACTOR,
        100
    ); 

    return Math.random() * 100 < missChance;
}


function getRandomFactor(): number {
    const { MIN, MAX } = RANDOM_ATTACK_MULTIPLIER;
    return Math.random() * (MAX - MIN) + MIN;
}

export function getDefenderHpKey(attackerIdentifier: ATTACKER):keyof Fighting{
    return attackerIdentifier === ATTACKER.USER
        ? 'pcPokemonHP'
        : 'currentActivePokemonHP';
  }