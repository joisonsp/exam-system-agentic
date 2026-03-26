#!/usr/bin/env node

/**
 * Script para iniciar servidor e rodar testes Cucumber
 * Garante que o servidor está rodando antes de executar os testes
 */

import { spawn, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

const SERVER_PORT = 4000;
const SERVER_URL = `http://localhost:${SERVER_PORT}/health`;
const MAX_RETRIES = 30;
const RETRY_DELAY = 1000; // 1 segundo

function killProcessOnPort(port: number) {
  try {
    console.log(`🔪 Matando processos na porta ${port}...`);

    // No Windows, usar netstat e taskkill
    const netstatOutput = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });

    if (netstatOutput) {
      const lines = netstatOutput.trim().split('\n');
      const pids = new Set<string>();

      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const pid = parts[4];
          if (pid && pid !== '0') {
            pids.add(pid);
          }
        }
      });

      pids.forEach(pid => {
        try {
          execSync(`taskkill /PID ${pid} /F`, { stdio: 'pipe' });
          console.log(`✅ Processo ${pid} terminado`);
        } catch (error) {
          console.log(`⚠️  Não foi possível terminar processo ${pid}`);
        }
      });

      // Aguardar um pouco para garantir que a porta foi liberada
      setTimeout(() => {}, 2000);
    } else {
      console.log(`ℹ️  Nenhum processo encontrado na porta ${port}`);
    }
  } catch (error) {
    console.log(`ℹ️  Erro ao verificar processos na porta ${port}:`, error instanceof Error ? error.message : String(error));
  }
}

async function waitForServer(retries = 0): Promise<boolean> {
  if (retries >= MAX_RETRIES) {
    console.error('❌ Servidor não respondeu no tempo esperado');
    return false;
  }

  try {
    await axios.get(SERVER_URL);
    console.log('✅ Servidor está pronto!');
    return true;
  } catch (error) {
    console.log(`⏳ Aguardando servidor... (tentativa ${retries + 1}/${MAX_RETRIES})`);
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    return waitForServer(retries + 1);
  }
}

async function main() {
  console.log('🚀 Iniciando testes de aceitação...\n');

  // Build server
  console.log('📦 Compilando servidor...');
  try {
    execSync('npm run build --workspace=server', { stdio: 'inherit' });
    console.log('✅ Servidor compilado\n');
  } catch (error) {
    console.error('❌ Erro ao compilar servidor');
    process.exit(1);
  }

  // Kill any existing processes on the port
  killProcessOnPort(SERVER_PORT);

  // Start server in background via ts-node-dev (sem dependência direta de npm no spawn)
  console.log('🚀 Iniciando servidor...');
  const serverProcess = spawn('npx', ['ts-node-dev', '--respawn', '--transpile-only', 'server/src/index.ts'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
  });

  // Wait for server to be ready
  const isReady = await waitForServer();
  if (!isReady) {
    serverProcess.kill();
    process.exit(1);
  }

  // Run Cucumber tests
  console.log('\n🧪 Executando testes Cucumber...\n');
  const testProcess = spawn('npx', ['cucumber-js'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true,
  });

  testProcess.on('exit', (code) => {
    console.log(`\n📊 Testes finalizados com código: ${code}`);

    // Kill server process
    serverProcess.kill();

    // Clean up and exit
    setTimeout(() => {
      process.exit(code || 0);
    }, 1000);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n⏹️  Interrompendo testes...');
    testProcess.kill();
    serverProcess.kill();
    killProcessOnPort(SERVER_PORT); // Garantir que a porta seja liberada
    process.exit(1);
  });

  process.on('SIGTERM', () => {
    console.log('\n⏹️  Terminando processo...');
    testProcess.kill();
    serverProcess.kill();
    killProcessOnPort(SERVER_PORT);
    process.exit(1);
  });

  process.on('exit', () => {
    console.log('\n🧹 Limpando processos...');
    try {
      testProcess.kill();
      serverProcess.kill();
      killProcessOnPort(SERVER_PORT);
    } catch (error) {
      // Ignorar erros de limpeza
    }
  });
}

main().catch((error) => {
  console.error('Erro:', error);
  process.exit(1);
});
