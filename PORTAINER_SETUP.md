# Configuração do Portainer

Este guia explica como configurar as variáveis de ambiente no Portainer para o correto funcionamento da API.

## Problema: CORS Error 500

Se você está recebendo erros de CORS ao acessar a API pelo frontend, é necessário configurar a variável `ALLOWED_ORIGINS` com o endereço correto.

## Solução

### 1. Acessar as Variáveis de Ambiente no Portainer

1. Acesse seu Portainer
2. Vá em **Containers** > **sherlocker-api** (ou o nome do seu container)
3. Clique em **Duplicate/Edit**
4. Role até a seção **Environment variables**

### 2. Configurar ALLOWED_ORIGINS

Adicione ou edite a variável `ALLOWED_ORIGINS` com o endereço do seu frontend:

```env
ALLOWED_ORIGINS=http://86.48.28.31
```

Se você tiver múltiplas origens (ex: HTTP e HTTPS, ou múltiplos domínios), separe por vírgula:

```env
ALLOWED_ORIGINS=http://86.48.28.31,https://86.48.28.31,https://seudominio.com
```

Para permitir TODAS as origens durante desenvolvimento/testes (não recomendado em produção):

```env
ALLOWED_ORIGINS=*
```

### 3. Outras Variáveis Importantes

Certifique-se de que as seguintes variáveis estão configuradas:

```env
# Servidor
PORT=3000
NODE_ENV=production

# Database (ajuste conforme sua configuração)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres

# JWT
JWT_SECRET=seu-secret-aqui
JWT_SECRET_NOACCESS=seu-secret-noaccess-aqui
JWT_EXPIRES_IN=7d

# Email
RESEND_API_KEY=re_sua_api_key
EMAIL_FROM=suporte@nexorum.shop

# Mind API
MIND_TOKEN=seu-token-aqui

# ZyonPay
ZYONPAY_PUBLIC_KEY=sua-public-key
ZYONPAY_SECRET_KEY=sua-secret-key
ZYONPAY_BASE_URL=https://app.hotpayy.com/api/v1
ZYONPAY_WEBHOOK_URL=http://86.48.28.31:3000/payments/webhook
```

### 4. Reconstruir e Redeploy

Após configurar as variáveis:

1. **Stop** o container
2. **Remove** o container
3. **Rebuild** a imagem (se necessário)
4. **Recreate** o container com as novas variáveis

Ou simplesmente clique em **Deploy the container** se você editou via Duplicate/Edit.

## Verificação

Após o redeploy, teste a API fazendo uma requisição do frontend. O erro de CORS não deve mais aparecer.

### Logs para Debug

Você pode verificar os logs do container para confirmar que a variável foi carregada corretamente:

```bash
docker logs sherlocker-api
```

## Importante

- **Nunca** use `ALLOWED_ORIGINS=*` em produção se você usar cookies ou autenticação
- Sempre especifique as origens exatas em produção
- Se usar HTTPS no frontend, adicione também a origem HTTPS
