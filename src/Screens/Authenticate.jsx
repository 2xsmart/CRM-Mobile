import { View, Text, TouchableHighlight, StyleSheet, Modal, TouchableWithoutFeedback, BackHandler } from 'react-native'
import React, { useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { iconsize } from '../Constants/dimensions';


const Authenticate = ({ navigation }) => {

  const authenticate = async () => {
    navigation.navigate('Login');
  };
  const exitApp = () => {
    BackHandler.exitApp();
  };

  // Runs every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // CheckBiometrics();
    }, [])
  );
  return (
    <View style={styles.safeArea}>
      <Modal visible={true} transparent animationType="fade">
        <TouchableWithoutFeedback>
          <View style={styles.ApprovalmodalOverlay}>
            <View style={styles.ApprovalmodalContent}>
              <View style={styles.iconbox}>
                <FontAwesome6 name="user-shield" size={iconsize.lg} color="blue" />
              </View>
              <View style={styles.header}>
                <Text style={styles.headText}>2XSMART Sceurity Shield</Text>
              </View>
              <View style={styles.informationBox}>
                <Text style={styles.informationText}>Please unlock 2XSMART to continue. 2XSMART Security Shield protects you from unauthorised access to 2XSMART</Text>
              </View>
              <View style={styles.actionbox}>
                <TouchableHighlight onPress={exitApp} underlayColor="gray" style={[styles.buttonContainer, styles.bg]}>
                  <Text style={styles.buttonText}>Exit</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={authenticate} underlayColor="#1A5DFF" style={[styles.buttonContainer, styles.bb]}>
                  <Text style={styles.buttonText}>Unlock</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default Authenticate

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15
  },
  ApprovalmodalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: 'center',
    alignItems: 'center'
  },
  ApprovalmodalContent: {
    width: '85%',
    height: 300,
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: 'center'
  },
  iconbox: {
    height: '25%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green'
  },
  header: {
    height: '15%',
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
    // backgroundColor: 'green'
  },
  informationText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 25
  },
  actionbox: {
    height: '30%',
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
    // backgroundColor: 'green'
  },
  buttonContainer: {
    width: '40%',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bb: {
    backgroundColor: '#2B7FFF',
  },
  bg: { backgroundColor: 'gray', }
})