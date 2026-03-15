import { HeaderSecundary, PageTitle } from '@/src/components';
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function EditDependentScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderSecundary />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ padding: 24 }}>
          <PageTitle>Editar Dependente</PageTitle>
          <Text style={{ fontSize: 16, color: '#666', marginTop: 16 }}>
            Tela de edição de dependentes em desenvolvimento...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
