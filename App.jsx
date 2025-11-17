import React from 'react';
import { StatusBar, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerScreens from './src/Navigation/DrawerScreens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, { BaseToast } from 'react-native-toast-message';
// Global 
import Login from './src/Screens/Login';
import Authenticate from './src/Screens/Authenticate';
import ClientDrawer from './src/Navigation/ClientDrawer';


const Stack = createNativeStackNavigator();

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green', flexDirection: 'row', alignItems: 'center' }}
      contentContainerStyle={{ paddingHorizontal: 15, flex: 1 }}
      text1Style={{ fontSize: 15, fontWeight: 'bold' }}
      text2Style={{ fontSize: 13, color: '#555' }}
      renderTrailingIcon={() => (
        <TouchableOpacity onPress={() => Toast.hide()}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', paddingHorizontal: 18 }}>✕</Text>
        </TouchableOpacity>
      )}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'red', flexDirection: 'row', alignItems: 'center',
      }}
      contentContainerStyle={{
        paddingHorizontal: 15, flex: 1
      }
      }
      text1Style={{ fontSize: 15, fontWeight: 'bold' }}
      text2Style={{ fontSize: 13, color: '#555' }}
      renderTrailingIcon={() => (
        <TouchableOpacity onPress={() => Toast.hide()}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', paddingHorizontal: 18 }}>✕</Text>
        </TouchableOpacity>
      )}
    />
  ),
};

// Main App
const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="Authenticate" component={Authenticate} options={{ headerShown: false }} />
              <Stack.Screen name="MainDrawer" component={DrawerScreens} options={{ headerShown: false }} />
              <Stack.Screen name="ClientDrawer" component={ClientDrawer} options={{ headerShown: false }} />
            </Stack.Navigator>
            <Toast config={toastConfig} visibilityTime={2000} />
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </>
  );
}
export default App;
