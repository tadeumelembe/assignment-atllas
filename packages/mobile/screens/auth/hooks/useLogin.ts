import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React from 'react'
import { ApiResponse } from '../../../types';
import { User, useAuth } from '../../../context/auth';

export interface SignInForm {
  username: string,
  password: string
}

interface LoginResponse extends ApiResponse {
  data: {
    token: string,
    user: {
      displayName: string;
    }
  }
}

export default function useLogin() {
  const { signIn } = useAuth()
  const logInMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: (data: SignInForm) => {
      return axios.post<LoginResponse>(`${process.env.EXPO_PUBLIC_BACKEND_HOST}auth/login`, data)
    },
    onSuccess: ({ data }) => {
      const user: User = {
        token: data.data.token,
        displayName: data.data.user.displayName
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
    isLoading: logInMutation.isPending
  }
}