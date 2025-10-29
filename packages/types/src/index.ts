/**
 * Tipos compartilhados para a aplicação Rick and Morty
 * Consumindo https://rickandmortyapi.com/api
 */

// ============================================================================
// CARACTERES (Characters)
// ============================================================================

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: Location;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharacterFilters {
  name?: string;
  status?: Character["status"];
  species?: string;
  type?: string;
  gender?: Character["gender"];
}

// ============================================================================
// LOCAIS (Locations)
// ============================================================================

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

export interface LocationFilters {
  name?: string;
  type?: string;
  dimension?: string;
}

// ============================================================================
// EPISÓDIOS (Episodes)
// ============================================================================

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface EpisodeFilters {
  name?: string;
  episode?: string;
}

// ============================================================================
// API RESPONSE (Generic wrapper)
// ============================================================================

export interface ApiInfo {
  count: number;
  pages: number;
  next?: string | null;
  prev?: string | null;
}

export interface ApiResponse<T> {
  info: ApiInfo;
  results: T[];
}

// ============================================================================
// API CONFIG
// ============================================================================

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: "https://rickandmortyapi.com/api",
  timeout: 10000,
  retryAttempts: 3,
};

// Fim dos tipos
