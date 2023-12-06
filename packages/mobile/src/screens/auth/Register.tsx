import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { Entypo } from '@expo/vector-icons';

import { StackScreens } from '../../../App';
import { AuthBottomContainer, AuthHeader, Container, TextBody } from '../../components/styledComponents';
import { ControlledInput } from '../../components/Input';
import useRegister, { SignUpForm } from './hooks/useRegister';
import { ButtonPrimary } from '../../components/Button';
import { useTheme } from 'styled-components/native';

export default function Register({ navigation }: NativeStackScreenProps<StackScreens, 'Register'>) {
  const { colors } = useTheme()

  const { control, handleSubmit, watch } = useForm<SignUpForm>({
    defaultValues: {
      username: '',
      name: '',
      password: '',
      confirm_password: '',
    }
  });

  const passwordWatch = watch('password')
  const usernameWatch = watch('username')

  const {
    handleRegister,
    isLoading,
    usernameExists,
    isCheckingUsername
  } = useRegister({ usernameWatch })

  const PasswordRightComponent = () => {
    if (!usernameWatch) return null

    if (isCheckingUsername) return <ActivityIndicator color={colors.muted} />

    return (
      <Entypo name={usernameExists ? "cross" : 'check'} size={24} color={usernameExists ? colors.danger : colors.tint} />
    )
  }

  return (
    <Container style={styles.container}>
      <StatusBar style="auto" />

      <AuthHeader>App Name</AuthHeader>

      <ControlledInput
        control={control}
        name='name'
        placeholder='Full Name'
        containerStyle={styles.inputContainer}
        rules={{
          required: 'Name is required',
        }}
      />

      <ControlledInput
        control={control}
        name='username'
        placeholder='Username'
        containerStyle={styles.inputContainer}
        rules={{
          required: 'Username is required',
        }}
        rightComponent={
          <PasswordRightComponent />
        }
      />

      <ControlledInput
        control={control}
        containerStyle={styles.inputContainer}
        name='password'
        secureTextEntry
        placeholder='Password'
        rules={{
          required: 'Password is required',
        }}
      />

      <ControlledInput
        control={control}
        containerStyle={styles.inputContainer}
        name='confirm_password'
        secureTextEntry
        placeholder='Confirm Password'
        rules={{
          required: 'Please confirm your password',
          validate: (value: string) => (value === passwordWatch || passwordWatch === '') || "Passwords don't match",
        }}
      />

      <AuthBottomContainer>
        <ButtonPrimary
          buttonText='Create account'
          loading={isLoading}
          disabled={isLoading || usernameExists || isCheckingUsername}
          onPress={handleSubmit(handleRegister)}
        />

        <TextBody style={{ textAlign: 'center', marginTop: 25, marginBottom: 10 }}>Already have an account?</TextBody>


        <ButtonPrimary
          buttonText='Login'
          btnSecondary
          onPress={() => navigation.navigate('Login')}
        />
      </AuthBottomContainer>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20
  }
});
