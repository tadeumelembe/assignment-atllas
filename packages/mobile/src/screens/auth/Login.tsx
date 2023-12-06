import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';

import { StackScreens } from '../../../App';
import { ControlledInput } from '../../components/Input';
import useLogin, { SignInForm } from './hooks/useLogin';
import { ButtonPrimary } from '../../components/Button';
import { AuthBottomContainer, AuthHeader, Container, TextBody } from '../../components/styledComponents';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';

export default function Login({ navigation }: NativeStackScreenProps<StackScreens, 'Login'>) {
  const { colors } = useTheme()
  const { control, handleSubmit } = useForm<SignInForm>({
    defaultValues: {
      username: '',
      password: '',
    }
  });

  const {
    handleLogin,
    setShowPassword,
    showPassword,
    isLoading
  } = useLogin()


  const PasswordRightComponent = () => {
    return (
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Entypo name={showPassword ? "eye" : 'eye-with-line'} size={24} color={!showPassword ? colors.muted : colors.tint} />
      </TouchableOpacity>
    )
  }


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
      <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} showsHorizontalScrollIndicator={false} >

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
            secureTextEntry={!showPassword}
            placeholder='Password'
            rules={{
              required: 'Password is required',
            }}
            rightComponent={
              <PasswordRightComponent />
            }
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
      </ScrollView>
    </KeyboardAvoidingView>
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
