import { useProfile } from '@/hooks/use-profile';
import {
  ButtonFooter,
  HeaderSecundary,
  InfoBox,
  InputField,
  PageTitle,
  PrimaryButton,
  SecondaryButton,
} from '@/src/components';
import { useNotification } from '@/src/contexts/NotificationContext';
import { createPurpose } from '@/src/services/purposes.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormContainer } from './styleCreatePurpose';

export default function CreatePurposeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { success, error } = useNotification();
  const { profile } = useProfile();

  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const isFormValid = (): boolean => {
    return name.trim().length >= 2;
  };

  const handleSave = async () => {
    if (loading) return;

    if (name.trim().length < 2) {
      error('Erro', 'Nome deve ter pelo menos 2 caracteres');
      return;
    }

    setLoading(true);

    try {
      const companyId = (params.companyId as string) || profile?.company_id;

      if (!companyId) {
        throw new Error('ID da empresa não fornecido');
      }

      if (!profile?.id) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      await createPurpose({
        name: name.trim(),
        company_id: companyId,
      });

      success('Sucesso', 'Tag criada com sucesso!', () => router.back());
    } catch (err: any) {
      console.error('Erro ao criar tag:', err);
      error('Erro', err.message || 'Não foi possível criar a tag. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderSecundary />
      <KeyboardAwareScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={120}
        extraHeight={120}
        enableResetScrollToCoords={false}
        keyboardOpeningTime={250}
      >
        <PageTitle>Nova Tag</PageTitle>

        <InfoBox>
          Crie uma tag para agrupar e identificar suas despesas de forma mais específica.
        </InfoBox>

        <FormContainer>
          <InputField
            label="Nome da Tag *"
            placeholder="Ex: Urgente, Recorrente, Pessoal"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            required
          />
        </FormContainer>
      </KeyboardAwareScrollView>

      <ButtonFooter>
        <SecondaryButton title="Cancelar" onPress={handleCancel} />
        <PrimaryButton
          title="Criar Tag"
          onPress={handleSave}
          loading={loading}
          disabled={!isFormValid() || loading}
        />
      </ButtonFooter>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 24,
  },
});
