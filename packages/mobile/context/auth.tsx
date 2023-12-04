import { createContext, useContext, useEffect, useMemo, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface IUser {
    displayName: string;
    token: string;
}

interface AuthContextI {
    user: IUser | null;
    signIn: (user: IUser) => Promise<void>;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextI>({} as AuthContextI)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        signOut()
    }, [])

    const signIn = async (user: IUser) => {
        setUser(user)
        return await AsyncStorage.setItem('@TakeHome_user', JSON.stringify(user))
    }

    async function signOut() {
        try {
            setIsLoading(true)

            setUser(null)

            return await AsyncStorage.removeItem('@TakeHome_user')

        } catch (error) {
            alert('Something went wrong')
        } finally {
            setIsLoading(false)
        }
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
            isLoading
        }), [user, isLoading, signIn]
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