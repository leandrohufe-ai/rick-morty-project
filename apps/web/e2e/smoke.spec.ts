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

test.describe("Smoke Test", () => {
  test("A página principal deve carregar e exibir o título e os personagens", async ({
    page,
  }) => {
    // 1. Mockar a API e navegar para a página inicial
    await page.route("**/api/character**", async (route) => {
      const url = route.request().url();
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

    // 2. Verificar se o título principal está visível
    await expect(
      page.getByRole("heading", { name: "Rick and Morty" })
    ).toBeVisible();

    // 3. Verificar se pelo menos um card de personagem é renderizado
    const characterCards = await page.locator("div > h3").all();
    expect(characterCards.length).toBeGreaterThan(0);

    // 4. Validar que existem headings de cards renderizados
    await expect(page.locator("h3").first()).toBeVisible({ timeout: 15000 });
  });
});

