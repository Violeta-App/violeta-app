const BASE_URL = 'https://violeta-be.onrender.com/alertas';

export interface AlertaInput {
  titulo: string;
  descricao: string;
  tipo: string;
  imagem: string; 
  latitude: number;
  longitude: number;
  createdBy: string;
}

export interface Alerta {
  alerta_id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  imagem?: string;
  latitude: number;
  longitude: number;
  createdBy: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
}


export const fetchAlerts = async () => {
  try {
    const response = await fetch(BASE_URL);
    return await response.json();
  } catch (err) {
    console.error('Erro ao buscar alertas:', err);
    return [];
  }
};

export const fetchAlertById = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error('Erro ao buscar alerta');
  return await response.json();
};

export const createAlert = async (alertData: AlertaInput) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alertData),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar alerta');
  }

  return await response.json();
};

export const updateAlert = async (id: string, alertData: AlertaInput) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData),
    });
    return await response.json();
  } catch (err) {
    console.error('Erro ao atualizar alerta:', err);
  }
};

export const deleteAlert = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (err) {
    console.error('Erro ao deletar alerta:', err);
  }
};