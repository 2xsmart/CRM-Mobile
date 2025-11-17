import { Text, View, TextInput, ScrollView, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../Plugins/axios';
import { iconsize } from '../../../Constants/dimensions';
import JobStyles from '../../Styles/Jobs';
import Loader from '../../Loader';

const ApprovalJob = ({ navigation }) => {
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
    await api.get(`/ApprovalData/mydata/job/${userId}`).then((res) => {
      const data = res.data;
      if (data.length) {
        setmyjobs(data)
      }
      else {
        setLoading(false);
        setmyjobs(data)
      }
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const navigate = (id) => {
    navigation.navigate('ApprovalStack', {
      screen: 'ApprovalJobForm',
      params: {
        id
      }
    })
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
                      <Text style={JobStyles.cw}>{obj[3]}</Text>
                      <Pressable style={JobStyles.openjobicon} onPress={() => { navigate(obj.id) }}>
                        <FontAwesome name='angle-right' color='#fff' size={iconsize.sm} />
                      </Pressable>
                    </View>
                    <View style={JobStyles.TableValues}>
                      {
                        headers.length > 0 ? headers.map((head, index) => {
                          return (
                            <View style={JobStyles.valuebox} key={index}>
                              <View style={JobStyles.keybox}><Text style={JobStyles.label}>{head.value}</Text></View>
                              <View style={JobStyles.keyvalue}><Text>{obj[head.fieldId]}</Text></View>
                            </View>
                          )
                        }) : <View style={JobStyles.Nodata}>
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

export default ApprovalJob
