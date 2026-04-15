import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';
export function ChatScreen() {
  return <View style={s.c}><Text style={s.t}>ChatScreen</Text></View>;
}
const s = StyleSheet.create({ c: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor: colors.bg }, t: { color: colors.textMid } });
