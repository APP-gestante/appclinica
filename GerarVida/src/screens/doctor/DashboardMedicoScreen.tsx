import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DoctorStackParams } from '../../navigation/DoctorNavigator';
import { RiskBadge } from '../../components/RiskBadge';
import { colors, spacing, radius } from '../../theme';

type Nav = NativeStackNavigationProp<DoctorStackParams>;

const AGENDA = [
  { hora: '08:30', dur: '30 min', paciente: 'Maria da Silva', tipo: 'Pré-natal de rotina · Sem. 24', status: 'done' },
  { hora: '09:00', dur: '30 min', paciente: 'Carla Mendes', tipo: 'Ultrassom morfológico · Sem. 20', status: 'done' },
  { hora: '10:00', dur: '45 min', paciente: 'Fernanda Costa', tipo: 'Consulta 1º trimestre · Sem. 10', status: 'now' },
  { hora: '11:00', dur: '30 min', paciente: 'Juliana Rocha', tipo: 'Retorno pós-exames · Sem. 32', status: 'next' },
];

const PACIENTES = [
  { iniciais: 'MS', nome: 'Maria da Silva', meta: 'DPP: 20 Jun · Última: hoje', semana: 24, risk: 'low' as const, alerta: '1 exame aguardando análise', alertaRed: false },
  { iniciais: 'CM', nome: 'Carla Mendes', meta: 'DPP: 15 Ago · Última: hoje', semana: 20, risk: 'low' as const, alerta: null, alertaRed: false },
  { iniciais: 'FC', nome: 'Fernanda Costa', meta: 'DPP: 10 Set · Última: hoje', semana: 10, risk: 'med' as const, alerta: 'Glicemia elevada — verificar', alertaRed: false },
  { iniciais: 'JR', nome: 'Juliana Rocha', meta: 'DPP: 02 Mai · Última: 28 Fev', semana: 32, risk: 'low' as const, alerta: null, alertaRed: false },
  { iniciais: 'PS', nome: 'Patrícia Souza', meta: 'DPP: 18 Abr · Última: 20 Fev', semana: 36, risk: 'high' as const, alerta: 'Pressão elevada — acompanhar', alertaRed: true },
];

