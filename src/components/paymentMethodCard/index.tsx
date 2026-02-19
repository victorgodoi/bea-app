import { PaymentMethod } from '@/src/types/payment-methods.types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import {
    Card,
    CardBadge,
    CardBadgeText,
    CardHeader,
    CardInfo,
    CardInfoLabel,
    CardInfoRow,
    CardInfoText,
    CardTitle,
} from './stylePaymentMethodCard';

interface PaymentMethodCardProps extends TouchableOpacityProps {
  paymentMethod: PaymentMethod;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ 
  paymentMethod, 
  ...rest 
}) => {
  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      credit: 'Crédito',
      debit: 'Débito',
      cash: 'Dinheiro',
      pix: 'PIX',
      bank_transfer: 'Transferência',
    };
    return labels[type] || type;
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'credit':
      case 'debit':
        return <MaterialCommunityIcons name="credit-card" size={20} color="#666" />;
      case 'cash':
        return <MaterialCommunityIcons name="cash" size={20} color="#666" />;
      case 'pix':
        return <MaterialCommunityIcons name="cellphone" size={20} color="#666" />;
      case 'bank_transfer':
        return <MaterialCommunityIcons name="bank-transfer" size={20} color="#666" />;
      default:
        return <MaterialCommunityIcons name="wallet" size={20} color="#666" />;
    }
  };

  return (
    <Card {...rest}>
      <CardHeader>
        <CardTitle numberOfLines={1}>{paymentMethod.description}</CardTitle>
        <CardBadge type={paymentMethod.type}>
          <CardBadgeText type={paymentMethod.type}>
            {getTypeLabel(paymentMethod.type)}
          </CardBadgeText>
        </CardBadge>
      </CardHeader>

      <CardInfo>
        {paymentMethod.bank_name && (
          <CardInfoRow>
            {getCardIcon(paymentMethod.type)}
            <CardInfoLabel>Banco:</CardInfoLabel>
            <CardInfoText>{paymentMethod.bank_name}</CardInfoText>
          </CardInfoRow>
        )}

        {paymentMethod.card_type && (
          <CardInfoRow>
            <MaterialCommunityIcons name="credit-card-outline" size={20} color="#666" />
            <CardInfoLabel>Tipo:</CardInfoLabel>
            <CardInfoText>{paymentMethod.card_type.toUpperCase()}</CardInfoText>
          </CardInfoRow>
        )}

        {paymentMethod.owner_card && (
          <CardInfoRow>
            <MaterialCommunityIcons name="account" size={20} color="#666" />
            <CardInfoLabel>Titular:</CardInfoLabel>
            <CardInfoText>{paymentMethod.owner_card}</CardInfoText>
          </CardInfoRow>
        )}

        {paymentMethod.due_day && (
          <CardInfoRow>
            <MaterialCommunityIcons name="calendar" size={20} color="#666" />
            <CardInfoLabel>Vencimento:</CardInfoLabel>
            <CardInfoText>Dia {paymentMethod.due_day}</CardInfoText>
          </CardInfoRow>
        )}

        {!paymentMethod.is_active && (
          <CardInfoRow>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#f44336" />
            <CardInfoText style={{ color: '#f44336' }}>Inativo</CardInfoText>
          </CardInfoRow>
        )}
      </CardInfo>
    </Card>
  );
};
