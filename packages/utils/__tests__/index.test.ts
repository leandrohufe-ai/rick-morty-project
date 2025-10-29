/**
 * TESTES COM VITEST - Testes Unitários e de Integração
 * 
 * Arquivo: packages/utils/__tests__/index.test.ts
 * 
 * Executar: bun test
 */

import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatDateShort,
  normalizeStatus,
  normalizeGender,
  parseEpisodeNumber,
  sortCharactersByName,
  filterAliveCharacters,
  searchCharactersByName,
  extractIdFromUrl,
  calculateCharacterStats,
  findCharacterById,
} from "../src/index";
import type { Character } from "@rick-morty/types";

// ============================================================================
// TESTES DE FORMATAÇÃO
// ============================================================================

describe("formatDate", () => {
  it("deve formatar data ISO para português legível", () => {
    const result = formatDate("2023-01-15T10:30:00Z");
    expect(result).toContain("janeiro");
    expect(result).toContain("2023");
  });

  it("deve retornar string original se data for inválida", () => {
    const result = formatDate("data-invalida");
    expect(result).toBe("data-invalida");
  });

  it("deve formatar data diferente corretamente", () => {
    const result = formatDateShort("2023-12-25T00:00:00Z");
    expect(result).toContain("25");
    expect(result).toContain("12");
    expect(result).toContain("2023");
  });
});

describe("formatDateShort", () => {
  it("deve formatar data no padrão DD/MM/YYYY", () => {
    const result = formatDateShort("2023-01-15T10:30:00Z");
    expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });
});

// ============================================================================
// TESTES DE NORMALIZAÇÃO
// ============================================================================

describe("normalizeStatus", () => {
  it("deve converter 'Alive' para 'Vivo'", () => {
    expect(normalizeStatus("Alive")).toBe("Vivo");
  });

  it("deve converter 'Dead' para 'Morto'", () => {
    expect(normalizeStatus("Dead")).toBe("Morto");
  });

  it("deve converter 'unknown' para 'Desconhecido'", () => {
    expect(normalizeStatus("unknown")).toBe("Desconhecido");
  });

  it("deve retornar status original se não encontrado", () => {
    expect(normalizeStatus("outro")).toBe("outro");
  });
});

describe("normalizeGender", () => {
  it("deve converter 'Male' para 'Masculino'", () => {
    expect(normalizeGender("Male")).toBe("Masculino");
  });

  it("deve converter 'Female' para 'Feminino'", () => {
    expect(normalizeGender("Female")).toBe("Feminino");
  });

  it("deve converter 'Genderless' para 'Sem gênero'", () => {
    expect(normalizeGender("Genderless")).toBe("Sem gênero");
  });
});

// ============================================================================
// TESTES DE PARSING
// ============================================================================

describe("parseEpisodeNumber", () => {
  it("deve fazer parse de S01E01", () => {
    const result = parseEpisodeNumber("S01E01");
    expect(result.season).toBe(1);
    expect(result.episode).toBe(1);
  });

  it("deve fazer parse de S03E15", () => {
    const result = parseEpisodeNumber("S03E15");
    expect(result.season).toBe(3);
    expect(result.episode).toBe(15);
  });

  it("deve retornar 0,0 se formato for inválido", () => {
    const result = parseEpisodeNumber("invalid");
    expect(result.season).toBe(0);
    expect(result.episode).toBe(0);
  });
});

// ============================================================================
// TESTES DE EXTRAÇÃO
// ============================================================================

describe("extractIdFromUrl", () => {
  it("deve extrair ID de URL", () => {
    const url = "https://rickandmortyapi.com/api/character/1";
    expect(extractIdFromUrl(url)).toBe(1);
  });

  it("deve extrair ID diferente", () => {
    const url = "https://rickandmortyapi.com/api/character/42";
    expect(extractIdFromUrl(url)).toBe(42);
  });

  it("deve retornar 0 se URL inválida", () => {
    expect(extractIdFromUrl("url-invalida")).toBe(0);
  });
});

// ============================================================================
// TESTES DE MANIPULAÇÃO DE ARRAYS
// ============================================================================

