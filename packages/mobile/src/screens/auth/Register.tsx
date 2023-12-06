import { StatusBar } from 'expo-status-bar';
import { StyleSheet, } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';

import { StackScreens } from '../../../App';
import { AuthBottomContainer, AuthHeader, Container, TextBody } from '../../components/styledComponents';
import { ControlledInput } from '../../components/Input';
import useRegister, { SignUpForm } from './hooks/useRegister';
import { ButtonPrimary } from '../../components/Button';

export default function Register({ navigation }: NativeStackScreenProps<StackScreens, 'Register'>) {

  const { control, handleSubmit, watch } = useForm<SignUpForm>({
    defaultValues: {
      username: '',
      name:'',
      password: '',
      confirm_password: '',
    }
  });

  const passwordWatch = watch('password')

  const {
    handleRegister,
    isLoading
  } = useRegister()

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
          disabled={isLoading}
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
