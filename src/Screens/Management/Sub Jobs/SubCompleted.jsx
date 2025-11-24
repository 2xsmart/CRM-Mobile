import { Text, View, TextInput, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../../Plugins/axios';
import { iconsize } from '../../../Constants/dimensions';
import JobStyles from '../../Styles/Jobs';
import JobFormStyle from '../../Styles/JobForm';
import Loader from '../../Loader';

const SubCompleted = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [headers, setheaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Client, setClient] = useState([]);
  const [myjobs, setmyjobs] = useState([]);
  const [Subjobs, setSubjobs] = useState([]);
  const [Tabs, setTabs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(Subjobs);
  const [selectedTab, setselectedTab] = useState(0);
  const [visible, setVisible] = useState(false);

  const getHeaders = async (id) => {
    await api.get(`/jobs/SubjobPreferences/completedsubjob/${id}`).then((res) => {
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
  const getClient = async () => {
    await api.get('/clients').then((res) => {
      setClient(res.data)
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getJobs = async () => {
    await api.post('/jobs/getDataCompleted').then(async (res) => {
      const data = res.data;
      if (data.length) {
        data.forEach((obj) => {
          obj.AssignTo = obj.AssignTo ? JSON.parse(obj.AssignTo).map(Number) : []
          const jobData = obj.details || {};
          Object.keys(jobData).forEach((th) => {
            const cleanKey = th.replace(/^primary\./, ''); // remove "primary."
            const value = jobData[th];
            obj[cleanKey] = (value && typeof value === 'object') ? value.value : value;
          });
          delete obj.details; // remove original details
        });
        const NewData = await data.map((job) => {
          job.Client = Client.find((C) => C.id === job.Client)?.name
          return job
        });
        setmyjobs(NewData)
      } else {
        setLoading(false);
      }
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getTabs = async () => {
    return await api.get('/subjobs').then((res) => {
      setTabs(res.data);
      const firstTab = res.data[0].id;
      handleTabs(firstTab, 0)
    }).catch((err) => {
      console.log('Error', err);
    })
  };
  const getSubJobs = async (id) => {
    await api.get(`/subjobscategory/completedsubjob/${id}`).then((res) => {
      const data = res.data.map((obj) => {
        const { id, SJUID, details } = obj;
        const job = myjobs.find((val) => val.id === obj.JobId)
        if (job) {
          const { UID, JobId } = job;
          details.UID = UID
          details.Client = job.Client
          details.JobId = JobId
          details.id = id
          details.SID = SJUID
          return details
        }
      }).filter(Boolean);
      const data1 = data.map(item => {
        const newItem = {};
        for (const [key, val] of Object.entries(item)) {
          if (typeof val === 'string') {
            try {
              const parsed = JSON.parse(val);
              if (parsed && typeof parsed === 'object' && 'value' in parsed) {
                newItem[key] = parsed.value;
                continue;
              }
            } catch (e) {
              // not JSON → leave it as is
            }
          }
          newItem[key] = val;
        }
        return newItem;
      });
      const cleanedData = data1.map(obj =>
        Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [
            key,
            typeof value === "string"
              ? value.trim().replace(/^"|"$/g, "") // remove wrapping quotes
              : value
          ])
        )
      );
      setSubjobs(cleanedData);
    }).catch((err) => {
      console.log('Error', err);
    });
  };
  const handleTabs = async (Tid, ind) => {
    await getSubJobs(Tid);
    await getHeaders(Tid);
    setselectedTab(ind);
  };
  useFocusEffect(
    useCallback(() => {
      getClient()
      setselectedTab(0)
    }, [])
  );
  useEffect(() => {
    getJobs();
  }, [Client]);
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredJobs(Subjobs);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredJobs(
        Subjobs.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(lowerSearch)
          )
        )
      );
    }
  }, [search, Subjobs]);
  useEffect(() => {
    getTabs()
  }, [myjobs]);
  useEffect(() => {
    if (filteredJobs.length > 0) {
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
                        onPress={() => navigation.navigate('SubTaskStack', {
                          screen: 'SubJobForm',
                          params: {
                            id: obj.id,
                            action: false
                          }
                        })}
                      >
                        <FontAwesome name='angle-right' color='#fff' size={iconsize.sm} />
                      </Pressable>
                    </View>
                    <View style={JobStyles.TableValues}>
                      {
                        headers.map((header, index) => {
                          return (
                            <View style={JobStyles.valuebox} key={index}>
                              <View style={JobStyles.keybox}><Text style={JobStyles.label}>{header.value}</Text></View>
                              <View style={JobStyles.keyvalue}><Text numberOfLines={1} ellipsizeMode="tail">{obj[header.value]}</Text></View>
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
        animationType="slide" // "fade", "none" also possible
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

export default SubCompleted;
