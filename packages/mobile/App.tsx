import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components/native';

import themes from './theme'
import { AuthProvider } from './context/auth';
import Routes from './routes';

export type StackScreens = {
  Home: undefined,
  Login: undefined,
  Register: undefined,
  App: undefined,
}

const queryClient = new QueryClient()

export const Stack = createNativeStackNavigator<StackScreens>();

const theme = themes.light

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <SafeAreaProvider>
            <NavigationContainer>
             <Routes />
            </NavigationContainer>
            <StatusBar style="auto" />
          </SafeAreaProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>

  );
}
