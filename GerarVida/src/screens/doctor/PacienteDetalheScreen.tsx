import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { colors, spacing, radius } from '../../theme';

export function PacienteDetalheScreen() {
  const [tab, setTab] = useState<'cartao' | 'sinais'>('cartao');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScreenHeader title="Maria da Silva" />
      <View style={styles.tabs}>
        {(['cartao', 'sinais'] as const).map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'cartao' ? 'Cartão' : 'Sinais Vitais'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {tab === 'cartao' ? <CartaoTab /> : <SinaisTab />}
    </View>
  );
}

function CartaoTab() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
      {/* IDENTIFICAÇÃO */}
      <Section title="Identificação">
        <Field label="Nome do bebê" placeholder="A definir" />
        <Field label="Acompanhante" placeholder="Nome do acompanhante" />
        <Field label="Hospital" placeholder="Clínica Gerar Vida" />
        <Row>
          <Field label="DPP" placeholder="02/07/2025" flex />
          <Field label="IG atual" placeholder="24 sem" flex />
        </Row>
        <Row>
          <Field label="Peso inicial" placeholder="62,0 kg" flex />
          <Field label="Altura" placeholder="1,65 m" flex />
        </Row>
        <Field label="Classificação de risco" placeholder="Baixo risco" />
        <Field label="Fatores de risco" placeholder="Nenhum relatado" multiline />
      </Section>

      {/* DADOS CLÍNICOS */}
      <Section title="Dados Clínicos">
        <Field label="Alergias" placeholder="Nenhuma" />
        <Field label="Medicamentos em uso" placeholder="Ácido fólico, Ferro, Vitamina D" multiline />
        <Field label="Doenças crônicas" placeholder="Nenhuma" />
        <Field label="Cirurgias anteriores" placeholder="Nenhuma" />
        <Field label="Antecedentes familiares" placeholder="Diabetes materno" multiline />
      </Section>

      {/* EXAMES ESPECIAIS */}
      <Section title="Exames Especiais">
        <Field label="Tipo sanguíneo" placeholder="A+" />
        <Field label="NIPT" placeholder="Normal - Baixo risco" />
        <Field label="Glicemia jejum (mg/dL)" placeholder="88" />
        <Field label="Glicemia 1h (mg/dL)" placeholder="—" />
        <Field label="Glicemia 2h (mg/dL)" placeholder="—" />
      </Section>

      {/* CONSULTAS */}
      <Section title="Consultas">
        <ConsultaMock semana="24ª" data="03 Mar 2025" pa="118/76" peso="67,3 kg" />
        <ConsultaMock semana="20ª" data="14 Fev 2025" pa="115/74" peso="65,2 kg" />
        <ConsultaMock semana="16ª" data="17 Jan 2025" pa="112/72" peso="63,4 kg" />
      </Section>

      {/* NOTAS */}
      <View style={styles.notasCard}>
        <Text style={styles.notasLabel}>🔒 Notas da Médica — Conteúdo privado</Text>
        <TextInput style={styles.notasInput} multiline placeholder="Escreva suas anotações aqui..." placeholderTextColor={colors.textInactive} />
      </View>
    </ScrollView>
  );
}

function SinaisTab() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
      <Text style={styles.sinaisInfo}>🩺 Pressão Arterial</Text>
      {[['118/76 mmHg', 'Manhã · 03 Mar', 'Normal', '#3CB371'], ['122/80 mmHg', 'Tarde · 03 Mar', 'Atenção', colors.yellow]].map(([v, d, s, c]) => (
        <View key={v} style={styles.sinaisRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sinaisVal}>{v}</Text>
            <Text style={styles.sinaisSub}>{d}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: (c as string) + '22' }]}>
            <Text style={[styles.badgeText, { color: c as string }]}>{s}</Text>
          </View>
        </View>
      ))}
      <Text style={[styles.sinaisInfo, { marginTop: 20 }]}>🩸 Glicose</Text>
      {[['88 mg/dL', 'Jejum · 03 Mar', 'Normal', '#3CB371'], ['132 mg/dL', '2h pós-refeição', 'Atenção', colors.yellow]].map(([v, d, s, c]) => (
        <View key={v} style={styles.sinaisRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sinaisVal}>{v}</Text>
            <Text style={styles.sinaisSub}>{d}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: (c as string) + '22' }]}>
            <Text style={[styles.badgeText, { color: c as string }]}>{s}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Field({ label, placeholder, multiline, flex }: { label: string; placeholder: string; multiline?: boolean; flex?: boolean }) {
  return (
    <View style={[styles.field, flex && { flex: 1 }]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={[styles.fieldInput, multiline && { minHeight: 60 }]} placeholder={placeholder} placeholderTextColor={colors.textInactive} multiline={multiline} />
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', gap: 12 }}>{children}</View>;
}

function ConsultaMock({ semana, data, pa, peso }: { semana: string; data: string; pa: string; peso: string }) {
  return (
    <View style={styles.consultaMock}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.consultaSemana}>{semana} semana</Text>
        <Text style={styles.consultaData}>{data}</Text>
      </View>
      <Text style={styles.consultaMeta}>PA: {pa} · Peso: {peso}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  tabs: { flexDirection: 'row', backgroundColor: colors.white, padding: 6, margin: spacing.lg, marginBottom: 0, borderRadius: radius.md },
  tab: { flex: 1, padding: 10, alignItems: 'center', borderRadius: radius.sm },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textMid },
  tabTextActive: { color: colors.white },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.text, marginBottom: 10 },
  sectionCard: { backgroundColor: colors.white, borderRadius: radius.md, padding: 16, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  field: {},
  fieldLabel: { fontSize: 11, fontWeight: '600', color: colors.textInactive, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  fieldInput: { backgroundColor: colors.bg, borderRadius: radius.sm, padding: 12, fontSize: 14, color: colors.text },
  notasCard: { backgroundColor: '#FFFDF0', borderRadius: radius.md, padding: 16, borderLeftWidth: 3, borderLeftColor: colors.accent },
  notasLabel: { fontSize: 12, fontWeight: '600', color: colors.textMid, marginBottom: 10 },
  notasInput: { fontSize: 14, color: colors.text, minHeight: 100 },
  consultaMock: { backgroundColor: colors.bg, borderRadius: radius.sm, padding: 12, marginBottom: 8 },
  consultaSemana: { fontSize: 13, fontWeight: '700', color: colors.primaryDk },
  consultaData: { fontSize: 12, color: colors.textMid },
  consultaMeta: { fontSize: 12, color: colors.textMid, marginTop: 4 },
  sinaisInfo: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  sinaisRow: { backgroundColor: colors.white, borderRadius: radius.md, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  sinaisVal: { fontSize: 16, fontWeight: '700', color: colors.text },
  sinaisSub: { fontSize: 12, color: colors.textMid, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: 11, fontWeight: '700' },
});
