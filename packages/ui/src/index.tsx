"use client";

import React from "react";
// Evitar dependência direta de Next em pacote UI compartilhado
import { MapPin, Tv } from "lucide-react";
import type { Character, Location, Episode } from "@rick-morty/types";
import {
  normalizeStatus,
  normalizeGender,
  formatDateShort,
  normalizeSpecies,
} from "@rick-morty/utils";

// CHARACTER CARD
export interface CharacterCardProps {
  character: Character;
  onClick?: (character: Character) => void;
  className?: string;
}

export function CharacterCard({
  character,
  onClick,
  className = "",
}: CharacterCardProps) {
  const statusColor =
    character.status === "Alive"
      ? "bg-green-100 text-green-800"
      : character.status === "Dead"
        ? "bg-red-100 text-red-800"
        : "bg-gray-100 text-gray-800";

  return (
    <div
      onClick={() => onClick?.(character)}
      className={`rounded-2xl md:rounded-3xl border border-gray-200 overflow-hidden shadow-sm md:shadow transition-shadow ${className}`}
    >
      <div className="w-full h-40 md:h-48">
        <img
          src={character.image}
          alt={character.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="px-4 py-3 md:px-5 md:py-4">
        <h3 className="font-bold text-base md:text-lg truncate">{character.name}</h3>

        <div className="mt-2 space-y-1.5 text-xs md:text-sm text-gray-600 leading-snug md:leading-relaxed">
          <p>{normalizeSpecies(character.species)}</p>
          <p className="text-gray-500">{normalizeGender(character.gender)}</p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}>
            {normalizeStatus(character.status)}
          </span>
        </div>

        {character.location && (
          <div className="mt-3 flex items-center gap-2 text-xs md:text-sm text-gray-500">
            <MapPin size={14} className="flex-shrink-0" aria-hidden="true" />
            <span className="truncate align-middle">{character.location.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// CHARACTER LIST
export interface CharacterListProps {
  characters: Character[];
  onSelectCharacter?: (character: Character) => void;
  className?: string;
}

export function CharacterList({
  characters,
  onSelectCharacter,
  className = "",
}: CharacterListProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className} `}
    >
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          onClick={onSelectCharacter}
        />
      ))}
    </div>
  );
}

// CHARACTER DETAILS
export interface CharacterDetailsProps {
  character: Character;
  onClose?: () => void;
}

export function CharacterDetails({
  character,
  onClose,
}: CharacterDetailsProps) {
  const statusColor =
    character.status === "Alive"
      ? "text-green-600 bg-green-50"
      : character.status === "Dead"
        ? "text-red-600 bg-red-50"
        : "text-gray-600 bg-gray-50";

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="w-full h-72 md:h-96">
        <img
          src={character.image}
          alt={character.name}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{character.name}</h1>
          <p className={`mt-2 ${statusColor} px-3 py-1 rounded-full inline-block text-sm font-semibold`}>
            {normalizeStatus(character.status)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Espécie</p>
            <p className="text-lg font-semibold">{character.species}</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm">Gênero</p>
            <p className="text-lg font-semibold">
              {normalizeGender(character.gender)}
            </p>
          </div>

          <div>
            <p className="text-gray-600 text-sm">Tipo</p>
            <p className="text-lg font-semibold">{character.type || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm">Criado em</p>
            <p className="text-lg font-semibold">
              {formatDateShort(character.created)}
            </p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div>
            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <MapPin size={18} />
              Origem
            </div>
            <p className="text-gray-600">{character.origin.name}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <MapPin size={18} />
              Localização Atual
            </div>
            <p className="text-gray-600">{character.location.name}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <Tv size={18} />
              Episódios
            </div>
            <p className="text-gray-600">Aparece em {character.episode.length} episódios</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full mt-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
}

// LOADING SKELETON
export function LoadingSkeletonCard() {
  return (
    <div className="rounded-2xl md:rounded-3xl border border-gray-200 overflow-hidden shadow-sm md:shadow animate-pulse">
      <div className="w-full h-40 md:h-48 bg-gray-200" />
      <div className="px-4 py-3 md:px-5 md:py-4 space-y-3">
        <div className="h-5 md:h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-3 md:h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

// EMPTY STATE
export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = "Nenhum resultado encontrado",
  description = "Tente ajustar seus filtros ou faça uma nova busca",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-gray-400 mb-4 text-6xl">🔍</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// PAGINATION
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const pages = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, i) => Math.max(1, currentPage - 2) + i
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
      >
        Anterior
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
      >
        Próxima
      </button>
    </div>
  );
}
