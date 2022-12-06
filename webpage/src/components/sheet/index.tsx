import React, { ReactNode, useMemo } from 'react';
import styled from 'styled-components';
import { createTheme } from 'theme/create';
import { ThemeProvider } from 'theme/provider';

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  min-height: 90%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

type Props = {
  backgroundColor: string;
  children: ReactNode;
  background?: ReactNode;
};

const Sheet: React.FC<Props> = ({ background, children }) => {
  const theme = useMemo(() => createTheme({}), []);
  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        {background && <BackgroundWrapper>{background}</BackgroundWrapper>}
        {children}
      </Wrapper>
    </ThemeProvider>
  );
};

export { Sheet };
