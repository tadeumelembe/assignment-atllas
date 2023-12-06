import styled from "styled-components/native";
import { horizontal_padding } from "../utils/constants";
import { Platform, StatusBar } from "react-native";

export const Container = styled.View`
background-color:${props => props.theme.colors.background};
padding-horizontal:${horizontal_padding}px;
flex:1;
padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;

`

export const Button = styled.TouchableOpacity<{ $muted?: boolean; $secondary?: boolean }>`
    width: 100%;
    height: 45px;
    border-radius: 8px;
    align-items: center;
    background-color:${props => props.$muted ? props.theme.colors.muted : props.theme.colors.tint};
    justify-content: center;
    shadow-color: rgba(0,0,0,0.6);
    shadow-offset: 2px 3px;
    shadow-opacity: 0.29;
    shadow-radius:${props => props.theme.borderRadius};
    elevation: 2;

    ${props => props.$secondary &&
        `
        background-color:${props.theme.colors.background};
        border-color:${props.theme.colors.tint};
        border-width:2px;
        `
    }
`

export const ButtonText = styled.Text<{ $secondary?: boolean }>`
  font-size: 15px;
  color: #f4f4f4;
  font-weight: 600;

  ${props => props.$secondary &&
        `
    color:${props.theme.colors.tint};
    `
    }
`;

export const Input = styled.TextInput<{ $focused?: boolean }>`
    width: '100%';
    font-size: 13px;
    color:${props => props.theme.colors.text};
    flex:1;
`

export const InputContainer = styled.View<{ $focused?: boolean }>`
    border-bottom-width: 2px;
    padding: 8px;
    border-color: ${props => props.$focused ? props.theme.colors.tint : props.theme.colors.border};
`

export const Text = styled.Text`
    color: ${props => props.theme.colors.text};
`

export const TextBody = styled(Text)`
    font-size:16px;
`

export const TitleH1 = styled(Text)`
    color: ${props => props.theme.colors.text};
    font-size:40px;
`

export const TitleH2 = styled(Text)`
    color: ${props => props.theme.colors.text};
    font-size:36px;
`

export const TitleH3 = styled(Text)`
    color: ${props => props.theme.colors.text};
    font-size:32px;
`

export const TextError = styled.Text`
    color: ${props => props.theme.colors.danger};
`

export const AuthHeader = styled(TitleH3)`
text-align:center;
margin-bottom:50px;
`

export const AuthBottomContainer = styled.View`
margin-top:10px;
`

