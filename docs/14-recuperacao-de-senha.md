# Plano: Recuperação de Senha

**Esforço estimado:** 4–5h  
**Superfícies:** finance-api (Go) + finance-app (Expo)  
**Dependência externa:** Mailtrap (SMTP sandbox)  
**Token expira em:** 15 minutos

---

## Status atual em 2026-06-04

O fluxo do app está implementado e integrado com a API.

| Parte | Estado observado |
| --- | --- |
| Link "Esqueceu a senha?" | Implementado em `app/(auth)/login.tsx`. |
| Tela de solicitação | Implementada em `app/(auth)/forgot-password.tsx`. |
| Tela de nova senha | Implementada em `app/(auth)/reset-password.tsx`. |
| Service e hooks | Implementados em `auth.service.ts`, `useForgotPassword` e `useResetPassword`. |
| Schemas Zod | Implementados em `src/features/auth/schemas.ts`. |
| Deep link | `app.json` usa scheme `financeapp`, não `finance`. |

Diferenças do plano original:

- O backend envia um link intermediário `GET /v1/auth/redirect-reset?token=...`, que então direciona para o deep link do app.
- O scheme real do app é `financeapp`.

Pendências restantes:

- Validar manualmente abertura do deep link no Android/iOS.
- Ajustar exemplos deste documento caso a URL pública da API/deep link mude por ambiente.
- Adicionar testes automatizados ou smoke checks do fluxo.

---

## Visão geral do fluxo

```
[App] esqueceu senha
  → POST /v1/auth/forgot-password { email }
      → gera token UUID → SHA-256 → salva em password_reset_tokens
      → envia email via Mailtrap com link deep link
  ← 202 Accepted (sempre, mesmo se email não existe — evita enumeração)

[Usuário clica no link no email]
  → GET /v1/auth/redirect-reset?token=<plain-token>
  → financeapp://reset-password?token=<plain-token>
  → App abre tela "Cria uma senha nova"

  → POST /v1/auth/reset-password { token, password }
      → busca hash do token, valida expiry
      → atualiza password_hash
      → deleta token usado
  ← 200 OK

[App] navega para tela "Senha redefinida" → login
```

---

## Slice 1 — Backend: infraestrutura de email

**O que entrega:** pacote `internal/mailer/` funcionando com Mailtrap. Sem endpoints novos.  
**Revisável antes do Slice 2.**

### 1.1 Dependência

```bash
# finance-api
go get github.com/wneessen/go-mail
```

> `go-mail` é mais idiomático que `net/smtp` direto: suporte a TLS, STARTTLS, retry, e não precisa montar o MIME à mão.

### 1.2 Estrutura de arquivos

```
internal/mailer/
  mailer.go          ← interface Client + constantes
  mailtrap.go        ← implementação concreta
  templates/
    password_reset.tmpl
```

### 1.3 Interface (igual ao social-network)

```go
// internal/mailer/mailer.go
type Client interface {
    Send(templateFile, toUsername, toEmail string, data any) error
}

const (
    fromEmail             = "Finance App <noreply@finance.app>"
    maxRetries            = 3
    PasswordResetTemplate = "password_reset.tmpl"
)

//go:embed "templates"
var FS embed.FS
```

### 1.4 Implementação Mailtrap

```go
// internal/mailer/mailtrap.go
type MailtrapMailer struct {
    host, user, pass, from string
    port                   int
}

func NewMailtrap(host, user, pass, from string, port int) *MailtrapMailer {
    return &MailtrapMailer{host, user, pass, from, port}
}

func (m *MailtrapMailer) Send(templateFile, toUsername, toEmail string, data any) error {
    tmpl, err := template.ParseFS(FS, "templates/"+templateFile)
    // ... executa {{subject}} e {{body}} do template
    // ... monta mensagem com go-mail
    // ... loop de retry (maxRetries=3, backoff linear)
}
```

### 1.5 Template de email

```
// internal/mailer/templates/password_reset.tmpl
{{define "subject"}}Redefinição de senha — Finance App{{end}}

{{define "body"}}
Olá, {{.Username}}!

Recebemos um pedido para redefinir a sua senha.
Clique no link abaixo para criar uma nova (válido por 15 minutos):

{{.ResetURL}}

Se você não solicitou isso, ignore este e-mail.
{{end}}
```

### 1.6 Env vars

Adicionar em `.envrc`:

```bash
export MAILTRAP_HOST=sandbox.smtp.mailtrap.io
export MAILTRAP_PORT=2525
export MAILTRAP_USER=<user do Mailtrap>
export MAILTRAP_PASS=<pass do Mailtrap>
export FRONTEND_URL=financeapp://   # prefixo do deep link
```

### 1.7 Wiring em `cmd/api/main.go`

