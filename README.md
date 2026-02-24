# API GB Core 🚀

<p align="center">
	<img src="https://gb-core-imagens.s3.us-east-2.amazonaws.com/images/ea94b5fe-dbc5-4af3-9ced-dcb63b80c971/7aad0d8a-f433-4146-9f9c-64aa5ecfd68e.jpg" alt="GB Core Banner" style="max-width:100%; width:450px;">
</p>

Esta API é o núcleo dos meus serviços pessoais, servindo como uma ponte unificada entre diferentes domínios da minha vida. Ela não apenas armazena dados de produtividade, mas atua como o 'cérebro' para gatilhos de automação e gerenciamento de agentes de IA.

## Visão

O objetivo da Api GB Core é ser o "Single Source of Truth" (Fonte Única de Verdade) para minha vida digital. Diferente de apps isolados, esta API centraliza lógica de negócios personalizada, permitindo que eu mude de interface (web, mobile ou CLI) sem perder a inteligência centralizada em estudos, carreira e automações.

## Ideias para Explorar

- **AI Budget Advisor**: Agente que analisa gastos e sugere investimentos baseados em metas de economia.
- **Automated Study Tracker**: Integração com o calendário da UFAPE para notificar prazos de disciplinas.
- **WhatsApp Agent Bridge**: Interface para que agentes autônomos respondam e executem tarefas via comandos de chat.
- **Personal Knowledge Graph**: Conectar ideias e notas de estudo usando bancos de dados em nuvem.

## Configuração do NestJS

Esta API foi construída com [NestJS](https://nestjs.com/), um framework Node.js progressivo para construir aplicações server-side eficientes e escaláveis.

### Documentação da API

A documentação Swagger está disponível em: `http://localhost:3000/api`

## Docker Hub

A aplicação está disponível como imagem Docker no Docker Hub.

### Usando a Imagem

```bash
# Pull da imagem
docker pull genildodocker/api-gb-core:latest

# Executar container
docker run -p 3000:3000 \
  -e AWS_REGION=us-east-2 \
  -e AWS_ACCESS_KEY_ID=sua_access_key \
  -e AWS_SECRET_ACCESS_KEY=sua_secret_key \
  -e JWT_SECRET=sua_chave_secreta \
  genildodocker/api-gb-core:latest
```

## Contribuindo

Este é primariamente um workspace pessoal, mas contribuições são bem-vindas. Por favor, abra uma issue ou envie um PR descrevendo a mudança e o propósito. Prefira commits pequenos e focados com mensagens descritivas.

Consulte o guia completo em [`CONTRIBUTING.md`](./CONTRIBUTING.md) para detalhes de configuração local, convenções de branch, execução de testes e checklist de PR.

## Segurança

Siga o processo descrito em [`SECURITY.md`](./SECURITY.md) para reportar vulnerabilidades e garantir que contribuições atendam aos requisitos mínimos (auth, validação de dados, dependências e monitoramento).

## Licença

Este projeto está licenciado sob a licença MIT. Leia [`LICENSE`](./LICENSE) para o texto integral e atribuições.

## Contato

Se você quiser discutir alguma ideia aqui: abra uma issue ou me encontre através do contato no meu perfil.

- Email: [gnldburgos@gmail.com](mailto:gnldburgos@gmail.com)
- LinkedIn: [linkedin.com/in/genildoburgos](https://www.linkedin.com/in/genildoburgos)



