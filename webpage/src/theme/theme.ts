type Typography = {
  family?: string;
  size?: number;
  spacing?: number;
  weight?: string;
  upperCase?: boolean;
};

type Theme = {
  typography: {
    Jumbo: Typography;
    Title2: Typography;
    Title1: Typography;
    Body1: Typography;
    Caption: Typography;
    Overline: Typography;
    Link: Typography;
  };
  colors: {
    primary: string;
    foreground: string;
    background: string;
  };
  font: {
    baseSize: number;
    family?: string;
  };
};

export type { Theme, Typography };
