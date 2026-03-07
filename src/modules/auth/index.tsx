import { Dialog } from '@/src/components';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '../../contexts/AuthContext';
import { signInUser, signUpUser } from '../../services/auth.service';
import {
  FormContainer,
  InputContainer,
  InputWrapper,
  Label,
  LogoContainer,
  TabContainer
} from './styleAuth';

const { height } = Dimensions.get('window');

export default function AuthScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [dialogContent, setDialogContent] = useState<string>('');
  const [dialogAction, setDialogAction] = useState<(() => void) | undefined>(undefined);

  const showDialog = (content: string, action?: () => void) => {
    setDialogContent(content);
    setDialogAction(() => action);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    if (dialogAction) {
      dialogAction();
      setDialogAction(undefined);
    }
  };

  const handleAuth = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (isLogin) {
        // Login
        const data = await signInUser({ email, password });
        await setUser({ 
          email: data.user?.email || email,
          name: data.user?.user_metadata?.name 
        });
        router.replace('/(tabs)');
      } else {
        // Cadastro
        if (password !== confirmPassword) {
          showDialog('As senhas não conferem');
          return;
        }

        const data = await signUpUser({ name, email, password });
        await setUser({ 
          email: data.user?.email || email,
          name: data.user?.user_metadata?.name || name
        });
        showDialog(
          'Cadastro realizado com sucesso!',
          () => router.replace('/(tabs)')
        );
      }
    } catch (error: any) {
      console.error('Erro na autenticação:', error);
      showDialog(error.message || 'Ocorreu um erro ao processar sua solicitação');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Keyboard.dismiss();
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  }, [isLogin]);

  return (
    <ImageBackground
      source={require('@/assets/images/BEA_Fundo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={height * 0.15}
        keyboardOpeningTime={0}
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

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#c43edf" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Entrar' : 'Cadastrar'}
                </Text>
              )}
            </TouchableOpacity>
          </InputContainer>
        </FormContainer>
      </KeyboardAwareScrollView>

      <Dialog
        visible={dialogVisible}
        content={dialogContent}
        confirmText="OK"
        onConfirm={hideDialog}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#c43edf',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
