import { useEffect, useState } from 'react';
import { Servicos } from '../models/Servicos';
import { getServicos, saveServicosAPI } from '../services/api';

export function useServicos() {
  const [servicos, setServicos] = useState<Servicos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarServicos = async () => {
    try {
      setLoading(true);
      const dados = await getServicos();
      console.log('DADOS CARREGADOS NO HOOK:', dados);
      setServicos(dados);
    } catch (err) {
      setError('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  const addServico = async (novoServico: Omit<Servicos, 'id'>) => {
    try {
      const id = Date.now().toString();
      const listaAtualizada = [...servicos, { id, ...novoServico }];
      await saveServicosAPI(listaAtualizada);
      setServicos(listaAtualizada);
    } catch (err) {
      throw new Error('Erro ao adicionar');
    }
  };

  const editServico = async (id: string, dadosAtualizados: Partial<Servicos>) => {
    try {
      const listaAtualizada = servicos.map((item) =>
        item.id === id ? { ...item, ...dadosAtualizados } : item
      );
      await saveServicosAPI(listaAtualizada);
      setServicos(listaAtualizada);
    } catch (err) {
      throw new Error('Erro ao editar');
    }
  };

  const removeServico = async (id: string) => {
    try {
      const listaAtualizada = servicos.filter((item) => item.id !== id);
      await saveServicosAPI(listaAtualizada);
      setServicos(listaAtualizada);
    } catch (err) {
      throw new Error('Erro ao remover');
    }
  };

  return {
    servicos,
    loading,
    error,
    addServico,
    editServico,
    removeServico,
    carregarServicos,
  };
}