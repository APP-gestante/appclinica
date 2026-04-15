import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { PatientNavigator } from './PatientNavigator';
import { DoctorNavigator } from './DoctorNavigator';
import { SecretaryNavigator } from './SecretaryNavigator';

export type RootStackParams = {
  Login: undefined;
  Patient: undefined;
  Doctor: undefined;
  Secretary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Patient" component={PatientNavigator} />
      <Stack.Screen name="Doctor" component={DoctorNavigator} />
      <Stack.Screen name="Secretary" component={SecretaryNavigator} />
    </Stack.Navigator>
  );
}
