import { View, TextInputProps, StyleProp, TextStyle } from 'react-native'
import React, { useState } from 'react'
import { Controller, Control } from "react-hook-form"
import { Input, InputContainer, TextError } from './styledComponents';

interface ControlledInputProps extends TextInputProps {
    control: Control<any>;
    rightComponent?: React.ReactNode;
    name: string;
    rules?: object;
    containerStyle?: StyleProp<TextStyle>
}

const ControlledInput = ({ control, rightComponent = null, name, rules, containerStyle, ...otherProps }: ControlledInputProps) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View style={containerStyle}>
                    <InputContainer $focused={isFocused} style={{ flexDirection: 'row',alignItems:'center', justifyContent: 'space-between' }}>
                        <Input
                            {...otherProps}
                            onBlur={() => setIsFocused(false)}
                            onFocus={() => setIsFocused(true)}
                            onChangeText={onChange}
                            value={value}
                            selectionColor={'#444'}
                            
                        />
                        {rightComponent}
                    </InputContainer>
                    {error?.message &&
                        <TextError style={{ marginTop: 2 }}>{error?.message || 'Error'}</TextError>
                    }
                </View>
            )}

        />

    )
}

export {
    ControlledInput
}
