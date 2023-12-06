import { useMutation } from "@tanstack/react-query"
import { ApiResponse, IUser } from "../../../../types";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../../context/auth";
import { useEffect, useState } from "react";

export interface SignUpForm {
    name: string,
    username: string,
    password: string,
    confirm_password?: string
}

interface RegisterResponse extends ApiResponse {
    data: {
        token: string,
        user: {
            displayName: string;
            username: string;
        }
    }
}

interface UseRegisterProps {
    usernameWatch: string
}

const useRegister = ({ usernameWatch }: UseRegisterProps) => {
    const {
        signIn
    } = useAuth()
    const [usernameExists, setUsernameExists] = useState(false);

    const checkUsernameMutation = useMutation({
        mutationKey: ['login'],
        mutationFn: () => {
            const params = {
                username: usernameWatch
            }
            return axios.post<ApiResponse>(`${process.env.EXPO_PUBLIC_BACKEND_HOST}auth/checkUsername`, params)
        },
        onSuccess: ({ data }) => {
            if (data.success) setUsernameExists(true);

        },
        onError: (err: AxiosError<ApiResponse>) => {
            if (err.response?.data.message === 'username not found') setUsernameExists(false)
            //dadasdalert(err.response?.data?.message || 'Something went wrong, try again')
            console.log(err, err?.response?.data)
        },
    })

    useEffect(() => {
        if (!usernameWatch) return;
        const debounceTimeout = setTimeout(async () => {
            checkUsernameMutation.mutate()
        }, 500); // Adjust the debounce time as needed (e.g., 300, 500, etc.)

        return () => clearTimeout(debounceTimeout);
    }, [usernameWatch]);


    const logInMutation = useMutation({
        mutationKey: ['login'],
        mutationFn: (data: SignUpForm) => {
            return axios.post<RegisterResponse>(`${process.env.EXPO_PUBLIC_BACKEND_HOST}auth/register`, data)
        },
        onSuccess: ({ data }) => {
            console.log(data.data.token)
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





    const handleRegister = (data: SignUpForm) => {
        delete data.confirm_password
        logInMutation.mutate(data)
    };

    return {
        handleRegister,
        usernameExists,
        isCheckingUsername: checkUsernameMutation.isPending,
        isLoading: logInMutation.isPending
    }
}

export default useRegister