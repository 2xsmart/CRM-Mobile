import { Text, View, TextInput, ActivityIndicator, ScrollView, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import jobsstyles from '../../Styles/Jobs'
import { iconsize } from '../../../Constants/dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../../../Plugins/axios';
import JobStyles from '../../Styles/Jobs';
import Loader from '../../Loader';

const ClientAudit = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [myjobs, setmyjobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(myjobs);
  const [clients, setclients] = useState([]);
  const [Owner, setOwner] = useState([]);
  const [Status, setStatus] = useState([]);

  const getAudit = async () => {
    await api.post('/jobs/client/audit').then(async (res) => {
      const jobsdata = res.data.map(obj => {
        const cid = obj.Client;
        const sid = obj.Status;
        const owid = obj.Owner;
        obj.Client = clients.find(val => val.id === cid)?.name;
        obj.Status = Status.find(val => val.id === sid)?.name;
        obj.Owner = Owner.find(val => val.id === owid)?.name;
        // console.log(cname);
        return obj
      });
      if (jobsdata.length) {
        setmyjobs(jobsdata);
      } else {
        setLoading(false)
        setmyjobs(jobsdata);
      }
      // console.log(res.data);
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getclients = async () => {
    await api.get('/clients').then(async (res) => {
      setclients(res.data);
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
  const getStatus = async () => {
    await api.get('/status').then((res) => {
      setStatus(res.data)
    }).catch((err) => {
      console.log('err', err);
    })
  };
  useFocusEffect(
    useCallback(() => {
      const getdata = async () => {
        getclients()
        getStatus()
        getOwner()
      };
      getdata();
    }, [])
  );
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
    if (clients.length && Status.length && Owner.length) {
      getAudit();
    }
  }, [Owner, Status, clients]);
  useEffect(() => {
    if (filteredJobs.length) {
      setLoading(false);
    }
  }, [filteredJobs]);
  if (loading) {
    return <View style={JobStyles.loadingbox}>
      <Loader />
    </View>
  }
  return (
    <View style={jobsstyles.container}>
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
                        style={jobsstyles.openjobicon} onPress={() => navigation.navigate('ClientStack', {
                          screen: 'ClientJobForm', params: { id: obj.id }
                        })}>
                        <FontAwesome name='angle-right' color='#fff' size={iconsize.sm} />
                      </Pressable>
                    </View>
                    <View style={jobsstyles.TableValues}>
                      <View style={jobsstyles.valuebox}>
                        <View style={jobsstyles.keybox}><Text style={jobsstyles.label}>JobId</Text></View>
                        <View style={jobsstyles.keyvalue}><Text>{obj.JobId}</Text></View>
                      </View>
                      <View style={jobsstyles.valuebox}>
                        <View style={jobsstyles.keybox}><Text style={jobsstyles.label}>Client</Text></View>
                        <View style={jobsstyles.keyvalue}><Text>{obj.Client}</Text></View>
                      </View>
                      <View style={jobsstyles.valuebox}>
                        <View style={jobsstyles.keybox}><Text style={jobsstyles.label}>Status</Text></View>
                        <View style={jobsstyles.keyvalue}><Text>{obj.Status}</Text></View>
                      </View>
                      <View style={jobsstyles.valuebox}>
                        <View style={jobsstyles.keybox}><Text style={jobsstyles.label}>Owner</Text></View>
                        <View style={jobsstyles.keyvalue}><Text>{obj.Owner}</Text></View>
                      </View>
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

export default ClientAudit