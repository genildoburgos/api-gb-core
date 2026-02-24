# Política de Segurança

Esta política descreve como tratamos a segurança da API GB Core, incluindo reporte de vulnerabilidades, manutenção de versões suportadas e boas práticas para contribuições seguras.

## Escopo

- Aplica-se ao código localizado neste repositório (`main`, branches de release e branches de feature).
- Engloba todas as superfícies expostas pela API (REST, filas/streams e integrações AWS).
- Não cobre dependências externas fora do nosso controle operacional.

## Reporte de Vulnerabilidades

1. **Não** abra issues públicas descrevendo detalhes técnicos.
2. Envie um email para `gnldburgos@gmail.com` com:
	- Descrição do problema e impacto estimado
	- Passo a passo para reproduzir (logs e PoCs mínimos)
	- Sugestão de mitigação, se houver
3. Opcionalmente, sinalize via [LinkedIn](https://www.linkedin.com/in/genildoburgos) caso precise confirmar o recebimento.

## Requisitos de Segurança para Contribuidores

### Autenticação e Autorização

- Mantenha JWTs curtos e renove secrets comprometidos imediatamente.
- Use `AuthGuard`/`RolesGuard` nos controladores sensíveis e valide escopos mínimos.
- Nunca exponha credenciais em logs, commits ou arquivos de exemplo.

### Proteção de Dados e Entrada

- Sempre valide e sanitize DTOs usando `class-validator`/`class-transformer`.
- Proteja dados em repouso delegando a criptografia a serviços gerenciados (por exemplo, AWS KMS/S3 SSE).
- Remova dados sensíveis de respostas e mensagens de erro.

### Dependências e Infraestrutura

- Execute `npm audit` antes de abrir PRs e aplique patches críticos.
- Não faça download dinâmico de pacotes em runtime; faça o pin das versões em `package.json`.
- Configure rate limiting (`@nestjs/throttler` ou gateway) e monitore uso anômalo.

### Operação e Monitoramento

- Adicione logs estruturados (nível WARN/ERROR) para falhas de autenticação e acesso negado.
- Propague IDs de correlação em requisições para facilitar investigações.
- Registre incidentes com data/hora, impacto e ações tomadas.

## Checklist de Desenvolvimento Seguro

- [ ] Tests cobrindo fluxos de autenticação/autorização (`auth`, `users`, `images`).
- [ ] Validação estrita dos DTOs em todos os endpoints públicos.
- [ ] Segredos carregados via variáveis de ambiente e nunca versionados.
- [ ] Revisão de PR focada em superfícies expostas (controladores, filtros globais, interceptors).
- [ ] Pipeline CI executando lint, testes e scanners de vulnerabilidade antes do deploy.

## Contato

- **Email**: gnldburgos@gmail.com
- **LinkedIn**: [linkedin.com/in/genildoburgos](https://www.linkedin.com/in/genildoburgos)

Agradecemos por colaborar para manter a API GB Core segura.
