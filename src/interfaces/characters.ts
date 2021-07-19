export interface Character {
  birthYear: string;
  created: string;
  edited: string;
  eyeColor: string;
  films: string[];
  gender: string;
  hairColor: string;
  height: string;
  homeworld: string;
  mass: string;
  name: string;
  skinColor: string;
  species: string[];
  starships: string[];
  url: string;
  vehicles: string[];
}

export interface Cast {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}
