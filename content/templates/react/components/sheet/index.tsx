import React, { ReactNode, useMemo } from "react";
import styled from "styled-components";
import { createTheme } from "@/theme/create";
import { ThemeProvider } from "@/theme/provider";

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  min-height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const BackgroundWrapper = styled.div<{
  image?: string;
}>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.2;
  ${({ image }) => (image ? `background-image: url(${image});` : "")}
`;

const Content = styled.div`
  z-index: 1;
  display: flex;
  max-width: 1000px;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

type Props = {
  children: ReactNode;
  background?: string;
  color?: string;
};

const Sheet: React.FC<Props> = ({ color, background, children }) => {
  const theme = useMemo(
    () =>
      createTheme({
        baseColor: color,
      }),
    [color]
  );
  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <BackgroundWrapper image={background} />
        <Content>{children}</Content>
      </Wrapper>
    </ThemeProvider>
  );
};

export { Sheet };
