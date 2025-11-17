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

const DrawerNavigation = (props) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [Client, setClient] = useState(false);
  const [Name, setName] = useState('');
  const [level, setlevel] = useState('')
  const [Menus, setMenus] = useState([]);

  const toggleMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };
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
      if (name === 'client') {
        setClient(true)
      } else {
        setClient(false)
      }
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
        showMenu('Dashboard', 'Dashboard') &&
        <DrawerItem label="Dashboard" labelStyle={styles.label} icon={() => getIcon(MaterialIcons, 'dashboard')} onPress={() => props.navigation.navigate('Dashboard')} />
      }
      {
        showMenu('Home', 'Home') &&
        <TouchableOpacity onPress={() => toggleMenu('Home')} style={styles.menuRow}>
          <View style={styles.menuLeft}>
            {
              getIcon(MaterialCommunityIcons, 'home-account')
            }
            <Text style={styles.label}>Home</Text>
          </View>
          <MaterialIcons name={expandedMenu === 'Home' ? 'expand-less' : 'expand-more'} size={iconsize.sm} color="#fff" />
        </TouchableOpacity>
      }
      {showMenu('Home', 'Home') && expandedMenu === 'Home' && (
        <View style={styles.subMenu}>
          {
            showMenu('Alljobs', 'Home') && <DrawerItem label="All Jobs" labelStyle={styles.subLabel} icon={() => getIcon(FontAwesome, 'briefcase')} onPress={() => props.navigation.navigate('HomeStack', { screen: 'AllJobs' })} />
          }
          {
            showMenu('ToDo', 'Home') && <DrawerItem label="To Do" labelStyle={styles.subLabel} icon={() => getIcon(MaterialCommunityIcons, 'clipboard-list')} onPress={() => props.navigation.navigate('HomeStack', { screen: 'Todo' })} />
          }
          {
            showMenu('HomeAudit', 'Home') && <DrawerItem label="Audit" labelStyle={styles.subLabel} icon={() => getIcon(Ionicons, 'eye')} onPress={() => props.navigation.navigate('HomeStack', { screen: 'Audit' })} />
          }
          {
            showMenu('HomeCompleted', 'Home') && <DrawerItem label="Completed" labelStyle={styles.subLabel} icon={() => getIcon(FontAwesome, 'bookmark')} onPress={() => props.navigation.navigate('HomeStack', { screen: 'Completed' })} />
          }
        </View>
      )}
      {
        showMenu('MyTask', 'Home') && <DrawerItem label="My Task" labelStyle={styles.label} icon={() => getIcon(FontAwesome, 'tasks')} onPress={() => props.navigation.navigate('HomeStack', { screen: 'MyTask' })} />
      }
      {
        showMenu('Approval', 'Home') && <TouchableOpacity onPress={() => toggleMenu('Approval')} style={styles.menuRow}>
          <View style={styles.menuLeft}>
            {
              getIcon(MaterialCommunityIcons, 'lock-check')
            }
            <Text style={styles.label}>Approval</Text>
          </View>
          <MaterialIcons name={expandedMenu === 'Approval' ? 'expand-less' : 'expand-more'} size={iconsize.sm} color="#fff" />
        </TouchableOpacity>
      }
      {showMenu('Approval', 'MyApproval') && expandedMenu === 'Approval' && (
        <View style={styles.subMenu}>
          {
            showMenu('Approval Job', 'MyApproval') && <DrawerItem label="Job" labelStyle={styles.subLabel} icon={() => getIcon(MaterialCommunityIcons, 'lock-check')} onPress={() => props.navigation.navigate('ApprovalStack', { screen: 'Approvaljob' })} />
          }
          {
            showMenu('Approval SubJob', 'MyApproval') && <DrawerItem label="Sub Job" labelStyle={styles.subLabel} icon={() => getIcon(MaterialCommunityIcons, 'lock-check')} onPress={() => props.navigation.navigate('ApprovalStack', { screen: 'Approvalsubjob' })} />
          }
        </View>
      )}
      {
        showMenu('Subjob', 'Subbasic') && <TouchableOpacity onPress={() => toggleMenu('subtask')} style={styles.menuRow}>
          <View style={styles.menuLeft}>
            {
              getIcon(MaterialCommunityIcons, 'home-account')
            }
            <Text style={styles.label}>Sub Task</Text>
          </View>
          <MaterialIcons name={expandedMenu === 'subtask' ? 'expand-less' : 'expand-more'} size={iconsize.sm} color="#fff" />
        </TouchableOpacity>
      }
      {showMenu('Subjob', 'Subbasic') && expandedMenu === 'subtask' && (
        <View style={styles.subMenu}>
          {
            showMenu('SubTask', 'Subbasic') && <DrawerItem label="Job" labelStyle={styles.subLabel} icon={() => getIcon(MaterialCommunityIcons, 'file-tree')} onPress={() => props.navigation.navigate('SubTaskStack', { screen: 'SubTask' })} />
          }
          {
            showMenu('SubjobAudit', 'Subbasic') && <DrawerItem label="Audit" labelStyle={styles.subLabel} icon={() => getIcon(Ionicons, 'eye')} onPress={() => props.navigation.navigate('SubTaskStack', { screen: 'SubAudit' })} />
          }
          {
            showMenu('SubCompleted', 'Subbasic') && <DrawerItem label="Completed" labelStyle={styles.subLabel} icon={() => getIcon(FontAwesome, 'bookmark')} onPress={() => props.navigation.navigate('SubTaskStack', { screen: 'SubCompleted' })} />
          }
        </View>
      )}
      {
        showMenu('Client', 'Clients') && <DrawerItem label="Clients" labelStyle={styles.label} icon={() => getIcon(FontAwesome5, 'users')} onPress={() => props.navigation.navigate('ClientStack', { screen: 'Clients' })} />
      }
      {
        showMenu('HelpSupport', 'Dashboard') && <DrawerItem label="Support" labelStyle={styles.label} icon={() => getIcon(MaterialIcons, 'support-agent')} onPress={() => props.navigation.navigate('Supports')} />
      }
      <DrawerItem label="Logout" labelStyle={styles.label} icon={() => getIcon(FontAwesome, 'sign-out')} onPress={Logout} />
    </DrawerContentScrollView>
  );
};
export default DrawerNavigation;

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