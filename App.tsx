// Arquivo que contém as rotas do aplicativo, ou seja,
//as telas que o usuário 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Importar todas as telas do aplicativo
import DashboardScreen from './src/screens/dashboard_screen';
import LoginScreen from './src/screens/login_screen';
import ProfissionalScreen from './src/screens/profissional_screen';
import RegisterScreen from './src/screens/register_screen';
import SplashScreen from './src/screens/splash_screen';



const Stack = createNativeStackNavigator();

export default function App() {
    return (
    <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}
>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Cadastro" component={RegisterScreen}/>
            <Stack.Screen name="Dashboard" component={DashboardScreen}/>
            <Stack.Screen name="Profissional" component={ProfissionalScreen}/>
            
        </Stack.Navigator>
    </NavigationContainer>
);
}