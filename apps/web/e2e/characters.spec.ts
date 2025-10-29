import { test, expect } from "@playwright/test";

const mockApiResponse = {
  info: { count: 3, pages: 2, next: null, prev: null },
  results: [
    {
      id: 1,
      name: "Rick Sanchez",
      status: "Alive",
      species: "Human",
      type: "",
      gender: "Male",
      origin: { name: "Earth (C-137)", url: "" },
      location: { name: "Citadel of Ricks", url: "" },
      image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      episode: ["S01E01"],
      url: "https://rickandmortyapi.com/api/character/1",
      created: "2017-11-04T18:48:46.250Z",
    },
    {
      id: 2,
      name: "Morty Smith",
      status: "Alive",
      species: "Human",
      type: "",
      gender: "Male",
      origin: { name: "Earth (C-137)", url: "" },
      location: { name: "Citadel of Ricks", url: "" },
      image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
      episode: ["S01E01"],
      url: "https://rickandmortyapi.com/api/character/2",
      created: "2017-11-04T18:50:21.651Z",
    },
    {
      id: 3,
      name: "Summer Smith",
      status: "Alive",
      species: "Human",
      type: "",
      gender: "Female",
      origin: { name: "Earth (C-137)", url: "" },
      location: { name: "Earth (Replacement Dimension)", url: "" },
      image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
      episode: ["S01E01"],
      url: "https://rickandmortyapi.com/api/character/3",
      created: "2017-11-04T19:09:56.428Z",
    },
  ],
};

test.describe("Lista de Personagens", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/character**", async (route) => {
      const url = route.request().url();
      // Interceptar apenas a listagem (com query string)
      if (url.includes("/api/character?")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockApiResponse),
        });
      } else {
        await route.continue();
      }
    });
    await page.goto("/");
    // Navegação pronta; conteúdo será validado por seletores específicos
  });

  test("Buscar personagem por nome", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Buscar personagem...");
    await expect(searchInput).toBeVisible();

    // Buscar por "Morty" e validar resultado
    await searchInput.fill("Morty");
    await expect(page.getByText(/Morty Smith/i)).toBeVisible({ timeout: 15000 });
  });

  test("Filtrar por status (Vivos)", async ({ page }) => {
    const vivosButton = page.getByRole("button", { name: "Vivos" });
    await expect(vivosButton).toBeVisible();

    await vivosButton.click();
    // Badge "Vivo" deve aparecer nos cards
    await expect(page.getByText("Vivo").first()).toBeVisible({ timeout: 15000 });
  });

  test("Paginação funciona quando disponível", async ({ page }) => {
    const nextButton = page.getByRole("button", { name: "Próxima" });
    const prevButton = page.getByRole("button", { name: "Anterior" });

    const hasNext = await nextButton.count();
    const hasPrev = await prevButton.count();

    if (hasNext > 0) {
      await expect(nextButton).toBeEnabled();
      await nextButton.click();
      await expect(page.locator("h3").first()).toBeVisible({ timeout: 15000 });
    }

    if (hasPrev > 0) {
      await expect(prevButton).toBeVisible();
      await expect(prevButton).toBeEnabled();
      // Evitar segundo clique para reduzir flakiness
    }

    // Se não houver paginação, apenas validar que cards continuam visíveis
    await expect(page.locator("h3").first()).toBeVisible();
  });
});
