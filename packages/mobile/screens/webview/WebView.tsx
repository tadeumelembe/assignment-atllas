import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackScreens } from '../../App';
import { WebView as NativeWebView } from 'react-native-webview'
import { useAuth } from '../../context/auth';

export default function WebView({ }: NativeStackScreenProps<StackScreens, 'App'>) {

  return (
    <View style={styles.container}>
      <NativeWebView
        source={{
          uri: process.env.EXPO_PUBLIC_WEBAPP_ROOT as string
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
