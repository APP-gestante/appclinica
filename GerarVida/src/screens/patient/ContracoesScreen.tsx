import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView,
  Animated, Easing,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { colors, spacing, radius } from '../../theme';

interface Contracao {
  id: number;
  hora: string;
  duracao: number;
  intervalo: number | null;
}

function WaveformIcon({ color }: { color: string }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </Svg>
  );
}

export function ContracoesScreen() {
  const [contracoes, setContracoes] = useState<Contracao[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const startTime = useRef<number | null>(null);
  const lastEndTime = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const insets = useSafeAreaInsets();

  // Ring animations
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.6)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const ring2Opacity = useRef(new Animated.Value(0.4)).current;
  const idleAnim = useRef<Animated.CompositeAnimation | null>(null);
  const activeAnim = useRef<Animated.CompositeAnimation | null>(null);

  const stopAllAnims = () => {
    idleAnim.current?.stop();
    activeAnim.current?.stop();
    ring1Scale.setValue(1);
    ring1Opacity.setValue(0.6);
    ring2Scale.setValue(1);
    ring2Opacity.setValue(0.4);
  };

  const startIdleAnim = () => {
    stopAllAnims();
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ring1Scale, { toValue: 1.25, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(ring1Opacity, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ring1Scale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(ring1Opacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    );
    const pulse2 = Animated.loop(
      Animated.sequence([
        Animated.delay(750),
        Animated.parallel([
          Animated.timing(ring2Scale, { toValue: 1.4, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(ring2Opacity, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ring2Scale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(ring2Opacity, { toValue: 0.4, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    );
    idleAnim.current = Animated.parallel([pulse, pulse2]);
    idleAnim.current.start();
  };

  const startActiveAnim = () => {
    stopAllAnims();
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ring1Scale, { toValue: 1.3, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(ring1Opacity, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ring1Scale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(ring1Opacity, { toValue: 0.7, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    );
    const pulse2 = Animated.loop(
      Animated.sequence([
        Animated.delay(300),
        Animated.parallel([
          Animated.timing(ring2Scale, { toValue: 1.5, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(ring2Opacity, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ring2Scale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(ring2Opacity, { toValue: 0.5, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    );
    activeAnim.current = Animated.parallel([pulse, pulse2]);
    activeAnim.current.start();
  };

  useEffect(() => {
    storage.get<Contracao[]>(STORAGE_KEYS.contracoes).then((v) => { if (v) setContracoes(v); });
    startIdleAnim();
    return () => {
      stopAllAnims();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const avgDuracao = contracoes.length
    ? Math.round(contracoes.reduce((s, c) => s + c.duracao, 0) / contracoes.length) : 0;
  const withIntervalo = contracoes.filter((c) => c.intervalo !== null);
  const avgIntervalo = withIntervalo.length
    ? Math.round(withIntervalo.reduce((s, c) => s + (c.intervalo ?? 0), 0) / withIntervalo.length) : 0;
  const ultima = contracoes[0];

  const startPress = () => {
    setIsActive(true);
    setSeconds(0);
    startTime.current = Date.now();
    startActiveAnim();
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const endPress = async () => {
    if (!isActive || !startTime.current) return;
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    startIdleAnim();
    const duracao = Math.round((Date.now() - startTime.current) / 1000);
    const intervalo = lastEndTime.current
      ? Math.round((startTime.current - lastEndTime.current) / 60000) : null;
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
      {
        text: 'Limpar', style: 'destructive', onPress: async () => {
          setContracoes([]);
          lastEndTime.current = null;
          await storage.remove(STORAGE_KEYS.contracoes);
        },
      },
    ]);
  };

  const btnColor = isActive ? colors.accent : colors.primary;
  const ringColor = isActive ? 'rgba(229,152,125,' : 'rgba(141,170,145,';

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScreenHeader title="Contrações" />
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Stats row — 4 boxes */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{contracoes.length}</Text>
            <Text style={styles.statLabel}>Hoje</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{avgDuracao ? `${avgDuracao}s` : '—'}</Text>
            <Text style={styles.statLabel}>Duração média</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{avgIntervalo ? `${avgIntervalo}min` : '—'}</Text>
            <Text style={styles.statLabel}>Intervalo médio</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{ultima ? ultima.hora : '—'}</Text>
            <Text style={styles.statLabel}>Última</Text>
          </View>
        </View>

        {/* Alert banner */}
        {contracoes.length >= 6 && avgIntervalo > 0 && avgIntervalo <= 10 && (
          <View style={styles.alertBanner}>
            <Text style={styles.alertText}>⚠️ Contrações frequentes! Entre em contato com a clínica.</Text>
          </View>
        )}

        {/* Hint text */}
        <Text style={styles.hint}>
          {isActive ? `Contração em curso... ${seconds}s` : 'Pressione e segure durante a contração'}
        </Text>

        {/* Big ring button */}
        <View style={styles.btnWrap}>
          {/* Rings */}
          <Animated.View style={[styles.ring, {
            borderColor: `${ringColor}0.35)`,
            backgroundColor: `${ringColor}0.08)`,
            transform: [{ scale: ring2Scale }],
            opacity: ring2Opacity,
          }]} />
          <Animated.View style={[styles.ring, styles.ringInner, {
            borderColor: `${ringColor}0.5)`,
            backgroundColor: `${ringColor}0.12)`,
            transform: [{ scale: ring1Scale }],
            opacity: ring1Opacity,
          }]} />

          <TouchableOpacity
            style={[styles.bigBtn, { backgroundColor: btnColor, shadowColor: btnColor }]}
            onPressIn={startPress}
            onPressOut={endPress}
            activeOpacity={0.92}
          >
            <WaveformIcon color="white" />
            <Text style={styles.bigBtnTimer}>{isActive ? `${seconds}s` : ''}</Text>
            <Text style={styles.bigBtnLabel}>{isActive ? 'Solte' : 'Segure'}</Text>
          </TouchableOpacity>
        </View>

        {/* Last recorded */}
        {ultima && (
          <Text style={styles.lastMsg}>
            Última: {ultima.hora} · {ultima.duracao}s
            {ultima.intervalo != null ? ` · intervalo ${ultima.intervalo}min` : ''}
          </Text>
        )}

        {/* List */}
        {contracoes.length > 0 && (
          <>
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>Registro</Text>
              <TouchableOpacity onPress={limpar}>
                <Text style={styles.clearBtn}>Limpar sessão</Text>
              </TouchableOpacity>
            </View>
            {contracoes.map((c, i) => (
              <View key={c.id} style={styles.row}>
                <View style={styles.crIndex}>
                  <Text style={styles.crIndexText}>{contracoes.length - i}</Text>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowHora}>{c.hora}</Text>
                  {c.intervalo != null && (
                    <Text style={styles.rowMeta}>intervalo: {c.intervalo}min</Text>
                  )}
                </View>
                <Text style={styles.rowDur}>{c.duracao}s</Text>
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
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statBox: {
    flex: 1, backgroundColor: colors.white, borderRadius: 14, padding: 12,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  statValue: { fontSize: 16, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 9, fontWeight: '600', color: colors.textInactive, textAlign: 'center', marginTop: 2 },
  alertBanner: {
    backgroundColor: 'rgba(229,152,125,0.15)', borderRadius: 12, padding: 12,
    marginBottom: 16, borderLeftWidth: 3, borderLeftColor: colors.accent,
  },
  alertText: { fontSize: 12.5, fontWeight: '600', color: colors.accent },
  hint: { fontSize: 13, color: colors.textMid, textAlign: 'center', marginBottom: 16 },
  btnWrap: { alignItems: 'center', justifyContent: 'center', height: 260, marginBottom: 16 },
  ring: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    borderWidth: 1.5,
  },
  ringInner: { width: 210, height: 210, borderRadius: 105 },
  bigBtn: {
    width: 180, height: 180, borderRadius: 90,
    justifyContent: 'center', alignItems: 'center',
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10,
  },
  bigBtnTimer: { fontSize: 22, fontWeight: '800', color: 'white', marginTop: 6 },
  bigBtnLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  lastMsg: { fontSize: 12, color: colors.textMid, textAlign: 'center', marginBottom: 24 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  clearBtn: { fontSize: 13, fontWeight: '600', color: colors.accent },
  row: {
    flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.md,
    padding: 14, marginBottom: 8, alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  crIndex: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(141,170,145,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  crIndexText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  rowInfo: { flex: 1 },
  rowHora: { fontSize: 14, fontWeight: '600', color: colors.text },
  rowMeta: { fontSize: 11, color: colors.textInactive, marginTop: 2 },
  rowDur: { fontSize: 13, color: colors.primaryDk, fontWeight: '700' },
});
