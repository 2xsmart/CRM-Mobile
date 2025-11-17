import { Text, View, TextInput, ScrollView, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { iconsize } from '../../Constants/dimensions';
import api from '../../Plugins/axios';
import JobStyles from '../Styles/Jobs';
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
      // const state = navigation.getState();
      // console.log('🧭 Current Navigation State:', state);
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
  if (loading) return <View style={JobStyles.loadingbox}>
    <Loader />

  </View>
  return (
    <View style={JobStyles.container}>
      <View style={JobStyles.searchBox}>
        <View style={JobStyles.search}>
          <Icon name="search" size={20} color="#888" style={JobStyles.icon} />
          <TextInput
            style={JobStyles.input}
            placeholder="Search..."
            value={search}
            onChangeText={(text) => setSearch(text)}
            placeholderTextColor="#999"
          />
        </View>
      </View>
      <View style={JobStyles.Table}>
        <ScrollView contentContainerStyle={JobStyles.scrollbox}>
          {
            filteredJobs.length === 0 ? <View style={JobStyles.Nodata}>
              <Text style={JobStyles.cr}>No Data Found</Text>
            </View> :
              filteredJobs.map((obj, i) => {
                return (
                  <View key={i} style={JobStyles.Tablebox}>
                    <View style={JobStyles.TableHead}>
                      <Text style={JobStyles.cw}>{obj.UID}</Text>
                      <Pressable
                        style={JobStyles.openjobicon}
                        onPress={() => navigation.navigate('HomeStack', {
                          screen: 'JobForm',
                          params: {
                            id: obj.id,
                            action: true
                          }
                        })}>
                        <FontAwesome name='angle-right' color='#fff' size={iconsize.sm} />
                      </Pressable>
                    </View>
                    <View style={JobStyles.TableValues}>
                      {
                        headers.map((header, index) =>
                          <View style={JobStyles.valuebox} key={index}>
                            <View style={JobStyles.keybox}><Text style={JobStyles.label}>{header}</Text></View>
                            <View style={JobStyles.keyvalue}><Text numberOfLines={1} ellipsizeMode="tail">{obj[header]}</Text></View>
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