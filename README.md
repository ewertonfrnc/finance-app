# finance-app

App mobile Expo/React Native para finanças pessoais, integrado ao `finance-api`.

O fluxo principal cobre onboarding, cadastro/login, saldos mensais, lançamentos, recorrência, tags, menu e recuperação de senha. A aba Totais ainda está pendente e permanece como placeholder.

## Stack

- Expo 54, React 19, React Native 0.81 e TypeScript strict.
- Expo Router com rotas em `app/`.
- Bun como gerenciador de pacotes (`bun.lock`).
- React Query para dados remotos.
- Zustand para estado local de auth, onboarding, data selecionada, privacidade e picker de tags.
- Axios centralizado em `src/services/client.ts`.
- Uniwind/Tailwind CSS 4 para estilos.

## Comandos

```bash
bun install
bun run start
bun run android
bun run ios
bun run web
bun run lint
```

Não há suíte de testes automatizada configurada neste projeto.

## Estado das telas

| Tela/fluxo | Estado |
| --- | --- |
| Onboarding | Implementado |
| Cadastro/login | Implementado |
| Recuperação de senha | Implementado |
| Saldos mensais | Implementado |
| Detalhe do dia | Implementado |
| Criar/editar/excluir transação | Implementado |
| Recorrência de transações | Implementado |
| Tags e picker de tags | Implementado |
| Menu/logout | Implementado |
| Totais | Pendente; `app/(tabs)/totais.tsx` ainda é placeholder |

## Próximos passos do app

1. Implementar a aba Totais depois do backend expor `GET /v1/summary?year=YYYY`.
2. Criar `src/features/totais` com service, hooks, types e mappers.
3. Adicionar as telas de detalhe de Totais.
4. Validar deep link de recuperação de senha em Android/iOS.
5. Adicionar testes ou ao menos smoke checks automatizados para auth, transações, tags e recuperação de senha.
