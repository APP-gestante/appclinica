import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StatBox } from '../../components/StatBox';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { colors, spacing, radius } from '../../theme';

interface Medicao {
  id: number;
  valor: number;
  momento: string;
  obs: string;
}

const classify = (valor: number, momento: string) => {
  const limit = momento === 'Jejum' ? 95 : 140;
  if (valor <= limit) return { label: 'Normal', color: '#3CB371' };
  if (valor <= limit + 20) return { label: 'Atenção', color: colors.yellow };
  return { label: 'Alto', color: colors.red };
};

const MOCK: Medicao[] = [
  { id: 1, valor: 88, momento: 'Jejum', obs: '' },
  { id: 2, valor: 132, momento: '2h pós-refeição', obs: 'Após almoço' },
  { id: 3, valor: 91, momento: 'Jejum', obs: '' },
];

export function GlicoseScreen() {
  const [medicoes, setMedicoes] = useState<Medicao[]>(MOCK);
  const [modalVisible, setModalVisible] = useState(false);
  const [valor, setValor] = useState('');
  const [momento, setMomento] = useState('Jejum');
  const [obs, setObs] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    storage.get<Medicao[]>(STORAGE_KEYS.glicose).then((v) => { if (v && v.length) setMedicoes(v); });
  }, []);

  const ultima = medicoes[0];
  const { label: status } = ultima ? classify(ultima.valor, ultima.momento) : { label: '—' };

  const salvar = async () => {
    const v = parseInt(valor);
    if (!v || v < 40 || v > 400) return;
    const nova: Medicao = { id: Date.now(), valor: v, momento, obs };
    const updated = [nova, ...medicoes];
    setMedicoes(updated);
    await storage.set(STORAGE_KEYS.glicose, updated);
    setModalVisible(false);
    setValor(''); setObs('');
  };

  const momentos = ['Jejum', '1h pós-refeição', '2h pós-refeição', 'Antes de dormir'];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScreenHeader title="Glicose" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <View style={styles.statsRow}>
          <StatBox value={String(medicoes.length)} label="Medições" />
          <StatBox value={ultima ? `${ultima.valor}` : '—'} label="Última (mg/dL)" />
          <StatBox value={status} label="Status" />
        </View>

        {medicoes.map((m) => {
          const { label, color } = classify(m.valor, m.momento);
          return (
            <View key={m.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowValor}>{m.valor} <Text style={styles.rowUnit}>mg/dL</Text></Text>
                <Text style={styles.rowMomento}>{m.momento}{m.obs ? ` · ${m.obs}` : ''}</Text>
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
          <Text style={styles.sheetTitle}>Registrar Glicose</Text>
          <Text style={styles.fieldLabel}>Valor (mg/dL)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={valor} onChangeText={setValor} placeholder="ex: 95" placeholderTextColor={colors.textInactive} />
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
          <Text style={styles.fieldLabel}>Observação (opcional)</Text>
          <TextInput style={styles.input} value={obs} onChangeText={(t) => setObs(t.slice(0, 80))} placeholder="ex: após almoço" placeholderTextColor={colors.textInactive} />
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
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  row: { backgroundColor: colors.white, borderRadius: radius.md, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  rowValor: { fontSize: 20, fontWeight: '800', color: colors.text },
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
