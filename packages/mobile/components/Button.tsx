import { TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { Button, ButtonText } from './styledComponents';
import { useTheme } from 'styled-components/native';

type ButtonProps = TouchableOpacity['props'] & {
    buttonText?: string,
    btnSecondary?: boolean,
    loading?: boolean,
    muted?: boolean,
};

const ButtonPrimary = ({ buttonText, loading, btnSecondary, muted, ...otherProps }: ButtonProps) => {
    const { colors } = useTheme();

    return (
        <Button
            {...otherProps}
            $secondary={btnSecondary}
        >
            {loading ? <ActivityIndicator color={colors.background} /> :
                <ButtonText $secondary={btnSecondary}>{buttonText} </ButtonText>
            }
        </Button>
    )
}


export {
    ButtonPrimary
}