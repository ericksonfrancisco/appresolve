import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

export default function DashboardScreen({ navigation }: any) {

    // ==================================================
    // DADOS FICTÍCIOS
    // ==================================================
    const dados = {
        orcamentosAbertos: 5,
        orcamentosRecusados: 2,
        orcamentosAprovados: 8,
        trabalhosConcluidos: 12,
        avaliacao: 4.8,
    };

    return (
        <View style={styles.container}>

            <StatusBar
                barStyle="light-content"
                backgroundColor="#F36B2B"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* ==========================================
                    CABEÇALHO
                ========================================== */}
                <View style={styles.header}>
                    <View>
                        <Image
                            source={require('../../assets/images/Logo2.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.profileButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Perfil')}
                    >
                        <Text style={styles.profileIcon}>👤</Text>
                    </TouchableOpacity>
                </View>


                {/* ==========================================
                    SAUDAÇÃO
                ========================================== */}
                <View style={styles.welcomeArea}>
                    <Text style={styles.welcomeTitle}>
                        Olá, Usuário! 👋
                    </Text>
                    <Text style={styles.welcomeDescription}>
                        Acompanhe o desempenho dos seus trabalhos.
                    </Text>
                </View>


                {/* ==========================================
                    PAINEL
                ========================================== */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Seu Painel
                    </Text>
                </View>


                {/* ==========================================
                    CARDS DE ORÇAMENTOS
                ========================================== */}
                <View style={styles.cardsRow}>
                    {/* ORÇAMENTOS ABERTOS */}
                    <TouchableOpacity
                        style={[styles.statCard, styles.orangeCard]}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconCircle, styles.orangeIcon]}>
                            <Text style={styles.iconText}>📄</Text>
                        </View>
                        <Text style={styles.cardTitle}>
                            Orçamentos{'\n'}em aberto
                        </Text>
                        <Text style={styles.cardNumber}>
                            {dados.orcamentosAbertos}
                        </Text>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>

                    {/* ORÇAMENTOS RECUSADOS */}
                    <TouchableOpacity
                        style={[styles.statCard, styles.redCard]}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconCircle, styles.redIcon]}>
                            <Text style={styles.iconText}>✕</Text>
                        </View>
                        <Text style={styles.cardTitle}>
                            Orçamentos{'\n'}recusados
                        </Text>
                        <Text style={styles.cardNumber}>
                            {dados.orcamentosRecusados}
                        </Text>
                        <Text style={[styles.arrow, { color: '#EF4444' }]}>→</Text>
                    </TouchableOpacity>
                </View>


                {/* ==========================================
                    ORÇAMENTOS APROVADOS
                ========================================== */}
                <TouchableOpacity
                    style={[styles.wideCard, styles.greenCard]}
                    activeOpacity={0.8}
                >
                    <View style={[styles.iconCircle, styles.greenIcon]}>
                        <Text style={styles.iconText}>✓</Text>
                    </View>
                    <View style={styles.wideCardContent}>
                        <Text style={styles.cardTitle}>
                            Orçamentos aprovados
                        </Text>
                        <Text style={styles.cardNumber}>
                            {dados.orcamentosAprovados}
                        </Text>
                    </View>
                    <Text style={[styles.arrow, { color: '#16A34A' }]}>→</Text>
                </TouchableOpacity>


                {/* ==========================================
                    TRABALHOS + AVALIAÇÃO
                ========================================== */}
                <View style={styles.cardsRow}>
                    {/* TRABALHOS CONCLUÍDOS */}
                    <TouchableOpacity
                        style={[styles.statCard, styles.blueCard]}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconCircle, styles.blueIcon]}>
                            <Text style={styles.iconText}>🔧</Text>
                        </View>
                        <Text style={styles.cardTitle}>
                            Trabalhos{'\n'}concluídos
                        </Text>
                        <Text style={styles.cardNumber}>
                            {dados.trabalhosConcluidos}
                        </Text>
                        <Text style={[styles.arrow, { color: '#1677D2' }]}>→</Text>
                    </TouchableOpacity>

                    {/* AVALIAÇÃO */}
                    <TouchableOpacity
                        style={[styles.statCard, styles.purpleCard]}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconCircle, styles.purpleIcon]}>
                            <Text style={styles.iconText}>★</Text>
                        </View>
                        <Text style={styles.cardTitle}>
                            Sua avaliação{'\n'}média
                        </Text>
                        <Text style={styles.ratingNumber}>
                            {dados.avaliacao}
                        </Text>
                        <Text style={styles.stars}>★★★★★</Text>
                    </TouchableOpacity>
                </View>


                {/* ==========================================
                    ÚLTIMAS ATIVIDADES
                ========================================== */}
                <View style={styles.activitiesHeader}>
                    <Text style={styles.sectionTitle}>
                        Úlțimas atividades
                    </Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>
                            Ver todos →
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.activitiesCard}>
                    {/* ATIVIDADE 1 */}
                    <View style={styles.activityItem}>
                        <View style={[styles.activityIcon, { backgroundColor: '#FFF0E5' }]}>
                            <Text>📄</Text>
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>Orçamento #1024</Text>
                            <Text style={styles.activityDescription}>Instalação elétrica residencial</Text>
                        </View>
                        <View style={styles.activityRight}>
                            <Text style={[styles.status, styles.statusOpen]}>Em aberto</Text>
                            <Text style={styles.date}>14/09/2026</Text>
                        </View>
                    </View>

                    {/* ATIVIDADE 2 */}
                    <View style={styles.activityItem}>
                        <View style={[styles.activityIcon, { backgroundColor: '#E7F7ED' }]}>
                            <Text>✓</Text>
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>Orçamento #1023</Text>
                            <Text style={styles.activityDescription}>Pintura interna</Text>
                        </View>
                        <View style={styles.activityRight}>
                            <Text style={[styles.status, styles.statusApproved]}>Aprovado</Text>
                            <Text style={styles.date}>12/09/2026</Text>
                        </View>
                    </View>

                    {/* ATIVIDADE 3 */}
                    <View style={styles.activityItem}>
                        <View style={[styles.activityIcon, { backgroundColor: '#FDEAEA' }]}>
                            <Text>✕</Text>
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>Orçamento #1021</Text>
                            <Text style={styles.activityDescription}>Troca de encanamento</Text>
                        </View>
                        <View style={styles.activityRight}>
                            <Text style={[styles.status, styles.statusRejected]}>Recusado</Text>
                            <Text style={styles.date}>10/09/2026</Text>
                        </View>
                    </View>

                    {/* ATIVIDADE 4 */}
                    <View style={[styles.activityItem, { borderBottomWidth: 0 }]}>
                        <View style={[styles.activityIcon, { backgroundColor: '#E5F2FF' }]}>
                            <Text>🔧</Text>
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>Serviço #0987</Text>
                            <Text style={styles.activityDescription}>Manutenção de ar condicionado</Text>
                        </View>
                        <View style={styles.activityRight}>
                            <Text style={[styles.status, styles.statusCompleted]}>Concluído</Text>
                            <Text style={styles.date}>08/09/2026</Text>
                        </View>
                    </View>
                </View>


                {/* ==========================================
                    BANNER
                ========================================== */}
                <View style={styles.banner}>
                    <View>
                        <Text style={styles.bannerTitle}>
                            Continue fazendo a diferença!
                        </Text>
                        <Text style={styles.bannerText}>
                            Mais pessoas precisam do seu trabalho.
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.bannerButton} activeOpacity={0.8}>
                        <Text style={styles.bannerButtonText}>
                            Oportunidades →
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Espaço para não sobrepor com a bottom navigation */}
                <View style={{ height: 100 }} />

            </ScrollView>


            {/* ==========================================
                MENU INFERIOR (TABS: HOME, PROFISSIONAL, API, SAIR)
            ========================================== */}
            <View style={styles.bottomNavigation}>

                {/* TAB 1: HOME */}
                <TouchableOpacity
                    style={styles.navItem}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.navIconActive}>🏠</Text>
                    <Text style={styles.navTextActive}>Home</Text>
                </TouchableOpacity>

                {/* TAB 2: PROFISSIONAL */}
                <TouchableOpacity
                    style={styles.navItem}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Profissional')}
                >
                    <Text style={styles.navIcon}>💼</Text>
                    <Text style={styles.navText}>Profissional</Text>
                </TouchableOpacity>

                {/* TAB 3: API */}
                <TouchableOpacity
                    style={styles.navItem}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Api')}
                >
                    <Text style={styles.navIcon}>⚡</Text>
                    <Text style={styles.navText}>API</Text>
                </TouchableOpacity>

                {/* TAB 4: SAIR */}
                <TouchableOpacity
                    style={styles.navItem}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.navIconExit}>🚪</Text>
                    <Text style={styles.navTextExit}>Sair</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}


// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },

    scrollContent: {
        paddingBottom: 20,
    },

    // HEADER
    header: {
        backgroundColor: '#F36B2B',
        paddingTop: 30,
        paddingHorizontal: 24,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    logo: {
        width: 180,
        height: 76,
        marginBottom: 3,
    },

    slogan: {
        color: '#FFFFFF',
        fontSize: 11,
        lineHeight: 16,
        marginTop: 3,
    },

    profileButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    profileIcon: {
        fontSize: 25,
    },

    // SAUDAÇÃO
    welcomeArea: {
        paddingHorizontal: 22,
        paddingTop: 24,
        paddingBottom: 10,
    },

    welcomeTitle: {
        fontSize: 23,
        fontWeight: '800',
        color: '#123E7A',
    },

    welcomeDescription: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 5,
    },

    // SEÇÕES
    sectionHeader: {
        paddingHorizontal: 22,
        marginTop: 10,
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 21,
        fontWeight: '800',
        color: '#123E7A',
    },

    // CARDS
    cardsRow: {
        flexDirection: 'row',
        paddingHorizontal: 22,
        gap: 12,
        marginBottom: 12,
    },

    statCard: {
        flex: 1,
        minHeight: 175,
        borderRadius: 20,
        padding: 15,
        position: 'relative',
        borderWidth: 1,
    },

    orangeCard: {
        backgroundColor: '#FFF5ED',
        borderColor: '#FBE0CC',
    },

    redCard: {
        backgroundColor: '#FFF1F2',
        borderColor: '#F8D9DC',
    },

    greenCard: {
        backgroundColor: '#F0F9F3',
        borderColor: '#D9EDDF',
    },

    blueCard: {
        backgroundColor: '#EEF7FF',
        borderColor: '#D8EAF9',
    },

    purpleCard: {
        backgroundColor: '#F7F2FF',
        borderColor: '#E8DDF8',
    },

    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    orangeIcon: {
        backgroundColor: '#F36B2B',
    },

    redIcon: {
        backgroundColor: '#EF4444',
    },

    greenIcon: {
        backgroundColor: '#16A34A',
    },

    blueIcon: {
        backgroundColor: '#1677D2',
    },

    purpleIcon: {
        backgroundColor: '#7040A5',
    },

    iconText: {
        fontSize: 19,
        color: '#FFFFFF',
    },

    cardTitle: {
        fontSize: 14,
        lineHeight: 19,
        fontWeight: '700',
        color: '#123E7A',
    },

    cardNumber: {
        fontSize: 34,
        fontWeight: '900',
        color: '#172A4A',
        marginTop: 8,
    },

    ratingNumber: {
        fontSize: 30,
        fontWeight: '900',
        color: '#172A4A',
        marginTop: 8,
    },

    stars: {
        position: 'absolute',
        bottom: 17,
        right: 12,
        fontSize: 15,
        color: '#F59E0B',
        letterSpacing: 1,
    },

    arrow: {
        position: 'absolute',
        right: 15,
        bottom: 13,
        fontSize: 27,
        color: '#F36B2B',
    },

    // CARD LARGO
    wideCard: {
        marginHorizontal: 22,
        minHeight: 125,
        borderRadius: 20,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
    },

    wideCardContent: {
        flex: 1,
        marginLeft: 8,
    },

    // ATIVIDADES
    activitiesHeader: {
        paddingHorizontal: 22,
        marginTop: 15,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    seeAll: {
        color: '#F36B2B',
        fontSize: 13,
        fontWeight: '800',
    },

    activitiesCard: {
        marginHorizontal: 22,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 14,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },

    activityItem: {
        minHeight: 92,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },

    activityIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 11,
    },

    activityInfo: {
        flex: 1,
    },

    activityTitle: {
        color: '#123E7A',
        fontSize: 13,
        fontWeight: '800',
    },

    activityDescription: {
        color: '#6B7280',
        fontSize: 11,
        marginTop: 4,
    },

    activityRight: {
        alignItems: 'flex-end',
        marginLeft: 5,
    },

    status: {
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 15,
        fontSize: 10,
        fontWeight: '800',
    },

    statusOpen: {
        backgroundColor: '#FFF0D9',
        color: '#D97706',
    },

    statusApproved: {
        backgroundColor: '#DCFCE7',
        color: '#15803D',
    },

    statusRejected: {
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
    },

    statusCompleted: {
        backgroundColor: '#DBEAFE',
        color: '#2563EB',
    },

    date: {
        color: '#9CA3AF',
        fontSize: 9,
        marginTop: 5,
    },

    // BANNER
    banner: {
        marginHorizontal: 22,
        marginTop: 18,
        backgroundColor: '#F36B2B',
        borderRadius: 20,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    bannerTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },

    bannerText: {
        color: '#FFFFFF',
        fontSize: 10,
        marginTop: 5,
    },

    bannerButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 13,
        paddingVertical: 11,
        borderRadius: 12,
    },

    bannerButtonText: {
        color: '#F36B2B',
        fontSize: 10,
        fontWeight: '800',
    },

    // MENU INFERIOR (BOTTOM NAVIGATION TABS)
    bottomNavigation: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 78,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 8,
    },

    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 70,
    },

    navIcon: {
        fontSize: 20,
        marginBottom: 4,
        opacity: 0.6,
    },

    navIconActive: {
        fontSize: 20,
        marginBottom: 4,
    },

    navIconExit: {
        fontSize: 20,
        marginBottom: 4,
        opacity: 0.8,
    },

    navText: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
    },

    navTextActive: {
        fontSize: 11,
        color: '#F36B2B',
        fontWeight: '800',
    },

    navTextExit: {
        fontSize: 11,
        color: '#EF4444',
        fontWeight: '700',
    },

});