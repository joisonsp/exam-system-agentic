/**
 * Hooks - Setup e Teardown para testes Cucumber
 * Iniciando/finalizando servidor de teste
 */

import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { ProvasWorld } from './world';
import * as http from 'http';
import axios from 'axios';

// Aumentar timeout para operações de arquivo/API
setDefaultTimeout(30 * 1000); // 30 segundos

let server: http.Server | null = null;

Before(async function (this: ProvasWorld) {
  console.log('🚀 Iniciando cenário de teste...');

  // Aguardar o servidor estar pronto
  let retries = 0;
  const maxRetries = 30;

  while (retries < maxRetries) {
    try {
      const response = await axios.get(`${this.apiBaseUrl.replace('/api', '')}/health`);
      if (response.status === 200) {
        console.log('✅ Servidor está pronto!');
        break;
      }
    } catch (error) {
      retries++;
      if (retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      }
    }
  }

  if (retries === maxRetries) {
    console.warn('⚠️ Servidor não respondeu no tempo esperado, continuando mesmo assim...');
  }
});

After(async function (this: ProvasWorld, scenario) {
  console.log(`\n✅ Cenário '${scenario.pickle.name}' finalizado`);

  // Limpar dados de teste
  this.reset();

  // Não encerrar servidor aqui pois ele será usado nos próximos cenários
});

// Hook para lidar com cenários falhados
After(async function (this: ProvasWorld, scenario) {
  if (scenario.result?.status === 'FAILED') {
    console.error(`\n❌ Cenário falhou: ${scenario.pickle.name}`);
    console.error(`Última resposta:`, JSON.stringify(this.lastResponse?.data, null, 2));
    console.error(`Último erro:`, this.lastError);
  }
});
