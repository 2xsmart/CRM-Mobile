import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/Ionicons';
import { iconsize } from '../../Constants/dimensions';

const Profile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <View style={styles.box1}>
          <Icon name={'person'} size={iconsize.sm} color='#2B7FFF' />
          <Text style={styles.headtext}>profile</Text>
        </View>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  head: {
    height: 40,
    width: '100%',
    // backgroundColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  box1: {
    height: '100%',
    width: '25%',
    // backgroundColor: '#74D4FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  headtext: {
    fontWeight: 'bold'
  },
})