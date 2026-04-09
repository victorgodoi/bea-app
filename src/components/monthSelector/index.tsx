import { MONTH_NAMES } from '@/src/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    MonthBar,
    MonthLabel,
    MonthNavButton,
    MonthTextGroup,
    YearLabel,
} from './styleMonthSelector';

interface MonthSelectorProps {
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  month,
  year,
  onPrevMonth,
  onNextMonth,
}) => {
  return (
    <MonthBar>
      <MonthNavButton onPress={onPrevMonth}>
        <MaterialCommunityIcons name="chevron-left" size={22} color="#c43edf" />
      </MonthNavButton>
      <MonthTextGroup>
        <MonthLabel>{MONTH_NAMES[month - 1]}</MonthLabel>
        <YearLabel>{year}</YearLabel>
      </MonthTextGroup>
      <MonthNavButton onPress={onNextMonth}>
        <MaterialCommunityIcons name="chevron-right" size={22} color="#c43edf" />
      </MonthNavButton>
    </MonthBar>
  );
};
