import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StatBox } from '../../components/StatBox';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { colors, spacing, radius } from '../../theme';

interface Contracao {
  id: number;
  hora: string;
  duracao: number;
  intervalo: number | null;
}

export function ContracoesScreen() {
  const [contracoes, setContracoes] = useState<Contracao[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const startTime = useRef<number | null>(null);
  const lastEndTime = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    storage.get<Contracao[]>(STORAGE_KEYS.contracoes).then((v) => { if (v) setContracoes(v); });
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const avgDuracao = contracoes.length ? Math.round(contracoes.reduce((s, c) => s + c.duracao, 0) / contracoes.length) : 0;
  const withIntervalo = contracoes.filter((c) => c.intervalo !== null);
  const avgIntervalo = withIntervalo.length ? Math.round(withIntervalo.reduce((s, c) => s + (c.intervalo ?? 0), 0) / withIntervalo.length) : 0;

  const startPress = () => {
    setIsActive(true);
    setSeconds(0);
    startTime.current = Date.now();
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const endPress = async () => {
    if (!isActive || !startTime.current) return;
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const duracao = Math.round((Date.now() - startTime.current) / 1000);
    const intervalo = lastEndTime.current ? Math.round((startTime.current - lastEndTime.current) / 60000) : null;
    lastEndTime.current = Date.now();
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const nova: Contracao = { id: Date.now(), hora, duracao, intervalo };
    const updated = [nova, ...contracoes];
    setContracoes(updated);
    await storage.set(STORAGE_KEYS.contracoes, updated);
    setSeconds(0);
  };

  const limpar = () => {
    Alert.alert('Limpar sessão', 'Deseja apagar todas as contrações?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: async () => { setContracoes([]); lastEndTime.current = null; await storage.remove(STORAGE_KEYS.contracoes); } },
    ]);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScreenHeader title="Contrações" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
        <View style={styles.statsRow}>
          <StatBox value={String(contracoes.length)} label="Total" />
          <StatBox value={avgDuracao ? `${avgDuracao}s` : '—'} label="Duração média" />
          <StatBox value={avgIntervalo ? `${avgIntervalo}min` : '—'} label="Intervalo médio" />
        </View>

        <View style={styles.btnWrap}>
          <Text style={styles.hint}>
            {isActive ? `Contração em curso: ${seconds}s` : 'Pressione e segure durante a contração'}
          </Text>
          <TouchableOpacity style={[styles.bigBtn, isActive && styles.bigBtnActive]} onPressIn={startPress} onPressOut={endPress} activeOpacity={0.9}>
            <Text style={styles.bigBtnText}>{isActive ? `${seconds}s` : 'SEGURAR'}</Text>
          </TouchableOpacity>
        </View>

        {contracoes.length > 0 && (
          <>
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>Registro</Text>
              <TouchableOpacity onPress={limpar}><Text style={styles.clearBtn}>Limpar</Text></TouchableOpacity>
            </View>
            {contracoes.map((c, i) => (
              <View key={c.id} style={styles.row}>
                <Text style={styles.rowIndex}>#{contracoes.length - i}</Text>
                <Text style={styles.rowHora}>{c.hora}</Text>
                <Text style={styles.rowDur}>{c.duracao}s</Text>
                <Text style={styles.rowInt}>{c.intervalo != null ? `${c.intervalo}min` : '—'}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  btnWrap: { alignItems: 'center', marginBottom: 32 },
  hint: { fontSize: 13, color: colors.textMid, marginBottom: 24, textAlign: 'center' },
  bigBtn: { width: 180, height: 180, borderRadius: 90, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  bigBtnActive: { backgroundColor: colors.accent, shadowColor: colors.accent },
  bigBtnText: { fontSize: 22, fontWeight: '800', color: colors.white },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  clearBtn: { fontSize: 13, fontWeight: '600', color: colors.accent },
  row: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.md, padding: 14, marginBottom: 8, alignItems: 'center', gap: 12 },
  rowIndex: { fontSize: 12, color: colors.textInactive, width: 28 },
  rowHora: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  rowDur: { fontSize: 13, color: colors.primaryDk, fontWeight: '600', width: 48, textAlign: 'right' },
  rowInt: { fontSize: 13, color: colors.textMid, width: 52, textAlign: 'right' },
});
