import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParams } from '../navigation/RootNavigator';
import { colors, spacing, radius } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParams>;

const profiles = [
  { key: 'Patient',   label: 'Paciente',  icon: '🤰', desc: 'Acompanhe sua gestação' },
  { key: 'Doctor',    label: 'Médica',    icon: '👩‍⚕️', desc: 'Gerencie suas pacientes' },
  { key: 'Secretary', label: 'Secretaria',icon: '📋', desc: 'Controle a agenda' },
] as const;

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.logoArea}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>🌱</Text>
        </View>
        <Text style={styles.appName}>Gerar Vida</Text>
        <Text style={styles.tagline}>Acompanhamento pré-natal</Text>
      </View>
      <Text style={styles.selectLabel}>Como deseja entrar?</Text>
      <View style={styles.profileList}>
        {profiles.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={styles.profileCard}
            onPress={() => navigation.replace(p.key)}
            activeOpacity={0.85}
          >
            <Text style={styles.profileIcon}>{p.icon}</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>{p.label}</Text>
              <Text style={styles.profileDesc}>{p.desc}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  logoArea: { alignItems: 'center', marginBottom: 48 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoIcon: { fontSize: 36 },
  appName: { fontSize: 32, fontWeight: '800', color: colors.text, letterSpacing: -0.8 },
  tagline: { fontSize: 14, color: colors.textMid, marginTop: 4 },
  selectLabel: { fontSize: 12, fontWeight: '600', color: colors.textMid, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.8 },
  profileList: { gap: 12 },
  profileCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  profileIcon: { fontSize: 32 },
  profileInfo: { flex: 1 },
  profileLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  profileDesc: { fontSize: 12, color: colors.textMid, marginTop: 2 },
  arrow: { fontSize: 24, color: colors.textInactive },
});
