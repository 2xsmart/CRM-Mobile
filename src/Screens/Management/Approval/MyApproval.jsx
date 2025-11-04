import { Text, View, TextInput, ActivityIndicator, ScrollView, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../Plugins/axios';
import { iconsize } from '../../../Constants/dimensions';
import jobsstyles from '../../Styles/JobsStyle';
import Loader from '../../Loader';

const MyApproval = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [headers, setheaders] = useState();
  const [loading, setLoading] = useState(true);
  const [myjobs, setmyjobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(myjobs);

  const getHeaders = async () => {
    await api.get('/jobs/preferences/Approval').then((res) => {
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
        // console.log(MobileFields);
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
  const getJobs = async () => {
    const userId = await AsyncStorage.getItem('userId')
    await api.get(`/ApprovalData/mydata/${userId}`).then((res) => {
      const data = res.data;
      if (data.length) {
        setmyjobs(data)
        // console.log(data);
      }
      else {
        setLoading(false);
      }
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const navigate = (id) => {
    navigation.navigate('ApprovalJob', { id, name: 'MyApproval' })
    // navigation.navigate('JobForm', { id, name: 'AllJobs', action: false})
  };
  useFocusEffect(
    useCallback(() => {
      getHeaders()
      getJobs();
    }, [])
  );
  useEffect(() => {
    if (search.trim() === "") {
      // console.log(myjobs);
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
          <MaterialCommunityIcons name={'lock-check'} size={iconsize.sm} color='#2B7FFF' />
          <Text style={jobsstyles.headtext}>My Approval</Text>
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
                      <Text style={jobsstyles.cw}>{obj[3]}</Text>
                      <Pressable style={jobsstyles.openjobicon} onPress={() => { navigate(obj.id) }}>
                        <FontAwesome name='angle-right' color='#fff' size={iconsize.sm} />
                      </Pressable>
                    </View>
                    <View style={jobsstyles.TableValues}>
                      {
                        headers.length > 0 ? headers.map((head, index) => {
                          return (
                            <View style={jobsstyles.valuebox} key={index}>
                              <View style={jobsstyles.keybox}><Text style={jobsstyles.label}>{head.value}</Text></View>
                              <View style={jobsstyles.keyvalue}><Text>{obj[head.fieldId]}</Text></View>
                            </View>
                          )
                        }) : <View style={jobsstyles.Nodata}>
                          <Text style={{ color: 'red' }}>No Data Found</Text>
                        </View>
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

export default MyApproval
