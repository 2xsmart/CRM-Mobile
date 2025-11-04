import React from 'react';
import { Text, TouchableOpacity, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { createDrawerNavigator } from '@react-navigation/drawer'
import DrawerNavigation from './src/Navigation/DrawerNavigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Image } from 'react-native';
import Toast, { BaseToast } from 'react-native-toast-message';
// Global 
import Login from './src/Screens/Login'

// Management
import Dashboard from './src/Screens/Management/Dashboard'
import MyTask from './src/Screens/Management/MyTask'
import AllJobs from './src/Screens/Management/Home/AllJobs'
import Todo from './src/Screens/Management/Home/Todo'
import Audit from './src/Screens/Management/Home/Audit'
import Completed from './src/Screens/Management/Home/Completed'
import SubTask from './src/Screens/Management/Sub Jobs/SubTask'
import SubAudit from './src/Screens/Management/Sub Jobs/SubAudit'
import SubCompleted from './src/Screens/Management/Sub Jobs/SubCompleted'
import MyApproval from './src/Screens/Management/Approval/MyApproval';
import Clients from './src/Screens/Management/Clients/Clients'
import Supports from './src/Screens/Management/Supports'
import JobForm from './src/Screens/Management/Home/JobForm';
import SubJobForm from './src/Screens/Management/Sub Jobs/SubJobForm';
import ApprovalJobForm from './src/Screens/Management/Approval/ApprovalJobForm';
import ClientForm from './src/Screens/Management/Clients/ClientForm';

// Clients
import ClientDashboard from './src/Screens/Clients/ClientDashboard';
import Jobs from './src/Screens/Clients/Jobs';
import ClientAudit from './src/Screens/Clients/ClientAudit';
import ClientCompleted from './src/Screens/Clients/ClientCompleted';
import Settings from './src/Screens/Management/Settings';



const Drawer = createDrawerNavigator();

const App = () => {
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
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <NavigationContainer>
            <Drawer.Navigator drawerContent={(props) => <DrawerNavigation {...props} />} screenOptions={{
              headerRight: () => (
                <Image source={require('./assets/logo.png')} style={{ width: 100, height: 30 }} resizeMode="contain" />
              ),
              headerShown: true, headerTitle: '', drawerStyle: { width: 250, backgroundColor: '#204D74', borderTopRightRadius: 0, borderBottomRightRadius: 0 }
            }}>
              <Drawer.Screen name='Login' component={Login} options={{ headerShown: false }} />

              <Drawer.Screen name='Dashboard' component={Dashboard} options={{ headerTitle: 'Dashboard' }} />
              <Drawer.Screen name='AllJobs' component={AllJobs} options={{ headerTitle: 'All Jobs' }} />
              <Drawer.Screen name='Todo' component={Todo} options={{ headerTitle: 'Todo' }} />
              <Drawer.Screen name='Audit' component={Audit} options={{ headerTitle: 'Audit' }} />
              <Drawer.Screen name='Completed' component={Completed} options={{ headerTitle: 'Completed' }} />
              <Drawer.Screen name='JobForm' component={JobForm} options={{ headerTitle: 'Job Details' }} />
              <Drawer.Screen name='SubTask' component={SubTask} options={{ headerTitle: 'Sub Task' }} />
              <Drawer.Screen name='SubAudit' component={SubAudit} options={{ headerTitle: 'Audit' }} />
              <Drawer.Screen name='SubCompleted' component={SubCompleted} options={{ headerTitle: 'Completed' }} />
              <Drawer.Screen name='SubJobForm' component={SubJobForm} options={{ headerTitle: 'Sub Job Details' }} />
              <Drawer.Screen name='MyTask' component={MyTask} options={{ headerTitle: 'My Task' }} />
              <Drawer.Screen name='MyApproval' component={MyApproval} options={{ headerTitle: 'My Approval' }} />
              <Drawer.Screen name='ApprovalJob' component={ApprovalJobForm} options={{ headerTitle: 'Approval Details' }} />
              <Drawer.Screen name='Clients' component={Clients} options={{ headerTitle: 'Clients' }} />
              <Drawer.Screen name='ClientForm' component={ClientForm} options={{ headerTitle: 'Client Details' }} />
              <Drawer.Screen name='Settings' component={Settings} />
              <Drawer.Screen name='Supports' component={Supports} options={{ headerTitle: 'Supports' }} />

              <Drawer.Screen name='ClientDashboard' component={ClientDashboard} />
              <Drawer.Screen name='ClientJobs' component={Jobs} />
              <Drawer.Screen name='ClientAudit' component={ClientAudit} />
              <Drawer.Screen name='ClientCompleted' component={ClientCompleted} />
            </Drawer.Navigator>
            <Toast config={toastConfig} visibilityTime={2000} />
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </>
  )
}

export default App
