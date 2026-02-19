import {
  ButtonFooter,
  HeaderSecundary,
  InputField,
  PageTitle,
  PrimaryButton,
  SecondaryButton,
  SelectField,
  StepIndicator,
} from '@/src/components';
import { useNotification } from '@/src/contexts/NotificationContext';
import { createPaymentMethod } from '@/src/services/payment-methods.service';
import { CardType, PaymentMethodType } from '@/src/types/payment-methods.types';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
  const { success, error } = useNotification();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Estados do formulário
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<PaymentMethodType>('credit');
  const [bankName, setBankName] = useState<string>('');
  const [cardType, setCardType] = useState<CardType>('mastercard');
  const [flag, setFlag] = useState<string>('');
  const [ownerCard, setOwnerCard] = useState<string>('');
  const [dueDay, setDueDay] = useState<string>('');
  const [closingDay, setClosingDay] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const paymentTypeOptions = [
    { label: 'Cartão de Crédito', value: 'credit' },
    { label: 'Cartão de Débito', value: 'debit' },
    { label: 'Dinheiro', value: 'cash' },
    { label: 'PIX', value: 'pix' },
    { label: 'Transferência Bancária', value: 'bank_transfer' },
  ];

  const cardTypeOptions = [
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
    if (type === 'cash') return 1; // Apenas descrição e tipo
    if (type === 'credit') return 4; // Descrição, Bancário, Cartão, Datas
    if (type === 'debit') return 3; // Descrição, Bancário, Cartão
    return 2; // PIX/Transferência: Descrição, Bancário
  };

  // Valida o step atual antes de avançar
  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      if (!description.trim()) {
        error('Erro', 'A descrição é obrigatória');
        return false;
      }
      if (!type) {
        error('Erro', 'Selecione o tipo de pagamento');
        return false;
      }
    }
    return true;
  };

  // Avança para o próximo step
  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
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

  const handleSave = async () => {
    if (loading) return;

    // Validação final
    if (!validateCurrentStep()) return;

    setLoading(true);

    try {
      // TODO: Substituir por company_id do usuário logado quando disponível
      const mockCompanyId = '00000000-0000-0000-0000-000000000000';

      await createPaymentMethod({
        description: description.trim(),
        type,
        bank_name: bankName.trim() || undefined,
        card_type: (type === 'credit' || type === 'debit') && cardType ? cardType : undefined,
        flag: flag.trim() || undefined,
        owner_card: ownerCard.trim() || undefined,
        due_day: dueDay ? parseInt(dueDay, 10) : undefined,
        closing_day: closingDay ? parseInt(closingDay, 10) : undefined,
        expiration_date: expirationDate || undefined,
        company_id: mockCompanyId,
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

  const showCardFields = type === 'credit' || type === 'debit';
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
        <PageTitle>Adicionar Conta</PageTitle>

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
              />

              <SelectField
                label="Tipo de Pagamento *"
                selectedValue={type}
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
                label="Banco"
                placeholder="Ex: Nubank, Itaú, Bradesco"
                placeholderTextColor="#999"
                value={bankName}
                onChangeText={setBankName}
                autoCapitalize="words"
              />

              <InputField
                label="Titular"
                placeholder="Nome do titular"
                placeholderTextColor="#999"
                value={ownerCard}
                onChangeText={setOwnerCard}
                autoCapitalize="words"
              />
            </>
          )}

          {/* STEP 3: Informações do Cartão (apenas para crédito/débito) */}
          {currentStep === 3 && showCardFields && (
            <>
              <SectionTitle>Informações do Cartão</SectionTitle>

              <SelectField
                label="Bandeira do Cartão"
                selectedValue={cardType}
                onValueChange={(value) => setCardType(value as CardType)}
                options={cardTypeOptions}
              />

              <InputField
                label="Bandeira/Flag"
                placeholder="Ex: Mastercard, Visa"
                placeholderTextColor="#999"
                value={flag}
                onChangeText={setFlag}
                autoCapitalize="words"
              />

              <InputField
                label="Data de Validade"
                placeholder="MM/AA (Ex: 12/28)"
                placeholderTextColor="#999"
                value={expirationDate}
                onChangeText={setExpirationDate}
                maxLength={5}
              />
            </>
          )}

          {/* STEP 4: Datas de Pagamento (apenas para crédito) */}
          {currentStep === 4 && showDueDays && (
            <>
              <SectionTitle>Datas de Pagamento</SectionTitle>

              <InputField
                label="Dia de Fechamento"
                placeholder="Dia (1-31)"
                placeholderTextColor="#999"
                value={closingDay}
                onChangeText={setClosingDay}
                keyboardType="number-pad"
                maxLength={2}
              />

              <InputField
                label="Dia de Vencimento"
                placeholder="Dia (1-31)"
                placeholderTextColor="#999"
                value={dueDay}
                onChangeText={setDueDay}
                keyboardType="number-pad"
                maxLength={2}
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
