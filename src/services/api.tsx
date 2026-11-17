import axios from 'axios';
import { API_KEY, URL } from '../constants/config';
import { JSONBinResponse, Servicos } from '../models/Servicos';

export const getServicos = async (): Promise<Servicos[]> => {
  try {
    const response = await axios.get<JSONBinResponse>(URL, {
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    console.log('CONTEÚDO RECEBIDO DO JSONBIN:', response.data);

    const data = response.data;

    // Tenta encontrar o array em qualquer estrutura possível que o JSONBin retorne
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.record)) return data.record;
    if (data.record?.record && Array.isArray(data.record.record)) return data.record.record;
    
    // Se os dados estiverem salvos em outro formato de objeto, tenta achar qualquer propriedade que seja array
    const possibleArray = Object.values(data.record || {}).find(val => Array.isArray(val));
    if (Array.isArray(possibleArray)) return possibleArray;

    return [];
  } catch (error: any) {
    console.log('ERRO GET:', error.message);
    throw new Error('Erro ao carregar serviços');
  }
};

export const saveServicosAPI = async (servicos: Servicos[]) => {
  try {
    await axios.put(
      URL,
      { 
        record: { 
          record: servicos 
        } 
      },
      {
        headers: {
          'X-Master-Key': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.log('ERRO SALVAR:', error.message);
    throw new Error('Erro ao salvar serviços');
  }
};