```go
// Adicionar ao config struct em api.go
type config struct {
    // ...campos existentes...
    mail     mailConfig
    frontendURL string
}

type mailConfig struct {
    host, user, pass, from string
    port                   int
    expiresAt              time.Duration
}

// Em main.go, na função run():
mailer := mailer.NewMailtrap(
    cfg.mail.host,
    cfg.mail.user,
    cfg.mail.pass,
    mailer.fromEmail,
    cfg.mail.port,
)

// Injetar na struct application:
app := &application{
    // ...campos existentes...
    mailer: mailer,
}
```

**Validação do Slice 1:** `go build ./...` sem erros. Testar `Send()` manualmente via teste de integração simples.

---

## Slice 2 — Backend: migration + store + endpoints

**O que entrega:** 2 endpoints funcionais testáveis via curl/Postman.  
**Revisável antes do Slice 3.**

### 2.1 Migration

```bash
make migration add_password_reset_tokens
```

```sql
-- 000010_add_password_reset_tokens.up.sql
CREATE TABLE password_reset_tokens (
    token      TEXT        PRIMARY KEY,
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
```

```sql
-- 000010_add_password_reset_tokens.down.sql
DROP TABLE IF EXISTS password_reset_tokens;
```

```bash
make migrate-up
```

### 2.2 Store — novos métodos em `internal/store/users.go`

```go
// Adicionar à interface UserStoreInterface em storage.go:
CreatePasswordResetToken(ctx context.Context, userID, token string, expiresAt time.Duration) error
GetUserFromResetToken(ctx context.Context, token string) (*User, error)
DeletePasswordResetToken(ctx context.Context, userID string) error
```

Implementação segue o padrão existente:
- `context.WithTimeout(ctx, QueryTimeoutDuration)` em todos
- Armazena o **SHA-256 do token**, não o token plain (mesmo padrão do social-network)
- `GetUserFromResetToken` valida `expires_at > NOW()` no próprio SQL

### 2.3 Endpoints em `cmd/api/auth.go`

**POST /v1/auth/forgot-password**

```go
type ForgotPasswordPayload struct {
    Email string `json:"email" validate:"required,email"`
}

func (app *application) forgotPasswordHandler(w http.ResponseWriter, r *http.Request) {
    // 1. Valida payload
    // 2. Busca usuário por email — se não existir, retorna 202 mesmo assim
    // 3. Gera UUID plain token → SHA-256 → salva no DB (expires_at = 15min)
    // 4. Monta resetURL = app.config.frontendURL + "reset-password?token=" + plainToken
    // 5. Envia email via app.mailer.Send(mailer.PasswordResetTemplate, ...)
    // 6. Retorna 202 Accepted
}
```

> Retornar sempre 202 (mesmo se email não existir) evita que atacantes descubram quais emails estão cadastrados.

**POST /v1/auth/reset-password**

```go
type ResetPasswordPayload struct {
    Token    string `json:"token"    validate:"required"`
    Password string `json:"password" validate:"required,min=8,max=72"`
}

func (app *application) resetPasswordHandler(w http.ResponseWriter, r *http.Request) {
    // 1. Valida payload
    // 2. GetUserFromResetToken → 401 se expirado ou inválido
    // 3. Dentro de WithTx:
    //    a. user.Password.SetPassword(payload.Password)
    //    b. UPDATE users SET password_hash = $1 WHERE id = $2
    //    c. DeletePasswordResetToken(ctx, user.ID)
    // 4. Retorna 200 OK
}
```

### 2.4 Rotas em `cmd/api/api.go`

```go
r.Route("/auth", func(r chi.Router) {
    r.Post("/register", app.registerHandler)
    r.Post("/login",    app.loginHandler)
    r.Post("/forgot-password", app.forgotPasswordHandler)  // novo
    r.Post("/reset-password",  app.resetPasswordHandler)   // novo
})
```

**Validação do Slice 2:**
```bash
go test ./...
go build ./...

# Teste manual:
curl -X POST localhost:8080/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com"}'
# → Verificar email no Mailtrap inbox

curl -X POST localhost:8080/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"<token-do-email>","password":"novaSenha123"}'
```

---

## Slice 3 — App: telas de recuperação de senha

**O que entrega:** telas navegáveis com fixtures (sem chamar API real).  
**Revisável antes do Slice 4.**

### 3.1 Configurar deep link em `app.json`

```json
{
  "expo": {
    "scheme": "financeapp"
  }
}
```

Isso habilita o deep link `financeapp://reset-password?token=xxx`.

### 3.2 Estrutura de arquivos novos

```
app/(auth)/
  forgot-password.tsx       ← telas 1, 2, 3, 4 do design (controla estado interno)
  reset-password.tsx        ← telas 5, 6, 7 do design (recebe token via params)

src/features/auth/
  hooks/
    useForgotPassword.ts    ← mutation: POST /forgot-password
    useResetPassword.ts     ← mutation: POST /reset-password
  services/
    auth.service.ts         ← adicionar forgotPassword() e resetPassword()
  schemas.ts                ← adicionar forgotPasswordSchema e resetPasswordSchema
```

### 3.3 Rota `forgot-password.tsx` — estados internos

A tela gerencia 3 estados via `useState`:

