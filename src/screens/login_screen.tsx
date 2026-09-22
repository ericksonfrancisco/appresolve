import React, { useState } from 'react';
import { loginUsuario } from '../services/userService';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from 'react-native';

export default function LoginScreen({ navigation }: any) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [mensagemLogin, setMensagemLogin] = useState('');

    // ==========================================
    // VALIDAÇÃO DO E-MAIL
    // ==========================================

    const validateEmail = (value: string) => {

        if (!value.trim()) {
            return 'Informe seu e-mail.';
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value.trim())) {
            return 'Informe um e-mail válido.';
        }

        return '';
    };

    // ==========================================
    // VALIDAÇÃO DA SENHA
    // ==========================================

    const validatePassword = (value: string) => {

        if (!value) {
            return 'Informe sua senha.';
        }

        if (value.length < 6) {
            return 'A senha deve possuir pelo menos 6 caracteres.';
        }

        return '';
    };

    // ==========================================
    // ALTERAÇÃO DO E-MAIL
    // ==========================================

    const handleEmailChange = (value: string) => {

        const formattedValue = value
            .replace(/\s/g, '')
            .toLowerCase();

        setEmail(formattedValue);

        if (emailError) {
            setEmailError('');
        }
    };

    // ==========================================
    // ALTERAÇÃO DA SENHA
    // ==========================================

    const handlePasswordChange = (value: string) => {

        setPassword(value);

        if (passwordError) {
            setPasswordError('');
        }
    };

    // ==========================================
    // LOGIN
    // ==========================================

    const handleLogin = async () => {

        setMensagemLogin('');

        const emailValidation = validateEmail(email);
        const passwordValidation = validatePassword(password);

        setEmailError(emailValidation);
        setPasswordError(passwordValidation);

        // Se houver erro de validação, não continua
        if (emailValidation || passwordValidation) {
            return;
        }

        setCarregando(true);

        try {

            const resultado = await loginUsuario(
                email.trim(),
                password
            );

            if (!resultado.sucesso) {

                setMensagemLogin(resultado.mensagem);

                return;
            }

            // Login realizado com sucesso
            navigation.replace('Dashboard');

        } catch (error) {

            console.log('Erro inesperado:', error);

            setMensagemLogin(
                'Ocorreu um erro ao realizar o login.'
            );

        } finally {

            setCarregando(false);

        }
    };

    return (

        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === 'ios'
                    ? 'padding'
                    : undefined
            }
        >

            <StatusBar
                barStyle="light-content"
                backgroundColor="#F36B2B"
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                {/* ==================================
                    CABEÇALHO LARANJA
                ================================== */}

                <View style={styles.brandArea}>

                    <Text style={styles.slogan}>
                        Quem precisa encontra.{'\n'}
                        Quem resolve atende.
                    </Text>

                    <Image
                        source={require('../../assets/images/Logotipo_ResoLve.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                </View>


                {/* ==================================
                    FORMULÁRIO
                ================================== */}

                <View style={styles.formCard}>

                    <Text style={styles.welcome}>
                        Bem-vindo!
                    </Text>

                    <Text style={styles.description}>
                        Entre na sua conta para continuar.
                    </Text>


                    {/* E-MAIL */}

                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>
                            E-mail
                        </Text>

                        <View
                            style={[
                                styles.inputWrapper,
                                emailError
                                    ? styles.inputWrapperError
                                    : null,
                            ]}
                        >

                            <View style={styles.iconBox}>
                                <Text style={styles.emailIcon}>
                                    @
                                </Text>
                            </View>

                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={handleEmailChange}
                                placeholder="Digite seu e-mail"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="email"
                                textContentType="emailAddress"
                                returnKeyType="next"
                            />

                        </View>

                        {emailError ? (
                            <Text style={styles.errorText}>
                                {emailError}
                            </Text>
                        ) : null}

                    </View>


                    {/* SENHA */}

                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>
                            Senha
                        </Text>

                        <View
                            style={[
                                styles.inputWrapper,
                                passwordError
                                    ? styles.inputWrapperError
                                    : null,
                            ]}
                        >

                            <View style={styles.iconBox}>
                                <Text style={styles.lockIcon}>
                                    •
                                </Text>
                            </View>

                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={handlePasswordChange}
                                placeholder="Digite sua senha"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="password"
                                textContentType="password"
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setShowPassword(!showPassword)
                                }
                                style={styles.showButton}
                                activeOpacity={0.7}
                            >

                                <Text style={styles.showText}>
                                    {showPassword
                                        ? 'Ocultar'
                                        : 'Mostrar'}
                                </Text>

                            </TouchableOpacity>

                        </View>

                        {passwordError ? (
                            <Text style={styles.errorText}>
                                {passwordError}
                            </Text>
                        ) : null}

                    </View>

                    {mensagemLogin ? (
                        <View style={styles.loginErrorBox}>
                            <Text style={styles.loginErrorText}>
                                {mensagemLogin}
                            </Text>
                        </View>
                    ) : null}

                    {/* ESQUECI MINHA SENHA */}

                    <TouchableOpacity
                        style={styles.forgotButton}
                        activeOpacity={0.7}
                        onPress={() => {
                            console.log('Recuperar senha');
                        }}
                    >

                        <Text style={styles.forgotText}>
                            Esqueci minha senha
                        </Text>

                    </TouchableOpacity>


                    {/* ENTRAR */}

                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            carregando && styles.loginButtonDisabled
                        ]}
                        onPress={handleLogin}
                        activeOpacity={0.85}
                        disabled={carregando}
                    >
                        <Text style={styles.loginButtonText}>
                            {carregando ? 'ENTRANDO...' : 'ENTRAR'}
                        </Text>
                    </TouchableOpacity>


                    {/* CADASTRO */}

                    <View style={styles.registerArea}>

                        <Text style={styles.registerText}>
                            Ainda não possui uma conta?
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('Cadastro')}
                        >
                            <Text style={styles.registerLink}>
                                Cadastre-se
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>


                {/* ==================================
                    RODAPÉ
                ================================== */}

                <View style={styles.footer}>

                    <Text style={styles.footerText}>
                        Conectando soluções para você
                    </Text>

                    <Text style={styles.version}>
                        RESOLVE • 2026
                    </Text>

                </View>

            </ScrollView>

        </KeyboardAvoidingView>
    );
}


