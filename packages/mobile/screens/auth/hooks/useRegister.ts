import { useMutation } from "@tanstack/react-query"
import { ApiResponse, IUser } from "../../../types";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../../context/auth";

export interface SignUpForm {
    username: string,
    password: string
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


const useRegister = () => {
    const {
        signIn
    } = useAuth()

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

    const handleRegister = (data: SignUpForm) => logInMutation.mutate(data);

    return {
        handleRegister,
        isLoading: logInMutation.isPending
    }
}

export default useRegister