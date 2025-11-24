import React from 'react';
import Logo from './../../assets/logo.png';
import { Image, StyleSheet } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigation from './DrawerNavigation';
import Dashboard from '../Screens/Management/Dashboard';
import AllJobs from '../Screens/Management/Home/AllJobs';
import Todo from '../Screens/Management/Home/Todo';
import Audit from '../Screens/Management/Home/Audit';
import Completed from '../Screens/Management/Home/Completed';
import MyTask from '../Screens/Management/MyTask';
import ApprovalJob from '../Screens/Management/Approval/ApprovalJob';
import ApprovalSubJob from '../Screens/Management/Approval/ApprovalSubJob';
import SubTask from '../Screens/Management/Sub Jobs/SubTask';
import SubAudit from '../Screens/Management/Sub Jobs/SubAudit';
import SubCompleted from '../Screens/Management/Sub Jobs/SubCompleted';
import Clients from '../Screens/Management/Clients/Clients';
import Supports from '../Screens/Management/Supports';
import ClientForm from '../Screens/Management/Clients/ClientForm';
import JobForm from '../Screens/Management/Home/JobForm';
import SubJobForm from '../Screens/Management/Sub Jobs/SubJobForm';
import ApprovalJobForm from '../Screens/Management/Approval/ApprovalJobForm';
import ApprovalSubJobForm from '../Screens/Management/Approval/ApprovalSubJobForm';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AllJobs" component={AllJobs} />
    <Stack.Screen name="Todo" component={Todo} />
    <Stack.Screen name="Audit" component={Audit} />
    <Stack.Screen name="Completed" component={Completed} />
    <Stack.Screen name="MyTask" component={MyTask} />
    <Stack.Screen name="JobForm" component={JobForm} />
  </Stack.Navigator>
);
const ApprovalStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Approvaljob" component={ApprovalJob} />
    <Stack.Screen name="Approvalsubjob" component={ApprovalSubJob} />
    <Stack.Screen name="ApprovalJobForm" component={ApprovalJobForm} />
    <Stack.Screen name="ApprovalSubJobForm" component={ApprovalSubJobForm} />
  </Stack.Navigator>
);
const SubTaskStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SubTask" component={SubTask} />
    <Stack.Screen name="SubAudit" component={SubAudit} />
    <Stack.Screen name="SubCompleted" component={SubCompleted} />
    <Stack.Screen name="SubJobForm" component={SubJobForm} />
  </Stack.Navigator>
);
const ClientStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Clients" component={Clients} />
    <Stack.Screen name="ClientForm" component={ClientForm} />
  </Stack.Navigator>
);

const DrawerScreens = () => {

  const SubmenuNames = {
    AllJobs: 'All Jobs',
    Todo: 'To do',
    Audit: 'Audit',
    Completed: 'Completed',
    MyTask: 'My Task',
    JobForm: 'Job Form',
    Approvaljob: 'Job',
    Approvalsubjob: 'Sub Job',
    ApprovalJobForm: 'Approval Form',
    ApprovalSubJobForm: 'Approval Sub Job',
    SubTask: 'Job',
    SubAudit: 'Audit',
    SubCompleted: 'Job Details',
    SubJobForm: 'SubJob Form',
    Clients: 'Client',
    ClientForm: 'Client Form',
  }
  const getHeaderNames = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    return { title: SubmenuNames[routeName] };
  };
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerNavigation {...props} />} screenOptions={{ headerRight: () => (<Image source={Logo} style={styles.logo} resizeMode="contain" />), headerStyle: { backgroundColor: '#FFF' }, drawerStyle: { width: 250, backgroundColor: '#204D74' }, }}>
      <Drawer.Screen name="Dashboard" component={Dashboard} options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="HomeStack" component={HomeStack} options={({ route }) => getHeaderNames(route)} />
      <Drawer.Screen name="ApprovalStack" component={ApprovalStack} options={({ route }) => getHeaderNames(route)} />
      <Drawer.Screen name="SubTaskStack" component={SubTaskStack} options={({ route }) => getHeaderNames(route)} />
      <Drawer.Screen name="ClientStack" component={ClientStack} options={({ route }) => getHeaderNames(route)} />
      <Drawer.Screen name="Supports" component={Supports} options={{ title: 'Support' }} />
    </Drawer.Navigator>
  );
}

export default DrawerScreens;

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 40,
  },
});