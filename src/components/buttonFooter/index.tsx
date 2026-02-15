import React from 'react';
import { Container } from './styleButtonFooter';

interface ButtonFooterProps {
  children: React.ReactNode;
}

export const ButtonFooter: React.FC<ButtonFooterProps> = ({ children }) => {
  return <Container>{children}</Container>;
};
