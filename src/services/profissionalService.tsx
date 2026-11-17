import { child, get, push, ref, remove, update } from 'firebase/database';
import { ProfissionalModel } from '../models/ProfissionalModel';
import { database } from '../services/firebaseConfig';

export type ErrosProfissional = Partial<
  Record<keyof ProfissionalModel, string>
>;

// Função auxiliar para validar o algoritmo do CPF (dígitos verificadores)
function validarCPF(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, '');

  if (cpfLimpo.length !== 11) return false;

  // Rejeita CPFs com todos os dígitos repetidos (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(cpfLimpo)) return false;

  let soma = 0;
  let resto: number;

  // Validação do 1º dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

  soma = 0;
  // Validação do 2º dígito verificador
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

  return true;
}

export class ProfissionalService {
  static validarCampos(
    dados: ProfissionalModel
  ): { valido: boolean; erros: ErrosProfissional } {
    const erros: ErrosProfissional = {};

    if (!dados.nome?.trim()) {
      erros.nome = 'Campo obrigatório.';
    }

    if (
      dados.cpf === null ||
      dados.cpf === undefined ||
      String(dados.cpf).trim() === ''
    ) {
      erros.cpf = 'Campo obrigatório.';
    } else {
      // Validação completa de tamanho e dígitos verificadores
      if (!validarCPF(String(dados.cpf))) {
        erros.cpf = 'Informe um CPF válido.';
      }
    }

    if (
      dados.rg === null ||
      dados.rg === undefined ||
      String(dados.rg).trim() === ''
    ) {
      erros.rg = 'Campo obrigatório.';
    } else {
      // Aceita números e letras (A-Z, a-z), removendo caracteres especiais
      const rgLimpo = String(dados.rg).replace(/[^0-9a-zA-Z]/g, '');
      if (rgLimpo.length < 5) { // Ajuste o tamanho mínimo conforme sua necessidade (ex: 5 ou 7)
        erros.rg = 'Informe um RG válido.';
      }
    }

    if (
      dados.telefone === null ||
      dados.telefone === undefined ||
      String(dados.telefone).trim() === ''
    ) {
      erros.telefone = 'Campo obrigatório.';
    } else {
      const telefoneNumeros = String(dados.telefone).replace(/\D/g, '');
      if (
        telefoneNumeros.length !== 10 &&
        telefoneNumeros.length !== 11
      ) {
        erros.telefone = 'Informe um telefone válido.';
      }
    }

    if (!dados.endereco?.trim()) {
      erros.endereco = 'Campo obrigatório.';
    }

    if (!dados.atividadeProfissional || dados.atividadeProfissional.length === 0) {
      erros.atividadeProfissional = 'Campo obrigatório.';
    }

    return {
      valido: Object.keys(erros).length === 0,
      erros,
    };
  }

  // Criar profissional
  static async criar(dados: ProfissionalModel): Promise<ProfissionalModel> {
    try {
      const profissionaisRef = ref(database, 'profissionais');
      const novoProfissionalRef = push(profissionaisRef);
      const novoId = novoProfissionalRef.key;

      if (!novoId) {
        throw new Error('Não foi possível gerar um ID único no Firebase.');
      }

      const novoProfissional: ProfissionalModel = {
        ...dados,
        id: novoId,
      };

      await update(novoProfissionalRef, novoProfissional);
      return novoProfissional;
    } catch (error) {
      console.error('Erro ao criar profissional no Firebase:', error);
      throw new Error('Falha ao registrar o profissional no banco de dados.');
    }
  }

  // Listar todos os profissionais
  static async listarTodos(): Promise<ProfissionalModel[]> {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'profissionais'));

      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
      }

      return [];
    } catch (error) {
      console.error('Erro ao listar profissionais do Firebase:', error);
      throw new Error('Falha ao carregar os profissionais.');
    }
  }

  // Buscar profissional por ID
  static async obterPorId(id: string): Promise<ProfissionalModel | null> {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `profissionais/${id}`));

      if (snapshot.exists()) {
        return {
          id,
          ...snapshot.val(),
        };
      }

      return null;
    } catch (error) {
      console.error(`Erro ao buscar profissional com ID ${id}:`, error);
      throw new Error('Falha ao obter os dados do profissional.');
    }
  }

  // Atualizar profissional
  static async atualizar(
    id: string,
    dados: ProfissionalModel
  ): Promise<boolean> {
    try {
      const profissionalRef = ref(database, `profissionais/${id}`);
      const dadosAtualizados: ProfissionalModel = {
        ...dados,
        id,
      };

      await update(profissionalRef, dadosAtualizados);
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar profissional com ID ${id}:`, error);
      throw new Error('Falha ao atualizar o profissional.');
    }
  }

  // Excluir profissional no Firebase Realtime Database
  static async eliminar(id: string): Promise<boolean> {
    if (!id || !id.trim()) {
      throw new Error('ID do profissional não informado.');
    }

    try {
      const profissionalRef = ref(database, `profissionais/${id.trim()}`);

      // Verifica se o cadastro existe antes de excluir
      const snapshot = await get(profissionalRef);

      if (!snapshot.exists()) {
        throw new Error('Profissional não encontrado no banco de dados.');
      }

      // Remove o cadastro do Firebase
      await remove(profissionalRef);

      console.log('Profissional excluído com sucesso:', id);
      return true;
    } catch (error) {
      console.error('Erro detalhado ao excluir profissional:', error);

      // Mantém a mensagem original do Firebase para diagnóstico
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Não foi possível excluir o profissional.');
    }
  }
}

export default ProfissionalService;