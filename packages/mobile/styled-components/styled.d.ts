import 'styled-components/native'


declare module 'styled-components/native' {
  export interface DefaultTheme {
    borderRadius: string;
    colors: {
        text: string;
        muted:string;
        background: string;
        border:string
        tint: string;
        danger: string;
    };
  }
}