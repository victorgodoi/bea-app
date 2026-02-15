import React from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { Button, ButtonText } from './stylePrimaryButton';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  title, 
  loading = false, 
  disabled,
  ...rest 
}) => {
  return (
    <Button 
      disabled={disabled || loading} 
      isDisabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <ButtonText>{title}</ButtonText>
      )}
    </Button>
  );
};
