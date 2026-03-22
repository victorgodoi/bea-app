// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

interface BadgeProps {
  hasSubCategories?: boolean;
}

export const Card = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #e0e0e0;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 3px;
  elevation: 2;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  flex: 1;
  margin-right: 8px;
`;

export const CardBadge = styled.View<BadgeProps>`
  background-color: ${(props: BadgeProps) => props.hasSubCategories ? '#e8f5e9' : '#ffebee'};
  padding: 4px 12px;
  border-radius: 12px;
`;

export const CardBadgeText = styled.Text<BadgeProps>`
  font-size: 12px;
  font-weight: 600;
  color: ${(props: BadgeProps) => props.hasSubCategories ? '#2e7d32' : '#c62828'};
`;

export const CardInfo = styled.View`
  gap: 4px;
  margin-bottom: 12px;
`;

export const CardInfoRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
`;

export const CardInfoLabel = styled.Text`
  font-size: 14px;
  color: #666;
`;

export const CardInfoText = styled.Text`
  font-size: 14px;
  color: #333;
  font-weight: 500;
  flex: 1;
`;

export const SubCategoriesContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: #f0f0f0;
`;

export const SubCategoryChip = styled.View`
  background-color: #f5f5f5;
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
`;

export const SubCategoryText = styled.Text`
  font-size: 12px;
  color: #555;
  font-weight: 500;
`;
