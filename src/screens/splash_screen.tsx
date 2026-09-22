import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Animated,
    Easing,
    StatusBar,
} from 'react-native';

export default function SplashScreen({ navigation }: any) {

    // ==========================================
    // ANIMAÇÕES DA LOGO
    // ==========================================

    const logoOpacity = useRef(
        new Animated.Value(0)
    ).current;

    const logoScale = useRef(
        new Animated.Value(0.85)
    ).current;

    const logoTranslateY = useRef(
        new Animated.Value(20)
    ).current;


    // ==========================================
    // ANIMAÇÕES DO TEXTO
    // ==========================================

    const sloganOpacity = useRef(
        new Animated.Value(0)
    ).current;

    const sloganTranslateY = useRef(
        new Animated.Value(-10)
    ).current;


    const subtitleOpacity = useRef(
        new Animated.Value(0)
    ).current;


    // ==========================================
    // LOADING
    // ==========================================

    const loadingOpacity = useRef(
        new Animated.Value(0)
    ).current;

    const loadingAnimation = useRef(
        new Animated.Value(0)
    ).current;


    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    useEffect(() => {

        // --------------------------------------
        // SLOGAN
        // --------------------------------------

        Animated.parallel([

            Animated.timing(sloganOpacity, {
                toValue: 1,
                duration: 700,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),

            Animated.timing(sloganTranslateY, {
                toValue: 0,
                duration: 700,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),

        ]).start();


        // --------------------------------------
        // LOGO
        // --------------------------------------

        Animated.parallel([

            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 900,
                delay: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),

            Animated.spring(logoScale, {
                toValue: 1,
                delay: 300,
                friction: 7,
                tension: 45,
                useNativeDriver: true,
            }),

            Animated.timing(logoTranslateY, {
                toValue: 0,
                duration: 900,
                delay: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),

        ]).start();


        // --------------------------------------
        // SUBTÍTULO
        // --------------------------------------

        Animated.timing(subtitleOpacity, {
            toValue: 1,
            duration: 700,
            delay: 900,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();


        // --------------------------------------
        // LOADING
        // --------------------------------------

        Animated.timing(loadingOpacity, {
            toValue: 1,
            duration: 500,
            delay: 1200,
            useNativeDriver: true,
        }).start();


        // --------------------------------------
        // ANIMAÇÃO CONTÍNUA DO LOADING
        // --------------------------------------

        Animated.loop(

            Animated.sequence([

                Animated.timing(loadingAnimation, {
                    toValue: 1,
                    duration: 700,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),

                Animated.timing(loadingAnimation, {
                    toValue: 0,
                    duration: 700,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),

            ])

        ).start();


        // --------------------------------------
        // NAVEGAÇÃO PARA LOGIN
        // --------------------------------------

        const timer = setTimeout(() => {

            navigation.replace('Login');

        }, 4000);


        // --------------------------------------
        // LIMPEZA
        // --------------------------------------

        return () => {

            clearTimeout(timer);

            loadingAnimation.stopAnimation();

        };

    }, [navigation]);


    // ==========================================
    // ANIMAÇÕES DOS PONTOS
    // ==========================================

    const dotOne = loadingAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.35, 1],
    });

    const dotTwo = loadingAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.35],
    });

    const dotScaleOne = loadingAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1.2],
    });

    const dotScaleTwo = loadingAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1.2, 0.8],
    });


    // ==========================================
    // TELA
    // ==========================================

    return (

        <View style={styles.container}>

            <StatusBar
                barStyle="light-content"
                backgroundColor="#F36B2B"
            />


            {/* ==================================
                ELEMENTOS DECORATIVOS
            ================================== */}

            <View style={styles.circleTop} />

            <View style={styles.circleBottom} />


            {/* ==================================
                CONTEÚDO PRINCIPAL
            ================================== */}

            <View style={styles.content}>


                {/* SLOGAN */}

                <Animated.View
                    style={[
                        styles.sloganContainer,
                        {
                            opacity: sloganOpacity,
                            transform: [
                                {
                                    translateY:
                                        sloganTranslateY,
                                },
                            ],
                        },
                    ]}
                >

                    <Text style={styles.slogan}>
                        Quem precisa encontra.
                    </Text>

                    <Text style={styles.slogan}>
                        Quem resolve atende.
                    </Text>

                </Animated.View>


                {/* LOGO */}

                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: logoOpacity,
                            transform: [
                                {
                                    scale: logoScale,
                                },
                                {
                                    translateY:
                                        logoTranslateY,
                                },
                            ],
                        },
                    ]}
                >

                    <Image
                        source={require(
                            '../../assets/images/Logotipo_ResoLve.png'
                        )}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                </Animated.View>


                {/* SUBTÍTULO */}

                <Animated.View
                    style={{
                        opacity: subtitleOpacity,
                    }}
                >

                    <Text style={styles.subtitle}>
                        CONECTANDO SOLUÇÕES PARA VOCÊ
                    </Text>

                </Animated.View>

            </View>


            {/* ==================================
                LOADING
            ================================== */}

            <Animated.View
                style={[
                    styles.loading,
                    {
                        opacity: loadingOpacity,
                    },
                ]}
            >

                <View style={styles.dots}>

                    <Animated.View
                        style={[
                            styles.dot,
                            {
                                opacity: dotOne,
                                transform: [
                                    {
                                        scale: dotScaleOne,
                                    },
                                ],
                            },
                        ]}
                    />

                    <Animated.View
                        style={[
                            styles.dot,
                            {
                                opacity: dotTwo,
                                transform: [
                                    {
                                        scale: dotScaleTwo,
                                    },
                                ],
                            },
                        ]}
                    />

                    <Animated.View
                        style={[
                            styles.dot,
                            {
                                opacity: dotOne,
                                transform: [
                                    {
                                        scale: dotScaleOne,
                                    },
                                ],
                            },
                        ]}
                    />

                </View>

                <Text style={styles.loadingText}>
                    Carregando...
                </Text>

            </Animated.View>


            {/* ==================================
                VERSÃO
            ================================== */}

            <Text style={styles.version}>
                RESOLVE • 2026
            </Text>

        </View>
    );
}


