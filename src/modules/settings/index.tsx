import { useProfile } from '@/hooks/use-profile';
import {
    ButtonFooter,
    HeaderSecundary,
    InfoBox,
    PageTitle,
    PrimaryButton,
    SecondaryButton,
    SelectField,
} from '@/src/components';
import { useNotification } from '@/src/contexts/NotificationContext';
import { getPaymentMethods } from '@/src/services/payment-methods.service';
import {
    getUserSettingsByUserId,
    updateUserSettings,
} from '@/src/services/user-settings.service';
import { PaymentMethod } from '@/src/types/payment-methods.types';
import { UserSettings } from '@/src/types/user-settings.types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormContainer, LoadingContainer } from './styleSettings';

const LANGUAGE_OPTIONS = [
  { label: 'Português', value: 'pt' },
  { label: 'English', value: 'en' },
];

const CURRENCY_OPTIONS = [
  { label: 'Real Brasileiro (BRL)', value: 'BRL' },
  { label: 'Dólar Americano (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
];

const NO_PAYMENT_METHOD = '__none__';

export default function SettingsScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const { success, error } = useNotification();

  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [language, setLanguage] = useState<string>('pt');
  const [currency, setCurrency] = useState<string>('BRL');
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState<string>(NO_PAYMENT_METHOD);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!profile?.id) return;

        const [userSettings, methods] = await Promise.all([
          getUserSettingsByUserId(profile.id),
          profile.company_id ? getPaymentMethods(profile.company_id) : Promise.resolve([]),
        ]);

        setPaymentMethods(methods);

        if (userSettings) {
          setSettings(userSettings);
          setLanguage(userSettings.language || 'pt');
          setCurrency(userSettings.currency || 'BRL');
          setDefaultPaymentMethodId(userSettings.default_payment_method_id || NO_PAYMENT_METHOD);
        }
      } catch (err: any) {
        console.error('Erro ao carregar configurações:', err);
        error('Erro', err.message || 'Não foi possível carregar as configurações.');
      } finally {
        setInitialLoading(false);
      }
    };

    if (profile?.id) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const paymentMethodOptions = [
    { label: 'Nenhum', value: NO_PAYMENT_METHOD },
    ...paymentMethods.map(pm => ({ label: pm.description, value: pm.id })),
  ];

  const handleSave = async () => {
    if (loading || !settings) return;
    setLoading(true);

    try {
      await updateUserSettings({
        id: settings.id,
        language,
        currency,
        default_payment_method_id:
          defaultPaymentMethodId === NO_PAYMENT_METHOD ? null : defaultPaymentMethodId,
      });

      success('Sucesso', 'Configurações salvas com sucesso!', () => router.back());
    } catch (err: any) {
      console.error('Erro ao salvar configurações:', err);
      error('Erro', err.message || 'Não foi possível salvar as configurações. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
      >
        <PageTitle>Configurações</PageTitle>

        <InfoBox>
          Personalize o idioma, a moeda e o método de pagamento padrão da sua conta.
        </InfoBox>

        <FormContainer>
          <SelectField
            label="Idioma"
            selectedValue={language}
            onValueChange={setLanguage}
            options={LANGUAGE_OPTIONS}
          />

          <SelectField
            label="Moeda"
            selectedValue={currency}
            onValueChange={setCurrency}
            options={CURRENCY_OPTIONS}
          />

          <SelectField
            label="Método de Pagamento Padrão"
            selectedValue={defaultPaymentMethodId}
            onValueChange={setDefaultPaymentMethodId}
            options={paymentMethodOptions}
          />
        </FormContainer>
      </KeyboardAwareScrollView>

      <ButtonFooter>
        <SecondaryButton title="Cancelar" onPress={() => router.back()} />
        <PrimaryButton
          title="Salvar"
          onPress={handleSave}
          loading={loading}
          disabled={loading || !settings}
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
