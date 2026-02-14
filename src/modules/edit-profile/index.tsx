import { HeaderSecundary } from '@/src/components/headerSecundary';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CancelButton, CancelButtonText, Footer, FormContainer, InputWrapper, Label, SaveButtonText, Title } from './styleEditProfile';

export default function EditProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (params.name) setName(params.name as string);
    if (params.email) setEmail(params.email as string);
  }, []);

  const handleSave = async () => {
    if (loading) return;
    // Lógica será implementada posteriormente
    console.log('Salvar perfil:', { name, email });
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
        <CancelButton onPress={() => router.back()}>
          <CancelButtonText>Cancelar</CancelButtonText>
        </CancelButton>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.buttonDisabled]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <SaveButtonText>Salvar</SaveButtonText>
          )}
        </TouchableOpacity>
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
  saveButton: {
    flex: 1,
    backgroundColor: '#c43edf',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
