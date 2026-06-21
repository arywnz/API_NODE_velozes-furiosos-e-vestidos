const swaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'API de Dupla Persistência (SQL & NoSQL)',
    version: '1.0.0',
    description: 'API desenvolvida em Node.js e Express contemplando segurança, testes de integração e conteinerização.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      UsuarioRegistro: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['user', 'admin'] }
        }
      },
      UsuarioLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      Carro: {
        type: 'object',
        required: ['marca', 'modelo', 'ano', 'cor', 'preco'],
        properties: {
          marca: { type: 'string' },
          modelo: { type: 'string' },
          ano: { type: 'integer' },
          cor: { type: 'string' },
          preco: { type: 'number' }
        }
      },
      Moto: {
        type: 'object',
        required: ['marca', 'modelo', 'ano', 'cilindrada', 'preco'],
        properties: {
          marca: { type: 'string' },
          modelo: { type: 'string' },
          ano: { type: 'integer' },
          cilindrada: { type: 'integer' },
          preco: { type: 'number' }
        }
      },
      MarcaRoupa: {
        type: 'object',
        required: ['nome', 'fundador', 'anoFundacao', 'paisOrigem'],
        properties: {
          nome: { type: 'string' },
          fundador: { type: 'string' },
          anoFundacao: { type: 'integer' },
          paisOrigem: { type: 'string' }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Registrar um novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UsuarioRegistro' }
            }
          }
        },
        responses: {
          201: { description: 'Usuário registrado com sucesso' },
          400: { description: 'Dados de entrada inválidos' }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Autenticar um usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UsuarioLogin' }
            }
          }
        },
        responses: {
          200: { description: 'Autenticado com sucesso, retorna token JWT' },
          401: { description: 'Credenciais inválidas' }
        }
      }
    },
    '/users': {
      get: {
        summary: 'Listar todos os usuários (apenas admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de usuários' },
          401: { description: 'Não autorizado' },
          403: { description: 'Acesso proibido' }
        }
      },
      post: {
        summary: 'Criar um novo usuário (apenas admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UsuarioRegistro' }
            }
          }
        },
        responses: {
          201: { description: 'Usuário criado com sucesso' },
          400: { description: 'Erro na validação ou e-mail já em uso' },
          401: { description: 'Não autorizado' },
          403: { description: 'Acesso proibido' }
        }
      }
    },
    '/users/{id}': {
      get: {
        summary: 'Obter detalhes de um usuário por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Detalhes do usuário' },
          401: { description: 'Não autorizado' },
          404: { description: 'Usuário não encontrado' }
        }
      },
      put: {
        summary: 'Atualizar dados de um usuário',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['user', 'admin'] }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Usuário atualizado com sucesso' },
          400: { description: 'Dados inválidos' },
          401: { description: 'Não autorizado' },
          404: { description: 'Usuário não encontrado' }
        }
      },
      delete: {
        summary: 'Excluir um usuário (apenas admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          204: { description: 'Usuário excluído com sucesso' },
          401: { description: 'Não autorizado' },
          403: { description: 'Acesso proibido' },
          404: { description: 'Usuário não encontrado' }
        }
      }
    },
    '/carros': {
      get: {
        summary: 'Listar todos os carros',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de carros' },
          401: { description: 'Não autorizado' }
        }
      },
      post: {
        summary: 'Criar um carro',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Carro' }
            }
          }
        },
        responses: {
          201: { description: 'Carro criado com sucesso' },
          400: { description: 'Dados de entrada inválidos' },
          401: { description: 'Não autorizado' }
        }
      }
    },
    '/carros/{id}': {
      get: {
        summary: 'Obter carro por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Detalhes do carro' },
          401: { description: 'Não autorizado' },
          404: { description: 'Carro não encontrado' }
        }
      },
      put: {
        summary: 'Atualizar carro',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Carro' }
            }
          }
        },
        responses: {
          200: { description: 'Carro atualizado com sucesso' },
          400: { description: 'Dados inválidos' },
          401: { description: 'Não autorizado' },
          404: { description: 'Carro não encontrado' }
        }
      },
      delete: {
        summary: 'Excluir carro',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          204: { description: 'Carro excluído com sucesso' },
          401: { description: 'Não autorizado' },
          404: { description: 'Carro não encontrado' }
        }
      }
    },
    '/motos': {
      get: {
        summary: 'Listar todas as motos',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de motos' },
          401: { description: 'Não autorizado' }
        }
      },
      post: {
        summary: 'Criar uma moto',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Moto' }
            }
          }
        },
        responses: {
          201: { description: 'Moto criada com sucesso' },
          400: { description: 'Dados de entrada inválidos' },
          401: { description: 'Não autorizado' }
        }
      }
    },
    '/motos/{id}': {
      get: {
        summary: 'Obter moto por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Detalhes da moto' },
          401: { description: 'Não autorizado' },
          404: { description: 'Moto não encontrada' }
        }
      },
      put: {
        summary: 'Atualizar moto',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Moto' }
            }
          }
        },
        responses: {
          200: { description: 'Moto atualizada com sucesso' },
          400: { description: 'Dados inválidos' },
          401: { description: 'Não autorizado' },
          404: { description: 'Moto não encontrada' }
        }
      },
      delete: {
        summary: 'Excluir moto',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          204: { description: 'Moto excluída com sucesso' },
          401: { description: 'Não autorizado' },
          404: { description: 'Moto não encontrada' }
        }
      }
    },
    '/marcas-roupa': {
      get: {
        summary: 'Listar todas as marcas de roupa',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de marcas de roupa' },
          401: { description: 'Não autorizado' }
        }
      },
      post: {
        summary: 'Criar uma marca de roupa',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MarcaRoupa' }
            }
          }
        },
        responses: {
          201: { description: 'Marca de roupa criada com sucesso' },
          400: { description: 'Dados de entrada inválidos' },
          401: { description: 'Não autorizado' }
        }
      }
    },
    '/marcas-roupa/{id}': {
      get: {
        summary: 'Obter marca de roupa por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Detalhes da marca de roupa' },
          401: { description: 'Não autorizado' },
          404: { description: 'Marca de roupa não encontrada' }
        }
      },
      put: {
        summary: 'Atualizar marca de roupa',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MarcaRoupa' }
            }
          }
        },
        responses: {
          200: { description: 'Marca de roupa atualizada com sucesso' },
          400: { description: 'Dados inválidos' },
          401: { description: 'Não autorizado' },
          404: { description: 'Marca de roupa não encontrada' }
        }
      },
      delete: {
        summary: 'Excluir marca de roupa',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          204: { description: 'Marca de roupa excluída com sucesso' },
          401: { description: 'Não autorizado' },
          404: { description: 'Marca de roupa não encontrada' }
        }
      }
    }
  }
};

module.exports = swaggerOptions;
