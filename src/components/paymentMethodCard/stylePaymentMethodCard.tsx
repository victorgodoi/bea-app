// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

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
`;

export const CardBadge = styled.View<{ type: string }>`
  background-color: ${(props: { type: string }) => {
    switch (props.type) {
      case 'credit':
        return '#e3f2fd';
      case 'debit':
        return '#f3e5f5';
      case 'cash':
        return '#e8f5e9';
      case 'pix':
        return '#fff3e0';
      default:
        return '#f5f5f5';
    }
  }};
  padding: 4px 12px;
  border-radius: 12px;
`;

export const CardBadgeText = styled.Text<{ type: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(props: { type: string }) => {
    switch (props.type) {
      case 'credit':
        return '#1976d2';
      case 'debit':
        return '#7b1fa2';
      case 'cash':
        return '#388e3c';
      case 'pix':
        return '#f57c00';
      default:
        return '#666';
    }
  }};
`;

export const CardInfo = styled.View`
  gap: 4px;
`;

export const CardInfoRow = styled.View`
  flex-direction: row;
  align-items: center;
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
`;