const mockCharacters: Character[] = [
  {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    type: "Scientist",
    gender: "Male",
    origin: { id: 1, name: "Earth", type: "Planet", dimension: "C-137", residents: [], url: "", created: "" },
    location: { id: 1, name: "Earth", type: "Planet", dimension: "C-137", residents: [], url: "", created: "" },
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    episode: ["1", "2", "3"],
    url: "https://rickandmortyapi.com/api/character/1",
    created: "2017-11-04T18:48:46.250Z",
  },
  {
    id: 2,
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
    type: "Teenager",
    gender: "Male",
    origin: { id: 1, name: "Earth", type: "Planet", dimension: "C-137", residents: [], url: "", created: "" },
    location: { id: 1, name: "Earth", type: "Planet", dimension: "C-137", residents: [], url: "", created: "" },
    image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
    episode: ["1", "2"],
    url: "https://rickandmortyapi.com/api/character/2",
    created: "2017-11-04T18:50:21.651Z",
  },
  {
    id: 3,
    name: "Summer Smith",
    status: "Alive",
    species: "Human",
    type: "Teenager",
    gender: "Female",
    origin: { id: 1, name: "Earth", type: "Planet", dimension: "C-137", residents: [], url: "", created: "" },
    location: { id: 1, name: "Earth", type: "Planet", dimension: "C-137", residents: [], url: "", created: "" },
    image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
    episode: ["1", "3"],
    url: "https://rickandmortyapi.com/api/character/3",
    created: "2017-11-04T19:09:56.428Z",
  },
];

describe("sortCharactersByName", () => {
  it("deve ordenar personagens alfabeticamente", () => {
    const sorted = sortCharactersByName(mockCharacters);
    expect(sorted[0].name).toBe("Morty Smith");
    expect(sorted[1].name).toBe("Rick Sanchez");
    expect(sorted[2].name).toBe("Summer Smith");
  });

  it("não deve modificar array original", () => {
    const original = [...mockCharacters];
    sortCharactersByName(mockCharacters);
    expect(mockCharacters).toEqual(original);
  });
});

describe("filterAliveCharacters", () => {
  it("deve filtrar apenas personagens vivos", () => {
    const result = filterAliveCharacters(mockCharacters);
    expect(result).toHaveLength(3);
    expect(result.every((char) => char.status === "Alive")).toBe(true);
  });

  it("deve retornar array vazio se nenhum vivo", () => {
    const deadCharacters = mockCharacters.map((char) => ({
      ...char,
      status: "Dead" as const,
    }));
    const result = filterAliveCharacters(deadCharacters);
    expect(result).toHaveLength(0);
  });
});

describe("searchCharactersByName", () => {
  it("deve buscar personagem por nome", () => {
    const result = searchCharactersByName(mockCharacters, "Rick");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Rick Sanchez");
  });

  it("deve ser case-insensitive", () => {
    const result = searchCharactersByName(mockCharacters, "rick");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Rick Sanchez");
  });

  it("deve buscar parcialmente", () => {
    const result = searchCharactersByName(mockCharacters, "Smith");
    expect(result).toHaveLength(2); // Morty e Summer
  });

  it("deve retornar array vazio se não encontrar", () => {
    const result = searchCharactersByName(mockCharacters, "xyz");
    expect(result).toHaveLength(0);
  });
});

describe("findCharacterById", () => {
  it("deve encontrar personagem por ID", () => {
    const result = findCharacterById(mockCharacters, 1);
    expect(result?.name).toBe("Rick Sanchez");
  });

  it("deve retornar undefined se não encontrar", () => {
    const result = findCharacterById(mockCharacters, 999);
    expect(result).toBeUndefined();
  });
});

// ============================================================================
// TESTES DE CÁLCULOS
// ============================================================================

describe("calculateCharacterStats", () => {
  it("deve calcular estatísticas corretas", () => {
    const stats = calculateCharacterStats(mockCharacters);
    expect(stats.total).toBe(3);
    expect(stats.alive).toBe(3);
    expect(stats.dead).toBe(0);
    expect(stats.species).toContain("Human");
  });

  it("deve contar status corretamente com mistura", () => {
    const mixed = [
      ...mockCharacters,
      {
        ...mockCharacters[0],
        id: 999,
        status: "Dead" as const,
      },
    ];
    const stats = calculateCharacterStats(mixed);
    expect(stats.total).toBe(4);
    expect(stats.alive).toBe(3);
    expect(stats.dead).toBe(1);
  });
});