// ==================================================
// ESTILOS
// ==================================================

const styles = StyleSheet.create({

    // ==========================================
    // CONTAINER
    // ==========================================

    container: {
        flex: 1,
        backgroundColor: '#F36B2B',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },


    // ==========================================
    // CONTEÚDO
    // ==========================================

    content: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 25,
    },


    // ==========================================
    // SLOGAN
    // ==========================================

    sloganContainer: {
        alignItems: 'center',
        marginBottom: 28,
    },

    slogan: {
        color: '#FFFFFF',
        fontSize: 21,
        fontWeight: '800',
        lineHeight: 30,
        textAlign: 'center',
        letterSpacing: 0.2,
    },


    // ==========================================
    // LOGO
    // ==========================================

    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        width: 270,
        height: 190,
    },


    // ==========================================
    // SUBTÍTULO
    // ==========================================

    subtitle: {
        marginTop: 3,
        color: '#123E7A',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.8,
        textAlign: 'center',
    },


    // ==========================================
    // LOADING
    // ==========================================

    loading: {
        position: 'absolute',
        bottom: 85,
        alignItems: 'center',
    },

    dots: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
        marginBottom: 7,
    },

    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 4,
    },

    loadingText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.4,
    },


    // ==========================================
    // VERSÃO
    // ==========================================

    version: {
        position: 'absolute',
        bottom: 25,
        color: 'rgba(255,255,255,0.65)',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1.5,
    },


    // ==========================================
    // DECORAÇÕES
    // ==========================================

    circleTop: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: 'rgba(255,255,255,0.06)',
        top: -170,
        right: -100,
    },

    circleBottom: {
        position: 'absolute',
        width: 230,
        height: 230,
        borderRadius: 115,
        backgroundColor: 'rgba(18,62,122,0.08)',
        bottom: -130,
        left: -100,
    },

});