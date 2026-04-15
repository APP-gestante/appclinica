import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { colors, spacing, radius } from '../../theme';

const MENUS = [
  { section: 'Documentos & Dados', items: ['Meus Exames', 'Receitas Médicas', 'Dados Pessoais'] },
  { section: 'Preferências', items: ['Notificações', 'Privacidade', 'Sobre o App'] },
];

export function PerfilScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScreenHeader title="Perfil" showBack={false} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>MS</Text></View>
          <Text style={styles.name}>Maria da Silva</Text>
          <Text style={styles.sub}>Semana 24 · Prontuário 2024-00847</Text>
        </View>
        <View style={styles.clinicCard}>
          <Text style={{ fontSize: 22 }}>🏥</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.clinicName}>Clínica Gerar Vida</Text>
            <Text style={styles.clinicDoc}>Dra. Ana Lima — Obstetra</Text>
          </View>
        </View>
        {MENUS.map((s) => (
          <View key={s.section} style={{ marginBottom: 24 }}>
            <Text style={styles.sectionLabel}>{s.section}</Text>
            <View style={styles.menuCard}>
              {s.items.map((item, i) => (
                <TouchableOpacity key={item} style={[styles.menuItem, i < s.items.length - 1 && styles.menuItemBorder]}>
                  <Text style={styles.menuText}>{item}</Text>
                  <Text style={{ color: colors.textInactive, fontSize: 18 }}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  profileCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 24, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 24, fontWeight: '700', color: colors.primaryDk },
  name: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4 },
  sub: { fontSize: 13, color: colors.textMid },
  clinicCard: { backgroundColor: colors.white, borderRadius: radius.md, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  clinicName: { fontSize: 14, fontWeight: '700', color: colors.text },
  clinicDoc: { fontSize: 12, color: colors.textMid, marginTop: 2 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: colors.textMid, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  menuCard: { backgroundColor: colors.white, borderRadius: radius.md, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.bg },
  menuText: { fontSize: 14, color: colors.text, fontWeight: '500' },
});
