"use client";

import { useState, useEffect } from "react";
import type { Character } from "@rick-morty/types";
import {
  CharacterList,
  EmptyState,
  Pagination,
  LoadingSkeletonCard,
} from "@rick-morty/ui";
import { RickAndMortyApiClient } from "@rick-morty/api-client";
import { SearchBar } from "./components/SearchBar";
import { FilterBar } from "./components/FilterBar";

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Character["status"]>("");

  const client = new RickAndMortyApiClient();

  const fetchCharacters = async (pageNum: number, query: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await client.getCharacters(
        {
          name: query || undefined,
          status: statusFilter || undefined,
        },
        pageNum
      );

      setCharacters(response.results);
      setTotalPages(response.info.pages);
    } catch (err) {
      setError("Erro ao buscar personagens. Tente novamente.");
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchCharacters(1, searchQuery);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    if (page !== 1) {
      fetchCharacters(page, searchQuery);
    }
  }, [page]);

  const loadingSkeletons = Array.from({ length: 8 }, (_, i) => (
    <LoadingSkeletonCard key={i} />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              Rick and Morty
            </h1>
            <p className="mt-2 text-gray-600">
              Explore o universo de Rick and Morty
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar personagem..."
          />
          <FilterBar
            statusFilter={statusFilter}
            onStatusChange={(s) => setStatusFilter(s as "" | Character["status"])}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {loadingSkeletons}
          </div>
        ) : characters.length > 0 ? (
          <>
            <CharacterList characters={characters} />
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                isLoading={loading}
              />
            )}
          </>
        ) : (
          <EmptyState
            title="Nenhum personagem encontrado"
            description={
              searchQuery
                ? `Não encontramos "${searchQuery}". Tente outro nome.`
                : "Nenhum personagem disponível com os filtros selecionados."
            }
            action={{
              label: "Limpar filtros",
              onClick: () => {
                setSearchQuery("");
                setStatusFilter("");
                setPage(1);
              },
            }}
          />
        )}
      </main>

      <footer className="mt-16 bg-gray-800 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>
            Desenvolvido com Next.js, Bun e{" "}
            <a
              href="https://rickandmortyapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Rick and Morty API
            </a>
          </p>
          <p className="mt-2 text-sm">© 2025 - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}
