import axios from 'axios';
import { API_KEY, URL } from '../constants/config';
import { JSONBinResponse, Servicos } from '../models/Servicos';

// Função auxiliar para extrair o array mesmo se houver múltiplos níveis de "record"
function extrairArrayServicos(obj: any): Servicos[] {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  if (obj.record) return extrairArrayServicos(obj.record);
  
  const arrayEncontrado = Object.values(obj).find((val) => Array.isArray(val));
  return Array.isArray(arrayEncontrado) ? arrayEncontrado : [];
}

export const getServicos = async (): Promise<Servicos[]> => {
  try {
    const response = await axios.get<JSONBinResponse>(URL, {
      headers: {
        'X-Master-Key': API_KEY,
      },
    });

    console.log('CONTEÚDO RECEBIDO DO JSONBIN:', JSON.stringify(response.data));
    return extrairArrayServicos(response.data);
  } catch (error: any) {
    console.log('ERRO GET:', error.response?.data || error.message);
    throw new Error('Erro ao carregar serviços');
  }
};

export const saveServicosAPI = async (servicos: Servicos[]) => {
  try {
    await axios.put(
      URL,
      { record: servicos },
      {
        headers: {
          'X-Master-Key': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.log('ERRO SALVAR:', error.response?.data || error.message);
    throw new Error('Erro ao salvar serviços');
  }
};