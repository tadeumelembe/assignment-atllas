import { createContext, useContext, useEffect, useMemo, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse, IUser } from "../../types";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

interface AuthContextI {
    user: IUser | null;
    signIn: (user: IUser) => Promise<void>;
    signOut: () => Promise<AxiosResponse<any, any> | undefined>;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextI>({} as AuthContextI)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const logInMutation = useMutation({
        mutationKey: ['login'],
        mutationFn: () => {
            return axios.post(`${process.env.EXPO_PUBLIC_BACKEND_HOST}auth/logout`)
        },
        onSuccess: async ({ data }) => {
            setUser(null)
            setIsLoading(false)

            await AsyncStorage.removeItem('@TakeHome_user')

        },
        onError: (err: AxiosError<ApiResponse>) => {
            setIsLoading(false)
            alert(err.response?.data?.message || 'Something went wrong, try again')
            console.log(err, err?.response?.data)
        },
    })

    useEffect(() => {
        restoreUser()
    }, [])

    const signIn = async (user: IUser) => {
        setUser(user)
        return await AsyncStorage.setItem('@TakeHome_user', JSON.stringify(user))
    }

    async function signOut() {
        if (user?.token) {
            setIsLoading(true)
            return logInMutation.mutateAsync();
        }

        setUser(null)
        await AsyncStorage.removeItem('@TakeHome_user')
    }

    async function restoreUser() {
        const storedUser = await AsyncStorage.getItem('@TakeHome_user');

        if (storedUser) {
            const parsedUser: IUser = JSON.parse(storedUser)
            await signIn(parsedUser)

        } else {
            await signOut()
        }
        setIsLoading(false)
    }

    const memorizedValues = useMemo(
        () => ({
            user,
            signIn,
            signOut,
            isLoading
        }), [user, isLoading, signOut, signIn]
    )

    return (
        <AuthContext.Provider value={memorizedValues}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}