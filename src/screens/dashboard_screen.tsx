import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';


// Importação da tela de Profissionais
import ProfissionalScreen from './profissional_screen';
import ListarServicosScreen from './listar_servicos_screen';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <ScrollView
      style={styles.tabContainer}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.welcomeText}>Olá, Bem-vindo(a)!</Text>
        <Text style={styles.subtitle}>Painel Geral de Profissionais e Serviços</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statLabel}>Atendimentos Finalizados</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Orçamentos Hoje</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ÚLTIMOS ATENDIMENTOS</Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>João Silva — Elétrica</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Ana Maria — Encanamento</Text>
        </View>
      
      </View>

      
    </ScrollView>
  );
}



function SairScreen({ navigation }: any) {
  const executarLogout = () => {
    const rootNav = navigation.getParent() || navigation;
    rootNav.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja realmente sair da sua conta?')) {
        executarLogout();
      }
      return;
    }

    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: executarLogout,
        },
      ]
    );
  };

  return (
    <View style={styles.logoutContainer}>
      <Text style={styles.logoutTitle}>Atenção</Text>
      <Text style={styles.logoutSubtitle}>
        Você está prestes a encerrar sua sessão.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>CONFIRMAR SAÍDA</Text>
      </Pressable>
    </View>
  );
}

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.topLine} />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: '#F8F9FA',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#E9ECEF',
          },
          headerTitleStyle: {
            color: '#123E7A', // Azul ResoLve
            fontWeight: '700',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#F36B2B', // Laranja ResoLve para a aba ativa
          tabBarInactiveTintColor: '#6C757D',
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Profissional') {
              iconName = 'briefcase-outline';
            } else if (route.name === 'Serviços') {
              iconName = 'build-outline';
            } else if (route.name === 'Sair') {
              iconName = 'log-out-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
        <Tab.Screen name="Profissional" component={ProfissionalScreen} options={{ tabBarLabel: 'Profissionais' }} />
        <Tab.Screen name="Serviços" component={ListarServicosScreen} options={{ tabBarLabel: 'Serviços' }} />
        <Tab.Screen name="Sair" component={SairScreen} options={{ tabBarLabel: 'Sair' }} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  topLine: { height: 5, width: '100%', backgroundColor: '#F36B2B' }, // Linha superior Laranja
  tabContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { padding: 24 },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    height: 65,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  cardHeader: { marginBottom: 20 },
  welcomeText: { fontSize: 24, fontWeight: '700', color: '#123E7A' }, // Azul ResoLve
  subtitle: { fontSize: 14, color: '#6C757D', marginTop: 4 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: '#123E7A', marginBottom: 8 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    flex: 0.48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statNumber: { fontSize: 28, fontWeight: '700', color: '#F36B2B' }, // Destaque Laranja
  statLabel: { fontSize: 12, color: '#123E7A', fontWeight: '600', marginTop: 4 },
  section: { marginTop: 10 },
  sectionTitle: { color: '#123E7A', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
    borderColor: '#E9ECEF',
    borderRadius: 10,
    padding: 16,
    elevation: 1,
  },
  infoTitle: { color: '#6C757D', fontSize: 12 },
  infoText: { color: '#123E7A', fontSize: 16, fontWeight: '600', marginTop: 4 },
  servicoCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 10,
    padding: 16,
    marginTop: 12,
  },
  servicoEndpoint: { fontSize: 14, fontWeight: '700', color: '#123E7A' },
  servicoStatus: { fontSize: 12, color: '#28A745', marginTop: 4, fontWeight: '600' },
  logoutContainer: { flex: 1, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', padding: 28 },
  logoutTitle: { fontSize: 22, fontWeight: '700', color: '#123E7A', marginBottom: 8 },
  logoutSubtitle: { fontSize: 14, color: '#6C757D', textAlign: 'center', marginBottom: 32 },
  logoutButton: {
    height: 52,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#F36B2B', // Laranja ResoLve
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.85 },
  logoutButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', letterSpacing: 2 },
});