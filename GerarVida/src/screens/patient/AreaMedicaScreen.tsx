import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { colors, spacing, radius } from '../../theme';

const EXAMES = [
  { titulo: 'Hemograma completo', data: '14 Fev', status: 'Disponível', ok: true },
  { titulo: 'Glicemia de jejum', data: '14 Fev', status: 'Disponível', ok: true },
  { titulo: 'TSH', data: '14 Fev', status: 'Pendente análise', ok: false },
  { titulo: 'Ultrassom morfológico', data: '20 Jan', status: 'Disponível', ok: true },
];

const MEDS = [
  { nome: 'Ácido Fólico 5mg', dose: '1 comprimido/dia', horario: 'Manhã em jejum' },
  { nome: 'Sulfato Ferroso 40mg', dose: '1 comprimido/dia', horario: '30 min antes do almoço' },
  { nome: 'Vitamina D 2000UI', dose: '1 gota/dia', horario: 'Com refeição' },
];

export function AreaMedicaScreen() {
  const [tab, setTab] = useState<'exames' | 'meds'>('exames');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScreenHeader title="Área Médica" />
      <View style={styles.tabs}>
        {(['exames', 'meds'] as const).map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'exames' ? 'Exames' : 'Medicamentos'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
        {tab === 'exames' && EXAMES.map((e) => (
          <View key={e.titulo} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{e.titulo}</Text>
              <Text style={styles.cardSub}>{e.data}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: e.ok ? '#3CB37122' : colors.yellow + '22' }]}>
              <Text style={[styles.badgeText, { color: e.ok ? '#3CB371' : colors.yellow }]}>{e.status}</Text>
            </View>
          </View>
        ))}
        {tab === 'meds' && MEDS.map((m) => (
          <View key={m.nome} style={styles.card}>
            <Text style={{ fontSize: 22, marginRight: 12 }}>💊</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{m.nome}</Text>
              <Text style={styles.cardSub}>{m.dose} · {m.horario}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  tabs: { flexDirection: 'row', backgroundColor: colors.white, padding: 6, margin: spacing.lg, borderRadius: radius.md },
  tab: { flex: 1, padding: 10, alignItems: 'center', borderRadius: radius.sm },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textMid },
  tabTextActive: { color: colors.white },
  card: { backgroundColor: colors.white, borderRadius: radius.md, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  cardSub: { fontSize: 12, color: colors.textMid },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: 11, fontWeight: '700' },
});
