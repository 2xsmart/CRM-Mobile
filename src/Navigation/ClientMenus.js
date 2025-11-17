import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { iconsize } from '../Constants/dimensions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Logo from './../../assets/logo.png';
import { permissions } from './Permissions';

const ClientMenus = (props) => {
  const [Name, setName] = useState('');
  const [level, setlevel] = useState('')
  const [Menus, setMenus] = useState([]);

  const getIcon = (Iconname, name) => {
    return <Iconname name={name} size={iconsize.sm} color="#fff" />;
  };
  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared!');
    } catch (e) {
      console.error('Failed to clear storage', e);
    }
  };
  const Logout = async () => {
    await clearStorage();
    props.navigation.navigate('Login');
    Toast.show({
      type: 'success',
      text1: 'Logout successful',
      text2: 'Thank You 🎉',
      visibilityTime: 1000,
    });
  };
  const getFullName = () => {
    AsyncStorage.getItem('fullname').then(name => {
      setName(name);
    }).catch((err) => {
      console.log(err);
    })
  };
  const getuserLevel = () => {
    AsyncStorage.getItem('userlevel').then(name => {
      // console.log(name);
      setlevel(name)
    }).catch((err) => {
      console.log(err);
    })
  };
  const getMenus = () => {
    AsyncStorage.getItem('Menus').then(data => {
      const menus = JSON.parse(data);
      if (menus) {
        setMenus(menus)
      } else {
        setMenus([])
      }
      // console.log(menus);
    }).catch((err) => {
      console.log(err);
    })
  };
  const showMenu = (name, menu) => {
    return Menus.includes(name) && permissions[menu].includes(level)
  }
  useEffect(() => {
    getFullName()
    getuserLevel()
    getMenus()
  }, [props.state.history])
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.headerbox}>
        <View style={styles.headerbox1}>
          <Image
            source={Logo}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.username}>{Name || ''}</Text>
      </View>
      {
        showMenu('Dashboard', 'ClientDashboard') &&
        <DrawerItem label="Dashboard" labelStyle={styles.label} icon={() => getIcon(MaterialIcons, 'dashboard')} onPress={() => props.navigation.navigate('ClientDashboard')} />
      }
      {
        showMenu('Dashboard', 'ClientDashboard') &&
        <DrawerItem label="All Jobs" labelStyle={styles.label} icon={() => getIcon(FontAwesome, 'briefcase')} onPress={() => props.navigation.navigate('ClientJobs')} />
      }
      {
        showMenu('Dashboard', 'ClientDashboard') &&
        <DrawerItem label="Audit" labelStyle={styles.label} icon={() => getIcon(Ionicons, 'eye')} onPress={() => props.navigation.navigate('ClientAudit')} />
      }
      {
        showMenu('Dashboard', 'ClientDashboard') &&
        <DrawerItem label="Completed" labelStyle={styles.label} icon={() => getIcon(FontAwesome, 'bookmark')} onPress={() => props.navigation.navigate('ClientCompleted')} />
      }
      <DrawerItem label="Logout" labelStyle={styles.label} icon={() => getIcon(FontAwesome, 'sign-out')} onPress={Logout} />
    </DrawerContentScrollView>
  );
};
export default ClientMenus;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#204D74',
    // paddingTop: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  menuRow: {
    height: 53,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    // backgroundColor: 'green'
  },
  headerbox: {
    height: 60,
    width: '100%',
    // backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderColor: 'white',
    borderBottomWidth: 1
  },
  headerbox1: {
    width: 40,
    height: 40,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: 'white',
    alignItems: 'center',
    borderColor: '#FF5C01',
    borderWidth: 1
  },
  image: {
    width: '60%',
    height: '100%'
  },
  username: {
    width: '70%',
    color: '#fff',
    fontSize: 18,
    fontStyle: 'italic'
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  subMenu: {
    marginLeft: 40,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.2)',
  },
  subLabel: {
    color: '#ddd',
    fontSize: 15,
  },
});