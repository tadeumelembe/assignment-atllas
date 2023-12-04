import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from '../screens/auth/Login';
import Home from '../screens/home/Home';
import Register from '../screens/auth/Register';
import WebView from '../screens/webview/WebView';
import { useAuth } from "../context/auth";
import { Container } from "../components/styledComponents";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components/native";

export type StackScreens = {
    Home: undefined,
    Login: undefined,
    Register: undefined,
    App: undefined,
}

export type AppStackScreens = {
    Home: undefined,
    App: undefined,
}

export const AuthStack = createNativeStackNavigator<StackScreens>();
export const AppStack = createNativeStackNavigator<AppStackScreens>();

function AuthRoutes() {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <AuthStack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        </AuthStack.Navigator>
    )
}

function AppRoutes() {
    return (
        <AppStack.Navigator>
            <AppStack.Screen name="App" component={WebView} />
            <AppStack.Screen name="Home" component={Home} />
        </AppStack.Navigator>
    )
}

const Routes: React.FC<any> = () => {
    const { colors } = useTheme()
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={colors.tint} size={"large"} />
            </Container>
        )
    }

    return user?.token ? <AppRoutes /> : <AuthRoutes />;

};

export default Routes;