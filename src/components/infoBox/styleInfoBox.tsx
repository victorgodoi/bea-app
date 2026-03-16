// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

export const Container = styled.View<{ variant: 'info' | 'warning' | 'success' | 'error' }>`
  background-color: ${(props: { variant: string }) => {
    switch (props.variant) {
      case 'info':
        return '#f0f4ff';
      case 'warning':
        return '#fff8e1';
      case 'success':
        return '#e8f5e9';
      case 'error':
        return '#ffebee';
      default:
        return '#f0f4ff';
    }
  }};
  border-left-width: 4px;
  border-left-color: ${(props: { variant: string }) => {
    switch (props.variant) {
      case 'info':
        return '#c43edf';
      case 'warning':
        return '#ffa726';
      case 'success':
        return '#66bb6a';
      case 'error':
        return '#ef5350';
      default:
        return '#c43edf';
    }
  }};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

export const Text = styled.Text<{ variant: 'info' | 'warning' | 'success' | 'error' }>`
  font-size: 14px;
  color: ${(props: { variant: string }) => {
    switch (props.variant) {
      case 'info':
        return '#555';
      case 'warning':
        return '#5d4037';
      case 'success':
        return '#2e7d32';
      case 'error':
        return '#c62828';
      default:
        return '#555';
    }
  }};
  line-height: 20px;
`;
