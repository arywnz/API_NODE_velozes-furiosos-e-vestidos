const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const requisitar = async (caminho, metodo = 'GET', dados = null, token = null) => {
  const url = `${BASE_URL}${caminho}`;
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const opcoes = {
    method: metodo,
    headers
  };

  if (dados) {
    opcoes.body = JSON.stringify(dados);
  }

  const resposta = await fetch(url, opcoes);

  if (resposta.status === 204) {
    return null;
  }

  let payload = null;
  const contentType = resposta.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      payload = await resposta.json();
    } catch (e) {
      payload = { erro: 'Erro ao ler a resposta JSON do servidor.' };
    }
  } else {
    try {
      const texto = await resposta.text();
      payload = { erro: texto || `Erro do servidor (Status: ${resposta.status})` };
    } catch (e) {
      payload = { erro: `Erro desconhecido do servidor (Status: ${resposta.status})` };
    }
  }

  if (!resposta.ok) {
    throw new Error(payload.erro || 'Falha ao processar a requisição');
  }

  return payload;
};

export const api = {
  auth: {
    login: (email, password) => requisitar('/auth/login', 'POST', { email, password }),
    register: (name, email, password) => requisitar('/auth/register', 'POST', { name, email, password })
  },
  usuarios: {
    listar: (token) => requisitar('/users', 'GET', null, token),
    buscarPorId: (id, token) => requisitar(`/users/${id}`, 'GET', null, token),
    criar: (dados, token) => requisitar('/users', 'POST', dados, token),
    atualizar: (id, dados, token) => requisitar(`/users/${id}`, 'PUT', dados, token),
    excluir: (id, token) => requisitar(`/users/${id}`, 'DELETE', null, token)
  },
  carros: {
    listar: (token) => requisitar('/carros', 'GET', null, token),
    buscarPorId: (id, token) => requisitar(`/carros/${id}`, 'GET', null, token),
    criar: (dados, token) => requisitar('/carros', 'POST', dados, token),
    atualizar: (id, dados, token) => requisitar(`/carros/${id}`, 'PUT', dados, token),
    excluir: (id, token) => requisitar(`/carros/${id}`, 'DELETE', null, token)
  },
  motos: {
    listar: (token) => requisitar('/motos', 'GET', null, token),
    buscarPorId: (id, token) => requisitar(`/motos/${id}`, 'GET', null, token),
    criar: (dados, token) => requisitar('/motos', 'POST', dados, token),
    atualizar: (id, dados, token) => requisitar(`/motos/${id}`, 'PUT', dados, token),
    excluir: (id, token) => requisitar(`/motos/${id}`, 'DELETE', null, token)
  },
  marcas: {
    listar: (token) => requisitar('/marcas-roupa', 'GET', null, token),
    buscarPorId: (id, token) => requisitar(`/marcas-roupa/${id}`, 'GET', null, token),
    criar: (dados, token) => requisitar('/marcas-roupa', 'POST', dados, token),
    atualizar: (id, dados, token) => requisitar(`/marcas-roupa/${id}`, 'PUT', dados, token),
    excluir: (id, token) => requisitar(`/marcas-roupa/${id}`, 'DELETE', null, token)
  }
};