// ==================================================
// ESTILOS
// ==================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },

    scrollContent: {
        flexGrow: 1,
    },

    // ==========================================
    // ÁREA DA MARCA
    // ==========================================

    brandArea: {
        backgroundColor: '#F36B2B',
        minHeight: 260,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 35,
        paddingBottom: 30,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },

    slogan: {
        color: '#FFFFFF',
        fontSize: 21,
        fontWeight: '800',
        lineHeight: 29,
        textAlign: 'center',
        marginBottom: 15,
    },

    logo: {
        width: 190,
        height: 120,
    },

    // ==========================================
    // CARD
    // ==========================================

    formCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 22,
        marginTop: -18,
        borderRadius: 22,
        paddingHorizontal: 22,
        paddingTop: 25,
        paddingBottom: 26,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,

        elevation: 4,
    },

    // ==========================================
    // CABEÇALHO
    // ==========================================

    welcome: {
        fontSize: 25,
        fontWeight: '800',
        color: '#123E7A',
        marginBottom: 5,
    },

    description: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 24,
    },

    // ==========================================
    // CAMPOS
    // ==========================================

    inputGroup: {
        marginBottom: 17,
    },

    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 7,
    },

    inputWrapper: {
        height: 53,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        flexDirection: 'row',
        alignItems: 'center',
    },

    inputWrapperError: {
        borderColor: '#EF4444',
        backgroundColor: '#FFF8F8',
    },

    iconBox: {
        width: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },

    emailIcon: {
        fontSize: 17,
        fontWeight: '800',
        color: '#F36B2B',
    },

    lockIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F36B2B',
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 17,
    },

    input: {
        flex: 1,
        height: '100%',
        fontSize: 14,
        color: '#1F2937',
        paddingRight: 10,
    },

    showButton: {
        paddingHorizontal: 12,
    },

    showText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#123E7A',
    },

    errorText: {
        color: '#EF4444',
        fontSize: 11,
        marginTop: 5,
        marginLeft: 2,
    },

    // ==========================================
    // ESQUECI SENHA
    // ==========================================

    forgotButton: {
        alignSelf: 'flex-end',
        marginTop: -3,
        marginBottom: 21,
    },

    forgotText: {
        color: '#123E7A',
        fontSize: 12,
        fontWeight: '700',
    },

    // ==========================================
    // BOTÃO
    // ==========================================

    loginButton: {
        height: 53,
        borderRadius: 12,
        backgroundColor: '#36A9E1',
        alignItems: 'center',
        justifyContent: 'center',
    },

    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.5,
    },

    loginButtonDisabled: {
        opacity: 0.6,
    },

    // ==========================================
    // CADASTRO
    // ==========================================

    registerArea: {
        alignItems: 'center',
        marginTop: 21,
    },

    registerText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 5,
    },

    registerLink: {
        fontSize: 14,
        fontWeight: '800',
        color: '#F36B2B',
    },

    // ==========================================
    // RODAPÉ
    // ==========================================

    footer: {
        alignItems: 'center',
        paddingVertical: 22,
    },

    footerText: {
        fontSize: 10,
        color: '#9CA3AF',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    version: {
        marginTop: 5,
        fontSize: 9,
        color: '#C4C7CC',
        letterSpacing: 1.2,
        fontWeight: '700',
    },

    loginErrorBox: {
        backgroundColor: '#FFF1F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 15,
    },

    loginErrorText: {
        color: '#DC2626',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },

});