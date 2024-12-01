export const RANDOM_ATTACK_MULTIPLIER = {
    MIN: 0.7,
    MAX: 1.3,
}

export const BASE_MISS_CHANCE = 0.05;

export const MISS_SPEED_FACTOR = 0.1;

export const MISS_ACCURACY_FACTOR = 0.1;

export const BASE_ATTACK_DAMAGE = 20;

export const ATTACK_DEFENCE_DIFF_FACTOR = 0.5;

export const BASE_CATCH_RATE = 0.1;

export const LOW_HP_RATION_THRESHOLD = 0.2;

export const LOW_HP_CATCH_RATE_BONUS = 0.1;

export const MAX_CATCH_ATTEMPTS = 3;

export enum FightStatus {
    PRE_FIGHT = "READY",
    IN_FIGHT = "IN FIGHT",
    FINISHED = "FINISHED",
}

export enum AttackOutcome {
    SUCCESSFUL = "SUCCESSFUL",
    MISSED = "MISSED",
}

export enum CatchOutcome {
    CAUGHT = "CAUGHT",
    MISSED = "MISSED",
    FLED = "FLED"
}