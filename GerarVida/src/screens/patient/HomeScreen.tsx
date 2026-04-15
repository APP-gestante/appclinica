import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PatientStackParams } from '../../navigation/PatientNavigator';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { colors, spacing, radius } from '../../theme';

type Nav = NativeStackNavigationProp<PatientStackParams>;
const SEMANA = 24;
const PROGRESS = SEMANA / 42;

const quickActions: { label: string; icon: string; screen: keyof PatientStackParams }[] = [
  { label: 'Exames',      icon: '🔬', screen: 'AreaMedica' },
  { label: 'Chat',        icon: '💬', screen: 'Chat' },
  { label: 'Meus Meds',  icon: '💊', screen: 'AreaMedica' },
  { label: 'Consultas',  icon: '📅', screen: 'Consultas' },
  { label: 'Nomes',      icon: '✨', screen: 'Nomes' },
  { label: 'Contrações', icon: '⏱️', screen: 'Contracoes' },
  { label: 'Pressão',    icon: '💓', screen: 'Pressao' },
  { label: 'Glicose',    icon: '🩸', screen: 'Glicose' },
];

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    storage.get<boolean>(STORAGE_KEYS.onboarded).then((v) => {
      if (!v) navigation.replace('Onboarding');
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View>
            <Text style={styles.greeting}>Bom dia, Maria 👋</Text>
            <Text style={styles.weekText}>Semana {SEMANA} de gestação</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>MS</Text></View>
        </View>

        {/* PROGRESSO */}
        <View style={styles.progressCard}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.round(PROGRESS * 100)}%` }]} />
          </View>
          <Text style={styles.progressLabel}>Semana {SEMANA} de 42 · {Math.round(PROGRESS * 100)}%</Text>
        </View>

        {/* ATALHOS */}
        <Text style={styles.sectionTitle}>Atalhos Rápidos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
          {quickActions.map((a) => (
            <TouchableOpacity key={a.label} style={styles.quickBtn} onPress={() => navigation.navigate(a.screen)} activeOpacity={0.8}>
              <View style={styles.quickIconWrap}><Text style={{ fontSize: 24 }}>{a.icon}</Text></View>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FETO 3D */}
        <TouchableOpacity style={styles.feto3dCard} onPress={() => navigation.navigate('Feto3D')} activeOpacity={0.9}>
          <View>
            <Text style={styles.feto3dTitle}>Seu bebê esta semana</Text>
            <Text style={styles.feto3dSub}>Tamanho de um milho 🌽</Text>
            <View style={styles.feto3dBtn}><Text style={styles.feto3dBtnText}>VER EM 3D</Text></View>
          </View>
          <Text style={{ fontSize: 64 }}>👶</Text>
        </TouchableOpacity>

        {/* PRONTUÁRIO */}
        <TouchableOpacity style={styles.prontuarioCard} onPress={() => navigation.navigate('Prontuario')}>
          <Text style={{ fontSize: 24 }}>📋</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.prontuarioTitle}>Meu Prontuário</Text>
            <Text style={styles.prontuarioSub}>Prontuário 2024-00847</Text>
          </View>
          <Text style={{ fontSize: 18, color: colors.primary }}>›</Text>
        </TouchableOpacity>

        {/* AVISOS */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Avisos da Clínica</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Avisos')}>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.avisoCard}>
          <View style={styles.avisoBadge}><Text style={styles.avisoBadgeText}>Novo</Text></View>
          <Text style={styles.avisoText}>Recesso de Carnaval — Clínica fechada de 1 a 5 de Março</Text>
        </View>

        {/* PRÓXIMA CONSULTA */}
        <TouchableOpacity style={styles.consultaCard} onPress={() => navigation.navigate('Consultas')}>
          <Text style={styles.consultaLabel}>Próxima consulta</Text>
          <Text style={styles.consultaDate}>Sex, 7 Mar · 09:30</Text>
          <Text style={styles.consultaLocal}>Clínica Gerar Vida · Dra. Ana Lima</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white },
  greeting: { fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },
  weekText: { fontSize: 12, color: colors.textMid, marginTop: 2 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700', color: colors.primaryDk },
  progressCard: { backgroundColor: colors.white, marginHorizontal: spacing.lg, marginTop: 16, borderRadius: radius.md, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  progressBar: { height: 8, backgroundColor: colors.bg, borderRadius: radius.full, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  progressLabel: { fontSize: 11, color: colors.textMid, marginTop: 8, textAlign: 'right' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginHorizontal: spacing.lg, marginTop: 24, marginBottom: 12 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: spacing.lg, marginTop: 24, marginBottom: 12 },
  sectionLink: { fontSize: 12, fontWeight: '600', color: colors.primary },
  quickRow: { paddingHorizontal: spacing.lg, gap: 12 },
  quickBtn: { alignItems: 'center', gap: 6, width: 64 },
  quickIconWrap: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  quickLabel: { fontSize: 10, fontWeight: '600', color: colors.textMid, textAlign: 'center' },
  feto3dCard: { marginHorizontal: spacing.lg, marginTop: 16, backgroundColor: colors.darkCard, borderRadius: radius.lg, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  feto3dTitle: { fontSize: 16, fontWeight: '700', color: colors.white, marginBottom: 4 },
  feto3dSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 12 },
  feto3dBtn: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, alignSelf: 'flex-start' },
  feto3dBtnText: { fontSize: 11, fontWeight: '700', color: colors.white, letterSpacing: 0.5 },
  prontuarioCard: { marginHorizontal: spacing.lg, marginTop: 12, backgroundColor: colors.white, borderRadius: radius.md, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  prontuarioTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  prontuarioSub: { fontSize: 12, color: colors.textMid, marginTop: 2 },
  avisoCard: { marginHorizontal: spacing.lg, backgroundColor: colors.white, borderRadius: radius.md, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  avisoBadge: { backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full, alignSelf: 'flex-start', marginBottom: 8 },
  avisoBadgeText: { fontSize: 10, fontWeight: '700', color: colors.white },
  avisoText: { fontSize: 13, color: colors.text },
  consultaCard: { marginHorizontal: spacing.lg, marginTop: 12, marginBottom: 24, backgroundColor: colors.primary, borderRadius: radius.lg, padding: 20 },
  consultaLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  consultaDate: { fontSize: 20, fontWeight: '800', color: colors.white, letterSpacing: -0.3 },
  consultaLocal: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
});
