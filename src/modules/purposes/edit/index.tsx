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
import {
    deletePurpose,
    getPurposeById,
    updatePurpose,
} from '@/src/services/purposes.service';
import { Purpose } from '@/src/types/purposes.types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Switch } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    FormContainer,
    LoadingContainer,
    SwitchContainer,
    SwitchLabel,
} from './styleEditPurpose';

export default function EditPurposeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { success, error } = useNotification();

  const [purpose, setPurpose] = useState<Purpose | null>(null);
  const [name, setName] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadPurpose = async () => {
      try {
        const purposeId = params.id as string;

        if (!purposeId) {
          throw new Error('ID da tag não fornecido');
        }

        const data = await getPurposeById(purposeId);
        setPurpose(data);
        setName(data.name);
        setIsActive(data.is_active);
      } catch (err: any) {
        console.error('Erro ao carregar tag:', err);
        error('Erro', err.message || 'Não foi possível carregar a tag.');
        router.back();
      } finally {
        setInitialLoading(false);
      }
    };

    loadPurpose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFormValid = (): boolean => {
    return name.trim().length >= 2;
  };

  const handleSave = async () => {
    if (loading || !purpose) return;

    if (name.trim().length < 2) {
      error('Erro', 'Nome deve ter pelo menos 2 caracteres');
      return;
    }

    setLoading(true);

    try {
      await updatePurpose({
        id: purpose.id,
        name: name.trim(),
        is_active: isActive,
      });

      success('Sucesso', 'Tag atualizada com sucesso!', () => router.back());
    } catch (err: any) {
      console.error('Erro ao atualizar tag:', err);
      error('Erro', err.message || 'Não foi possível atualizar a tag. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {    Alert.alert(
      'Excluir Tag',
      `Tem certeza que deseja excluir a tag "${purpose?.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (!purpose) return;
            setLoading(true);
            try {
              await deletePurpose(purpose.id);
              success('Sucesso', 'Tag excluída com sucesso!', () => router.back());
            } catch (err: any) {
              console.error('Erro ao excluir tag:', err);
              error('Erro', err.message || 'Não foi possível excluir a tag.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderSecundary />
        <LoadingContainer>
          <ActivityIndicator size="large" color="#c43edf" />
        </LoadingContainer>
      </SafeAreaView>
    );
  }

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
        <PageTitle>Editar Tag</PageTitle>

        <InfoBox>
          Atualize as informações da tag ou altere seu status de ativação.
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

          <SwitchContainer>
            <SwitchLabel>Tag ativa</SwitchLabel>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: '#e0e0e0', true: '#d68af0' }}
              thumbColor={isActive ? '#c43edf' : '#bdbdbd'}
            />
          </SwitchContainer>
        </FormContainer>
      </KeyboardAwareScrollView>

      <ButtonFooter>
        <SecondaryButton title="Excluir" onPress={handleDelete} />
        <PrimaryButton
          title="Salvar"
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
