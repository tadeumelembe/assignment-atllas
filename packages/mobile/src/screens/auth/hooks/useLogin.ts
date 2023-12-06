import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ApiResponse, IUser } from '../../../../types';
import { useAuth } from '../../../context/auth';
import { useState } from 'react';

export interface SignInForm {
  username: string,
  password: string
}

interface LoginResponse extends ApiResponse {
  data: {
    token: string,
    user: {
      displayName: string;
      username: string;
    }
  }
}

export default function useLogin() {
  const { signIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  
  const logInMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: (data: SignInForm) => {
      return axios.post<LoginResponse>(`${process.env.EXPO_PUBLIC_BACKEND_HOST}auth/login`, data)
    },
    onSuccess: ({ data }) => {
      const user: IUser = {
        token: data.data.token,
        displayName: data.data.user.displayName,
        username: data.data.user.username
      }
      signIn(user)
    },
    onError: (err: AxiosError<ApiResponse>) => {
      alert(err.response?.data?.message || 'Something went wrong, try again')
      console.log(err, err?.response?.data)
    },
  })

  const handleLogin = (data: SignInForm) => logInMutation.mutate(data);

  return {
    handleLogin,
    showPassword,
    setShowPassword,
    isLoading: logInMutation.isPending
  }
}