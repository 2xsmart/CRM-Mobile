import React from 'react';
import Logo from './../../assets/logo.png';
import { Image, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ClientDashboard from '../Screens/Clients/ClientDashboard';
import ClientJobs from '../Screens/Clients/ClientJobs';
import ClientAudit from '../Screens/Clients/ClientAudit';
import ClientCompleted from '../Screens/Clients/ClientCompleted';
import ClientMenus from './ClientMenus';

const Drawer = createDrawerNavigator();

const ClientDrawer = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <ClientMenus {...props} />} screenOptions={{ headerRight: () => (<Image source={Logo} style={styles.logo} resizeMode="contain" />), headerStyle: { backgroundColor: '#FFF' }, drawerStyle: { width: 250, backgroundColor: '#204D74' }, }}>
      <Drawer.Screen name="ClientDashboard" component={ClientDashboard} options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="ClientJobs" component={ClientJobs} options={{ title: 'Jobs' }} />
      <Drawer.Screen name="ClientAudit" component={ClientAudit} options={{ title: 'Audit' }} />
      <Drawer.Screen name="ClientCompleted" component={ClientCompleted} options={{ title: 'Completed' }} />
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