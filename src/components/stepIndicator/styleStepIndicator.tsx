// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

export const Container = styled.View`
  margin-bottom: 24px;
  align-items: center;
  gap: 12px;
`;

export const StepText = styled.Text`
  font-size: 14px;
  color: #666;
  font-weight: 600;
`;

export const StepWrapper = styled.View`
  flex-direction: row;
  gap: 8px;
  width: 100%;
`;

export const StepDot = styled.View<{ active?: boolean; completed?: boolean }>`
  height: 4px;
  flex: 1;
  background-color: ${(props: { active?: boolean; completed?: boolean }) => {
    if (props.completed) return '#c43edf';
    if (props.active) return '#c43edf';
    return '#e0e0e0';
  }};
  border-radius: 2px;
  min-width: 40px;
`;
