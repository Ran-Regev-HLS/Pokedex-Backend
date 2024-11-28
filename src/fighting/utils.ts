import { Pokemon } from "src/pokemons/schemas/pomemon.schema";
import { ATTACK_DEFENCE_DIFF_FACTOR, BASE_ATTACK_DAMAGE, BASE_MISS_CHANCE, MAX_HP, MISS_ACCURACY_FACTOR, MISS_SPEED_FACTOR, RANDOM_ATTACK_MULTIPLIER } from "./constants";
import { BASE_CATCH_RATE, LOW_HP_CATCH_RATE_BONUS, LOW_HP_RATION_THRESHOLD } from "./constants";

export function calculateAttack(
    attacker: Pokemon,
    defender: Pokemon,
    defenderHP: number
): number {
    
    if (didAttackMiss(attacker.base.Speed, defender.base.Speed)) {
        return defenderHP; 
    }

    const randomFactor = getRandomFactor();

    const rawDamage = BASE_ATTACK_DAMAGE + Math.max(ATTACK_DEFENCE_DIFF_FACTOR *(attacker.base.Attack - defender.base.Defense),0);

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


function calculateCatchRate(currentHP: number): number {
    let catchRate = BASE_CATCH_RATE;
    if(currentHP < LOW_HP_RATION_THRESHOLD * MAX_HP){
        catchRate += LOW_HP_CATCH_RATE_BONUS;
    }
    return Math.min(catchRate, 1); 
}

export function attemptCatch(opponentHp: number): boolean{
    const randomValue = Math.random();
    const catchRate = calculateCatchRate(opponentHp);
    return randomValue <= catchRate ;
}
