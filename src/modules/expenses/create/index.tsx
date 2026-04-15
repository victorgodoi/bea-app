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
import { getAllCategories } from '@/src/services/categories.service';
import { createExpense } from '@/src/services/expenses.service';
import { getPaymentMethods } from '@/src/services/payment-methods.service';
import { getAllPurposes } from '@/src/services/purposes.service';
import { Category, SubCategory } from '@/src/types/categories.types';
import { ExpenseType, PaymentTerm } from '@/src/types/expenses.types';
import { PaymentMethod } from '@/src/types/payment-methods.types';
import { Purpose } from '@/src/types/purposes.types';
import {
  CURRENCY_OPTIONS,
  EXPENSE_TYPE_OPTIONS,
  PAYMENT_TERM_OPTIONS,
  formatAmountInput,
  parseDateInput,
  todayFormatted,
} from '@/src/utils';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormContainer, SectionTitle } from './styleCreateExpense';

const TOTAL_STEPS = 4;

export default function CreateExpenseScreen() {
  const router = useRouter();
  const { success, error } = useNotification();
  const { profile } = useProfile();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 — Informações Básicas
  const [description, setDescription] = useState('');
  const [expenseType, setExpenseType] = useState<ExpenseType>('variable');
  const [paymentTerm, setPaymentTerm] = useState<PaymentTerm>('single');

  // Step 2 — Valores e Datas
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BRL');
  const [expenseDate, setExpenseDate] = useState(todayFormatted());
  const [dueDate, setDueDate] = useState('');

  // Step 3 — Categoria
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [subCategoryId, setSubCategoryId] = useState<string>('');
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Step 4 — Detalhes
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [purposeId, setPurposeId] = useState<string>('');
  const [paymentMethodId, setPaymentMethodId] = useState<string>('');
  const [nfce, setNfce] = useState('');
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Carrega categorias ao entrar no step 3
  useEffect(() => {
    if (categories.length === 0 && profile?.company_id) {
      setLoadingCategories(true);
      getAllCategories(profile.company_id)
        .then(setCategories)
        .catch(() => error('Erro', 'Não foi possível carregar as categorias'))
        .finally(() => setLoadingCategories(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, profile?.company_id, categories.length]);

  // Carrega purposes e payment methods ao entrar no step 4
  useEffect(() => {
    if ( purposes.length === 0 && profile?.company_id) {
      setLoadingDetails(true);
      Promise.all([
        getAllPurposes(profile.company_id),
        getPaymentMethods(profile.company_id),
      ])
        .then(([p, pm]) => {
          setPurposes(p);
          setPaymentMethods(pm);
        })
        .catch(() => error('Erro', 'Não foi possível carregar os detalhes'))
        .finally(() => setLoadingDetails(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, profile?.company_id, purposes.length]);

  // Reseta subcategoria ao trocar categoria
  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setSubCategoryId('');
  };

  const selectedCategory = categories.find(c => c.id === categoryId);
  const subCategoryOptions: { label: string; value: string }[] =
    selectedCategory?.sub_categories?.map((s: SubCategory) => ({
      label: s.name,
      value: s.id,
    })) || [];

  const categoryOptions = categories.map(c => ({ label: c.name, value: c.id }));
  const purposeOptions = purposes.map(p => ({ label: p.name, value: p.id }));
  const paymentMethodOptions = paymentMethods.map(pm => ({
    label: pm.description,
    value: pm.id,
  }));

  const handleAmountChange = (text: string) => {
    setAmount(formatAmountInput(text));
  };

  const dueDateFromDueDay = (dueDay: number): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed
    const todayDay = today.getDate();

    // Se o dia de vencimento ainda não passou neste mês, usa o mês atual; caso contrário, próximo mês
    const targetMonth = todayDay <= dueDay ? month : month + 1;
    const targetDate = new Date(year, targetMonth, dueDay);

    // Normaliza caso o dia não exista no mês (ex: dia 31 em fevereiro)
    const d = String(targetDate.getDate()).padStart(2, '0');
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const y = String(targetDate.getFullYear());
    return `${d}/${m}/${y}`;
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethodId(value);
    if (!value) return;
    const pm = paymentMethods.find(p => p.id === value);
    if (pm?.due_day) {
      setDueDate(dueDateFromDueDay(pm.due_day));
    }
  };

  const isStepDisabled = (): boolean => {
    if (loading) return true;
    if (currentStep === 1) return !description.trim();
    if (currentStep === 2) {
      const parsed = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
      return isNaN(parsed) || parsed <= 0 || expenseDate.length !== 10;
    }
    return false;
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep(s => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (!profile?.company_id) {
        throw new Error('Empresa não identificada. Faça login novamente.');
      }

      const parsedAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Informe um valor válido para a despesa.');
      }

      const parsedExpenseDate = parseDateInput(expenseDate);
      if (!parsedExpenseDate) {
        throw new Error('Data da despesa inválida. Use o formato DD/MM/AAAA.');
      }

      const parsedDueDate = dueDate.length === 10 ? parseDateInput(dueDate) : null;

      const selectedCat = categories.find(c => c.id === categoryId);
      const selectedSub = selectedCat?.sub_categories?.find(
        (s: SubCategory) => s.id === subCategoryId
      );
      const selectedPurpose = purposes.find(p => p.id === purposeId);

      await createExpense({
        description: description.trim(),
        expense_type: expenseType,
        payment_term: paymentTerm,
        currency,
        amount: parsedAmount,
        expense_date: parsedExpenseDate,
        due_date: parsedDueDate ?? null,
        company_id: profile.company_id,
        category_id: categoryId || null,
        category_name: selectedCat?.name || null,
        sub_category_id: subCategoryId || null,
        sub_category_name: selectedSub?.name || null,
        purpose_id: purposeId || null,
        purpose_name: selectedPurpose?.name || null,
        payment_method_id: paymentMethodId || null,
        nfce: nfce.trim() || null,
      });

      success('Sucesso', 'Despesa criada com sucesso!');
      router.back();
    } catch (err: any) {
      error('Erro', err.message || 'Não foi possível criar a despesa.');
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
        extraScrollHeight={120}
        extraHeight={120}
      >
        <PageTitle>Nova Despesa</PageTitle>
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Step 1 — Informações Básicas */}
        {currentStep === 1 && (
          <FormContainer>
            <SectionTitle>Informações Básicas</SectionTitle>

            <InputField
              label="Descrição *"
              placeholder="Ex: Aluguel, Mercado, Assinatura..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              required
            />

            <SelectField
              label="Tipo de Despesa *"
              selectedValue={expenseType}
              onValueChange={v => setExpenseType(v as ExpenseType)}
              options={EXPENSE_TYPE_OPTIONS}
            />

            <SelectField
              label="Forma de Pagamento *"
              selectedValue={paymentTerm}
              onValueChange={v => setPaymentTerm(v as PaymentTerm)}
              options={PAYMENT_TERM_OPTIONS}
            />
          </FormContainer>
        )}

        {/* Step 2 — Valores e Datas */}
        {currentStep === 2 && (
          <FormContainer>
            <SectionTitle>Valores e Datas</SectionTitle>

            <InputField
              label="Valor *"
              placeholder="0,00"
              placeholderTextColor="#999"
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="number-pad"
              required
            />

            <SelectField
              label="Moeda *"
              selectedValue={currency}
              onValueChange={setCurrency}
              options={CURRENCY_OPTIONS}
            />

            <InputFieldNumber
              label="Data da Despesa *"
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#999"
              value={expenseDate}
              onChangeText={setExpenseDate}
              mask="##/##/####"
              required
            />
          </FormContainer>
        )}

        {/* Step 3 — Categoria */}
        {currentStep === 3 && (
          <FormContainer>
            <SectionTitle>Categoria</SectionTitle>

            {loadingCategories ? null : (
              <>
                <SelectField
                  label="Categoria"
                  selectedValue={categoryId}
                  onValueChange={handleCategoryChange}
                  options={[
                    { label: 'Sem categoria', value: '' },
                    ...categoryOptions,
                  ]}
                />

                {categoryId !== '' && subCategoryOptions.length > 0 && (
                  <SelectField
                    label="Subcategoria"
                    selectedValue={subCategoryId}
                    onValueChange={setSubCategoryId}
                    options={[
                      { label: 'Sem subcategoria', value: '' },
                      ...subCategoryOptions,
                    ]}
                  />
                )}
              </>
            )}
          </FormContainer>
        )}

        {/* Step 4 — Detalhes */}
        {currentStep === 4 && (
          <FormContainer>
            <SectionTitle>Detalhes Adicionais</SectionTitle>

            {!loadingDetails && (
              <>
                <SelectField
                  label="Tag / Finalidade"
                  selectedValue={purposeId}
                  onValueChange={setPurposeId}
                  options={[
                    { label: 'Nenhuma', value: '' },
                    ...purposeOptions,
                  ]}
                />

                <SelectField
                  label="Método de Pagamento"
                  selectedValue={paymentMethodId}
                  onValueChange={handlePaymentMethodChange}
                  options={[
                    { label: 'Não informado', value: '' },
                    ...paymentMethodOptions,
                  ]}
                />

                <InputFieldNumber
                  label="Data de Vencimento"
                  placeholder="DD/MM/AAAA (opcional)"
                  placeholderTextColor="#999"
                  value={dueDate}
                  onChangeText={setDueDate}
                  mask="##/##/####"
                />

                <InputField
                  label="Chave NFC-e"
                  placeholder="Chave da nota fiscal eletrônica (opcional)"
                  placeholderTextColor="#999"
                  value={nfce}
                  onChangeText={setNfce}
                />
              </>
            )}
          </FormContainer>
        )}
      </KeyboardAwareScrollView>

      <ButtonFooter>
        <SecondaryButton
          title={currentStep === 1 ? 'Cancelar' : 'Voltar'}
          onPress={handleBack}
          disabled={loading}
        />
        {currentStep < TOTAL_STEPS ? (
          <PrimaryButton
            title="Próximo"
            onPress={handleNext}
            disabled={isStepDisabled()}
          />
        ) : (
          <PrimaryButton
            title={loading ? 'Salvando...' : 'Salvar'}
            onPress={handleSave}
            disabled={loading}
          />
        )}
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
