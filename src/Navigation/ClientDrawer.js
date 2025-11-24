import React from 'react';
import Logo from './../../assets/logo.png';
import { Image, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ClientDashboard from '../Screens/Clients/ClientDashboard';
import ClientJobs from '../Screens/Clients/Home/ClientJobs';
import ClientMenus from './ClientMenus';
import ClientAudit from '../Screens/Clients/Home/ClientAudit';
import ClientCompleted from '../Screens/Clients/Home/ClientCompleted';
import ClientJobForm from '../Screens/Clients/Home/ClientJobForm';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const ClientStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClientJobs" component={ClientJobs} />
    <Stack.Screen name="ClientAudit" component={ClientAudit} />
    <Stack.Screen name="ClientCompleted" component={ClientCompleted} />
    <Stack.Screen name="ClientJobForm" component={ClientJobForm} />
  </Stack.Navigator>
);
const MenuNames = {
  ClientJobs: 'Jobs',
  ClientAudit: 'Audit',
  ClientCompleted: 'Completed',
  ClientJobForm: 'Job Form'
}
const getHeaderNames = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  return { title: MenuNames[routeName] };
};
const ClientDrawer = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <ClientMenus {...props} />} screenOptions={{ headerRight: () => (<Image source={Logo} style={styles.logo} resizeMode="contain" />), headerStyle: { backgroundColor: '#FFF' }, drawerStyle: { width: 250, backgroundColor: '#204D74' }, }}>
      <Drawer.Screen name="ClientDashboard" component={ClientDashboard} options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="ClientStack" component={ClientStack} options={({ route }) => getHeaderNames(route)} />
    </Drawer.Navigator>
  );
}

export default ClientDrawer;

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 40,
  },
});