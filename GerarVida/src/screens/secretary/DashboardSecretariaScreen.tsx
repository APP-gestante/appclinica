import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../../theme';

const AGENDA = [
  { hora: '08:30', paciente: 'Maria da Silva', medico: 'Dra. Ana Lima', status: 'done' },
  { hora: '09:00', paciente: 'Carla Mendes', medico: 'Dra. Ana Lima', status: 'done' },
  { hora: '10:00', paciente: 'Fernanda Costa', medico: 'Dra. Ana Lima', status: 'now' },
  { hora: '11:00', paciente: 'Juliana Rocha', medico: 'Dra. Ana Lima', status: 'confirmed' },
  { hora: '14:00', paciente: 'Patrícia Souza', medico: 'Dra. Ana Lima', status: 'pending' },
];

const ACOES = [
  { icon: '📅', label: 'Novo Agendamento' },
  { icon: '👤', label: 'Cadastrar Paciente' },
  { icon: '📲', label: 'Enviar Lembrete' },
  { icon: '📊', label: 'Relatório do Dia' },
];

export function DashboardSecretariaScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* HEADER ESCURO */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View>
            <Text style={styles.role}>Secretaria</Text>
            <Text style={styles.name}>Bom dia, Juliana 👋</Text>
            <Text style={styles.date}>Terça, 15 de Abril de 2026</Text>
          </View>
          <View style={styles.avatar}><Text style={{ fontSize: 20 }}>📋</Text></View>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          {[['8', 'Consultas'], ['5', 'Confirmadas'], ['3', 'Pendentes'], ['24', 'Pacientes']].map(([v, l]) => (
            <View key={l} style={styles.statCard}>
              <Text style={styles.statNum}>{v}</Text>
              <Text style={styles.statLabel}>{l}</Text>
            </View>
          ))}
        </View>

        {/* AÇÕES RÁPIDAS */}
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.acoesGrid}>
          {ACOES.map((a) => (
            <TouchableOpacity key={a.label} style={styles.acaoCard} activeOpacity={0.8}>
              <Text style={{ fontSize: 28 }}>{a.icon}</Text>
              <Text style={styles.acaoLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* AGENDA */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Agenda de Hoje</Text>
        {AGENDA.map((a) => (
          <View key={a.hora} style={[styles.apptCard, a.status === 'now' && { borderWidth: 1.5, borderColor: colors.accent }]}>
            <Text style={[styles.hora, a.status === 'now' && { color: colors.accent }]}>{a.hora}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.apptName}>{a.paciente}</Text>
              <Text style={styles.apptMedico}>{a.medico}</Text>
            </View>
            <View style={[styles.badge, {
              backgroundColor: a.status === 'done' ? 'rgba(141,170,145,0.15)' :
                a.status === 'now' ? 'rgba(229,152,125,0.18)' :
                a.status === 'confirmed' ? 'rgba(141,170,145,0.1)' : 'rgba(245,166,35,0.12)'
            }]}>
              <Text style={[styles.badgeText, {
                color: a.status === 'done' ? colors.primaryDk :
                  a.status === 'now' ? colors.accent :
                  a.status === 'confirmed' ? colors.primary : colors.yellow
              }]}>
                {a.status === 'done' ? 'Realizada' : a.status === 'now' ? 'Em curso' : a.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 24 }]}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.darkCard, paddingHorizontal: spacing.lg, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  role: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  name: { fontSize: 22, fontWeight: '800', color: colors.white, letterSpacing: -0.4 },
  date: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, padding: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: radius.md, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statNum: { fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  statLabel: { fontSize: 9, fontWeight: '600', color: colors.textInactive, textAlign: 'center', marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginHorizontal: spacing.lg, marginBottom: 12 },
  acoesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: spacing.lg },
  acaoCard: { width: '47%', backgroundColor: colors.white, borderRadius: radius.md, padding: 16, alignItems: 'center', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  acaoLabel: { fontSize: 13, fontWeight: '600', color: colors.text, textAlign: 'center' },
  apptCard: { backgroundColor: colors.white, borderRadius: radius.md, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: spacing.lg, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  hora: { fontSize: 13, fontWeight: '700', color: colors.primaryDk, width: 44 },
  apptName: { fontSize: 14, fontWeight: '700', color: colors.text },
  apptMedico: { fontSize: 11.5, color: colors.textMid, marginTop: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: 10, fontWeight: '700' },
  fab: { position: 'absolute', right: spacing.lg, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  fabText: { fontSize: 28, color: colors.white, fontWeight: '300', marginTop: -2 },
});
