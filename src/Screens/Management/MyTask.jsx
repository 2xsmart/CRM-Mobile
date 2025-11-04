import { StyleSheet, Text, View, TextInput, TouchableHighlight, TouchableOpacity, ActivityIndicator, ScrollView, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons'; // npm install react-native-vector-icons
import { useFocusEffect } from '@react-navigation/native';
import { iconsize } from '../../Constants/dimensions';
import api from '../../Plugins/axios';
import jobsstyles from '../Styles/JobsStyle';
import Loader from '../Loader';


const MyTask = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [headers, setheaders] = useState();
  const [loading, setLoading] = useState(true);
  const [Status, setStatus] = useState([]);
  const [SubStatus, setSubStatus] = useState([]);
  const [Client, setClient] = useState([]);
  const [Owner, setOwner] = useState([]);
  const [Users, setUsers] = useState([]);
  const [Mytask, setMytask] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(Mytask);

  const getStatus = async () => {
    await api.get('/status').then((res) => {
      setStatus(res.data)
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getSubStatus = async () => {
    await api.get('/subStatus').then((res) => {
      setSubStatus(res.data)
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getOwner = async () => {
    await api.get('/owner/getowner').then((res) => {
      setOwner(res.data)
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getClient = async () => {
    await api.get('/clients').then((res) => {
      setClient(res.data)
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getUsers = async () => {
    await api.get('/users').then((res) => {
      setUsers(res.data)
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getmytask = async () => {
    await api.get('/jobs/mytask/all').then(async (res) => {
      const data = res.data;
      if (data.length) {
        handlemytask(res.data);
      }
      else {
        setLoading(false);
      }

    }).catch((err) => {
      console.log('err', err);
    })
  };
  const handlemytask = async (data) => {
    const NewData = await data.map((job) => {
      job.AssignTo = job.AssignTo ? job.AssignTo : []
      job.Client = Client.find((C) => C.id === job.Client)?.name
      job.Status = Status.find((S) => S.id === job.Status)?.name
      job.SubStatus = SubStatus.find((SS) => SS.id === job.SubStatus)?.name
      job.Owner = Owner.find((O) => O.id === job.Owner)?.name
      job.AssignTo = Users.filter(U => job.AssignTo.includes(U.id)).map((user) => `${user.firstName}${user.lastName}`).join(',')
      return job
    })
    setMytask(NewData)
    // console.log(NewData);
  };
  useFocusEffect(
    useCallback(() => {
      getStatus()
      getSubStatus()
      getClient()
      getUsers()
      setheaders(['Status', 'JobId', 'SubStatus', 'Owner', 'Client', 'AssignTo'])
      getOwner()
    }, [])
  );
  useEffect(() => {
    getmytask();
  }, [Owner]);
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredJobs(Mytask);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredJobs(
        Mytask.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(lowerSearch)
          )
        )
      );
    }
  }, [search, Mytask]);
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
          <FontAwesome name={'tasks'} size={iconsize.sm} color='#2B7FFF' />
          <Text style={jobsstyles.headtext}>My Task</Text>
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
                        onPress={() => navigation.navigate('JobForm', { id: obj.id, name: 'MyTask', action: false })}>
                        <FontAwesome name='angle-right' color='#fff' size={iconsize.sm} />
                      </Pressable>
                    </View>
                    <View style={jobsstyles.TableValues}>
                      {
                        headers.map((header, index) =>
                          <View style={jobsstyles.valuebox} key={index}>
                            <View style={jobsstyles.keybox}><Text style={jobsstyles.label}>{header}</Text></View>
                            <View style={jobsstyles.keyvalue}><Text numberOfLines={1} ellipsizeMode="tail">{obj[header]}</Text></View>
                          </View>
                        )
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

export default MyTask

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
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
  serachBox: {
    height: 50,
    width: '100%',
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow'
  },
  search: {
    height: '70%',
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  input: {
    width: '100%'
  },
  Table: {
    height: '85%',
    width: '100%',
  },
  Tablebox: {
    height: 150,
    width: '90%',
    // borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow
    elevation: 5,
  },
  TableHead: {
    height: 30,
    width: '100%',
    backgroundColor: 'teal',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    elevation: 5,
  },
  openjobicon: {
    width: 30,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // backgroundColor: '#9D2EFF'
  },
  TableValues: {
    height: 120,
    width: '100%',
  },
  valuebox: {
    height: 30,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#96F7E4'
  },
  keybox: {
    height: 30,
    width: '45%',
    justifyContent: 'center',
    // backgroundColor: '#74D4FF'
  },
  keyvalue: {
    height: 30,
    width: '45%',
    justifyContent: 'center',
    // backgroundColor: '#51A2FF'
  },
  label: {
    fontFamily: 'AntDesign',
    fontWeight: 'bold'
  },

})