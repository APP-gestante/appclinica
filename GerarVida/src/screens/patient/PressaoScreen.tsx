import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StatBox } from '../../components/StatBox';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { colors, spacing, radius } from '../../theme';

interface Medicao {
  id: number;
  sistolica: number;
  diastolica: number;
  pulso: string;
  momento: string;
}

const classify = (s: number, d: number) => {
  if (s >= 140 || d >= 90) return { label: 'Alto', color: colors.red };
  if (s >= 130 || d >= 80) return { label: 'Atenção', color: colors.yellow };
  return { label: 'Normal', color: '#3CB371' };
};

const MOCK: Medicao[] = [
  { id: 1, sistolica: 118, diastolica: 76, pulso: '72', momento: 'Manhã' },
  { id: 2, sistolica: 122, diastolica: 80, pulso: '68', momento: 'Tarde' },
  { id: 3, sistolica: 115, diastolica: 74, pulso: '70', momento: 'Manhã' },
];

export function PressaoScreen() {
  const [medicoes, setMedicoes] = useState<Medicao[]>(MOCK);
  const [modalVisible, setModalVisible] = useState(false);
  const [sis, setSis] = useState('');
  const [dia, setDia] = useState('');
  const [pulso, setPulso] = useState('');
  const [momento, setMomento] = useState('Manhã');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    storage.get<Medicao[]>(STORAGE_KEYS.pressao).then((v) => { if (v && v.length) setMedicoes(v); });
  }, []);

  const avgSis = medicoes.length ? Math.round(medicoes.reduce((s, m) => s + m.sistolica, 0) / medicoes.length) : 0;
  const avgDia = medicoes.length ? Math.round(medicoes.reduce((s, m) => s + m.diastolica, 0) / medicoes.length) : 0;
  const pico = medicoes.length ? Math.max(...medicoes.map((m) => m.sistolica)) : 0;
  const momentos = ['Manhã', 'Tarde', 'Noite', 'Após atividade'];

  const salvar = async () => {
    const s = parseInt(sis), d = parseInt(dia);
    if (!s || !d || s < 60 || s > 220 || d < 40 || d > 140) return;
    const nova: Medicao = { id: Date.now(), sistolica: s, diastolica: d, pulso, momento };
    const updated = [nova, ...medicoes];
    setMedicoes(updated);
    await storage.set(STORAGE_KEYS.pressao, updated);
    setModalVisible(false);
    setSis(''); setDia(''); setPulso('');
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScreenHeader title="Pressão Arterial" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <View style={styles.statsRow}>
          <StatBox value={String(medicoes.length)} label="Medições" />
          <StatBox value={avgSis ? `${avgSis}` : '—'} label="Méd. sistólica" />
          <StatBox value={avgDia ? `${avgDia}` : '—'} label="Méd. diastólica" />
          <StatBox value={pico ? `${pico}` : '—'} label="Pico máx." />
        </View>

        {medicoes.map((m) => {
          const { label, color } = classify(m.sistolica, m.diastolica);
          return (
            <View key={m.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowValor}>{m.sistolica}<Text style={styles.rowSep}>/</Text>{m.diastolica} <Text style={styles.rowUnit}>mmHg</Text></Text>
                <Text style={styles.rowMomento}>{m.momento}{m.pulso ? ` · ${m.pulso} bpm` : ''}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: color + '22' }]}>
                <Text style={[styles.badgeText, { color }]}>{label}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 24 }]} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Registrar Pressão</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Sistólica</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={sis} onChangeText={setSis} placeholder="ex: 120" placeholderTextColor={colors.textInactive} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Diastólica</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={dia} onChangeText={setDia} placeholder="ex: 80" placeholderTextColor={colors.textInactive} />
            </View>
          </View>
          <Text style={styles.fieldLabel}>Pulso (opcional)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={pulso} onChangeText={setPulso} placeholder="ex: 72 bpm" placeholderTextColor={colors.textInactive} />
          <Text style={styles.fieldLabel}>Momento</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {momentos.map((m) => (
                <TouchableOpacity key={m} style={[styles.chip, momento === m && styles.chipActive]} onPress={() => setMomento(m)}>
                  <Text style={[styles.chipText, momento === m && styles.chipTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.saveBtn} onPress={salvar}>
            <Text style={styles.saveBtnText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  row: { backgroundColor: colors.white, borderRadius: radius.md, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  rowValor: { fontSize: 20, fontWeight: '800', color: colors.text },
  rowSep: { color: colors.textMid, fontWeight: '400' },
  rowUnit: { fontSize: 12, fontWeight: '400', color: colors.textMid },
  rowMomento: { fontSize: 12, color: colors.textMid, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: 11, fontWeight: '700' },
  fab: { position: 'absolute', right: spacing.lg, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  fabText: { fontSize: 28, color: colors.white, fontWeight: '300', marginTop: -2 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.textInactive, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 20 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.textMid, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: colors.bg, borderRadius: radius.sm, padding: 14, fontSize: 15, color: colors.text, marginBottom: 16 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.bg },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textMid },
  chipTextActive: { color: colors.white },
  saveBtn: { backgroundColor: colors.primary, borderRadius: radius.full, padding: 16, alignItems: 'center', marginTop: 8 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: colors.white },
});
