import { HeaderSecundary, PageTitle } from '@/src/components';
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function CreateDependentScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderSecundary />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ padding: 24 }}>
          <PageTitle>Novo Dependente</PageTitle>
          <Text style={{ fontSize: 16, color: '#666', marginTop: 16 }}>
            Tela de criação de dependentes em desenvolvimento...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
