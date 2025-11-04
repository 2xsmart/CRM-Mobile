import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../Plugins/axios';
import { iconsize } from '../../Constants/dimensions';
import jobsstyles from '../Styles/JobsStyle';
import Loader from '../Loader';

const Supports = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [Reports, setReports] = useState([]);
  const [Users, setUsers] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(Reports);
  const headers = [
    {
      text: 'Title',
      value: 'Title'
    },
    {
      text: 'Type',
      value: 'Type'
    },
    {
      text: 'Status',
      value: 'Status'
    },
    {
      text: 'User',
      value: 'UserId'
    },
    {
      text: 'E-Mail Id',
      value: 'Useremail'
    },
    {
      text: 'Priority',
      value: 'Severity'
    },
  ];
  const getUsers = async () => {
    await api.get('/users').then((res) => {
      setUsers(res.data)
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getReports = async () => {
    await api.get('/support').then((res) => {
      const data = res.data;
      if (data.length) {
        const NewData = data.map((val) => {
          const UserId = val.UserId;
          const userName = Users.find((user) => user.id === UserId);
          const fullName = userName ? `${userName.firstName} ${userName.lastName}` : '';
          val.UserId = fullName
          return val
        });
        setReports(NewData)
        // console.log(NewData);
      }
      else {
        setLoading(false);
      }
      // console.log(data);
    })
      .catch((err) => {
        console.log('err', err);
      });
  };
  useFocusEffect(
    useCallback(() => {
      getUsers();
      getReports();
    }, [])
  );
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredJobs(Reports);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredJobs(
        Reports.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(lowerSearch)
          )
        )
      );
    }
    setLoading(false)
  }, [search, Reports]);
  useEffect(() => {
    if (filteredJobs.length) {
      setLoading(false);
    }
  }, [filteredJobs]);
  if (loading) return <View style={jobsstyles.loadingbox}>
    <Loader />

  </View>
  return (
    <View style={jobsstyles.container}>
      {/* <View style={jobsstyles.head}>
        <View style={jobsstyles.box1}>
          <MaterialIcons name={'support-agent'} size={iconsize.sm} color='#2B7FFF' />
          <Text style={jobsstyles.headtext}>Supports</Text>
        </View>
      </View> */}
      <View style={jobsstyles.searchBox}>
        <View style={jobsstyles.search}>
          <Icon name="search" size={20} color="#888" style={jobsstyles.icon} />
          <TextInput
            style={jobsstyles.input}
            placeholder="Search..."
            value={search}
            onChangeText={(text) => setSearch(text)}
            placeholderTextColor="#999"
          />
        </View>
      </View>
      <View style={jobsstyles.Table}>
        <ScrollView contentContainerStyle={jobsstyles.scrollbox}>
          {
            filteredJobs.length === 0 ? <View style={jobsstyles.Nodata}>
              <Text style={{ color: 'red' }}>No Data Found</Text>
            </View> :
              filteredJobs.map((obj, i) => {
                return (
                  <View key={i} style={jobsstyles.Tablebox}>
                    <View style={jobsstyles.TableHead}>
                      <Text style={jobsstyles.cw}>{obj.UID}</Text>
                      <Pressable
                        style={jobsstyles.openjobicon}
                      // onPress={() => navigation.navigate('JobForm', { id: obj.id, name: 'AllJobs', action: false})}
                      >
                        <FontAwesome name='angle-right' color='#fff' size={iconsize.sm} />
                      </Pressable>
                    </View>
                    <View style={jobsstyles.TableValues}>
                      {
                        headers.map((header, index) => (
                          <View style={jobsstyles.valuebox} key={index}>
                            <View style={jobsstyles.keybox}><Text style={jobsstyles.label}>{header.text}</Text></View>
                            <View style={jobsstyles.keyvalue}><Text numberOfLines={1} ellipsizeMode="tail">{obj[header.value]}</Text></View>
                          </View>
                        ))
                      }
                    </View>
                  </View>
                )
              })
          }
        </ScrollView>
      </View>
    </View>
  )
}

export default Supports

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: '100%',
//     alignItems: 'center',
//   },
//   head: {
//     height: 40,
//     width: '100%',
//     // backgroundColor: 'gray',
//     flexDirection: 'row',
//     justifyContent: 'space-between'
//   },
//   box1: {
//     height: '100%',
//     width: '25%',
//     // backgroundColor: '#74D4FF',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 10
//   },
//   headtext: {
//     fontWeight: 'bold'
//   },
//   serachBox: {
//     height: 50,
//     width: '100%',
//     // justifyContent: 'center',
//     alignItems: 'center',
//     // backgroundColor: 'yellow'
//   },
//   search: {
//     height: '70%',
//     width: '80%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 25,
//     paddingHorizontal: 10,
//     backgroundColor: '#fff',
//   },
//   Table: {
//     height: '100%',
//   },
//   headerRow: {
//     flexDirection: 'row',
//     backgroundColor: '#f2f2f2',
//   },
//   headerCell: {
//     width: 110,
//     height: 40,
//     backgroundColor: '#2B7FFF',
//     fontWeight: 'bold',
//     textAlign: 'center',         // center horizontally
//     textAlignVertical: 'center', // center vertically (Android)
//     color: '#fff',
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: '#ccc',         // matches data cell border
//     paddingLeft: 15,
//     paddingRight: 5
//   },
//   row: {
//     flexDirection: 'row',
//   },
//   cell: {
//     width: 110,                // fixed column width1
//     height: 40,                // fixed row height     // horizontal padding
//     // textAlign: 'center',       // center horizontally
//     textAlignVertical: 'center',
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: '#ccc',       // light border color
//     backgroundColor: '#FFF',
//     paddingLeft: 15,
//     paddingRight: 5
//   }

// })