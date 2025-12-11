# Email Service - Resend

Este projeto utiliza o **Resend** como serviço de envio de emails.

## Configuração

### 1. Obter API Key do Resend

1. Acesse [https://resend.com/signup](https://resend.com/signup)
2. Crie uma conta
3. Vá em [API Keys](https://resend.com/api-keys)
4. Crie uma nova API Key
5. Copie a chave (começa com `re_`)

### 2. Configurar variável de ambiente

Adicione a chave no arquivo `.env`:

```env
RESEND_API_KEY=re_sua_chave_aqui
```

## Implementação

### Estrutura

```
src/infrastructure/services/mailer/
├── nodemailer.repository.ts   # Interface comum
├── nodemailer.service.ts      # Implementação Nodemailer (mantida para referência)
├── resend.service.ts          # Implementação Resend (ativa)
└── test/
    ├── nodemailer.spec.ts
    └── resend.spec.ts
```

### Serviço utilizado

Todos os casos de uso utilizam o `ResendService`:

- `GenerateOtpUsecase` - Envio de código OTP
- `HandlePaymentWebhookUsecase` - Confirmação de pagamento
- `ProcessExpiredPaymentsUsecase` - Notificação de pagamento expirado
- `ProcessRecurringChargesUsecase` - Cobrança recorrente

### Interface

Ambos os serviços implementam a interface `MailMessageService`:

```typescript
interface MailMessageService {
  send(message: MessageMail): Promise<MessageMailResponse | void>;
}
```

## Domínios verificados

Para usar o Resend em produção, você precisa verificar seu domínio:

1. Acesse [Domains](https://resend.com/domains) no painel do Resend
2. Adicione seu domínio
3. Configure os registros DNS conforme instruído
4. Aguarde a verificação

## Desenvolvimento

Durante o desenvolvimento, você pode usar o domínio de teste do Resend que permite enviar emails para endereços de email que você controla.

## Migração do Nodemailer

A implementação anterior usava Nodemailer com SMTP. A implementação foi mantida no arquivo `nodemailer.service.ts` para referência, mas não é mais utilizada.

### Diferenças principais:

**Nodemailer (anterior):**
- Requer configuração SMTP (host, port, user, password)
- Mais genérico, suporta qualquer provedor SMTP
- Mais configuração necessária

**Resend (atual):**
- Apenas API Key necessária
- API moderna e simples
- Dashboard com analytics
- Melhor deliverability
- Suporte nativo a templates React

## Troubleshooting

### Email não está sendo enviado

1. Verifique se `RESEND_API_KEY` está configurada no `.env`
2. Verifique se a API Key está válida no [dashboard](https://resend.com/api-keys)
3. Verifique se o domínio está verificado (produção)

### Erro de autenticação

- Confirme que a API Key começa com `re_`
- Verifique se não há espaços extras na chave

## Links úteis

- [Documentação Resend](https://resend.com/docs)
- [API Reference](https://resend.com/docs/api-reference/introduction)
- [Dashboard](https://resend.com/overview)
