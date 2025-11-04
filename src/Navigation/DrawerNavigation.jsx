import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { iconsize } from '../Constants/dimensions';
const DrawerNavigation = (props) => {
  const [showHomeSubmenu, setShowHomeSubmenu] = useState(false);
  const [showSubJobsSubmenu, setShowSubJobsSubmenu] = useState(false);
  const [Client, setClient] = useState(false);
  const [Name, setName] = useState('')


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
    }).catch((err) => {
      console.log(err);
    })
  };
  useEffect(() => {
    getFullName()
    getuserLevel()
  }, [props.state.history])
  return (
    <>
      {
        <DrawerContentScrollView >
          <View style={styles.headerbox}>
            <View style={{ width: 50, height: 50, borderRadius: 40, overflow: 'hidden', backgroundColor: 'white', alignItems: 'center', borderColor: '#FF5C01', borderWidth: 1 }}>
              <Image
                source={require('../../assets/logo.png')}
                style={{ width: '60%', height: '100%' }}
                resizeMode="contain"
              />
            </View>
            <Text style={{ width: '70%', color: '#fff', fontSize: 18, fontStyle: 'italic' }}>{Name || ''}</Text>
          </View>
          {
            Client ?
              // Client Side
              <View>
                <TouchableOpacity>
                  <View>
                    <DrawerItem label='Dashboard' labelStyle={styles.white} icon={() => <MaterialIcons name={'dashboard'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('ClientDashboard') }} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View>
                    <DrawerItem label='Jobs' labelStyle={styles.white} icon={() => <FontAwesome name={'briefcase'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('ClientJobs') }} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View>
                    <DrawerItem label='Audit' labelStyle={styles.white} icon={() => <Ionicons name={'eye'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('ClientAudit') }} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View>
                    <DrawerItem label='Completed' labelStyle={styles.white} icon={() => <FontAwesome name={'bookmark'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('ClientCompleted') }} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View>
                    <DrawerItem label='Logout' labelStyle={styles.white} icon={() => <FontAwesome name={'sign-out'} size={iconsize.sm} color="#fff" />} onPress={Logout} />
                  </View>
                </TouchableOpacity>
              </View> :
              // Management Side
              <View>
                <TouchableOpacity>
                  <DrawerItem label='Dashboard' labelStyle={styles.white} icon={() => <MaterialIcons name={'dashboard'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('Dashboard') }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowHomeSubmenu(!showHomeSubmenu); setShowSubJobsSubmenu(false); }}>
                  <View style={styles.menuItem}>
                    <View style={{ width: '70%' }}>
                      <DrawerItem label={'Home'} labelStyle={styles.white} icon={() => (<MaterialCommunityIcons name={'home-account'} size={iconsize.sm} color="#fff" />)} onPress={() => { setShowHomeSubmenu(!showHomeSubmenu); setShowSubJobsSubmenu(false); }} />
                    </View>
                    <View >
                      <MaterialIcons name={showHomeSubmenu ? 'expand-less' : 'expand-more'} size={iconsize.sm} style={styles.showmenu} color="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  {
                    showHomeSubmenu && (
                      <View style={styles.submenu}>
                        <DrawerItem label='All Jobs' labelStyle={styles.white} icon={() => <FontAwesome name={'briefcase'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('AllJobs') }} />
                        <DrawerItem label='To Do' labelStyle={styles.white} icon={() => <MaterialCommunityIcons name={'altimeter'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('Todo') }} />
                        <DrawerItem label='Audit' labelStyle={styles.white} icon={() => <Ionicons name={'eye'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('Audit') }} />
                        <DrawerItem label='Completed' labelStyle={styles.white} icon={() => <FontAwesome name={'bookmark'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('Completed') }} />
                      </View>
                    )
                  }
                </TouchableOpacity>
                <TouchableOpacity>
                  <View>
                    <DrawerItem label='My Task' labelStyle={styles.white} icon={() => <FontAwesome name={'tasks'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('MyTask') }} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View>
                    <DrawerItem label='My Approval' labelStyle={styles.white} icon={() => <MaterialCommunityIcons name={'lock-check'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('MyApproval') }} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowSubJobsSubmenu(!showSubJobsSubmenu); setShowHomeSubmenu(false) }}>
                  <View style={styles.menuItem}>
                    <View style={{ width: '70%' }}>
                      <DrawerItem label='Sub Jobs' labelStyle={styles.white} icon={() => <MaterialCommunityIcons name={'home-account'} size={iconsize.sm} color="#fff" />} onPress={() => { setShowSubJobsSubmenu(!showSubJobsSubmenu); setShowHomeSubmenu(false) }} />
                    </View>
                    <View>
                      <MaterialIcons name={showSubJobsSubmenu ? 'expand-less' : 'expand-more'} size={iconsize.sm} style={styles.showmenu} color="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  {
                    showSubJobsSubmenu && (
                      <View style={styles.submenu}>
                        <DrawerItem label='Sub Jobs' labelStyle={styles.white} icon={() => <MaterialCommunityIcons name={'file-tree'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('SubTask') }} />
                        <DrawerItem label='Audit' labelStyle={styles.white} icon={() => <Ionicons name={'eye'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('SubAudit') }} />
                        <DrawerItem label='Completed' labelStyle={styles.white} icon={() => <FontAwesome name={'bookmark'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('SubCompleted') }} />
                      </View>
                    )
                  }
                </TouchableOpacity>
                <TouchableOpacity>
                  <View>
                    <DrawerItem label='Clients' labelStyle={styles.white} icon={() => <FontAwesome5 name={'users'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('Clients') }} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View>
                    <DrawerItem label='support' labelStyle={styles.white} icon={() => <MaterialIcons name={'support-agent'} size={iconsize.sm} color="#fff" />} onPress={() => { props.navigation.navigate('Supports') }} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View>
                    <DrawerItem label='Logout' labelStyle={styles.white} icon={() => <FontAwesome name={'sign-out'} size={iconsize.sm} color="#fff" />} onPress={Logout} />
                  </View>
                </TouchableOpacity>
              </View>
          }


        </DrawerContentScrollView>
      }

    </>

  )
}

export default DrawerNavigation

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuIcon: {
    marginLeft: 18
  },
  menuLabel: {
    marginLeft: 10
  },
  showmenu: {
    marginLeft: 50
  },
  submenu: {
    marginLeft: 40
  },
  white: {
    color: '#fff'
  },
  headerbox: {
    height: 80,
    width: '100%',
    // backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderColor: 'white',
    borderBottomWidth: 1
  }

})