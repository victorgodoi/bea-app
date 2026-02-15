import {
  ButtonFooter,
  HeaderSecundary,
  InputField,
  PageTitle,
  PrimaryButton,
  SecondaryButton,
} from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import { updateUserProfile } from '@/src/services/auth.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormContainer } from './styleEditProfile';

export default function EditProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setUser } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (params.name) setName(params.name as string);
    if (params.email) setEmail(params.email as string);
    if (params.id) setUserId(params.id as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (loading || !userId) return;

    // Validações básicas
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome não pode estar vazio');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Erro', 'O email não pode estar vazio');
      return;
    }

    setLoading(true);

    try {
      const updatedProfile = await updateUserProfile({
        id: userId,
        name: name.trim(),
        email: email.trim(),
      });

      // Atualiza o contexto com os novos dados
      setUser({
        email: updatedProfile.email,
        name: updatedProfile.name,
      });

      Alert.alert(
        'Sucesso',
        'Perfil atualizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível atualizar o perfil. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
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
      >
        <PageTitle>Editar Perfil</PageTitle>
        <FormContainer>
          <InputField
            label="Nome"
            placeholder="Digite seu nome"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <InputField
            label="Email"
            placeholder="Digite seu email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </FormContainer>
      </KeyboardAwareScrollView>
      <ButtonFooter>
        <SecondaryButton 
          title="Cancelar"
          onPress={() => router.back()}
        />
        <PrimaryButton 
          title="Salvar"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
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
