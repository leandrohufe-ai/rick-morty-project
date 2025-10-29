/**
 * Utilitários compartilhados
 */

import type { Character, Episode } from "@rick-morty/types";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  // new Date não lança, então precisamos validar o timestamp
  if (isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString("pt-BR");
}

export function extractIdFromUrl(url: string): number {
  // Extrai dígitos ao final da URL (antes de possível barra)
  const match = url.match(/\/(\d+)(?:\/?$)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function normalizeStatus(status: string): string {
  const statusMap: Record<string, string> = {
    Alive: "Vivo",
    Dead: "Morto",
    unknown: "Desconhecido",
  };
  return statusMap[status] || status;
}

export function normalizeGender(gender: string): string {
  const genderMap: Record<string, string> = {
    Male: "Masculino",
    Female: "Feminino",
    Genderless: "Sem gênero",
    unknown: "Desconhecido",
  };
  return genderMap[gender] || gender;
}

export function parseEpisodeNumber(episodeString: string): {
  season: number;
  episode: number;
} {
  const match = episodeString.match(/S(\d+)E(\d+)/);
  return {
    season: match ? parseInt(match[1], 10) : 0,
    episode: match ? parseInt(match[2], 10) : 0,
  };
}

export function formatEpisodeDisplay(episodeString: string): string {
  const { season, episode } = parseEpisodeNumber(episodeString);
  if (season === 0 && episode === 0) return episodeString;
  return `Temporada ${season}, Episódio ${episode}`;
}

export function sortCharactersByName(characters: Character[]): Character[] {
  return [...characters].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR")
  );
}

export function filterAliveCharacters(characters: Character[]): Character[] {
  return characters.filter((char) => char.status === "Alive");
}

export function filterDeadCharacters(characters: Character[]): Character[] {
  return characters.filter((char) => char.status === "Dead");
}

export function groupCharactersBySpecies(
  characters: Character[]
): Map<string, Character[]> {
  const grouped = new Map<string, Character[]>();
  characters.forEach((char) => {
    if (!grouped.has(char.species)) {
      grouped.set(char.species, []);
    }
    grouped.get(char.species)?.push(char);
  });
  return grouped;
}

export function calculateCharacterStats(characters: Character[]): {
  total: number;
  alive: number;
  dead: number;
  unknown: number;
  species: string[];
} {
  return {
    total: characters.length,
    alive: characters.filter((c) => c.status === "Alive").length,
    dead: characters.filter((c) => c.status === "Dead").length,
    unknown: characters.filter((c) => c.status === "unknown").length,
    species: Array.from(new Set(characters.map((c) => c.species))),
  };
}

export function findCharacterById(
  characters: Character[],
  id: number
): Character | undefined {
  return characters.find((char) => char.id === id);
}

export function searchCharactersByName(
  characters: Character[],
  query: string
): Character[] {
  const lowerQuery = query.toLowerCase();
  return characters.filter((char) =>
    char.name.toLowerCase().includes(lowerQuery)
  );
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).concat("...");
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Normalizações para tradução
export function normalizeSpecies(species: string): string {
  const map: Record<string, string> = {
    Human: "Humano",
    Alien: "Alienígena",
    Humanoid: "Humanoide",
    Robot: "Robô",
    Animal: "Animal",
    "Mythological Creature": "Criatura mitológica",
    Disease: "Doença",
    Cronenberg: "Cronenberg",
    unknown: "Desconhecido",
  };
  return map[species] ?? species;
}
