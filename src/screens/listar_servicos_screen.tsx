import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ServicosCard from '../components/ServicosCard';
import { useServicos } from '../hooks/useServicos';
import { dispararNotificacaoLocal } from '../services/notificationService';

export default function HomeScreen() {
  const { servicos, loading, error, addServico, editServico, removeServico } = useServicos();

  // Estados para controlar o Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Estados dos campos do formulário
  const [nome, setNome] = useState('');
  const [imagem, setImagem] = useState('');

  // Abre o modal para cadastrar um Novo Serviço
  const handleOpenAdd = () => {
    setIsEditing(false);
    setNome('');
    setImagem('');
    setModalVisible(true);
  };

  // Abre o modal para Editar um Serviço existente
  const handleOpenEdit = (item: any) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setNome(item.nome);
    setImagem(item.imagem);
    setModalVisible(true);
  };

  // Função central para Salvar (seja Criar ou Atualizar)
  const handleSave = async () => {
    if (!nome.trim() || !imagem.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      if (isEditing && currentId) {
        await editServico(currentId, { nome, imagem });
        await dispararNotificacaoLocal(
          'Edição concluída',
          'Edição concluída com sucesso!'
        );
      } else {
        await addServico({ nome, imagem });
        await dispararNotificacaoLocal(
          'Cadastro realizado',
          'Cadastro realizado com sucesso!'
        );
      }
      setModalVisible(false);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar o serviço.');
    }
  };

  const executarExclusao = async (item: any) => {
    try {
      await removeServico(item.id);
      await dispararNotificacaoLocal(
        'Exclusão concluída',
        'Exclusão feita com sucesso!'
      );
    } catch (err) {
      if (Platform.OS === 'web') {
        window.alert('Não foi possível excluir o serviço.');
      } else {
        Alert.alert('Erro', 'Não foi possível excluir o serviço.');
      }
    }
  };

  const handleDelete = (item: any) => {
    if (!item?.id) {
      const msg = 'Este serviço não possui um ID válido no JSONBin para ser excluído.';
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Erro', msg);
      return;
    }

    if (Platform.OS === 'web') {
      if (window.confirm(`Deseja realmente excluir "${item.nome}"?`)) {
        executarExclusao(item);
      }
      return;
    }

    Alert.alert(
      'Excluir Serviço',
      `Deseja realmente excluir "${item.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => executarExclusao(item),
        },
      ]
    );
  };

  if (loading && servicos.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text>Carregando serviços...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* BOTÃO NOVO SERVIÇO */}
      <TouchableOpacity style={styles.addButton} onPress={handleOpenAdd}>
        <Ionicons name="add-circle" size={24} color="#FFF" />
        <Text style={styles.addText}>Novo Serviço</Text>
      </TouchableOpacity>

      <FlatList
        data={servicos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <ServicosCard servicos={item} />

            {/* BOTÕES DE AÇÃO */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleOpenEdit(item)}
              >
                <Ionicons name="create-outline" size={24} color="blue" />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDelete(item)}
              >
                <Ionicons name="trash-outline" size={24} color="red" />
                <Text style={styles.actionText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
            </Text>

            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do serviço"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>URL da imagem:</Text>
            <TextInput
              style={styles.input}
              placeholder="https://exemplo.com/imagem.png"
              value={imagem}
              onChangeText={setImagem}
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#ee7129',
    padding: 12,
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20,
    gap: 20,
    marginBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});