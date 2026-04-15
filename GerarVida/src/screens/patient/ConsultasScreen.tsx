import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { BottomSheet } from '../../components/BottomSheet';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { colors, spacing, radius } from '../../theme';

type Status = 'pending' | 'confirmed' | 'remark';
const MOTIVOS = ['Compromisso de trabalho', 'Problema de saúde', 'Transporte', 'Outro motivo'];

const HISTORICO = [
  { id: 1, data: '14 Fev, 2025 · 09:00', tipo: 'Pré-natal de rotina', medico: 'Dra. Ana Lima', local: 'Clínica Gerar Vida', semana: '20ª semana' },
  { id: 2, data: '17 Jan, 2025 · 10:30', tipo: 'Ultrassom morfológico', medico: 'Dra. Ana Lima', local: 'Clínica Gerar Vida', semana: '16ª semana' },
  { id: 3, data: '20 Dez, 2024 · 09:00', tipo: 'Pré-natal 1º trimestre', medico: 'Dra. Ana Lima', local: 'Clínica Gerar Vida', semana: '12ª semana' },
];

export function ConsultasScreen() {
  const [status, setStatus] = useState<Status>('pending');
  const [remarkSheet, setRemarkSheet] = useState(false);
  const [detailSheet, setDetailSheet] = useState<typeof HISTORICO[0] | null>(null);
  const [motivoSel, setMotivoSel] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    storage.get<Status>(STORAGE_KEYS.consultaStatus).then((v) => { if (v) setStatus(v); });
  }, []);

  const confirmar = async () => {
    setStatus('confirmed');
    await storage.set(STORAGE_KEYS.consultaStatus, 'confirmed');
  };

  const enviarRemarcacao = async () => {
    setStatus('remark');
    await storage.set(STORAGE_KEYS.consultaStatus, 'remark');
    setRemarkSheet(false);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScreenHeader title="Consultas" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
        {/* PRÓXIMA */}
        <View style={styles.nextCard}>
          <Text style={styles.nextLabel}>Próxima consulta</Text>
          <Text style={styles.nextDate}>Sex, 7 Mar · 09:30</Text>
          <Text style={styles.nextType}>Pré-natal de rotina · Semana 24</Text>
          <Text style={styles.nextLocal}>📍 Clínica Gerar Vida · Dra. Ana Lima</Text>
          <View style={styles.nextActions}>
            {status === 'pending' && (
              <>
                <TouchableOpacity style={styles.confirmBtn} onPress={confirmar}>
                  <Text style={styles.confirmBtnText}>Confirmar presença</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.remarkBtn} onPress={() => setRemarkSheet(true)}>
                  <Text style={styles.remarkBtnText}>Solicitar remarcação</Text>
                </TouchableOpacity>
              </>
            )}
            {status === 'confirmed' && (
              <View style={styles.statusBadge}><Text style={styles.statusBadgeText}>✓ Presença confirmada</Text></View>
            )}
            {status === 'remark' && (
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(229,152,125,0.15)' }]}>
                <Text style={[styles.statusBadgeText, { color: colors.accent }]}>⏳ Remarcação solicitada</Text>
              </View>
            )}
          </View>
        </View>

        {/* HISTÓRICO */}
        <Text style={styles.sectionTitle}>Histórico</Text>
        {HISTORICO.map((c) => (
          <View key={c.id} style={styles.histCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.histDate}>{c.data}</Text>
              <Text style={styles.histType}>{c.tipo}</Text>
              <Text style={styles.histSemana}>{c.semana}</Text>
            </View>
            <TouchableOpacity style={styles.detailBtn} onPress={() => setDetailSheet(c)}>
              <Text style={styles.detailBtnText}>Ver detalhes</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* REMARCAÇÃO */}
      <BottomSheet visible={remarkSheet} onClose={() => setRemarkSheet(false)} title="Solicitar remarcação">
        <Text style={styles.fieldLabel}>Motivo</Text>
        <View style={{ gap: 8, marginBottom: 20 }}>
          {MOTIVOS.map((m) => (
            <TouchableOpacity key={m} style={[styles.motivoRow, motivoSel === m && styles.motivoRowActive]} onPress={() => setMotivoSel(m)}>
              <View style={[styles.radio, motivoSel === m && styles.radioActive]} />
              <Text style={styles.motivoText}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.confirmBtn} onPress={enviarRemarcacao}>
          <Text style={styles.confirmBtnText}>Enviar solicitação</Text>
        </TouchableOpacity>
      </BottomSheet>

      {/* DETALHE */}
      <BottomSheet visible={!!detailSheet} onClose={() => setDetailSheet(null)} title="Detalhes da consulta">
        {detailSheet && (
          <View style={{ gap: 12 }}>
            {[
              { l: 'Tipo', v: detailSheet.tipo },
              { l: 'Data', v: detailSheet.data },
              { l: 'Médica', v: detailSheet.medico },
              { l: 'Local', v: detailSheet.local },
              { l: 'Semana gestacional', v: detailSheet.semana },
            ].map(({ l, v }) => (
              <View key={l}>
                <Text style={styles.fieldLabel}>{l}</Text>
                <Text style={{ fontSize: 14, color: colors.text, fontWeight: '600' }}>{v}</Text>
              </View>
            ))}
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  nextCard: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: 20, marginBottom: 24 },
  nextLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  nextDate: { fontSize: 22, fontWeight: '800', color: colors.white, letterSpacing: -0.3, marginBottom: 4 },
  nextType: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 4 },
  nextLocal: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 16 },
  nextActions: { gap: 10 },
  confirmBtn: { backgroundColor: colors.white, borderRadius: radius.full, padding: 14, alignItems: 'center' },
  confirmBtnText: { fontSize: 14, fontWeight: '700', color: colors.primaryDk },
  remarkBtn: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', borderRadius: radius.full, padding: 14, alignItems: 'center' },
  remarkBtnText: { fontSize: 14, fontWeight: '600', color: colors.white },
  statusBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.full, padding: 12, alignItems: 'center' },
  statusBadgeText: { fontSize: 14, fontWeight: '700', color: colors.white },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 12 },
  histCard: { backgroundColor: colors.white, borderRadius: radius.md, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  histDate: { fontSize: 12, color: colors.textMid, marginBottom: 2 },
  histType: { fontSize: 14, fontWeight: '700', color: colors.text },
  histSemana: { fontSize: 12, color: colors.primary, marginTop: 2 },
  detailBtn: { backgroundColor: colors.bg, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 8 },
  detailBtnText: { fontSize: 12, fontWeight: '600', color: colors.primaryDk },
  fieldLabel: { fontSize: 11, fontWeight: '600', color: colors.textInactive, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  motivoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.md, backgroundColor: colors.bg },
  motivoRowActive: { backgroundColor: colors.primaryLight + '40' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.textInactive },
  radioActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  motivoText: { fontSize: 14, color: colors.text },
});
