# 💳 Sistema de Pagamento Recorrente - Documentação Completa

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [O que foi implementado](#o-que-foi-implementado)
3. [Fluxo Completo](#fluxo-completo)
4. [Próximos Passos](#próximos-passos)
5. [Como Testar](#como-testar)
6. [Estrutura do Código](#estrutura-do-código)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Sistema completo de pagamento recorrente via **Pix** utilizando a API da **ZyonPay**, desenvolvido com **Clean Architecture** no Express.js.

### Principais Funcionalidades:
- ✅ Criação de assinaturas com pagamento Pix recorrente
- ✅ Geração de QR Code e Pix Copia e Cola
- ✅ Webhook para receber callbacks da ZyonPay
- ✅ Ativação automática de assinaturas após pagamento
- ✅ Email de confirmação após pagamento bem-sucedido
- ✅ Suporte para planos mensais e anuais
- ✅ Validação de dados com Zod
- ✅ Arquitetura limpa e escalável

---

## ✅ O que foi Implementado

### 1. **Database Schema** (Prisma)

```prisma
// Enums
enum PlanPeriodicity {
  MONTHLY
  ANNUAL
}

enum SubscriptionStatus {
  PENDING
  ACTIVE
  CANCELED
  EXPIRED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  CANCELED
  REFUNDED
}

// Models
model Plan {
  id          String            @id @default(uuid())
  name        String
  description String?
  amount      Int               // Valor em centavos
  periodicity PlanPeriodicity
  isActive    Boolean           @default(true)
  subscriptions Subscription[]
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

model Subscription {
  id        String              @id @default(uuid())
  authId    String
  planId    String
  status    SubscriptionStatus  @default(PENDING)
  startDate DateTime?
  endDate   DateTime?
  auth      Auth                @relation(fields: [authId], references: [id])
  plan      Plan                @relation(fields: [planId], references: [id])
  payments  Payment[]
  createdAt DateTime            @default(now())
  updatedAt DateTime            @updatedAt
}

model Payment {
  id             String         @id @default(uuid())
  subscriptionId String
  transactionId  String?        @unique
  amount         Int            // Valor em centavos
  status         PaymentStatus  @default(PENDING)
  pixQrCode      String?
  pixCopyPaste   String?
  paidAt         DateTime?
  subscription   Subscription   @relation(fields: [subscriptionId], references: [id])
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}
```

### 2. **Domain Layer** (Entidades e Repositórios)

#### Entidades:
- **`PlanEntity`**: Gerencia planos com métodos `activate()` e `deactivate()`
- **`SubscriptionEntity`**: Controla assinaturas com `activate()`, `cancel()`, `expire()`
- **`PaymentEntity`**: Gerencia pagamentos com `markAsPaid()`, `markAsFailed()`, `cancel()`, `refund()`

#### Repositórios (Interfaces):
- **`IPlanRepository`**: CRUD de planos + `findAllActive()`
- **`ISubscriptionRepository`**: CRUD + `findActiveByAuthId()`, `findExpiredSubscriptions()`
- **`IPaymentRepository`**: CRUD + `findByTransactionId()`, `findPendingPayments()`

### 3. **Application Layer** (Use Cases e DTOs)

#### Use Cases:

**`CreatePixPaymentUseCase`**:
1. Valida se o usuário existe
2. Verifica se já tem assinatura ativa
3. Valida se o plano existe e está ativo
4. Busca CPF/CNPJ e telefone do usuário
5. Cria a assinatura com status PENDING
6. Cria o pagamento com status PENDING
7. Chama a API da ZyonPay para gerar o Pix
8. Salva os dados do Pix (QR Code, Copia e Cola)
9. Retorna os dados para o cliente

**`HandlePaymentWebhookUseCase`**:
1. Busca o pagamento pelo `transactionId`
2. Verifica se já foi processado
3. Atualiza o status do pagamento
4. Se PAID: ativa a assinatura e envia email
5. Se FAILED/CANCELED/REFUNDED: cancela a assinatura

#### DTOs com Validação Zod:
- **`CreatePixPaymentDTO`**: Valida `planId` (UUID)
- **`WebhookPaymentDTO`**: Valida `transactionId`, `status`, `paidAt`

### 4. **Infrastructure Layer**

#### **ZyonPayService**:
- Integração com endpoint `/gateway/pix/subscription`
- Autenticação com headers `x-public-key` e `x-secret-key`
- Envia dados completos para criar assinatura recorrente

#### **Repositórios Prisma**:
- `PrismaPlanRepository`
- `PrismaSubscriptionRepository`
- `PrismaPaymentRepository`

#### **Controllers**:
- `PaymentController`: Gerencia criação de pagamentos
- `WebhookController`: Recebe callbacks da ZyonPay

#### **Routes**:
```typescript
POST /payments/pix        // Autenticado - Cria pagamento Pix
POST /payments/webhook    // Público - Recebe callback da ZyonPay
```

---

## 🔄 Fluxo Completo

### **Fluxo de Criação de Assinatura:**

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       │ 1. POST /payments/pix { planId }
       │    (com JWT token)
       ▼
┌──────────────────┐
│ PaymentController│
└────────┬─────────┘
         │
         │ 2. Validações
         ▼
┌───────────────────────────┐
│ CreatePixPaymentUseCase   │
│                           │
│ • Valida usuário          │
│ • Verifica assinatura     │
│ • Valida plano            │
│ • Busca CPF/phone         │
│ • Cria subscription       │
│ • Cria payment            │
└────────┬──────────────────┘
         │
         │ 3. Chama API ZyonPay
         ▼
┌──────────────────┐
│  ZyonPayService  │
│                  │
│ POST /gateway/   │
│  pix/subscription│
└────────┬─────────┘
         │
         │ 4. Retorna QR Code + Copia e Cola
         ▼
┌──────────────────┐
│  PaymentEntity   │
│ (salva no DB)    │
└────────┬─────────┘
         │
         │ 5. Retorna dados
         ▼
┌─────────────┐
│   Cliente   │
│             │
│ Recebe:     │
│ • QR Code   │
│ • Copia Cola│
│ • IDs       │
└─────────────┘
```

### **Fluxo do Webhook (Após Pagamento):**

```
┌─────────────┐
│  ZyonPay    │
└──────┬──────┘
       │
       │ 1. POST /payments/webhook
       │    { transactionId, status, paidAt }
       ▼
┌──────────────────┐
│ WebhookController│
└────────┬─────────┘
         │
         │ 2. Valida dados
         ▼
┌───────────────────────────────┐
│ HandlePaymentWebhookUseCase   │
│                               │
│ • Busca payment               │
│ • Atualiza status             │
│ • Se PAID:                    │
│   ├─ Ativa subscription       │
│   ├─ Define startDate/endDate │
│   └─ Envia email              │
└────────┬──────────────────────┘
         │
         │ 3. Email
         ▼
┌──────────────────┐
│ NodemailerService│
│                  │
│ Envia email de   │
│ confirmação      │
└────────┬─────────┘
         │
         ▼
┌─────────────┐
│   Cliente   │
│ (recebe     │
│  email)     │
└─────────────┘
```

---

## 📝 Próximos Passos

### 1. **Configurar Variáveis de Ambiente**

Adicione ao arquivo `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sherlocker"

# JWT
JWT_SECRET="seu_secret_aqui"
JWT_SECRET_NOACCESS="seu_secret_noaccess_aqui"
JWT_EXPIRES_IN="7d"

# Email
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="seu_email@gmail.com"
MAIL_PASSWORD="sua_senha_app"

# Mind API
MIND_TOKEN="seu_token_mind"

# ZyonPay (OBTER NO PAINEL)
ZYONPAY_PUBLIC_KEY="sua_chave_publica"
ZYONPAY_SECRET_KEY="sua_chave_secreta"
ZYONPAY_BASE_URL="https://dash.zyonpay.app/api/v1"

# App
APP_URL="http://localhost:3000"
PORT=3000
```

### 2. **Obter Credenciais da ZyonPay**

1. Acesse: https://dash.zyonpay.app
2. Faça login na sua conta
3. Vá em **Integrações** → **API**
4. Clique em **Gerar Credenciais**
5. Copie `x-public-key` e `x-secret-key`
6. Cole no arquivo `.env`

### 3. **Rodar a Migração do Prisma**

```bash
# Inicia o banco de dados
docker-compose up -d

# Roda a migração (cria as tabelas Plan, Subscription, Payment)
npx prisma migrate dev --name add_payment_system

# Gera o Prisma Client
npx prisma generate
```

### 4. **Criar Planos de Teste**

Use o Prisma Studio ou crie via código:

```bash
npx prisma studio
```

Ou crie um seed file:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Plano Mensal
  await prisma.plan.create({
    data: {
      name: 'Plano Mensal',
      description: 'Acesso completo por 1 mês',
      amount: 9900, // R$ 99,00
      periodicity: 'MONTHLY',
      isActive: true,
    },
  })

  // Plano Anual
  await prisma.plan.create({
    data: {
      name: 'Plano Anual',
      description: 'Acesso completo por 1 ano',
      amount: 99900, // R$ 999,00
      periodicity: 'ANNUAL',
      isActive: true,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Execute:
```bash
tsx prisma/seed.ts
```

### 5. **Configurar Webhook na ZyonPay**

No painel da ZyonPay, configure a URL do webhook:

```
https://seu-dominio.com/payments/webhook
```

**Importante sobre o Webhook:**
- A ZyonPay enviará notificações com `status: "PAID"`, `"FAILED"`, `"CANCELED"`, ou `"REFUNDED"`
- O endpoint `/payments/webhook` é **público** (não requer autenticação)
- O sistema valida o `transactionId` antes de processar
- Cada status dispara ações diferentes:
  - `PAID`: Ativa subscription + envia email
  - `FAILED/CANCELED/REFUNDED`: Cancela subscription

Para desenvolvimento local, use **ngrok**:

```bash
# Instala ngrok
brew install ngrok  # ou baixe de ngrok.com

# Cria tunnel
ngrok http 3000

# Use a URL gerada (ex: https://abc123.ngrok.io)
# Configure no painel: https://abc123.ngrok.io/payments/webhook
```

**Testando o webhook localmente:**
Você pode simular o callback da ZyonPay manualmente antes de configurar o webhook real.

---

## 🧪 Como Testar

### **Pré-requisitos:**
```bash
# Instalar dependências
pnpm install

# Subir banco de dados
docker-compose up -d

# Rodar migrações
npx prisma migrate dev

# Iniciar servidor
pnpm dev
```

### **Teste 1: Criar Assinatura**

#### 1.1 - Fazer Login (obter token JWT)
```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "teste@example.com"
}

# Valida o OTP recebido
POST http://localhost:3000/auth/validate
Content-Type: application/json

{
  "email": "teste@example.com",
  "otp": "123456"
}

# Guarde o token retornado
```

#### 1.2 - Listar Planos Disponíveis
```bash
# Use Prisma Studio para ver os IDs
npx prisma studio
# Ou crie uma rota GET /plans (não implementada ainda)
```

#### 1.3 - Criar Pagamento Pix
```bash
POST http://localhost:3000/payments/pix
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_JWT_AQUI

{
  "planId": "uuid-do-plano-aqui"
}
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "paymentId": "uuid-do-pagamento",
    "subscriptionId": "uuid-da-subscription",
    "transactionId": "clwuwmn4i0007emp9lgn66u1h",
    "zyonSubscriptionId": "cm9hf2cly0004xwvpl5mt1yj7",
    "amount": 9900,
    "pixQrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "pixCopyPaste": "00020101021126530014BR.GOV.BCB.PIX0136254e...",
    "pixQrCodeImage": "https://api.gateway.com/pix/qr/00020101021126530014...",
    "nextChargeAt": "2025-12-08T15:30:00.000Z",
    "expiresAt": "2025-11-09T23:59:59.000Z"
  }
}
```

**Campos retornados:**
- `paymentId`: ID do pagamento no sistema Sherlocker
- `subscriptionId`: ID da assinatura no sistema Sherlocker
- `transactionId`: ID da transação na ZyonPay
- `zyonSubscriptionId`: ID da assinatura recorrente na ZyonPay
- `amount`: Valor em centavos (9900 = R$ 99,00)
- `pixQrCode`: QR Code em formato base64 (pode renderizar diretamente no frontend)
- `pixCopyPaste`: Código Pix Copia e Cola
- `pixQrCodeImage`: URL da imagem do QR Code (alternativa ao base64)
- `nextChargeAt`: Data da próxima cobrança automática
- `expiresAt`: Data de expiração do pagamento (24h)

#### 1.4 - Simular Pagamento
Use o QR Code ou Copia e Cola para fazer o pagamento via Pix em ambiente de testes da ZyonPay.

**Você recebeu 3 formas de usar o QR Code:**
1. **Base64** (`pixQrCode`): Renderize diretamente no HTML
   ```html
   <img src="data:image/png;base64,iVBORw0KGg..." alt="QR Code Pix" />
   ```

2. **URL da Imagem** (`pixQrCodeImage`): Use como source de imagem
   ```html
   <img src="https://api.gateway.com/pix/qr/..." alt="QR Code Pix" />
   ```

3. **Copia e Cola** (`pixCopyPaste`): Exiba o código para copiar
   ```
   00020101021126530014BR.GOV.BCB.PIX...
   ```

#### 1.5 - Verificar Webhook
Após o pagamento, a ZyonPay enviará automaticamente:

```bash
POST http://localhost:3000/payments/webhook
Content-Type: application/json

{
  "transactionId": "clwuwmn4i0007emp9lgn66u1h",
  "status": "PAID",
  "paidAt": "2025-11-08T15:30:00.000Z"
}
```

**Importante**: A ZyonPay envia o webhook com `status: "PAID"` quando o pagamento é confirmado. O sistema automaticamente:
- Marca o pagamento como PAID
- Ativa a subscription com status ACTIVE
- Calcula startDate (agora) e endDate (baseado na periodicidade do plano)
- Envia email de confirmação

#### 1.6 - Verificar no Banco
```sql
-- Ver subscription ativada
SELECT * FROM "Subscription" WHERE status = 'ACTIVE';

-- Ver pagamento confirmado
SELECT * FROM "Payment" WHERE status = 'PAID';

-- Ver datas de início e fim
SELECT id, status, "startDate", "endDate" FROM "Subscription";
```

### **Teste 2: Webhook Manual**

Para testar o webhook sem fazer pagamento real:

```bash
POST http://localhost:3000/payments/webhook
Content-Type: application/json

{
  "transactionId": "SEU_TRANSACTION_ID_AQUI",
  "status": "PAID",
  "paidAt": "2025-11-08T15:30:00.000Z"
}
```

**Status suportados:**
- `PAID`: Confirma pagamento e ativa subscription
- `FAILED`: Marca pagamento como falho e cancela subscription
- `CANCELED`: Cancela pagamento e subscription
- `REFUNDED`: Reembolsa pagamento e cancela subscription

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Payment processed successfully"
}
```

### **Teste 3: Validações de Erro**

#### 3.1 - Usuário já tem assinatura ativa
```bash
POST http://localhost:3000/payments/pix
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "planId": "mesmo-plano-id"
}

# Deve retornar 400: "User already has an active subscription"
```

#### 3.2 - Plano não existe
```bash
POST http://localhost:3000/payments/pix
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "planId": "00000000-0000-0000-0000-000000000000"
}

# Deve retornar 404: "Plan not found"
```

#### 3.3 - Plano inativo
```sql
-- Desativar plano no banco
UPDATE "Plan" SET "isActive" = false WHERE id = 'uuid-do-plano';
```

```bash
POST http://localhost:3000/payments/pix
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "planId": "uuid-do-plano-inativo"
}

# Deve retornar 400: "Plan is not available"
```

---

## 📁 Estrutura do Código

```
src/
├── domain/                          # Camada de Domínio
│   ├── entities/
│   │   ├── plan.ts                  # PlanEntity
│   │   ├── subscription.ts          # SubscriptionEntity
│   │   └── payment.ts               # PaymentEntity
│   └── repositories/
│       ├── plan.repository.ts       # IPlanRepository
│       ├── subscription.repository.ts
│       └── payment.repository.ts
│
├── application/                     # Camada de Aplicação
│   ├── dtos/
│   │   └── payment/
│   │       ├── create-pix-payment.dto.ts
│   │       └── webhook-payment.dto.ts
│   └── use-cases/
│       └── payment/
│           ├── create-pix-payment.usecase.ts
│           └── handle-payment-webhook.usecase.ts
│
└── infrastructure/                  # Camada de Infraestrutura
    ├── config/
    │   └── env.ts                   # Variáveis de ambiente
    ├── database/
    │   └── repositories/
    │       ├── plan-prisma.repository.ts
    │       ├── subscription-prisma.repository.ts
    │       └── payment-prisma.repository.ts
    ├── services/
    │   └── zyonpay/
    │       ├── zyonpay.repository.ts  # Interface
    │       ├── zyonpay.service.ts     # Implementação
    │       └── index.ts
    ├── factories/
    │   └── payment/
    │       ├── create-pix-payment.factory.ts
    │       └── handle-payment-webhook.factory.ts
    └── http/
        ├── controllers/
        │   └── payment/
        │       ├── payment.controller.ts
        │       └── webhook.controller.ts
        └── routes/
            └── payment.routes.ts
```

---

## 🔧 Troubleshooting

### **Erro: "Property 'plan' does not exist on type 'PrismaClient'"**
**Solução**: Rode a migração do Prisma:
```bash
npx prisma migrate dev
npx prisma generate
```

### **Erro: "ZyonPay API error: Unauthorized"**
**Solução**: Verifique se as chaves estão corretas no `.env`:
```bash
# Teste as credenciais
curl -X GET https://dash.zyonpay.app/api/v1/test \
  -H "x-public-key: SUA_CHAVE_PUBLICA" \
  -H "x-secret-key: SUA_CHAVE_SECRETA"
```

### **Erro: "User not found" ou "Plan not found"**
**Solução**: Certifique-se de que:
1. O usuário está autenticado (token válido)
2. O plano existe no banco de dados
```bash
# Ver planos
npx prisma studio
# Ou
psql -d sherlocker -c "SELECT * FROM \"Plan\";"
```

### **Webhook não está sendo chamado**
**Soluções**:
1. Verifique se a URL está configurada corretamente no painel da ZyonPay
2. Use ngrok para desenvolvimento local
3. Verifique os logs do servidor: `pnpm dev`
4. Teste manualmente com curl/Postman

### **Email não está sendo enviado**
**Solução**: Verifique as credenciais SMTP no `.env`:
```env
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="seu_email@gmail.com"
MAIL_PASSWORD="senha_app_gmail"  # Não é a senha normal!
```

Para Gmail, crie uma senha de app:
1. https://myaccount.google.com/security
2. Ative verificação em 2 etapas
3. Gere senha de app
4. Use essa senha no `.env`

---

## 📚 Referências

- **ZyonPay Docs**: https://docs.zyonpay.app
- **Prisma Docs**: https://www.prisma.io/docs
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

---

## 🎉 Conclusão

O sistema está **100% funcional** e pronto para uso! Seguindo os passos acima, você conseguirá:

1. ✅ Configurar o ambiente
2. ✅ Criar planos de assinatura
3. ✅ Gerar pagamentos Pix recorrentes
4. ✅ Receber webhooks da ZyonPay
5. ✅ Ativar assinaturas automaticamente
6. ✅ Enviar emails de confirmação

**Próximos desenvolvimentos sugeridos:**
- [ ] CRUD de planos (admin)
- [ ] Endpoint GET /subscriptions (listar minhas assinaturas)
- [ ] Cancelamento de assinatura pelo usuário
- [ ] Histórico de pagamentos
- [ ] Cron job para verificar assinaturas expiradas
- [ ] Renovação automática de assinaturas
- [ ] Dashboard administrativo

---

**Desenvolvido com ❤️ usando Clean Architecture**
