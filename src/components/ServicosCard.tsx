import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Servicos } from '../models/Servicos';
 
interface Props {
  servicos: Servicos | null;
}
 
export default function ServicosCard({ servicos }: Props) {
  if (!servicos) {
    return <Text>Serviço inválido</Text>;
  }
 
  return (
<View style={styles.card}>
<Image
        source={{ uri: servicos.imagem || '' }}
        style={styles.image}
      />
<View style={styles.infoContainer}>
<Text style={styles.nome}>
          {servicos.nome ? servicos.nome.toUpperCase() : 'SEM NOME'}
</Text>
 
        <Text style={styles.descricao}>
          {servicos.descricao || 'Sem nome'}
</Text>
 
        <Text numberOfLines={2} style={styles.descricao}>
          {servicos.descricao || 'Sem descrição'}
</Text>
</View>
</View>
  );
}
 
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    margin: 16,
    overflow: 'hidden',
    elevation: 4,
  },
 
  image: {
    width: '100%',
    height: 200,
  },
 
  infoContainer: {
    padding: 16,
  },
 
  marca: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
 
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
 
  descricao: {
    fontSize: 14,
    color: '#555',
    marginVertical: 8,
  },
 
  preco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
});