export function DashboardMedicoScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View>
            <Text style={styles.role}>Painel Médico</Text>
            <Text style={styles.name}>Bom dia, Dra. Ana 👋</Text>
            <Text style={styles.date}>Terça-feira, 15 de Abril de 2026</Text>
          </View>
          <View style={styles.avatar}><Text style={{ fontSize: 20 }}>👩‍⚕️</Text></View>
        </View>

        {/* CLINIC BADGE */}
        <View style={styles.clinicBadge}>
          <Text style={{ fontSize: 16 }}>🏥</Text>
          <Text style={styles.clinicText}>Clínica Gerar Vida · Obstetra</Text>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          {[['8', 'Consultas hoje', colors.primaryDk], ['24', 'Pacientes ativas', colors.text], ['3', 'Exames pendentes', colors.accent]].map(([v, l, c]) => (
            <View key={l} style={styles.statCard}>
              <Text style={[styles.statNum, { color: c }]}>{v}</Text>
              <Text style={styles.statLabel}>{l}</Text>
            </View>
          ))}
        </View>

        {/* AGENDA */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Agenda de Hoje</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AgendaMedico')}>
              <Text style={styles.sectionLink}>Ver tudo</Text>
            </TouchableOpacity>
          </View>
          {AGENDA.map((a) => (
            <View key={a.hora} style={[styles.apptCard, a.status === 'now' && { borderWidth: 1.5, borderColor: colors.accent }]}>
              <View style={styles.timeCol}>
                <Text style={[styles.hora, a.status === 'now' && { color: colors.accent }]}>{a.hora}</Text>
                <Text style={styles.dur}>{a.dur}</Text>
              </View>
              <View style={[styles.divider, a.status === 'done' ? styles.divDone : a.status === 'now' ? styles.divNow : styles.divNext]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.apptName}>{a.paciente}</Text>
                <Text style={styles.apptType}>{a.tipo}</Text>
              </View>
              <View style={[styles.apptBadge, a.status === 'done' ? styles.bdDone : a.status === 'now' ? styles.bdNow : styles.bdNext]}>
                <Text style={[styles.apptBadgeText, { color: a.status === 'done' ? colors.primaryDk : a.status === 'now' ? colors.accent : colors.textMid }]}>
                  {a.status === 'done' ? 'Realizada' : a.status === 'now' ? 'Agora' : 'Próxima'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* PACIENTES */}
        <View style={[styles.sectionWrap, { marginTop: 8 }]}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Minhas Pacientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MedicoPacientes')}>
              <Text style={styles.sectionLink}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          {PACIENTES.map((p) => (
            <TouchableOpacity key={p.nome} style={styles.patientCard} onPress={() => navigation.navigate('PacienteDetalhe')} activeOpacity={0.85}>
              <View style={[styles.pAvatar, p.risk === 'high' && { backgroundColor: '#FFE5E5' }, p.risk === 'med' && { backgroundColor: '#FFF8E1' }]}>
                <Text style={[styles.pAvatarText, p.risk === 'high' && { color: '#B33A3A' }, p.risk === 'med' && { color: '#B87A00' }]}>{p.iniciais}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pName}>{p.nome}</Text>
                <Text style={styles.pMeta}>{p.meta}</Text>
                {p.alerta && (
                  <View style={[styles.alertChip, p.alertaRed && { backgroundColor: '#FFE5E5' }]}>
                    <Text style={[styles.alertText, p.alertaRed && { color: colors.red }]}>⚠ {p.alerta}</Text>
                  </View>
                )}
              </View>
              <View style={styles.pRight}>
                <View style={styles.weekBadge}><Text style={styles.weekBadgeText}>Sem. {p.semana}</Text></View>
                <RiskBadge risk={p.risk} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.white, paddingHorizontal: spacing.lg, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  role: { fontSize: 12, fontWeight: '600', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },
  date: { fontSize: 12, color: colors.textMid, marginTop: 2 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  clinicBadge: { backgroundColor: colors.primary, marginHorizontal: spacing.lg, marginTop: 16, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  clinicText: { fontSize: 13, fontWeight: '600', color: colors.white },
  statsRow: { flexDirection: 'row', gap: 12, padding: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: radius.md, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statNum: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 10, fontWeight: '600', color: colors.textInactive, textAlign: 'center', marginTop: 2 },
  sectionWrap: { paddingHorizontal: spacing.lg },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  sectionLink: { fontSize: 12, fontWeight: '600', color: colors.primary },
  apptCard: { backgroundColor: colors.white, borderRadius: radius.md, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  timeCol: { width: 44, alignItems: 'center' },
  hora: { fontSize: 13, fontWeight: '700', color: colors.primaryDk },
  dur: { fontSize: 10, color: colors.textInactive, marginTop: 2 },
  divider: { width: 2, height: 36, borderRadius: 1 },
  divDone: { backgroundColor: colors.primaryLight },
  divNow: { backgroundColor: colors.accent },
  divNext: { backgroundColor: '#e8ece8' },
  apptName: { fontSize: 14, fontWeight: '700', color: colors.text },
  apptType: { fontSize: 11.5, color: colors.textMid, marginTop: 2 },
  apptBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  bdDone: { backgroundColor: 'rgba(141,170,145,0.15)' },
  bdNow: { backgroundColor: 'rgba(229,152,125,0.18)' },
  bdNext: { backgroundColor: colors.bg },
  apptBadgeText: { fontSize: 10, fontWeight: '700' },
  patientCard: { backgroundColor: colors.white, borderRadius: radius.md, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  pAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  pAvatarText: { fontSize: 16, fontWeight: '700', color: colors.primaryDk },
  pName: { fontSize: 14, fontWeight: '700', color: colors.text },
  pMeta: { fontSize: 11.5, color: colors.textMid, marginTop: 2 },
  alertChip: { backgroundColor: 'rgba(229,152,125,0.12)', borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 4 },
  alertText: { fontSize: 10.5, fontWeight: '600', color: colors.accent },
  pRight: { alignItems: 'flex-end', gap: 6 },
  weekBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  weekBadgeText: { fontSize: 11, fontWeight: '700', color: colors.primaryDk },
});
