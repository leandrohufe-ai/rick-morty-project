# 📚 Como Funciona o Projeto Rick and Morty – Guia Atualizado (2025)

## 🎯 Visão Geral

Aplicação web moderna que consome a [Rick and Morty API](https://rickandmortyapi.com/) para listar personagens com busca, filtros e paginação. Monorepo com Next.js, Bun e TypeScript, componentes UI reutilizáveis e testes unitários/E2E.

## 🔄 Atualizações Recentes

- UI dos cards ajustada para melhor leitura em mobile:
  - Padding interno: `px-4 py-3 md:px-5 md:py-4`.
  - Espaçamento/linha: `leading-snug md:leading-relaxed` com `space-y-1.5`.
  - Cantos muito arredondados: `rounded-2xl md:rounded-3xl`.
  - Borda suave: `border border-gray-200` e `shadow-sm md:shadow`.
  - Removido `cursor-pointer` dos cards (interatividade opcional via prop `onClick`).
- Correções em utils (packages/utils):
  - `formatDate` agora valida data com `isNaN(date.getTime())` e retorna a string original quando inválida.
  - `extractIdFromUrl` usa regex `/(\/\d+)(?:\/?$)/` para extrair ID com segurança, retornando `0` se não corresponder.
- Testes E2E adicionados com Playwright (apps/web/e2e):
  - `smoke.spec.ts`: verifica carregamento da home e renderização de cards.
  - `characters.spec.ts`: cobre busca, filtro por status e paginação, com mock da API para testes determinísticos.

---

## 🧱 Stack e Arquitetura

- Next.js 16 (App Router) + React 19
- Bun (runtime + package manager)
- TypeScript (modo `strict`)
- Tailwind CSS
- Axios (cliente HTTP)
- Playwright (E2E) e Vitest (unitários)

### Estrutura do Monorepo

```
rick-morty-project/
├── apps/
│   ├── web/              # Aplicação Next.js principal
│   └── api/              # API interna (estrutura base)
├── packages/
│   ├── types/            # Tipos TypeScript compartilhados
│   ├── api-client/       # Cliente HTTP da Rick and Morty API
│   ├── utils/            # Funções utilitárias
│   ├── ui/               # Componentes UI reutilizáveis
│   └── config/           # Configurações compartilhadas
├── docs/                 # Documentação
├── scripts/              # Scripts auxiliares
├── package.json          # Configuração raiz (workspaces + scripts)
└── vitest.config.ts      # Configuração de testes unitários
```

### Aliases e Imports (App Web)

Configuração em `apps/web/tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@rick-morty/types": ["../../packages/types/src/index.ts"],
      "@rick-morty/ui": ["../../packages/ui/src/index.tsx"],
      "@rick-morty/api-client": ["../../packages/api-client/src/index.ts"],
      "@rick-morty/utils": ["../../packages/utils/src/index.ts"]
    },
    "strict": true
  }
}
```

---

## 🧩 Packages

### `packages/types`
- Tipos compartilhados (`Character`, `ApiResponse`, `ApiConfig`, etc.).
- `DEFAULT_API_CONFIG` com `baseUrl = "https://rickandmortyapi.com/api"`, `timeout = 10000`, `retryAttempts = 3`.

### `packages/api-client`
- Classe `RickAndMortyApiClient` usando Axios.
- Métodos principais:
  - `getCharacters(filters?, page?)` → GET `/character?{params}`.
  - `getCharacter(id)` → GET `/character/{id}`.
  - `getCharactersByIds(ids)` → GET `/character/{id1,id2,...}`.
- Retry exponencial com backoff e tratamento de 404.

### `packages/utils`
- Formatação e normalização:
  - `formatDate`, `formatDateShort`, `normalizeStatus`, `normalizeGender`, `normalizeSpecies`.
- Transformações/utilitários:
  - `extractIdFromUrl`, `sortCharactersByName`, `filterAliveCharacters`, `filterDeadCharacters`, `groupCharactersBySpecies`, `searchCharactersByName`, etc.
- Correções importantes:
  - `formatDate` valida timestamp para evitar `Invalid Date`.
  - `extractIdFromUrl` apenas extrai dígitos finais da URL ou retorna `0`.

### `packages/ui`
- Componentes:
  - `CharacterCard`, `CharacterList`, `CharacterDetails`, `LoadingSkeletonCard`, `EmptyState`, `Pagination`.
- Diretrizes visuais atualizadas:
  - Cards com cantos arredondados (`rounded-2xl md:rounded-3xl`), borda suave (`border-gray-200`) e sombra leve (`shadow-sm md:shadow`).
  - Imagens com `object-cover` e container com `overflow-hidden`.
  - Tipografia e espaçamento otimizados para mobile.

---

## 🖥️ App Web (`apps/web`)

### Componentes Locais
- `SearchBar`: input controlado, placeholder padrão "Buscar personagem...".
- `FilterBar`: botões para status (`Todos`, `Vivos`, `Mortos`, `Desconhecido`).

### Página Principal (`src/app/page.tsx`)
- Estado: `characters`, `loading`, `error`, `page`, `totalPages`, `searchQuery`, `statusFilter`.
- Efeitos:
  - Busca inicial e quando `searchQuery`/`statusFilter` mudam.
  - Busca em mudança de `page`.
- Renderização condicional:
  - `LoadingSkeletonCard` quando `loading`.
  - `CharacterList` + `Pagination` quando há dados.
  - `EmptyState` quando vazio.

### Fluxo Geral
1. Usuário abre `http://localhost:3000`.
2. Página inicial monta estado e busca via `RickAndMortyApiClient`.
3. Exibe skeletons → substitui por cards ao receber dados.
4. Interações: busca por nome, filtros de status e paginação.

---

## 🧪 Testes

### Unitários (Vitest)
- Local: `packages/utils/__tests__` e similares.
- Execução:
  - Raiz: `bun run test` (modo watch/disponível via scripts). 
  - Cobertura: `bun run test:coverage`.

### E2E (Playwright)
- Configuração: `apps/web/playwright.config.ts`.
  - `baseURL = "http://localhost:3000"`.
  - `webServer` inicia `bun run dev` automaticamente.
  - `reporter: "html"` com trace, screenshot e vídeo em falhas.
- Testes criados:
  - `apps/web/e2e/smoke.spec.ts`.
  - `apps/web/e2e/characters.spec.ts`.
- Mock de API para testes determinísticos:

```ts
// Exemplo simplificado de interceptação no teste
await page.route("**/api/character**", async (route) => {
  const url = route.request().url();
  if (url.includes("/api/character?")) {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockApiResponse)
    });
  } else {
    await route.continue();
  }
});
```

- Rodando E2E:
  - Na raiz: `bun run test:e2e`.
  - Na app web: `bun run test:e2e` (em `apps/web`).
  - Report: `bun run test:e2e:report` (abre HTML).

---

## 🛠️ Scripts Principais

### Raiz (`package.json`)
- `dev`: roda app web em desenvolvimento.
- `build`, `start`, `lint`, `type-check`.
- `test`, `test:watch`, `test:ui`, `test:coverage` (Vitest).
- `test:e2e`, `test:e2e:debug`, `test:e2e:headed`, `test:e2e:report` (Playwright).

### App Web (`apps/web/package.json`)
- `dev`, `build`, `start`, `lint`.
- `test:e2e`, `test:e2e:headed`, `test:e2e:debug`, `test:e2e:report`.

---

## 🔐 Variáveis de Ambiente

- `NEXT_PUBLIC_API_BASE_URL` para client-side.
- Server-side: variáveis privadas somente no servidor.
- Acesso via `process.env`.

---

## 🎨 Diretrizes de UI/UX

- Componentes funcionais e props tipadas.
- Sem lógica de negócio na app web; use packages.
- Tailwind como base de estilos, sem cores de borda explícitas nos cards (borda usa escala `gray`).
- Acessibilidade: atributos ARIA e roles em botões/links.

---

## 🧼 Clean Code e Type Safety

- Nomes significativos e funções pequenas.
- DRY: reutilizar utilitários.
- TypeScript `strict` sem `any`.
- Exportar tipos com `export type { ... }`.
- Evitar ciclos de dependência.

---

## 🚀 Como Rodar

1. `bun install` na raiz.
2. `bun run dev` na raiz ou `apps/web`.
3. Abrir `http://localhost:3000`.
4. Testes unitários: `bun run test`.
5. Testes E2E: `bun run test:e2e`.

---

## 📖 Recursos

- Next.js: https://nextjs.org/docs
- Bun: https://bun.sh
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Playwright: https://playwright.dev/docs/intro
- Rick and Morty API: https://rickandmortyapi.com/

---

**Versão**: 1.1.0  
**Atualizado**: 29 de outubro de 2025  
**Status**: Ativo

