import { StyleSheet, Text, View, TextInput, Pressable, TouchableOpacity, ActivityIndicator, ScrollView, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons'; // npm install react-native-vector-icons
import { useFocusEffect } from '@react-navigation/native';
import api from '../../../Plugins/axios';
import { iconsize } from '../../../Constants/dimensions';
import jobsstyles from '../../Styles/JobsStyle';
import Loader from '../../Loader';


const Todo = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [headers, setheaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Status, setStatus] = useState([]);
  const [SubStatus, setSubStatus] = useState([]);
  const [Client, setClient] = useState([]);
  const [Owner, setOwner] = useState([]);
  const [Users, setUsers] = useState([]);
  const [myjobs, setmyjobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(myjobs);

  const getHeaders = async () => {
    await api.get('/jobs/preferences/mobile/todo').then((res) => {
      const data = res.data;
      const MobileFields = data
        .filter(obj => obj.mobile === 1)
        .sort((a, b) => a.mobileOrder - b.mobileOrder)
        .map(item => ({
          ...item,
          value: item.value.replace(/^primary\./, '')
        }));

      if (MobileFields.length) {
        setheaders(MobileFields)
      } else {
        const cleanedData = data.map(item => ({
          ...item,
          value: item.value.replace(/^primary\./, '')
        })).slice(0, 6)
        setheaders(cleanedData)
      }
      // console.log(MobileFields);
    })
      .catch((err) => {
        console.log('err', err);
      });
  };
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
  const getJobs = async () => {
    await api.post('/jobs/todo').then(async (res) => {
      if (res.data.length) {
        handleJobs(res.data);
      } else {
        setLoading(false)
      }
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const handleJobs = async (data) => {
    data.forEach((obj) => {
      const jobData = obj.details || {};
      Object.keys(jobData).forEach((th) => {
        const cleanKey = th.replace(/^primary\./, ''); // remove "primary."
        const value = jobData[th];
        obj[cleanKey] = (value && typeof value === 'object') ? value.value : value;
      });
      delete obj.details; // remove original details
    });
    const NewData = await data.map((job) => {
      job.AssignTo = job.AssignTo ? JSON.parse(job.AssignTo).map(Number) : []
      job.Client = Client.find((C) => C.id === job.Client)?.name
      job.Status = Status.find((S) => S.id === job.Status)?.name
      job.SubStatus = SubStatus.find((SS) => SS.id === job.SubStatus)?.name
      job.Owner = Owner.find((O) => O.id === job.Owner)?.name
      job.AssignTo = Users.filter(U => job.AssignTo.includes(U.id)).map((user) => `${user.firstName}${user.lastName}`).join(',')
      return job
    });
    setmyjobs(NewData);
  };
  useFocusEffect(
    useCallback(() => {
      getSubStatus()
      getClient()
      getUsers()
      getStatus()
      getHeaders()
      getOwner()
    }, [])
  );
  useEffect(() => {
    getJobs();
  }, [Owner]);
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredJobs(myjobs);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredJobs(
        myjobs.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(lowerSearch)
          )
        )
      );
    }
  }, [search, myjobs]);
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
          <MaterialCommunityIcons name={'altimeter'} size={iconsize.sm} color='#2B7FFF' />
          <Text style={jobsstyles.headtext}>To-Do</Text>
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
                      <Text style={{ color: '#fff' }}>{obj.UID}</Text>
                      <Pressable
                        style={jobsstyles.openjobicon}
                        onPress={() => navigation.navigate('JobForm', { id: obj.id, name: 'Todo', action: false })}>
                        <FontAwesome name='angle-right' color='#fff' size={iconsize.sm} />
                      </Pressable>
                    </View>
                    <View style={jobsstyles.TableValues}>
                      {
                        headers.map((header, index) =>
                          <View style={jobsstyles.valuebox} key={index}>
                            <View style={jobsstyles.keybox}><Text style={jobsstyles.label}>{header.value}</Text></View>
                            <View style={jobsstyles.keyvalue}><Text numberOfLines={1} ellipsizeMode="tail">{obj[header.value]}</Text></View>
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

export default Todo