import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { Container, FormContainer, InputContainer, InputWrapper, Label, LogoContainer, TabContainer } from './styleAuth';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = () => {
    // Aqui você pode adicionar a lógica de autenticação
    console.log(isLogin ? 'Login' : 'Cadastro', { email, password, name });
    // Por enquanto, apenas navega para as tabs
    router.replace('/(tabs)');
  };

  return (
    <ImageBackground
      source={require('@/assets/images/BEA_Fundo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <Container
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LogoContainer>
            <Image
              source={require("../../../assets/images/iconBea.png")}
              style={{ width: 100, height: 100 }}
            />
          </LogoContainer>

          <FormContainer>
            <TabContainer>
              <TouchableOpacity
                style={[styles.tab, isLogin && styles.activeTab]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, !isLogin && styles.activeTab]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                  Cadastro
                </Text>
              </TouchableOpacity>
            </TabContainer>

            <InputContainer>
              {!isLogin && (
                <InputWrapper>
                  <Label>Nome</Label>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu nome"
                    placeholderTextColor="#e0e0e0"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </InputWrapper>
              )}

              <InputWrapper>
                <Label>Email</Label>
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu email"
                  placeholderTextColor="#e0e0e0"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </InputWrapper>

              <InputWrapper>
                <Label>Senha</Label>
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#e0e0e0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </InputWrapper>

              {!isLogin && (
                <InputWrapper>
                  <Label>Confirmar Senha</Label>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirme sua senha"
                    placeholderTextColor="#e0e0e0"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </InputWrapper>
              )}

              {/* {isLogin && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
                </TouchableOpacity>
              )} */}

              <TouchableOpacity style={styles.button} onPress={handleAuth}>
                <Text style={styles.buttonText}>
                  {isLogin ? 'Entrar' : 'Cadastrar'}
                </Text>
              </TouchableOpacity>
            </InputContainer>
          </FormContainer>
        </ScrollView>
      </Container>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 40,
    paddingTop: 90,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  activeTabText: {
    color: '#c43edf',
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#c43edf',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
