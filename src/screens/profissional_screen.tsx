import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import ProfissionalService from '../services/profissionalService';

const ATIVIDADES_OPCOES = [
  'Pedreiro',
  'Azulejista',
  'Encanador',
  'Eletricista',
  'Pintor de parede',
  'Pintor de aço',
  'Jardineiro',
  'Marceneiro',
  'Montador de móveis',
];

interface Profissional {
  id?: string;
  nome: string;
  cpf: string;
  rg: string;
  telefone: string;
  cep: string;
  endereco: string;
  atividadeProfissional?: string[] | string;
  atividadesProfissionais?: string[] | string;
}

export default function ProfissionalScreen() {
  const [modo, setModo] = useState<'lista' | 'formulario'>('lista');
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);

  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(false);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [atividadesSelecionadas, setAtividadesSelecionadas] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  // Estados para controle dos Modais
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [nomeCadastrado, setNomeCadastrado] = useState('');

  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [profissionalParaExcluir, setProfissionalParaExcluir] = useState<Profissional | null>(null);

  useEffect(() => {
    carregarProfissionais();
  }, []);

  // ==================================================
  // BUSCAR PROFISSIONAIS
  // ==================================================
  const carregarProfissionais = async () => {
    try {
      setCarregandoLista(true);
      const data = await ProfissionalService.listarTodos();
      setProfissionais((data as Profissional[]) || []);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
    } finally {
      setCarregandoLista(false);
    }
  };

  // ==================================================
  // LIMPAR FORMULÁRIO E ESTADO DE EDIÇÃO
  // ==================================================
  const limparFormulario = () => {
    setNome('');
    setCpf('');
    setRg('');
    setTelefone('');
    setCep('');
    setEndereco('');
    setAtividadesSelecionadas([]);
    setIdEmEdicao(null);
  };

  // ==================================================
  // MÁSCARAS DE FORMATAÇÃO
  // ==================================================
  const aplicarMascaraCPF = (value: string) => {
    const apenasNumeros = value.replace(/\D/g, '').slice(0, 11);
    const cpfFormatado = apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(cpfFormatado);
  };

  const aplicarMascaraRG = (value: string) => {
    const apenasValidos = value.replace(/[^0-9xX]/g, '').slice(0, 9);
    const rgFormatado = apenasValidos
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})([0-9xX]{1,2})$/, '$1-$2');
    setRg(rgFormatado.toUpperCase());
  };

  const aplicarMascaraTelefone = (value: string) => {
    const apenasNumeros = value.replace(/\D/g, '').slice(0, 11);
    let telFormatado = apenasNumeros;

    if (apenasNumeros.length <= 10) {
      telFormatado = apenasNumeros
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      telFormatado = apenasNumeros
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    setTelefone(telFormatado);
  };

  const aplicarMascaraCEP = (value: string) => {
    const apenasNumeros = value.replace(/\D/g, '').slice(0, 8);
    const cepFormatado = apenasNumeros.replace(/(\d{5})(\d)/, '$1-$2');
    setCep(cepFormatado);
  };

  // ==================================================
  // HANDLERS E AÇÕES DA LISTA (EDITAR E EXCLUIR)
  // ==================================================
  const handleIniciarEdicao = (item: Profissional) => {
    setIdEmEdicao(item.id || null);
    setNome(item.nome || '');
    aplicarMascaraCPF(item.cpf || '');
    aplicarMascaraRG(item.rg || '');
    aplicarMascaraTelefone(item.telefone || '');
    aplicarMascaraCEP(item.cep || '');
    setEndereco(item.endereco || '');

    const atividades = extrairAtividades(item);
    setAtividadesSelecionadas(atividades);

    setModo('formulario');
  };

  // Abre o modal de confirmação
  const solicitarExclusao = (item: Profissional) => {
    setProfissionalParaExcluir(item);
    setModalExcluirVisible(true);
  };

  // Executa a exclusão de fato após confirmar no modal
  const confirmarExclusao = async () => {
    if (!profissionalParaExcluir?.id) return;

    try {
      setCarregandoLista(true);
      await ProfissionalService.eliminar(profissionalParaExcluir.id);
      setModalExcluirVisible(false);
      setProfissionalParaExcluir(null);
      await carregarProfissionais();
    } catch (error) {
      console.error('Erro ao excluir profissional:', error);
    } finally {
      setCarregandoLista(false);
    }
  };

  const toggleAtividade = (atividade: string) => {
    if (atividadesSelecionadas.includes(atividade)) {
      setAtividadesSelecionadas((prev) => prev.filter((item) => item !== atividade));
    } else {
      setAtividadesSelecionadas((prev) => [...prev, atividade]);
    }
  };

  const handleCadastrar = async () => {
    if (
      !nome.trim() ||
      !cpf.trim() ||
      !rg.trim() ||
      !telefone.trim() ||
      !cep.trim() ||
      !endereco.trim() ||
      atividadesSelecionadas.length === 0
    ) {
      return;
    }

    try {
      setLoading(true);

      const dadosProfissional = {
        nome: nome.trim(),
        cpf: cpf.replace(/\D/g, ''),
        rg: rg.trim(),
        telefone: telefone.replace(/\D/g, ''),
        cep: cep.replace(/\D/g, ''),
        endereco: endereco.trim(),
        atividadeProfissional: atividadesSelecionadas,
      };

      if (idEmEdicao) {
        await ProfissionalService.atualizar(idEmEdicao, dadosProfissional);
      } else {
        await ProfissionalService.criar(dadosProfissional);
      }

      setNomeCadastrado(nome.trim());
      limparFormulario();
      carregarProfissionais();
      setModalSucessoVisible(true);
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
    } finally {
      setLoading(false);
    }
  };

  const extrairAtividades = (item: Profissional): string[] => {
    const lista = item.atividadeProfissional || item.atividadesProfissionais;
    if (Array.isArray(lista)) return lista;
    if (typeof lista === 'string') return lista.split(',').map((s) => s.trim());
    return [];
  };

  // ==================================================
  // VISUALIZAÇÃO: LISTA DE PROFISSIONAIS
  // ==================================================
  if (modo === 'lista') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.pageTitle}>Profissionais Cadastrados</Text>
            <Text style={styles.subtitle}>
              Consulte a lista de prestadores de serviços registrados.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.novoCadastroBtn}
            activeOpacity={0.8}
            onPress={() => {
              limparFormulario();
              setModo('formulario');
            }}
          >
            <Text style={styles.novoCadastroBtnText}>+ NOVO CADASTRO</Text>
          </TouchableOpacity>

          {carregandoLista ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#123E7A" />
              <Text style={styles.loadingText}>Carregando profissionais...</Text>
            </View>
          ) : profissionais.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Nenhum profissional encontrado</Text>
              <Text style={styles.emptySub}>
                Clique no botão acima para registrar o primeiro prestador.
              </Text>
            </View>
          ) : (
            profissionais.map((item, index) => {
              const atividades = extrairAtividades(item);
              return (
                <View key={item.id || index} style={styles.itemCard}>
                  {/* CABEÇALHO DO CARD COM NOME E BOTÕES */}
                  <View style={styles.itemHeaderRow}>
                    <Text style={styles.itemNome}>{item.nome}</Text>

                    <View style={styles.actionButtonsContainer}>
                      {/* BOTÃO EDITAR */}
                      <TouchableOpacity
                        style={styles.btnEditar}
                        activeOpacity={0.7}
                        onPress={() => handleIniciarEdicao(item)}
                      >
                        <MaterialIcons name="edit" size={18} color="#FFFFFF" />
                      </TouchableOpacity>

                      {/* BOTÃO EXCLUIR */}
                      <TouchableOpacity
                        style={styles.btnExcluir}
                        activeOpacity={0.7}
                        onPress={() => solicitarExclusao(item)}
                      >
                        <MaterialIcons name="delete" size={18} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View>
                    <Text style={styles.itemInfo}>
                      📱 Telefone: {item.telefone}
                    </Text>

                    <Text style={styles.itemInfo}>
                      📍 Endereço: {item.endereco}
                    </Text>
                  </View>

                  {atividades.length > 0 && (
                    <View style={styles.itemChipsRow}>
                      {atividades.map((atv, i) => (
                        <View key={i} style={styles.itemChip}>
                          <Text style={styles.itemChipText}>{atv}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>

        {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalExcluirVisible}
          onRequestClose={() => setModalExcluirVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={[styles.iconContainer, styles.iconContainerDelete]}>
                <Text style={styles.iconDeleteText}>?</Text>
              </View>

              <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
              <Text style={styles.modalDescription}>
                Deseja realmente excluir o cadastro de{' '}
                <Text style={styles.highlightText}>
                  {profissionalParaExcluir?.nome}
                </Text>
                ? Esta ação não poderá ser desfeita.
              </Text>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[styles.modalButtonBase, styles.modalButtonCancel]}
                  activeOpacity={0.8}
                  onPress={() => setModalExcluirVisible(false)}
                >
                  <Text style={styles.modalButtonCancelText}>CANCELAR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButtonBase, styles.modalButtonConfirm]}
                  activeOpacity={0.8}
                  onPress={confirmarExclusao}
                >
                  <Text style={styles.modalButtonText}>EXCLUIR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // ==================================================
  // VISUALIZAÇÃO: FORMULÁRIO DE CADASTRO / EDIÇÃO
  // ==================================================
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerFormRow}>
        <TouchableOpacity
          style={styles.voltarBtn}
          onPress={() => {
            limparFormulario();
            setModo('lista');
          }}
        >
          <Text style={styles.voltarBtnText}>← Voltar para a lista</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardHeader}>
        <Text style={styles.pageTitle}>
          {idEmEdicao ? 'Editar Profissional' : 'Cadastro de Profissional'}
        </Text>
        <Text style={styles.subtitle}>
          {idEmEdicao
            ? 'Altere os campos abaixo para atualizar o cadastro.'
            : 'Preencha os dados abaixo para registrar um novo prestador de serviço.'}
        </Text>
      </View>

      <View style={styles.formCard}>
        {/* NOME COMPLETO */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: João da Silva"
            placeholderTextColor="#A0A5A8"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        {/* CPF E RG */}
        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>CPF *</Text>
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              placeholderTextColor="#A0A5A8"
              keyboardType="numeric"
              maxLength={14}
              value={cpf}
              onChangeText={aplicarMascaraCPF}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>RG *</Text>
            <TextInput
              style={styles.input}
              placeholder="00.000.000-0"
              placeholderTextColor="#A0A5A8"
              autoCapitalize="characters"
              maxLength={12}
              value={rg}
              onChangeText={aplicarMascaraRG}
            />
          </View>
        </View>

        {/* TELEFONE E CEP */}
        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Telefone / WhatsApp *</Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#A0A5A8"
              keyboardType="numeric"
              maxLength={15}
              value={telefone}
              onChangeText={aplicarMascaraTelefone}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>CEP *</Text>
            <TextInput
              style={styles.input}
              placeholder="00000-000"
              placeholderTextColor="#A0A5A8"
              keyboardType="numeric"
              maxLength={9}
              value={cep}
              onChangeText={aplicarMascaraCEP}
            />
          </View>
        </View>

        {/* ENDEREÇO */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Endereço Completo *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Rua, número, bairro e cidade"
            placeholderTextColor="#A0A5A8"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={endereco}
            onChangeText={setEndereco}
          />
        </View>

        {/* ATIVIDADES */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Atividades Profissionais *</Text>
          <Text style={styles.subLabel}>
            Clique para selecionar uma ou mais opções
          </Text>

          <View style={styles.chipsContainer}>
            {ATIVIDADES_OPCOES.map((item) => {
              const isSelected = atividadesSelecionadas.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.7}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => toggleAtividade(item)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* BOTÃO CADASTRAR / ATUALIZAR */}
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleCadastrar}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                {idEmEdicao ? 'SALVANDO...' : 'CADASTRANDO...'}
              </Text>
            </>
          ) : (
            <Text style={styles.submitButtonText}>
              {idEmEdicao ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PROFISSIONAL'}
            </Text>
          )}
        </Pressable>
      </View>

      {/* MODAL DE SUCESSO */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalSucessoVisible}
        onRequestClose={() => {
          setModalSucessoVisible(false);
          setModo('lista');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconCheck}>✓</Text>
            </View>

            <Text style={styles.modalTitle}>Sucesso!</Text>
            <Text style={styles.modalDescription}>
              Profissional <Text style={styles.highlightText}>{nomeCadastrado}</Text>{' '}
              {idEmEdicao ? 'atualizado' : 'cadastrado'} com sucesso!
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              activeOpacity={0.8}
              onPress={() => {
                setModalSucessoVisible(false);
                setModo('lista');
              }}
            >
              <Text style={styles.modalButtonText}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  cardHeader: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#123E7A',
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },

  /* BOTÕES E NAVEGAÇÃO */
  novoCadastroBtn: {
    backgroundColor: '#F36B2B',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  novoCadastroBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
  headerFormRow: {
    marginBottom: 12,
  },
  voltarBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  voltarBtnText: {
    color: '#123E7A',
    fontWeight: '700',
    fontSize: 14,
  },

  /* CARDS DA LISTAGEM E BOTÕES DE AÇÃO */
  loadingBox: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6C757D',
    fontSize: 14,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#123E7A',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#6C757D',
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#123E7A',
    flex: 1,
    marginRight: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnEditar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#28A745',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnExcluir: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DC3545',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    fontSize: 13,
    color: '#495057',
    marginBottom: 4,
  },
  itemChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  itemChip: {
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  itemChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#123E7A',
  },

  /* FORMULÁRIO */
  formCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 18,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#123E7A',
    marginBottom: 6,
  },
  subLabel: {
    fontSize: 11,
    color: '#6C757D',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212529',
  },
  textArea: {
    minHeight: 80,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: '#123E7A',
    borderColor: '#123E7A',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#123E7A',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  submitButton: {
    height: 52,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#F36B2B',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  buttonDisabled: {
    opacity: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  /* ESTILOS DOS MODAIS */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D4EDDA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainerDelete: {
    backgroundColor: '#F8D7DA',
  },
  iconCheck: {
    fontSize: 28,
    color: '#28A745',
    fontWeight: 'bold',
  },
  iconDeleteText: {
    fontSize: 28,
    color: '#DC3545',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#123E7A',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  highlightText: {
    fontWeight: '700',
    color: '#212529',
  },
  modalButton: {
    backgroundColor: '#123E7A',
    width: '100%',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalButtonBase: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#E9ECEF',
  },
  modalButtonCancelText: {
    color: '#495057',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  modalButtonConfirm: {
    backgroundColor: '#DC3545',
  },
});