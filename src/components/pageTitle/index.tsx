import React from 'react';
import { StyledTitle } from './stylePageTitle';

interface PageTitleProps {
  children: React.ReactNode;
}

export const PageTitle: React.FC<PageTitleProps> = ({ children }) => {
  return <StyledTitle>{children}</StyledTitle>;
};
