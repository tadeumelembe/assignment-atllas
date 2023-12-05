import { View, TextInputProps, StyleProp, TextStyle } from 'react-native'
import React, { useState } from 'react'
import { Controller, Control } from "react-hook-form"
import { Input, TextError } from './styledComponents';

interface ControlledInputProps extends TextInputProps {
    control: Control<any>;
    name: string;
    rules?: object;
    containerStyle?: StyleProp<TextStyle>
}

const ControlledInput = ({ control, name, rules, containerStyle, ...otherProps }: ControlledInputProps) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View style={containerStyle}>
                    <Input
                        {...otherProps}
                        onBlur={()=>setIsFocused(false)}
                        onFocus={() => setIsFocused(true)}
                        onChangeText={onChange}
                        value={value}
                        selectionColor={'#444'}
                        $focused={isFocused}
                    />
                    {error &&
                        <TextError style={{marginTop:2}}>{error?.message || 'Error'}</TextError>
                    }
                </View>
            )}

        />

    )
}

export {
    ControlledInput
}
