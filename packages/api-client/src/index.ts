/**
 * Cliente da API Rick and Morty
 */

import axios, { AxiosInstance } from "axios";
import type {
  Character,
  Location,
  Episode,
  ApiResponse,
  CharacterFilters,
  ApiConfig,
} from "@rick-morty/types";
import { DEFAULT_API_CONFIG } from "@rick-morty/types";

export class RickAndMortyApiClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private retryAttempts: number;

  constructor(config: Partial<ApiConfig> = {}) {
    const fullConfig = { ...DEFAULT_API_CONFIG, ...config };
    this.baseUrl = fullConfig.baseUrl;
    this.retryAttempts = fullConfig.retryAttempts;

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: fullConfig.timeout,
    });
  }

  async getCharacters(
    filters?: CharacterFilters,
    page: number = 1
  ): Promise<ApiResponse<Character>> {
    const params = new URLSearchParams();
    params.append("page", page.toString());

    if (filters?.name) params.append("name", filters.name);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.species) params.append("species", filters.species);
    if (filters?.gender) params.append("gender", filters.gender);

    return this.fetchWithRetry<ApiResponse<Character>>(
      `/character?${params.toString()}`
    );
  }

  async getCharacter(id: number): Promise<Character> {
    return this.fetchWithRetry<Character>(`/character/${id}`);
  }

  async getCharactersByIds(ids: number[]): Promise<Character[]> {
    return this.fetchWithRetry<Character[]>(`/character/${ids.join(",")}`);
  }

  async getLocations(page: number = 1): Promise<ApiResponse<Location>> {
    return this.fetchWithRetry<ApiResponse<Location>>(
      `/location?page=${page}`
    );
  }

  async getLocation(id: number): Promise<Location> {
    return this.fetchWithRetry<Location>(`/location/${id}`);
  }

  async getEpisodes(page: number = 1): Promise<ApiResponse<Episode>> {
    return this.fetchWithRetry<ApiResponse<Episode>>(`/episode?page=${page}`);
  }

  async getEpisode(id: number): Promise<Episode> {
    return this.fetchWithRetry<Episode>(`/episode/${id}`);
  }

  async getEpisodesByIds(ids: number[]): Promise<Episode[]> {
    return this.fetchWithRetry<Episode[]>(`/episode/${ids.join(",")}`);
  }

  private async fetchWithRetry<T>(endpoint: string): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.client.get<T>(endpoint);
        return response.data;
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error("Erro desconhecido");

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          throw lastError;
        }

        if (attempt < this.retryAttempts) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}

export const rickAndMortyApi = new RickAndMortyApiClient();
export default RickAndMortyApiClient;
