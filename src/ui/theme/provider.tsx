import React, { ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { Theme } from './theme';

type Props = {
  theme: Theme;
  children: ReactNode;
};

const ThemeProvider: React.FC<Props> = ({ theme, children }) => (
  <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
);

export { ThemeProvider };
