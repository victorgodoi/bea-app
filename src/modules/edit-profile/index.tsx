import { HeaderSecundary } from '@/src/components/headerSecundary';
import { PrimaryButton } from '@/src/components/primaryButton';
import { SecondaryButton } from '@/src/components/secondaryButton';
import { useAuth } from '@/src/contexts/AuthContext';
import { updateUserProfile } from '@/src/services/auth.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  TextInput
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Footer, FormContainer, InputWrapper, Label, Title } from './styleEditProfile';

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
        <Title>Editar Perfil</Title>
        
        <FormContainer>
          <InputWrapper>
            <Label>Nome</Label>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </InputWrapper>

          <InputWrapper>
            <Label>Email</Label>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </InputWrapper>
        </FormContainer>
      </KeyboardAwareScrollView>
      <Footer>
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
      </Footer>
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
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
  },
});