| Estado | Telas do design |
|--------|----------------|
| `idle` | Tela 1 (vazio) / Tela 2 (preenchido) |
| `sent` | Tela 3 (countdown) / Tela 4 (pode reenviar) |

**Lógica do countdown:**
```ts
// Após enviar com sucesso, inicia countdown de 47s
const [countdown, setCountdown] = useState(47)
useEffect(() => {
  if (status !== 'sent' || countdown <= 0) return
  const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
  return () => clearTimeout(timer)
}, [status, countdown])

const canResend = countdown === 0
```

Botão "Reenviar" só fica ativo quando `canResend === true`.  
Botão "Mudar o e-mail" volta para estado `idle` e limpa o email.

### 3.4 Rota `reset-password.tsx` — recebe token via params

```tsx
// app/(auth)/reset-password.tsx
import { useLocalSearchParams } from 'expo-router'

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>()
  // ...
}
```

A tela gerencia 2 estados:
- Formulário com validação local (telas 5 e 6)
- Sucesso (tela 7 "Senha redefinida")

**Validação local antes de chamar API:**
```ts
// src/features/auth/schemas.ts
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8).max(72),
    confirmPassword: z.string(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'As senhas não batem.',
    path: ['confirmPassword'],
  })
```

### 3.5 Link "Esqueceu a senha?" na tela de login

```tsx
// app/(auth)/login.tsx — no rodapé, após o botão "Entrar"
<Button variant="ghost" onPress={() => router.push('/(auth)/forgot-password')}>
  <Button.Label className="text-muted text-sm">Esqueceu a senha?</Button.Label>
</Button>
```

**Validação do Slice 3:**
```bash
bun run lint
# Testar navegação manualmente no simulador:
# login → esqueceu senha → digitar email → ver telas de estado → voltar
```

---

## Slice 4 — App: integração com a API

**O que entrega:** fluxo completo de ponta a ponta funcionando.

### 4.1 Service (`src/features/auth/services/auth.service.ts`)

```ts
export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post('/v1/auth/forgot-password', { email })
  // API retorna 202 sempre — não há dado relevante na resposta
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await apiClient.post('/v1/auth/reset-password', { token, password })
}
```

### 4.2 Hooks

```ts
// src/features/auth/hooks/useForgotPassword.ts
export function useForgotPassword() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => forgotPassword(email),
  })
}

// src/features/auth/hooks/useResetPassword.ts
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      resetPassword(token, password),
  })
}
```

### 4.3 Wiring nas telas

- `forgot-password.tsx`: substitui `onSuccess` do fixture por `mutate()` do `useForgotPassword`, inicia countdown quando `isSuccess === true`
- `reset-password.tsx`: chama `useResetPassword`, em `onSuccess` muda estado para "Senha redefinida"

### 4.4 Tratamento de erros visíveis ao usuário

| Situação | Mensagem |
|----------|----------|
| Token expirado ou inválido (`401`) | "O link expirou. Solicite um novo." |
| Erro genérico de rede | "Não foi possível conectar. Tente novamente." |

**Validação do Slice 4:**
```bash
bun run lint

# Teste de ponta a ponta:
# 1. Abrir app → login → "Esqueceu a senha?"
# 2. Digitar email cadastrado → "Enviar link"
# 3. Verificar email no Mailtrap inbox
# 4. Copiar token do link → abrir financeapp://reset-password?token=<token> no simulador
# 5. Digitar senhas que não batem → ver mensagem "As senhas não batem."
# 6. Digitar senhas corretas → "Confirmar nova senha"
# 7. Ver tela "Senha redefinida" → "Entrar agora"
# 8. Fazer login com a nova senha
```

---

## Tabela de riscos

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| Email enumeration via tempo de resposta | MÉDIA | Sempre retornar 202 e processar email em background (goroutine) |
| Token reutilizado após uso | ALTA | `DeletePasswordResetToken` dentro da mesma transação que atualiza senha |
| Deep link não abre o app no Android | MÉDIA | Testar intent filter no Android com `adb shell am start` antes do Slice 4 |
| Usuário sem conta solicita reset e fica confuso | BAIXA | UX intencional: "Se o e-mail existir, você receberá o link" |
| Token plain visível em logs do servidor | MÉDIA | Nunca logar o token — logar apenas o `user_id` e o `email` |

---

## Questões em aberto

| Questão | Decidir antes de |
|---------|-----------------|
| O link no email deve abrir o app direto (deep link) ou uma página web intermediária? | Decidido: página intermediária no backend. |
| Limitar N tentativas de `forgot-password` por email/IP? | Slice 2 (pode ser pós-MVP) |
| Invalidar tokens antigos quando um novo é gerado? (`DELETE WHERE user_id = $1` antes do INSERT) | Decidido e implementado no backend. |

> Recomendação para a última questão: **sim**, deletar tokens anteriores do mesmo usuário antes de criar o novo. Evita acúmulo e garante que apenas o link mais recente funciona.
