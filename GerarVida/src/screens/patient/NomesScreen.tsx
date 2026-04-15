import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { BottomSheet } from '../../components/BottomSheet';
import { colors, spacing, radius } from '../../theme';

const NOMES = [
  { nome: 'Sofia', genero: 'F', origem: 'Grego', significado: 'Sabedoria' },
  { nome: 'Miguel', genero: 'M', origem: 'Hebraico', significado: 'Quem é como Deus?' },
  { nome: 'Alice', genero: 'F', origem: 'Germânico', significado: 'Nobre' },
  { nome: 'Arthur', genero: 'M', origem: 'Celta', significado: 'Urso forte' },
  { nome: 'Laura', genero: 'F', origem: 'Latino', significado: 'Laurel' },
  { nome: 'Gabriel', genero: 'M', origem: 'Hebraico', significado: 'Força de Deus' },
  { nome: 'Manuela', genero: 'F', origem: 'Hebraico', significado: 'Deus está conosco' },
  { nome: 'Davi', genero: 'M', origem: 'Hebraico', significado: 'Amado' },
];

export function NomesScreen() {
  const [filtro, setFiltro] = useState<'T' | 'F' | 'M'>('T');
  const [selecionado, setSelecionado] = useState<typeof NOMES[0] | null>(null);
  const insets = useSafeAreaInsets();
  const filtrados = filtro === 'T' ? NOMES : NOMES.filter((n) => n.genero === filtro);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScreenHeader title="Nomes" />
      <View style={styles.filtros}>
        {(['T', 'F', 'M'] as const).map((f) => (
          <TouchableOpacity key={f} style={[styles.chip, filtro === f && styles.chipActive]} onPress={() => setFiltro(f)}>
            <Text style={[styles.chipText, filtro === f && styles.chipTextActive]}>{f === 'T' ? 'Todos' : f === 'F' ? 'Meninas 💗' : 'Meninos 💙'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
        <View style={styles.grid}>
          {filtrados.map((n) => (
            <TouchableOpacity key={n.nome} style={styles.nomeCard} onPress={() => setSelecionado(n)} activeOpacity={0.8}>
              <Text style={styles.nomeTitulo}>{n.nome}</Text>
              <View style={[styles.generoBadge, { backgroundColor: n.genero === 'F' ? '#FFD6E0' : '#D6E8FF' }]}>
                <Text style={[styles.generoText, { color: n.genero === 'F' ? '#C2185B' : '#1565C0' }]}>{n.genero === 'F' ? '♀' : '♂'}</Text>
              </View>
              <Text style={styles.nomeOrigem}>{n.origem}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomSheet visible={!!selecionado} onClose={() => setSelecionado(null)} title={selecionado?.nome}>
        {selecionado && (
          <View style={{ gap: 16 }}>
            <View>
              <Text style={styles.detLabel}>Origem</Text>
              <Text style={styles.detValue}>{selecionado.origem}</Text>
            </View>
            <View>
              <Text style={styles.detLabel}>Significado</Text>
              <Text style={styles.detValue}>{selecionado.significado}</Text>
            </View>
            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Guardar no Top 1 ⭐</Text>
            </TouchableOpacity>
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  filtros: { flexDirection: 'row', gap: 8, padding: spacing.lg, paddingBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.white },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textMid },
  chipTextActive: { color: colors.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  nomeCard: { width: '47%', backgroundColor: colors.white, borderRadius: radius.md, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  nomeTitulo: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 6 },
  generoBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full, marginBottom: 6 },
  generoText: { fontSize: 12, fontWeight: '700' },
  nomeOrigem: { fontSize: 11, color: colors.textMid },
  detLabel: { fontSize: 11, fontWeight: '600', color: colors.textInactive, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  detValue: { fontSize: 15, color: colors.text, fontWeight: '500' },
  saveBtn: { backgroundColor: colors.primary, borderRadius: radius.full, padding: 16, alignItems: 'center', marginTop: 8 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: colors.white },
});
