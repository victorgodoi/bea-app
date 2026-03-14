import { useProfile } from '@/hooks/use-profile';
import {
  ButtonFooter,
  HeaderSecundary,
  InputField,
  InputFieldNumber,
  PageTitle,
  PrimaryButton,
  SecondaryButton,
  SelectField,
  StepIndicator,
} from '@/src/components';
import { useNotification } from '@/src/contexts/NotificationContext';
import { createPaymentMethod } from '@/src/services/payment-methods.service';
import { CardType, FlagType, PaymentMethodType } from '@/src/types/payment-methods.types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Switch } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  FormContainer,
  SectionTitle,
  SwitchContainer,
  SwitchLabel
} from './styleCreatePaymentMethod';

export default function CreatePaymentMethodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { success, error } = useNotification();
  const { profile } = useProfile();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Estados do formulário
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<PaymentMethodType>('credit');
  const [bankName, setBankName] = useState<string>('');
  const [cardType, setCardType] = useState<CardType | undefined>(undefined);
  const [flag, setFlag] = useState<FlagType | undefined>(undefined);
  const [ownerCard, setOwnerCard] = useState<string>('');
  const [dueDay, setDueDay] = useState<string>('');
  const [closingDay, setClosingDay] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const paymentTypeOptions = [
    { label: 'Cartão de Crédito', value: 'credit' },
    { label: 'Cartão de Débito', value: 'debit' },
    { label: 'Cartão Pré-pago', value: 'prepaid' },
    { label: 'Dinheiro', value: 'cash' },
    { label: 'PIX', value: 'pix' },
    { label: 'Transferência Bancária', value: 'bank_transfer' },
  ];

  const flagOptions = [
    { label: 'Visa', value: 'visa' },
    { label: 'Mastercard', value: 'mastercard' },
    { label: 'Elo', value: 'elo' },
    { label: 'American Express', value: 'american_express' },
    { label: 'Outro', value: 'other' },
  ];

  // Handler para mudança de tipo de pagamento
  const handleTypeChange = (value: string) => {
    setType(value as PaymentMethodType);
    // Se estiver em um step além do 1, volta para o 1 ao mudar o tipo
    if (currentStep > 1) {
      setCurrentStep(1);
    }
  };

  // Determina quantos steps são necessários baseado no tipo
  const getTotalSteps = (): number => {
    if (type === 'cash') return 1;
    if (type === 'credit') return 4;
    if (type === 'debit') return 3;
    if (type === 'prepaid') return 3;
    return 2;
  };

  // Verifica se o botão deve estar desabilitado baseado no step atual
  const isButtonDisabled = (): boolean => {
    if (loading) return true;
    
    // Step 1: Validação básica (todos os tipos)
    if (currentStep === 1) {
      return !description.trim() || !type;
    }
    
    // Step 2: Informações Bancárias (exceto cash)
    if (currentStep === 2 && type !== 'cash') {
      return !bankName.trim() || !ownerCard.trim();
    }
    
    // Step 3: Informações do Cartão (apenas credit, debit, prepaid)
    if (currentStep === 3 && showCardFields) {
      return !flag || !expirationDate.trim();
    }
    
    // Step 4: Datas de Pagamento (apenas credit)
    if (currentStep === 4 && showDueDays) {
      return !closingDay.trim() || !dueDay.trim();
    }
    
    return false;
  };

  // Avança para o próximo step
  const handleNext = () => {
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Volta para o step anterior
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  // Converte data do formato MM/AA para YYYY-MM-DD
  const convertExpirationDate = (mmaaDate: string): string | undefined => {
    if (!mmaaDate || mmaaDate.length !== 5) return undefined;
    
    const [month, year] = mmaaDate.split('/');
    
    // Valida se o mês está entre 01 e 12
    const monthNum = parseInt(month, 10);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return undefined;
    }
    
    const fullYear = `20${year}`; // Assume anos 20XX
    
    // Retorna no formato YYYY-MM-DD (primeiro dia do mês)
    // Garante que o mês tenha sempre 2 dígitos
    const paddedMonth = month.padStart(2, '0');
    return `${fullYear}-${paddedMonth}-01`;
  };

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const companyId = params.companyId as string;
      
      if (!companyId) {
        throw new Error('ID da empresa não fornecido');
      }

      if (!profile?.id) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      await createPaymentMethod({
        description: description.trim(),
        type: (type === 'credit' || type === 'debit' || type === 'prepaid') ? 'card' : undefined,
        bank_name: bankName.trim() || undefined,
        card_type: cardType || undefined,
        flag: flag || undefined,
        owner_card: ownerCard.trim() || undefined,
        due_day: dueDay ? parseInt(dueDay, 10) : undefined,
        closing_day: closingDay ? parseInt(closingDay, 10) : undefined,
        expiration_date: convertExpirationDate(expirationDate),
        company_id: companyId,
        created_by: profile.id,
        is_active: isActive,
      });

      success(
        'Sucesso',
        'Método de pagamento criado com sucesso!',
        () => router.back()
      );
    } catch (err: any) {
      console.error('Erro ao criar método de pagamento:', err);
      error(
        'Erro',
        err.message || 'Não foi possível criar o método de pagamento. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Determina a ação do botão principal
  const handlePrimaryAction = () => {
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps) {
      handleNext();
    } else {
      handleSave();
    }
  };

  // Determina o label do botão principal
  const getPrimaryButtonLabel = (): string => {
    const totalSteps = getTotalSteps();
    return currentStep < totalSteps ? 'Próximo' : 'Salvar';
  };

  useEffect(() => {
    if (type === 'credit') {
      setCardType('credit');
    } else if (type === 'debit') {
      setCardType('debit');
    } else if (type === 'prepaid') {
      setCardType('prepaid');
    } else {
      setCardType(undefined);
    }
  }, [type]);

  useEffect(() => {
    if (currentStep === 3) {
      setFlag('mastercard');
    }
  }, [currentStep]);

  const showCardFields = type === 'credit' || type === 'debit' || type === 'prepaid';
  const showDueDays = type === 'credit';

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
        <PageTitle>Adicionar Método de Pagamento</PageTitle>

        {/* Indicador de Steps */}
        <StepIndicator currentStep={currentStep} totalSteps={getTotalSteps()} />

        <FormContainer>
          {/* STEP 1: Informações Básicas */}
          {currentStep === 1 && (
            <>
              <InputField
                label="Descrição *"
                placeholder="Ex: Nubank Roxinho"
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                autoCapitalize="words"
                required
              />

              <SelectField
                label="Tipo de Pagamento *"
                selectedValue={type || 'credit'}
                onValueChange={handleTypeChange}
                options={paymentTypeOptions}
              />

              <SwitchContainer>
                <SwitchLabel>Conta Ativa</SwitchLabel>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  trackColor={{ false: '#767577', true: '#c43edf' }}
                  thumbColor={isActive ? '#fff' : '#f4f3f4'}
                />
              </SwitchContainer>
            </>
          )}

          {/* STEP 2: Informações Bancárias */}
          {currentStep === 2 && type !== 'cash' && (
            <>
              <SectionTitle>Informações Bancárias</SectionTitle>

              <InputField
                label="Banco *"
                placeholder="Ex: Nubank, Itaú, Bradesco"
                placeholderTextColor="#999"
                value={bankName}
                onChangeText={setBankName}
                autoCapitalize="words"
                required
              />

              <InputField
                label="Titular *"
                placeholder="Nome do titular"
                placeholderTextColor="#999"
                value={ownerCard}
                onChangeText={setOwnerCard}
                autoCapitalize="words"
                required
              />
            </>
          )}

          {/* STEP 3: Informações do Cartão (apenas para crédito/débito) */}
          {currentStep === 3 && showCardFields && (
            <>
              <SectionTitle>Informações do Cartão</SectionTitle>

              <SelectField
                label="Bandeira do Cartão *"
                selectedValue={flag || 'mastercard'}
                onValueChange={(value) => setFlag(value as FlagType)}
                options={flagOptions}
              />

              <InputFieldNumber
                label="Data de Validade *"
                placeholder="MM/AA (Ex: 12/28)"
                placeholderTextColor="#999"
                value={expirationDate}
                onChangeText={setExpirationDate}
                mask="##/##"
                required
              />
            </>
          )}

          {/* STEP 4: Datas de Pagamento (apenas para crédito) */}
          {currentStep === 4 && showDueDays && (
            <>
              <SectionTitle>Datas de Pagamento</SectionTitle>

              <InputFieldNumber
                label="Dia de Fechamento *"
                placeholder="Dia (1-31)"
                placeholderTextColor="#999"
                value={closingDay}
                onChangeText={setClosingDay}
                required
              />

              <InputFieldNumber
                label="Dia de Vencimento *"
                placeholder="Dia (1-31)"
                placeholderTextColor="#999"
                value={dueDay}
                onChangeText={setDueDay}
                required
              />
            </>
          )}
        </FormContainer>
      </KeyboardAwareScrollView>
      
      <ButtonFooter>
        <SecondaryButton 
          title={currentStep === 1 ? 'Cancelar' : 'Voltar'}
          onPress={handleBack}
        />
        <PrimaryButton
          title={getPrimaryButtonLabel()}
          onPress={handlePrimaryAction}
          loading={loading}
          disabled={isButtonDisabled()}
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
