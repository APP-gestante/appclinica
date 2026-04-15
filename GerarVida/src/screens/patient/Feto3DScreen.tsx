import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '../../components/BottomSheet';
import { colors, spacing, radius } from '../../theme';
import { useNavigation } from '@react-navigation/native';

const HOTSPOTS = [
  { id: 1, label: 'Coração', info: 'O coração já bate cerca de 140-160 bpm nesta semana. As 4 câmaras estão completamente formadas.' },
  { id: 2, label: 'Cérebro', info: 'O cérebro está se desenvolvendo rapidamente. Os sulcos e giros começam a se formar.' },
  { id: 3, label: 'Pulmões', info: 'Os pulmões estão se desenvolvendo mas ainda não funcionam — o bebê recebe oxigênio pela placenta.' },
  { id: 4, label: 'Tamanho', info: 'Com 24 semanas, o bebê mede cerca de 30 cm e pesa aproximadamente 600g — tamanho de um milho.' },
];

export function Feto3DScreen() {
  const [selected, setSelected] = useState<typeof HOTSPOTS[0] | null>(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <View style={styles.fetoArea}>
        <Text style={{ fontSize: 160, textAlign: 'center' }}>🫃</Text>
        <Text style={styles.semanaText}>Semana 24</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hotspotsRow}>
        {HOTSPOTS.map((h) => (
          <TouchableOpacity key={h.id} style={styles.hotspot} onPress={() => setSelected(h)}>
            <Text style={styles.hotspotLabel}>{h.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BottomSheet visible={!!selected} onClose={() => setSelected(null)} title={selected?.label}>
        {selected && <Text style={styles.infoText}>{selected.info}</Text>}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.darkCard },
  backBtn: { position: 'absolute', top: 60, left: 24, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 20, color: colors.white },
  fetoArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  semanaText: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginTop: 8 },
  hotspotsRow: { paddingHorizontal: spacing.lg, gap: 10, paddingBottom: 40 },
  hotspot: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.full, paddingHorizontal: 20, paddingVertical: 10 },
  hotspotLabel: { fontSize: 14, fontWeight: '600', color: colors.white },
  infoText: { fontSize: 14, color: colors.text, lineHeight: 22 },
});
