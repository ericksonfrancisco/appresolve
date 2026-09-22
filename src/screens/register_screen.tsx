import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Ajuste o caminho abaixo conforme a estrutura do seu projeto
import { userService } from '../services/userService';

export default function CadastroScreen({ navigation }: any) {

    // ==========================================
    // CAMPOS
    // ==========================================

    const [nome, setNome] = useState('');
    const [celular, setCelular] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mensagemRodape, setMensagemRodape] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

    // ==========================================
    // ERROS
    // ==========================================

    const [nomeError, setNomeError] = useState('');
    const [celularError, setCelularError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [senhaError, setSenhaError] = useState('');

    // ==========================================
    // VISUALIZAÇÃO DA SENHA
    // ==========================================

    const [showPassword, setShowPassword] = useState(false);


    // ==========================================
    // MÁSCARA DO NOME
    // ==========================================

    const formatNome = (value: string) => {

        return value
            .replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
            .replace(/\s+/g, ' ');
    };


    // ==========================================
    // MÁSCARA DO CELULAR
    // ==========================================

    const formatCelular = (value: string) => {

        const numbers = value.replace(/\D/g, '').slice(0, 11);

        if (numbers.length <= 2) {
            return numbers.length > 0
                ? `(${numbers}`
                : '';
        }

        if (numbers.length <= 7) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        }

        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    };


    // ==========================================
    // MÁSCARA DO E-MAIL
    // ==========================================

    const formatEmail = (value: string) => {

        return value
            .replace(/\s/g, '')
            .toLowerCase();
    };


    // ==========================================
    // VALIDAÇÃO DO NOME
    // ==========================================

    const validateNome = (value: string) => {

        const nomeLimpo = value.trim();

        if (!nomeLimpo) {
            return 'O nome é obrigatório.';
        }

        if (nomeLimpo.length < 3) {
            return 'Informe seu nome completo.';
        }

        if (!nomeLimpo.includes(' ')) {
            return 'Informe nome e sobrenome.';
        }

        return '';
    };


    // ==========================================
    // VALIDAÇÃO DO CELULAR
    // ==========================================

    const validateCelular = (value: string) => {

        const numbers = value.replace(/\D/g, '');

        if (!numbers) {
            return 'O celular é obrigatório.';
        }

        if (numbers.length !== 11) {
            return 'Informe um telefone válido.';
        }

        return '';
    };


    // ==========================================
    // VALIDAÇÃO DO E-MAIL
    // ==========================================

    const validateEmail = (value: string) => {

        if (!value.trim()) {
            return 'O e-mail é obrigatório.';
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value.trim())) {
            return 'Informe um e-mail válido.';
        }

        return '';
    };


    // ==========================================
    // REGRAS DA SENHA
    // ==========================================

    const passwordRules = {
        minLength: senha.length >= 8,
        uppercase: /[A-Z]/.test(senha),
        lowercase: /[a-z]/.test(senha),
        number: /[0-9]/.test(senha),
        special: /[^A-Za-z0-9]/.test(senha),
    };


    // ==========================================
    // VALIDAÇÃO DA SENHA
    // ==========================================

    const validateSenha = (value: string) => {

        if (!value) {
            return 'A senha é obrigatória.';
        }

        if (value.length < 8) {
            return 'A senha deve possuir pelo menos 8 caracteres.';
        }

        if (!/[A-Z]/.test(value)) {
            return 'A senha deve possuir uma letra maiúscula.';
        }

        if (!/[a-z]/.test(value)) {
            return 'A senha deve possuir uma letra minúscula.';
        }

        if (!/[0-9]/.test(value)) {
            return 'A senha deve possuir um número.';
        }

        if (!/[^A-Za-z0-9]/.test(value)) {
            return 'A senha deve possuir um caractere especial.';
        }

        return '';
    };


    // ==========================================
    // ALTERAÇÃO DO NOME
    // ==========================================

    const handleNomeChange = (value: string) => {

        const formatted = formatNome(value);

        setNome(formatted);

        if (nomeError) {
            setNomeError('');
        }
    };


    // ==========================================
    // ALTERAÇÃO DO CELULAR
    // ==========================================

    const handleCelularChange = (value: string) => {

        const formatted = formatCelular(value);

        setCelular(formatted);

        if (celularError) {
            setCelularError('');
        }
    };


    // ==========================================
    // ALTERAÇÃO DO E-MAIL
    // ==========================================

    const handleEmailChange = (value: string) => {

        const formatted = formatEmail(value);

        setEmail(formatted);

        if (emailError) {
            setEmailError('');
        }
    };


    // ==========================================
    // ALTERAÇÃO DA SENHA
    // ==========================================

    const handleSenhaChange = (value: string) => {

        setSenha(value);

        if (senhaError) {
            setSenhaError('');
        }
    };


    // ==========================================
    // VALIDAÇÃO GERAL
    // ==========================================

    const validarCampos = () => {
        const novoNomeError = validateNome(nome);
        const novoCelularError = validateCelular(celular);
        const novoEmailError = validateEmail(email);
        const novoSenhaError = validateSenha(senha);

        setNomeError(novoNomeError);
        setCelularError(novoCelularError);
        setEmailError(novoEmailError);
        setSenhaError(novoSenhaError);

        return !novoNomeError && !novoCelularError && !novoEmailError && !novoSenhaError;
    };

    const exibirMensagemRodape = (texto: string, tipo: 'sucesso' | 'erro') => {
        setMensagemRodape({ texto, tipo });
    };

    // ==========================================
    // CADASTRAR USUÁRIO
    // ==========================================

    const cadastrarUsuario = async () => {
        setMensagemRodape(null);
 
        const camposValidos = validarCampos();
        if (!camposValidos) {
            return;
        }
 
        const celularSemMascara = celular.replace(/\D/g, '');
        setCarregando(true);
 
        try {
            await userService.cadastrarUsuario(
                nome.trim(),
                celularSemMascara,
                email.trim(),
                senha
            );
 
            exibirMensagemRodape('Usuário cadastrado com sucesso!', 'sucesso');
 
            // Aguarda 2 segundos antes de redirecionar para a tela de login
            setTimeout(() => {
                navigation.navigate('Login');
            }, 2000);
 
        } catch (error: any) {
            let mensagem = 'Não foi possível realizar o cadastro.';
 
            if (error?.code === 'auth/email-already-in-use') {
                mensagem = 'Este e-mail já está cadastrado.';
            } else if (error?.code === 'auth/invalid-email') {
                mensagem = 'O e-mail informado é inválido.';
            } else if (error?.code === 'auth/weak-password') {
                mensagem = 'A senha informada é muito fraca.';
            } else if (error?.code === 'auth/network-request-failed') {
                mensagem = 'Verifique sua conexão com a internet.';
            }
 
            exibirMensagemRodape(mensagem, 'erro');
        } finally {
            setCarregando(false);
        }
    };


    // ==========================================
    // COMPONENTE DA REGRA DA SENHA
    // ==========================================

    const PasswordRule = ({
        valid,
        text,
    }: {
        valid: boolean;
        text: string;
    }) => {

        return (
            <View style={styles.passwordRule}>

                <View
                    style={[
                        styles.ruleIcon,
                        valid
                            ? styles.ruleIconValid
                            : styles.ruleIconInvalid,
                    ]}
                >

                    <Text
                        style={[
                            styles.ruleIconText,
                            valid
                                ? styles.ruleIconTextValid
                                : styles.ruleIconTextInvalid,
                        ]}
                    >
                        {valid ? '✓' : '•'}
                    </Text>

                </View>

                <Text
                    style={[
                        styles.ruleText,
                        valid
                            ? styles.ruleTextValid
                            : styles.ruleTextInvalid,
                    ]}
                >
                    {text}
                </Text>

            </View>
        );
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
                    CABEÇALHO
                ================================== */}

                <View style={styles.brandArea}>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                        //disabled={carregando}
                    >

                        <Text style={styles.backText}>
                            ‹
                        </Text>

                    </TouchableOpacity>


                    <Image
                        source={require(
                            '../../assets/images/Logotipo_ResoLve.png'
                        )}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                </View>


                {/* ==================================
                    CARD
                ================================== */}

                <View style={styles.formCard}>

                    <Text style={styles.title}>
                        Criar sua conta
                    </Text>

                    <Text style={styles.description}>
                        Preencha seus dados para começar.
                    </Text>


                    {/* ==================================
                        NOME
                    ================================== */}

                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>
                            Nome completo
                        </Text>

                        <View
                            style={[
                                styles.inputWrapper,
                                nomeError
                                    ? styles.inputWrapperError
                                    : null,
                            ]}
                        >

                            <View style={styles.iconBox}>

                                <Text style={styles.userIcon}>
                                    ●
                                </Text>

                            </View>

                            <TextInput
                                style={styles.input}
                                value={nome}
                                onChangeText={handleNomeChange}
                                placeholder="Digite seu nome completo"
                                placeholderTextColor="#9CA3AF"
                                autoCapitalize="words"
                                autoCorrect={false}
                                returnKeyType="next"
                            />

                        </View>

                        {nomeError ? (
                            <Text style={styles.errorText}>
                                {nomeError}
                            </Text>
                        ) : null}

                    </View>


                    {/* ==================================
                        CELULAR
                    ================================== */}

                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>
                            Celular
                        </Text>

                        <View
                            style={[
                                styles.inputWrapper,
                                celularError
                                    ? styles.inputWrapperError
                                    : null,
                            ]}
                        >

                            <View style={styles.iconBox}>

                                <Text style={styles.phoneIcon}>
                                    ☎
                                </Text>

                            </View>

                            <TextInput
                                style={styles.input}
                                value={celular}
                                onChangeText={handleCelularChange}
                                placeholder="(00) 00000-0000"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                                autoComplete="tel"
                                textContentType="telephoneNumber"
                                returnKeyType="next"
                                maxLength={15}
                            />

                        </View>

                        {celularError ? (
                            <Text style={styles.errorText}>
                                {celularError}
                            </Text>
                        ) : null}

                    </View>


                    {/* ==================================
                        E-MAIL
                    ================================== */}

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
                                placeholder="seu@email.com"
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


                    {/* ==================================
                        SENHA
                    ================================== */}

                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>
                            Senha
                        </Text>

                        <View
                            style={[
                                styles.inputWrapper,
                                senhaError
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
                                value={senha}
                                onChangeText={handleSenhaChange}
                                placeholder="Crie uma senha segura"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="done"
                            />

                            <TouchableOpacity
                                style={styles.showButton}
                                onPress={() =>
                                    setShowPassword(!showPassword)
                                }
                                activeOpacity={0.7}
                            >

                                <Text style={styles.showText}>
                                    {showPassword
                                        ? 'Ocultar'
                                        : 'Mostrar'}
                                </Text>

                            </TouchableOpacity>

                        </View>


                        {/* ==================================
                            REGRAS DA SENHA
                        ================================== */}

                        <View style={styles.passwordRules}>

                            <Text style={styles.passwordRulesTitle}>
                                Sua senha deve conter:
                            </Text>


                            <PasswordRule
                                valid={passwordRules.minLength}
                                text="Mínimo de 8 caracteres"
                            />

                            <PasswordRule
                                valid={passwordRules.uppercase}
                                text="Pelo menos 1 letra maiúscula"
                            />

                            <PasswordRule
                                valid={passwordRules.lowercase}
                                text="Pelo menos 1 letra minúscula"
                            />

                            <PasswordRule
                                valid={passwordRules.number}
                                text="Pelo menos 1 número"
                            />

                            <PasswordRule
                                valid={passwordRules.special}
                                text="Pelo menos 1 caractere especial"
                            />

                        </View>


                        {senhaError ? (
                            <Text style={styles.errorText}>
                                {senhaError}
                            </Text>
                        ) : null}

                    </View>


                    {/* ==================================
                        BOTÃO CADASTRAR
                    ================================== */}

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={cadastrarUsuario}
                        activeOpacity={0.85}
                        disabled={carregando}
                    >

                        <Text style={styles.registerButtonText}>
                            {carregando ? 'CADASTRANDO...' : 'CRIAR MINHA CONTA'}
                        </Text>

                    </TouchableOpacity>


                    {/* ==================================
                        VOLTAR PARA LOGIN
                    ================================== */}

                    <View style={styles.loginArea}>

                        <Text style={styles.loginText}>
                            Já possui uma conta?
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() =>
                                navigation.goBack()
                            }
                        >

                            <Text style={styles.loginLink}>
                                Entrar
                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>


                {mensagemRodape ? (
                    <Text
                        style={[
                            styles.mensagemRodape,
                            mensagemRodape.tipo === 'sucesso'
                                ? styles.mensagemSucesso
                                : styles.mensagemErro,
                        ]}
                    >
                        {mensagemRodape.texto}
                    </Text>
                ) : null}

                {/* ==================================
                    RODAPÉ
                ================================== */}

                <View style={styles.footer}>

                    <Text style={styles.footerText}>
                        CONECTANDO SOLUÇÕES PARA VOCÊ
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
        paddingBottom: 25,
    },


    // ==========================================
    // CABEÇALHO
    // ==========================================

    brandArea: {
        height: 190,
        backgroundColor: '#F36B2B',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },

    logo: {
        width: 175,
        height: 115,
    },

    backButton: {
        position: 'absolute',
        left: 20,
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    backText: {
        color: '#FFFFFF',
        fontSize: 34,
        fontWeight: '300',
        lineHeight: 34,
        marginTop: -4,
    },


    // ==========================================
    // CARD
    // ==========================================

    formCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: -18,
        borderRadius: 22,
        paddingHorizontal: 21,
        paddingTop: 25,
        paddingBottom: 25,

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
    // TÍTULO
    // ==========================================

    title: {
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

    userIcon: {
        fontSize: 15,
        color: '#F36B2B',
    },

    phoneIcon: {
        fontSize: 16,
        color: '#F36B2B',
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
    // REGRAS DA SENHA
    // ==========================================

    passwordRules: {
        marginTop: 9,
        padding: 13,
        backgroundColor: '#F8FAFC',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#EEF0F3',
    },

    passwordRulesTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 8,
    },

    passwordRule: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },

    ruleIcon: {
        width: 17,
        height: 17,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 7,
    },

    ruleIconValid: {
        backgroundColor: '#36A9E1',
    },

    ruleIconInvalid: {
        backgroundColor: '#E5E7EB',
    },

    ruleIconText: {
        fontSize: 10,
        fontWeight: '800',
    },

    ruleIconTextValid: {
        color: '#FFFFFF',
    },

    ruleIconTextInvalid: {
        color: '#94A3B8',
    },

    ruleText: {
        fontSize: 11,
    },

    ruleTextValid: {
        color: '#123E7A',
        fontWeight: '600',
    },

    ruleTextInvalid: {
        color: '#94A3B8',
    },


    // ==========================================
    // BOTÃO
    // ==========================================

    registerButton: {
        height: 53,
        borderRadius: 12,
        backgroundColor: '#36A9E1',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },

    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.5,
    },


    // ==========================================
    // LOGIN
    // ==========================================

    loginArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },

    loginText: {
        fontSize: 12,
        color: '#6B7280',
    },

    loginLink: {
        marginLeft: 5,
        fontSize: 13,
        fontWeight: '800',
        color: '#F36B2B',
    },


    mensagemRodape: {
        marginTop: 16,
        marginHorizontal: 20,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '700',
    },

    mensagemSucesso: {
        color: '#16A34A',
    },

    mensagemErro: {
        color: '#EF4444',
    },

    // ==========================================
    // RODAPÉ
    // ==========================================

    footer: {
        alignItems: 'center',
        paddingTop: 20,
    },

    footerText: {
        fontSize: 9,
        color: '#9CA3AF',
        fontWeight: '700',
        letterSpacing: 0.7,
    },

    version: {
        marginTop: 5,
        fontSize: 9,
        color: '#C4C7CC',
        letterSpacing: 1.2,
        fontWeight: '700',
    },

});