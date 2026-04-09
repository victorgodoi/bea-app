// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

export const MonthBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 14px;
  padding: 10px 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.07;
  shadow-radius: 4px;
`;

export const MonthNavButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #f3e8ff;
  justify-content: center;
  align-items: center;
`;

export const MonthTextGroup = styled.View`
  align-items: center;
`;

export const MonthLabel = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: 0.3px;
`;

export const YearLabel = styled.Text`
  font-size: 12px;
  color: #888;
  text-align: center;
  margin-top: 1px;
`;
