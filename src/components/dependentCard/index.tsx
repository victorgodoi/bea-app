import { Dependent } from '@/src/types/dependents.types';
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
} from './styleDependentCard';

interface DependentCardProps extends TouchableOpacityProps {
  dependent: Dependent;
}

export const DependentCard: React.FC<DependentCardProps> = ({ 
  dependent, 
  ...rest 
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card {...rest}>
      <CardHeader>
        <CardTitle numberOfLines={1}>{dependent.name}</CardTitle>
        <CardBadge>
          <CardBadgeText>Dependente</CardBadgeText>
        </CardBadge>
      </CardHeader>

      <CardInfo>
        <CardInfoRow>
          <MaterialCommunityIcons name="email-outline" size={20} color="#666" />
          <CardInfoLabel>Email:</CardInfoLabel>
          <CardInfoText numberOfLines={1}>{dependent.email}</CardInfoText>
        </CardInfoRow>

        <CardInfoRow>
          <MaterialCommunityIcons name="calendar" size={20} color="#666" />
          <CardInfoLabel>Cadastrado em:</CardInfoLabel>
          <CardInfoText>{formatDate(dependent.created_at)}</CardInfoText>
        </CardInfoRow>
      </CardInfo>
    </Card>
  );
};
