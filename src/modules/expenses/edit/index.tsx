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
import { deleteExpense, getExpenseById, updateExpense } from '@/src/services/expenses.service';
import { getPaymentMethods } from '@/src/services/payment-methods.service';
import { getAllPurposes } from '@/src/services/purposes.service';
import { Category, SubCategory } from '@/src/types/categories.types';
import { Expense, ExpenseType, PaymentTerm } from '@/src/types/expenses.types';
import { PaymentMethod } from '@/src/types/payment-methods.types';
import { Purpose } from '@/src/types/purposes.types';
import {
    CURRENCY_OPTIONS,
    EXPENSE_TYPE_OPTIONS,
    PAYMENT_TERM_OPTIONS,
    formatAmountInput,
    parseDateInput,
} from '@/src/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormContainer, LoadingContainer, SectionTitle } from './styleEditExpense';

const TOTAL_STEPS = 4;

function dateToInputFormat(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function amountToInputFormat(amount: number): string {
  return formatAmountInput(String(Math.round(amount * 100)));
}

export default function EditExpenseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { success, error } = useNotification();
  const { profile } = useProfile();

  const [currentStep, setCurrentStep] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState<Expense | null>(null);

  // Step 1 — Informações Básicas
  const [description, setDescription] = useState('');
  const [expenseType, setExpenseType] = useState<ExpenseType>('variable');
  const [paymentTerm, setPaymentTerm] = useState<PaymentTerm>('single');

  // Step 2 — Valores e Datas
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BRL');
  const [expenseDate, setExpenseDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Step 3 — Categoria
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Step 4 — Detalhes
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [purposeId, setPurposeId] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [nfce, setNfce] = useState('');
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Carrega dados da despesa
  useEffect(() => {
    const loadExpense = async () => {
      try {
        const id = params.id as string;
        if (!id) throw new Error('ID da despesa não fornecido');

        const data = await getExpenseById(id);
        setExpense(data);

        // Preenche os campos
        setDescription(data.description || '');
        setExpenseType(data.expense_type);
        setPaymentTerm(data.payment_term);
        setAmount(amountToInputFormat(data.amount));
        setCurrency(data.currency || 'BRL');
        setExpenseDate(dateToInputFormat(data.expense_date));
        setDueDate(dateToInputFormat(data.due_date));
        setCategoryId(data.category_id || '');
        setSubCategoryId(data.sub_category_id || '');
        setPurposeId(data.purpose_id || '');
        setPaymentMethodId(data.payment_method_id || '');
        setNfce(data.nfce || '');
      } catch (err: any) {
        error('Erro', err.message || 'Não foi possível carregar a despesa.');
        router.back();
      } finally {
        setInitialLoading(false);
      }
    };

    loadExpense();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Carrega categorias ao entrar no step 3
  useEffect(() => {
    if (currentStep === 3 && categories.length === 0 && profile?.company_id) {
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
    if (currentStep === 4 && purposes.length === 0 && profile?.company_id) {
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

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setSubCategoryId('');
  };

  const selectedCategory = categories.find(c => c.id === categoryId);
  const subCategoryOptions =
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

  const handleDelete = () => {
    Alert.alert(
      'Excluir Despesa',
      `Tem certeza que deseja excluir "${expense?.description}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (!expense) return;
            setLoading(true);
            try {
              await deleteExpense(expense.id);
              success('Sucesso', 'Despesa excluída com sucesso!', () => router.back());
            } catch (err: any) {
              error('Erro', err.message || 'Não foi possível excluir a despesa.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (loading || !expense) return;
    setLoading(true);

    try {
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

      await updateExpense({
        id: expense.id,
        description: description.trim(),
        expense_type: expenseType,
        payment_term: paymentTerm,
        currency,
        amount: parsedAmount,
        expense_date: parsedExpenseDate,
        due_date: parsedDueDate ?? null,
        category_id: categoryId || null,
        category_name: selectedCat?.name || null,
        sub_category_id: subCategoryId || null,
        sub_category_name: selectedSub?.name || null,
        purpose_id: purposeId || null,
        purpose_name: selectedPurpose?.name || null,
        payment_method_id: paymentMethodId || null,
        nfce: nfce.trim() || null,
      });

      success('Sucesso', 'Despesa atualizada com sucesso!', () => router.back());
    } catch (err: any) {
      error('Erro', err.message || 'Não foi possível atualizar a despesa.');
    } finally {
      setLoading(false);
    }
  };

  const getPrimaryButtonLabel = (): string =>
    currentStep < TOTAL_STEPS ? 'Próximo' : 'Salvar Alterações';

  const handlePrimaryAction = () => {
    if (currentStep < TOTAL_STEPS) {
      handleNext();
    } else {
      handleSave();
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
        extraScrollHeight={120}
        extraHeight={120}
      >
        <PageTitle>Editar Despesa</PageTitle>
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <FormContainer>
          {/* Step 1 — Informações Básicas */}
          {currentStep === 1 && (
            <>
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
            </>
          )}

          {/* Step 2 — Valores e Datas */}
          {currentStep === 2 && (
            <>
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

              <InputFieldNumber
                label="Data de Vencimento"
                placeholder="DD/MM/AAAA (opcional)"
                placeholderTextColor="#999"
                value={dueDate}
                onChangeText={setDueDate}
                mask="##/##/####"
              />
            </>
          )}

          {/* Step 3 — Categoria */}
          {currentStep === 3 && (
            <>
              <SectionTitle>Categoria</SectionTitle>

              {!loadingCategories && (
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
            </>
          )}

          {/* Step 4 — Detalhes */}
          {currentStep === 4 && (
            <>
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
                    onValueChange={setPaymentMethodId}
                    options={[
                      { label: 'Não informado', value: '' },
                      ...paymentMethodOptions,
                    ]}
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
            </>
          )}
        </FormContainer>
      </KeyboardAwareScrollView>

      <ButtonFooter>
        {currentStep === 1 ? (
          <SecondaryButton title="Excluir" onPress={handleDelete} disabled={loading} />
        ) : (
          <SecondaryButton title="Voltar" onPress={handleBack} disabled={loading} />
        )}
        <PrimaryButton
          title={getPrimaryButtonLabel()}
          onPress={handlePrimaryAction}
          loading={loading}
          disabled={isStepDisabled()}
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
