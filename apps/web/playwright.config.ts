import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  
  // Executar testes em paralelo
  fullyParallel: true,
  
  // Falhar se deixar teste focado (.only)
  forbidOnly: !!process.env.CI,
  
  // Reexecução em caso de falha (útil no CI)
  retries: process.env.CI ? 2 : 0,
  
  // Número de workers (paralelos)
  workers: process.env.CI ? 1 : undefined,
  
  // Gerar relatório HTML
  reporter: "html",
  
  // Configurações padrão
  use: {
    // URL base para todos os testes
    baseURL: "http://localhost:3000",
    
    // Rastrear interações
    trace: "on-first-retry",
    
    // Capturar screenshot se falhar
    screenshot: "only-on-failure",
    
    // Gravar vídeo se falhar
    video: "retain-on-failure",
  },

  // Testar em múltiplos navegadores
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  // Iniciar servidor automaticamente
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Timeouts globais
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
});
