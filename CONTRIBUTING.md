# Guia de Contribuição – API GB Core

Obrigado por considerar contribuir com a API GB Core! Ao seguir estas orientações você ajuda a manter o fluxo de trabalho organizado e garante que cada mudança fortaleça este hub pessoal de automações e integrações com AWS.

## ⚡ Início Rápido

1. **Faça um fork** do repositório no GitHub.
2. **Clone** o fork para sua máquina.
3. **Instale as dependências**: `npm install`.
4. **Configure o ambiente**: copie `.env.example` para `.env` e preencha as variáveis AWS/JWT (veja o `README.md`).
5. **Crie uma branch**: `git checkout -b <tipo/minha-feature>`.

## 🛠 Fluxo de Desenvolvimento

### 1. Convenção de Branches

- `feat/<descrição>` – novas funcionalidades (ex.: `feat/cronograma-automacoes`).
- `fix/<descrição>` – correções de bugs (ex.: `fix/upload-s3-timeout`).
- `docs/<descrição>` – mudanças em documentação.
- `chore/<descrição>` – tarefas auxiliares (deps, lint, scripts).

### 2. Padrões de Código

- Siga o estilo recomendado pelo NestJS e respeite o lint configurado.
- Evite `any`; prefira DTOs e interfaces tipadas.
- Adicione comentários apenas quando o código não for autoexplicativo.

### 3. Testes

- Toda nova funcionalidade deve vir acompanhada de testes (`auth`, `users`, `images`, etc.).
- Execute `npm run test` antes de abrir PR e garanta que o coverage não reduza.
- Para fluxos fim a fim, use `npm run test:e2e`.

### 4. Mensagens de Commit

Use o padrão **Conventional Commits**: `<tipo>: <assunto>`

Exemplos:

- `feat: adicionar webhook do whatsapp`
- `fix: corrigir validação de dto de imagem`
- `docs: atualizar instruções de deploy docker`
- `test: cobrir fluxo de refresh token`

## 🐛 Reporte de Bugs

Abra uma issue descrevendo:

1. Título e resumo objetivo.
2. Passo a passo para reproduzir o problema.
3. Resultado esperado x resultado atual.
4. Logs, prints ou payloads (mas sem segredos).

## 🚀 Pull Requests

1. Envie suas mudanças para o seu fork.
2. Abra o PR contra a branch `main` deste repo.
3. Título seguindo a convenção de commits.
4. Descreva o **o que** e **por que** da mudança, referenciando issues quando existir (`Fixes #123`).

### Checklist do PR

- [ ] Meu código segue o guia de estilo/lint do projeto.
- [ ] Fiz auto-review e removi comentários/prints temporários.
- [ ] Adicionei ou atualizei testes relevantes.
- [ ] `npm run test` e `npm run lint` passam localmente.
- [ ] Documentação/descrições foram atualizadas quando necessário.

---

## ❓ Dúvidas

Abra uma issue ou entre em contato via [LinkedIn](https://www.linkedin.com/in/genildoburgos). Obrigado por fortalecer a API GB Core! 🚀
