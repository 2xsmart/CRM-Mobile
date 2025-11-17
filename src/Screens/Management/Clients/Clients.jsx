import { Text, View, TextInput, ScrollView, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../../Plugins/axios';
import { iconsize } from '../../../Constants/dimensions';
import JobStyles from '../../Styles/Jobs';
import Loader from '../../Loader';

const Clients = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [Clients, setClients] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
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
        setClients([])
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
              <Text style={{ color: 'red' }}>No Data Found</Text>
            </View> :
              filteredJobs.map((obj, i) => {
                return (
                  <View key={i} style={JobStyles.Tablebox}>
                    <View style={JobStyles.TableHead}>
                      <Text style={JobStyles.cw}>{obj.UID}</Text>
                      <Pressable
                        style={JobStyles.openjobicon}
                        onPress={() => navigation.navigate('ClientStack', {
                          screen: 'ClientForm',
                          params: {
                            id: obj.id,
                            data: obj
                          }
                        })}
                      >
                        <FontAwesome name='angle-right' color='#fff' size={iconsize.sm} />
                      </Pressable>
                    </View>
                    <View style={JobStyles.TableValues}>
                      {
                        headers.map((header, index) => (
                          <View style={JobStyles.valuebox} key={index}>
                            <View style={JobStyles.keybox}><Text style={JobStyles.label}>{header.text}</Text></View>
                            <View style={JobStyles.keyvalue}><Text numberOfLines={1} ellipsizeMode="tail">{obj[header.value]}</Text></View>
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
