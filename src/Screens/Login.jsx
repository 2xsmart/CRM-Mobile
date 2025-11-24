import { StyleSheet, Text, View, ImageBackground, Image, Modal, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity, BackHandler } from 'react-native';
import { TextInput } from 'react-native-paper';
import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { iconsize } from '../Constants/dimensions';
import api from '../Plugins/axios';
import ReactNativeBiometrics from 'react-native-biometrics';
import Fontisto from 'react-native-vector-icons/Fontisto';

const Login = ({ navigation }) => {
  const [showPassword, setshowPassword] = useState(true)
  const [Data, setData] = useState({});
  const [UnlockBox, setUnlockBox] = useState(false);
  const rnBiometrics = new ReactNativeBiometrics();

  const CheckBiometrics = async () => {
    return rnBiometrics.isSensorAvailable()
      .then(({ available, biometryType }) => {
        if (available && biometryType === ReactNativeBiometrics.FaceID) {
          console.log('Face ID supported');
          return true
        } else if (available) {
          console.log('Biometric supported (fingerprint or iris)');
          return true
        } else {
          console.log('No biometric hardware available');
          return false
        }
      });
  };
  const authenticate = async () => {
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to continue',
        fallbackPromptMessage: 'Use device password',
        allowDeviceCredentials: true,
      });
      if (!success) {
        console.log('Prompt closed — retrying...');
        setUnlockBox(true)
      } else {
        console.log('✅ Authenticated successfully!');
        setUnlockBox(false)
        const localStorage = await fetchData();
        navigate(localStorage.userlevel);
      }
    } catch (error) {
      console.log('Biometric prompt error:', error);
      setUnlockBox(true)
      BackHandler.exitApp();
      // You can retry or exit app here
    }
  };
  const Mobileauthentication = async () => {
    const result = await CheckBiometrics();
    // console.log(result);  // true or false
    return result
  };
  const handleInput = (key, value) => {
    setData(prev => ({
      ...prev, [key]: value
    }))

  };
  const handlesubmit = async () => {
    if (Data.email && Data.password) {
      await api.post('/login', Data).then(res => {
        const loginData = res.data
        if (loginData && loginData.token && loginData.userLevel) {
          const fullname = `${loginData.firstName} ${loginData.lastName}`
          AsyncStorage.setItem('authToken', loginData.token)
          AsyncStorage.setItem('fname', loginData.firstName)
          AsyncStorage.setItem('lname', loginData.lastName)
          AsyncStorage.setItem('fullname', fullname)
          AsyncStorage.setItem('email', loginData.email)
          AsyncStorage.setItem('client', String(loginData.client))
          AsyncStorage.setItem('userlevel', loginData.userLevel)
          AsyncStorage.setItem('userId', String(loginData.id))
          AsyncStorage.setItem('Application', loginData.Application)
          setData({})
          menuItems()
          if (loginData.userLevel === 'client') {
            Toast.show({
              type: 'success',
              text1: 'Login successful 🎉',
              text2: 'Welcome to the Client Dashboard',
              visibilityTime: 1000,
            });
            navigation.reset({
              index: 0,
              routes: [{ name: 'ClientDrawer' }]
            });
          } else {
            Toast.show({
              type: 'success',
              text1: 'Login successful 🎉',
              text2: 'Welcome to the Dashboard',
              visibilityTime: 1000,
            });
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainDrawer' }],
            });
          }
        }
        else {
          Toast.show({
            type: 'error',
            text1: 'Login failed',
            text2: 'Check E-Mail Id and password'
          });
        }
      }).catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: 'Check E-Mail Id and password'
        });

      })

    }
    else {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Enter E-Mail Id and password'
      });
    }
  };
  const menuItems = async () => {
    const response = await api.get('/logo/standard/0')
    const data = response.data.filter(obj => obj.Value === 1).map(obj => obj.Name)
    AsyncStorage.setItem('Menus', JSON.stringify(data))
  };
  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared!');
    } catch (e) {
      console.error('Failed to clear storage', e);
    }
  };
  const fetchData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      const allData = Object.fromEntries(items);
      return allData
    } catch (error) {
      console.error('Error reading AsyncStorage:', error);
      return []
    }
  };
  const exitApp = () => {
    BackHandler.exitApp();
  };
  const navigate = (userlevel) => {
    if (userlevel === 'client') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ClientDrawer' }]
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainDrawer' }],
      });
    }
  };
  // Runs every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        const localStorage = await fetchData();
        if (localStorage.authToken && Mobileauthentication()) {
          authenticate()
        } else if (localStorage.authToken) {
          navigate(localStorage.userlevel)
        } else {
          clearStorage();
        }
      };
      getData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ImageBackground source={require('../../assets/bg.jpg')} style={styles.background} resizeMode="cover">
        <View style={styles.container}>
          <View style={styles.head}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.content}>
            <View>
              <TextInput label="Mail Id" mode="outlined" style={styles.input} value={Data.email || ''} onChangeText={text => handleInput('email', text)} />
              <TouchableOpacity style={styles.icon}>
                <FontAwesome6 name='user-large' size={iconsize.sm} color="gray" />
              </TouchableOpacity>
            </View>
            <View>
              <TextInput label="Password" mode="outlined" style={styles.input} value={Data.password || ''} secureTextEntry={showPassword} onChangeText={text => handleInput('password', text)} />
              <TouchableOpacity onPress={() => setshowPassword(!showPassword)} style={styles.icon}>
                <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={iconsize.sm} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.action}>
            <TouchableHighlight onPress={handlesubmit} underlayColor="#1A5DFF" style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableHighlight>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </View>
        </View>
      </ImageBackground>
      <Modal visible={UnlockBox} transparent animationType="fade">
        <TouchableWithoutFeedback>
          <View style={styles.ApprovalmodalOverlay}>
            <View style={styles.ApprovalmodalContent}>
              <View style={styles.iconbox}>
                <Fontisto name="locked" size={iconsize.sm} color="blue" />
              </View>
              <View style={styles.header}>
                <Text style={styles.headText}>Your App is Locked</Text>
              </View>
              <View style={styles.informationBox}>
                <Text style={styles.informationText}>For Your Security, You can Only use your App When it's Unlocked</Text>
              </View>
              <View style={styles.actionbox}>
                <TouchableHighlight onPress={exitApp} underlayColor="gray" style={styles.unlockbtn}>
                  <Text>Exit</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={authenticate} style={[styles.unlockbtn]}>
                  <Text style={[styles.b]}>Unlock</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Make SafeAreaView fill the screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: 400,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  head: {
    height: '20%',
    width: '100%',
    // backgroundColor: 'silver'
  },
  logo: {
    height: '100%',
    width: '100%',
  },
  content: {
    height: '40%',
    width: '90%',
    gap: 20,
    justifyContent: 'center',
    // backgroundColor: 'gray'
  },
  box: {
    gap: 10
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    borderColor: 'gray',
    outlineColor: 'black',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 17
  },
  action: {
    height: '25%',
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'gray'
  },
  buttonContainer: {
    backgroundColor: '#2B7FFF',
    width: '100%',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotText: {
    color: '#2B7FFF',
    marginTop: 10,
  },
  ApprovalmodalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: 'center',
    alignItems: 'center'
  },
  ApprovalmodalContent: {
    width: '90%',
    height: 170,
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: 'center'
  },
  iconbox: {
    height: '20%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green'
  },
  header: {
    height: '20%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green'
  },
  headText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  informationBox: {
    height: '30%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1
    // backgroundColor: 'green'
  },
  informationText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 20
  },
  actionbox: {
    height: '30%',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    // backgroundColor: 'green'
  },
  unlockbtn: {
    padding: 10,
    // backgroundColor: 'green'
  },
  b: {
    color: 'blue'
  }
})