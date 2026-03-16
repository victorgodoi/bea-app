import React from 'react';
import { ViewProps } from 'react-native';
import { Container, Text } from './styleInfoBox';

interface InfoBoxProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'error';
}

export const InfoBox: React.FC<InfoBoxProps> = ({ 
  children, 
  variant = 'info',
  ...rest 
}) => {
  return (
    <Container variant={variant} {...rest}>
      <Text variant={variant}>{children}</Text>
    </Container>
  );
};
