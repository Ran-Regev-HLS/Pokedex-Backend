import { Types } from "mongoose";
import { FightStatus } from "./constants";

interface PokemonData {
    id: number;
    name: string;
    image: string;
    hp: number;
    Attack: number;
  }
  
  interface UserPokemon {
    pokemonId: string; 
    hp: number;
    pokemonData: PokemonData;
  }
  
  export class AggregatedFightingResult {
    _id: string;
    pcPokemonId: string;
    pcPokemonHP: number;
    userPokemons: UserPokemon[];
    currentActivePokemonId: string; 
    currentActivePokemonHP: number;
    status: FightStatus; 
    catchAttempts: number;
    pcPokemonData: PokemonData;
    currentActivePokemonData: PokemonData;
    userTurn: boolean;
  }
  
  export type checkPossibleSwitchProps = {
    userPokemons: { pokemonId: Types.ObjectId; hp: number }[];
    currentActivePokemonId: Types.ObjectId;
  };