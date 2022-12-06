import {} from 'styled-components';
import { Theme } from './theme/theme'; // Import type from above file
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {} // extends the global DefaultTheme with our ThemeType.
}

declare module '*.png' {
  const value: string;
  export = value;
}
