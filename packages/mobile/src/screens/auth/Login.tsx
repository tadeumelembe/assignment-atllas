import { StatusBar } from 'expo-status-bar';
import { StyleSheet, } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';

import { StackScreens } from '../../../App';
import { ControlledInput } from '../../components/Input';
import useLogin, { SignInForm } from './hooks/useLogin';
import { ButtonPrimary } from '../../components/Button';
import { AuthBottomContainer, AuthHeader, Container, TextBody } from '../../components/styledComponents';

export default function Login({ navigation }: NativeStackScreenProps<StackScreens, 'Login'>) {

  const { control, handleSubmit } = useForm<SignInForm>({
    defaultValues: {
      username: '',
      password: '',
    }
  });

  const {
    handleLogin,
    isLoading
  } = useLogin()

  return (
    <Container style={[styles.container]}>
      <StatusBar style="auto" />

      <AuthHeader>App Name</AuthHeader>

      <ControlledInput
        control={control}
        name='username'
        placeholder='Username'
        containerStyle={styles.inputContainer}
        rules={{
          required: 'Username is required',
        }}
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

      <AuthBottomContainer>
        <ButtonPrimary
          buttonText='Login'
          loading={isLoading}
          disabled={isLoading}
          onPress={handleSubmit(handleLogin)}
        />

        <TextBody style={{ textAlign: 'center', marginTop: 25, marginBottom: 10 }}>Don't have an account?</TextBody>

        <ButtonPrimary
          buttonText='Create account'
          btnSecondary
          onPress={() => navigation.navigate('Register')}
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
