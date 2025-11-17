import { Text, View, TextInput, ScrollView, Pressable, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../Plugins/axios';
import { iconsize } from '../../../Constants/dimensions';
import Loader from '../../Loader';
import JobFormStyle from '../../Styles/JobForm';
import JobStyles from '../../Styles/Jobs';

const ApprovalSubJob = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [headers, setheaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myjobs, setmyjobs] = useState([]);
  const [Subjobs, setSubjobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(myjobs);
  const [selectedTab, setselectedTab] = useState(0);
  const [Tabs, setTabs] = useState([]);
  const [visible, setVisible] = useState(false);

  const getHeaders = async (id) => {
    await api.get(`/jobs/SubjobPreferences/Approval/${id}`).then((res) => {
      const data = res.data;
      // console.log(data)
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
  const getApprovals = async () => {
    const userId = await AsyncStorage.getItem('userId')
    await api.get(`/ApprovalData/mydata/subjob/${userId}`).then((res) => {
      const data = res.data;
      if (data.length) {
        setSubjobs(data)
        const data1 = data.filter(obj => obj.category === 1);
        setmyjobs(data1);
        // console.log(data1);
      }
      else {
        setLoading(false);
        setmyjobs([]);
      }
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getTabs = async () => {
    await api.get('/subjobs').then(async (res) => {
      const data = res.data.map(obj => {
        obj.fields = JSON.parse(obj.fields) ? JSON.parse(obj.fields) : []
        return obj
      });
      setTabs(data);
      await getHeaders(data[0].id)
      // console.log();
    }).catch(err => {
      console.log(err);
    })

  };
  const handleTabs = async (Tid, ind) => {
    await getHeaders(Tid)
    setselectedTab(ind)
    const data = Subjobs.filter(obj => obj.category === Tid);
    setmyjobs(data);
    console.log(data);
  }
  useFocusEffect(
    useCallback(() => {
      getApprovals();
      getTabs();
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
      <View style={JobFormStyle.head}>
        <Text style={[JobFormStyle.headtext]}>
          {Tabs[selectedTab]?.name?.toString() || ''}
        </Text>
        <MaterialCommunityIcons name="tab" size={iconsize.md} color="#FFF" onPress={() => setVisible(true)} />
      </View>
      <View style={JobStyles.Table1}>
        <ScrollView contentContainerStyle={JobStyles.scrollbox}>
          {
            filteredJobs.length === 0 ? <View style={JobStyles.Nodata}>
              <Text style={JobStyles.cr}>No Data Found</Text>
            </View> :
              filteredJobs.map((obj, i) => {
                return (
                  <View key={i} style={JobStyles.Tablebox}>
                    <View style={JobStyles.TableHead}>
                      <Text style={JobStyles.cw}>{obj.SID}</Text>
                      <Pressable
                        style={JobStyles.openjobicon}
                        onPress={() => navigation.navigate('ApprovalStack', {
                          screen: 'ApprovalSubJobForm',
                          params: {
                            id: obj.id
                          }
                        })}
                      >
                        <FontAwesome name='angle-right' color='#fff' size={iconsize.sm} />
                      </Pressable>
                    </View>
                    <View style={JobStyles.TableValues}>
                      {
                        headers.length > 0 && headers.map((header, index) => {
                          return (
                            <View style={JobStyles.valuebox} key={index}>
                              <View style={JobStyles.keybox}><Text style={JobStyles.label}>{header.value}</Text></View>
                              <View style={JobStyles.keyvalue}><Text numberOfLines={1} ellipsizeMode="tail">{obj[header.fieldId]}</Text></View>
                            </View>
                          )
                        })
                      }

                    </View>
                  </View>
                )
              })
          }
        </ScrollView>
      </View>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
        onDismiss={() => setVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={JobStyles.modalOverlay}>
            <View style={JobStyles.modalContent}>
              {
                Tabs.length > 0 ? Tabs.map((tab, index) =>
                  <TouchableOpacity style={[JobStyles.TabCell, selectedTab === index ? JobStyles.blb : JobStyles.bb]} key={index} onPress={() => { handleTabs(tab.id, index) }}>
                    {
                      tab.name && <Text style={JobStyles.TabText}>{tab.name}</Text>
                    }
                  </TouchableOpacity>
                ) : <View style={JobStyles.Nodata}> <Text style={JobStyles.cr}>No Tabs Found</Text> </View>
              }
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default ApprovalSubJob