# RabbitMQ Tutorial - Node.js

Este projeto demonstra como usar RabbitMQ com Node.js usando a biblioteca `amqplib`.

## 🚀 Início Rápido (2 minutos)

Se você tem Docker instalado, pode começar agora mesmo:

```bash
# 1. Iniciar RabbitMQ
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management

# 2. Instalar dependências do projeto (usando Yarn)
yarn install

# 3. Em um terminal, iniciar o receptor
cd javascript-nodejs/src && node receive.js

# 4. Em outro terminal, enviar uma mensagem
cd javascript-nodejs/src && node send.js
```

✅ **Pronto!** Você verá a mensagem sendo enviada e recebida.

🌐 **Interface Web**: http://localhost:15672 (guest/guest)

💡 **Nota**: Este projeto usa **Yarn** como gerenciador de pacotes para maior velocidade e confiabilidade.

## Pré-requisitos

1. **RabbitMQ** instalado e rodando no localhost
2. **Node.js** (versão 12 ou superior)
3. **Yarn** (gerenciador de pacotes) - [Instalar Yarn](https://yarnpkg.com/getting-started/install)

## Instalação do RabbitMQ

### 🐳 Opção 1: Docker (RECOMENDADO para estudos)

A forma mais rápida e prática para estudar RabbitMQ é usando Docker. Não precisa instalar nada no sistema, apenas ter Docker instalado:

```bash
# RabbitMQ 4.1 (versão mais recente) com interface de gerenciamento
docker run -it --rm --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:4-management
```

**Vantagens do Docker:**

- ✅ Instalação instantânea
- ✅ Não "suja" seu sistema operacional
- ✅ Fácil de remover quando não precisar mais
- ✅ Sempre a versão mais recente
- ✅ Interface de gerenciamento já habilitada

### 🖥️ Opção 2: Instalação Nativa

#### Ubuntu/Debian:

```bash
sudo apt-get update
sudo apt-get install rabbitmq-server
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server
```

#### macOS (usando Homebrew):

```bash
brew install rabbitmq
brew services start rabbitmq
```

#### Windows:

Baixe o instalador oficial do [RabbitMQ](https://www.rabbitmq.com/install-windows.html)

## Verificar se RabbitMQ está rodando

### Se usando Docker:

```bash
# Verificar se o container está rodando
docker ps | grep rabbitmq

# Ver logs do RabbitMQ
docker logs rabbitmq
```

### Se usando instalação nativa:

```bash
sudo systemctl status rabbitmq-server
```

### Interface de Gerenciamento Web

Acesse o painel de gerenciamento em: http://localhost:15672

- **Username**: guest
- **Password**: guest

## Comandos Docker Úteis para Estudos

```bash
# Iniciar RabbitMQ em background (persiste entre reinicializações)
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:4-management

# Parar o RabbitMQ
docker stop rabbitmq

# Iniciar novamente o mesmo container
docker start rabbitmq

# Remover o container (quando não precisar mais)
docker rm -f rabbitmq

# Ver logs em tempo real
docker logs -f rabbitmq
```

## ✅ Se você já tem RabbitMQ funcionando (instalação nativa)

**Parabéns!** Se você tem RabbitMQ rodando nativamente no seu sistema, pode pular direto para a execução dos scripts.

**Verificar se está funcionando:**
```bash
# Verificar se o serviço está ativo
sudo systemctl status rabbitmq-server

# Verificar se a interface web está acessível
curl -I http://localhost:15672
```

**Para habilitar a interface de gerenciamento web (se ainda não estiver habilitada):**
```bash
# Habilitar plugin de management
sudo rabbitmq-plugins enable rabbitmq_management

# Reiniciar o serviço (se necessário)
sudo systemctl restart rabbitmq-server
```

**Interface de Gerenciamento Web:**
- URL: http://localhost:15672
- Usuário: `guest`
- Senha: `guest`

## Instalação das dependências

**Este projeto usa Yarn como gerenciador de pacotes:**

```bash
# Instalar dependências (cria automaticamente yarn.lock se não existir)
yarn install

# Verificar se as dependências foram instaladas
yarn list --depth=0
```

**Principais vantagens do Yarn:**
- 🚀 **Mais rápido** que npm para instalação
- 🔒 **Lock file confiável** (yarn.lock) para dependências consistentes  
- 📦 **Cache global** evita re-downloads desnecessários
- 🔧 **Melhor resolução** de dependências

**Comandos úteis do Yarn:**
```bash
# Instalar uma nova dependência
yarn add nome-do-pacote

# Atualizar dependências
yarn upgrade

# Verificar dependências desatualizadas  
yarn outdated

# Limpar cache (se necessário)
yarn cache clean
```

## Como executar

**Antes de executar, certifique-se de que o RabbitMQ está rodando:**

### ✅ Verificação rápida:
```bash
# Teste 1: Verificar se está rodando
curl -s -I http://localhost:15672 | head -1

# Se retornar "HTTP/1.1 200 OK" = ✅ Funcionando!
# Se retornar erro de conexão = ❌ Não está rodando
```

### 🔍 Verificações detalhadas:
- **Instalação nativa**: `sudo systemctl status rabbitmq-server`
- **Docker**: `docker ps | grep rabbitmq`
- **Interface web**: http://localhost:15672 (deve abrir no navegador)

### 1. Executar o Consumidor (Receptor)

Em um terminal, execute:

```bash
cd javascript-nodejs/src
node receive.js
```

Você verá a mensagem:

```
[*] Waiting for messages in hello. To exit press CTRL+C
```

### 2. Executar o Produtor (Enviador)

Em outro terminal, execute:

```bash
cd javascript-nodejs/src
node send.js
```

Você verá:

```
[x] Sent Hello World!
```

E no terminal do `receive.js`, você verá:

```
[x] Received Hello World!
```

## Estrutura do Projeto

```
rabbitmq-tutorials/
├── package.json
├── yarn.lock        # Lock file do Yarn
├── README.md
└── javascript-nodejs/
    └── src/
        ├── send.js      # Produtor - envia mensagens
        └── receive.js   # Consumidor - recebe mensagens
```

## Explicação dos Arquivos

### send.js

- Conecta ao RabbitMQ usando as credenciais padrão (`guest:guest`)
- Cria uma fila chamada "hello"
- Envia uma mensagem "Hello World!"
- Fecha a conexão automaticamente após 500ms

### receive.js

- Conecta ao RabbitMQ usando as credenciais padrão (`guest:guest`)
- Cria uma fila chamada "hello" (se não existir)
- Fica ouvindo mensagens na fila
- Exibe as mensagens recebidas no console

## Credenciais de Autenticação

O RabbitMQ usa por padrão:

- **Username**: `guest`
- **Password**: `guest`

**Importante**: O usuário `guest` só funciona em conexões localhost por motivos de segurança.

## ⚖️ Docker vs Instalação Nativa - Qual escolher?

### 🐳 Use Docker quando:

- ✅ **Estudando/aprendendo** RabbitMQ
- ✅ Quer começar **rapidamente**
- ✅ Não quer "poluir" seu sistema operacional
- ✅ Testa diferentes versões facilmente
- ✅ Pode deletar sem deixar rastros
- ✅ Funciona igual em qualquer OS (Linux, Mac, Windows)

### 🖥️ Use instalação nativa quando:

- ✅ **Ambiente de produção**
- ✅ Precisa de **máxima performance**
- ✅ Configurações avançadas específicas do OS
- ✅ Integração com systemd/serviços do sistema
- ✅ Já tem um servidor dedicado

### 💡 Recomendação para estudos:

**Comece com Docker!** É mais rápido, prático e você pode sempre migrar para instalação nativa depois.

## Preparação para NestJS + DigitalOcean

Para usar em produção com NestJS e DigitalOcean:

1. **Crie um usuário específico** (não use `guest` em produção):

```bash
sudo rabbitmqctl add_user myuser mypassword
sudo rabbitmqctl set_user_tags myuser administrator
sudo rabbitmqctl set_permissions -p / myuser ".*" ".*" ".*"
```

2. **Configure variáveis de ambiente**:

```env
RABBITMQ_URL=amqp://myuser:mypassword@your-digitalocean-server:5672
```

3. **No NestJS**, use o módulo `@nestjs/microservices`:

```typescript
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

const client: ClientProxy = ClientProxyFactory.create({
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL],
    queue: 'your_queue_name',
    queueOptions: {
      durable: false,
    },
  },
});
```

```

## 🚀 Demo Completa em Linha de Comando

Para testar tudo de uma vez, você pode usar este comando:

```bash
# Teste completo: receptor + envio + resultado
cd javascript-nodejs/src && timeout 3s node receive.js & sleep 1 && node send.js && wait
```

**Resultado esperado:**
```
[*] Waiting for messages in hello. To exit press CTRL+C
[x] Sent Hello World!
[x] Received Hello World!
```

## 📊 Monitoramento Web

Acesse http://localhost:15672 e você verá:
- **Overview**: Estatísticas gerais do sistema
- **Connections**: Conexões ativas 
- **Channels**: Canais de comunicação
- **Exchanges**: Pontos de troca de mensagens
- **Queues**: Filas de mensagens (verá a fila "hello" criada pelos scripts)

## Troubleshooting

### 🐳 Problemas com Docker

#### Container não está rodando

```bash
# Verificar se Docker está instalado
docker --version

# Iniciar RabbitMQ se não estiver rodando
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management

# Verificar logs se houver problema
docker logs rabbitmq
```

#### Porta já está em uso

```bash
# Verificar o que está usando a porta 5672
sudo netstat -tulpn | grep 5672

# Usar portas diferentes se necessário
docker run -d --name rabbitmq -p 5673:5672 -p 15673:15672 rabbitmq:4-management
```

### 🖥️ Problemas com Instalação Nativa

#### Verificar versão instalada
```bash
# Verificar versão do RabbitMQ
dpkg -l | grep rabbitmq-server

# Deve mostrar algo como:
# ii rabbitmq-server 4.1.3-1 all Multi-protocol messaging broker
```

#### Plugin de management não habilitado
```bash
# Habilitar plugin de management
sudo rabbitmq-plugins enable rabbitmq_management

# Verificar plugins habilitados
sudo rabbitmq-plugins list | grep management
```

#### Serviço não está rodando
```bash
# Iniciar o serviço
sudo systemctl start rabbitmq-server

# Habilitar para iniciar automaticamente
sudo systemctl enable rabbitmq-server

# Verificar logs se houver problema
sudo journalctl -u rabbitmq-server -f
```

#### Erro: ACCESS_REFUSED

Se você receber o erro `ACCESS_REFUSED - Login was refused`:

1. Certifique-se de que está usando as credenciais corretas (`guest:guest`)
2. Verifique se o RabbitMQ está rodando: `sudo systemctl status rabbitmq-server`
3. O usuário `guest` só funciona em localhost

#### Erro: ECONNREFUSED

Se receber `ECONNREFUSED`:

1. Certifique-se de que o RabbitMQ está instalado e rodando
2. Verifique se está usando a porta correta (5672 para AMQP, 15672 para management UI)

### 🔧 Problemas Comuns nos Scripts Node.js

#### Erro: Cannot find module 'amqplib'

```bash
#### Erro: Cannot find module 'amqplib'
```bash
# Instalar dependências
yarn install
```
```

#### Erro de conexão mesmo com RabbitMQ rodando

1. Aguarde alguns segundos após iniciar o RabbitMQ (especialmente no Docker)
2. Verifique se as portas estão expostas corretamente
3. Teste a conexão pelo browser: http://localhost:15672
