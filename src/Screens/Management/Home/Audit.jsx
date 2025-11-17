import { Text, View, TextInput, ActivityIndicator, ScrollView, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useFocusEffect } from '@react-navigation/native';
import api from '../../../Plugins/axios';
import { iconsize } from '../../../Constants/dimensions';
import JobStyles from '../../Styles/Jobs';
import Loader from '../../Loader';


const Audit = ({ navigation }) => {
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
    await api.get('/jobs/preferences/Audits').then((res) => {
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
    await api.post('/jobs/audit').then(async (res) => {
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
      getStatus()
      getSubStatus()
      getClient()
      getUsers()
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
  if (loading) {
    handleJobs()
    return <View style={JobStyles.loadingbox}>
      <Loader />

    </View>
  }
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
                            action: false
                          }
                        })}>
                        <FontAwesome name='angle-right' color='#fff' size={iconsize.sm} />
                      </Pressable>
                    </View>
                    <View style={JobStyles.TableValues}>
                      {
                        headers.map((header, index) =>
                          <View style={JobStyles.valuebox} key={index}>
                            <View style={JobStyles.keybox}><Text style={JobStyles.label}>{header.value}</Text></View>
                            <View style={JobStyles.keyvalue}><Text numberOfLines={1} ellipsizeMode="tail">{obj[header.value]}</Text></View>
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

export default Audit
