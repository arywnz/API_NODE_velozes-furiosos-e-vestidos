# API de Dupla Persistência (SQL & NoSQL)

Esta aplicação foi desenvolvida em Node.js com Express e implementa duas camadas de banco de dados para persistência, alinhada com as melhores práticas de segurança baseadas no OWASP Top 10, totalmente testada e conteinerizada com Docker.

## Tecnologias e Decisões Adotadas

1. **Backend com Node.js e Express**: Escolha robusta e eficiente para construção de APIs assíncronas de alto desempenho.
2. **Banco Relacional (SQL) com PostgreSQL e Sequelize**: Utilizado para o contexto de usuários e autenticação, garantindo a integridade dos dados e o uso de chaves estrangeiras. O Sequelize facilita o mapeamento objeto-relacional sem poluir o código.
3. **Banco Não-Relacional (NoSQL) com MongoDB e Mongoose**: Utilizado para os recursos de alta flexibilidade e volume: Carros, Motos e Marcas de Roupa. O Mongoose provê modelagem orientada a esquemas de forma prática e limpa.
4. **Segurança (OWASP Top 10)**:
   - **Autenticação JWT**: Garante autenticação sem estado e autorização baseada em cargos (RBAC) com o cabeçalho Bearer Token.
   - **Criptografia de Senhas**: Uso de bcryptjs com 12 rounds de salt.
   - **Proteção contra Injeção**: Validação estrita de todos os inputs de dados usando express-validator.
   - **Helmet e CORS**: Configuração segura de cabeçalhos HTTP e origens de requisição.
   - **Rate Limiting**: Limitação de taxa de requisições por IP com express-rate-limit contra ataques de força bruta e DoS.
   - **Tratamento de Erros Seguro**: Tratamento centralizado que oculta rastreios de pilha (stack traces) em produção para mitigar vazamento de informações.
5. **Swagger**: Geração automática da documentação da API em `/api-docs` sem o uso de comentários no código de negócio.
6. **Testes de Integração com Jest e Supertest**: Testes ponta a ponta (end-to-end) validando fluxos de autenticação, permissões e operações CRUD.
7. **Conteinerização com Docker e Docker Compose**: Toda a aplicação e os bancos de dados são orquestrados em rede interna segura no Docker Compose.

## Como Executar a Aplicação via Docker

Certifique-se de ter o Docker instalado em sua máquina.

1. Clone o repositório e navegue até a pasta do projeto.
2. Configure o arquivo `.env` na raiz do projeto (use o `.env.example` como base).
3. Suba a aplicação completa (frontend, backend e bancos) utilizando o comando abaixo:
   ```bash
   docker-compose up --build
   ```
4. O **Frontend React** estará disponível em `http://localhost:8080`.
5. A **API Backend** estará disponível em `http://localhost:3000`.
6. A documentação interativa do Swagger pode ser acessada em `http://localhost:3000/api-docs`.

## Como Executar os Testes

Os testes de integração rodam automaticamente como um serviço integrado ao subir os containers da aplicação. Ao executar:

```bash
docker-compose up --build
```

O serviço `tests` será iniciado automaticamente, executando toda a suíte de testes do Jest contra instâncias isoladas dos bancos de dados, imprimindo os resultados diretamente no console e encerrando-se em seguida.

