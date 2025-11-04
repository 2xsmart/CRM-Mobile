import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import api from '../../../Plugins/axios';
import { iconsize } from '../../../Constants/dimensions';
import jobsstyles from '../../Styles/JobsStyle';
import Loader from '../../Loader';

const Clients = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [Clients, setClients] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(Clients);
  const headers = [
    {
      text: 'Name',
      value: 'name'
    },
    {
      text: 'Display Name',
      value: 'displayname'
    },
    {
      text: 'Executive Name',
      value: 'executiveName'
    },
    {
      text: 'Phone',
      value: 'executivePhone'
    },
    {
      text: 'E-Mail',
      value: 'executiveEmail'
    },
    {
      text: 'Country',
      value: 'country'
    }
  ];
  const getClients = async () => {
    await api.get('/clients').then((res) => {
      const data = res.data;
      if (data.length) {
        setClients(data)
        // console.log(data);
      }
      else {
        setLoading(false);
      }
    })
      .catch((err) => {
        console.log('err', err);
      });
  };
  useFocusEffect(
    useCallback(() => {
      getClients();
    }, [])
  );
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredJobs(Clients);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredJobs(
        Clients.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(lowerSearch)
          )
        )
      );
    }
  }, [search, Clients]);
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
          <FontAwesome5 name={'users'} size={iconsize.sm} color='#2B7FFF' />
          <Text style={jobsstyles.headtext}>Clients</Text>
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
                        onPress={() => navigation.navigate('ClientForm', { id: obj.id, name: 'Clients', action: false, data: obj })}
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

export default Clients
