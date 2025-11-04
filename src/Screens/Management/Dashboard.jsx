import { Text, View, ActivityIndicator, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useFocusEffect } from '@react-navigation/native';
import styles from '../Styles/DashboardStyle';
import { iconsize } from '../../Constants/dimensions';
import api from '../../Plugins/axios';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jobsstyles from '../Styles/JobsStyle';
import Loader from '../Loader';

const screenWidth = Dimensions.get('window').width;

const Dashboard = ({ navigation }) => {


  const [Name, setName] = useState('')
  const [Alljobs, setAlljobs] = useState(10);
  const [Audit, setAudit] = useState(20);
  const [Completed, setCompleted] = useState(30);
  const [MyTask, setMyTask] = useState(30);
  const [headers, setheaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Status, setStatus] = useState([]);
  const [SubStatus, setSubStatus] = useState([]);
  const [Client, setClient] = useState([]);
  const [Owner, setOwner] = useState([]);
  const [Users, setUsers] = useState([]);
  const [Statusdata, setStatusdata] = useState([]);

  const getalljobs = async () => {
    await api.post('/jobs/getData').then(async (res) => {
      const data = res.data;
      setAlljobs(data.length);
      const NewData = await data.map((job) => {
        job.AssignTo = job.AssignTo ? job.AssignTo : []
        job.Client = Client.find((C) => C.id === job.Client)?.name
        job.Status = Status.find((S) => S.id === job.Status)?.name
        job.SubStatus = SubStatus.find((SS) => SS.id === job.SubStatus)?.name
        job.Owner = Owner.find((O) => O.id === job.Owner)?.name
        job.AssignTo = Users.filter(U => job.AssignTo.includes(U.id)).map((user) => `${user.firstName}${user.lastName}`).join(',')
        return job
      });
      const grouped = NewData.reduce((acc, cur) => {
        const status = cur.Status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      const data1 = Object.entries(grouped).map(([name, population], i) => ({
        name,
        population,
        color: getRandomColor(),
        legendFontColor: '#333',
        legendFontSize: 14
      }));
      setStatusdata(data1)
      // console.log(data1);
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getaudit = async () => {
    await api.post('/jobs/audit').then(async (res) => {
      setAudit(res.data.length);
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getcompleted = async () => {
    await api.post('/jobs/getDataCompleted').then(async (res) => {
      setCompleted(res.data.length);
    }).catch((err) => {
      console.log('err', err);
    })
  };
  // 🎨 Function to generate random bright colors
  const getRandomColor = () => {
    const letters = '89ABCDEF'; // use only bright hex codes
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };
  const getmytask = async () => {
    await api.get('/jobs/mytask/all').then(async (res) => {
      handleJobs(res.data);
      // console.log(res.data);
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
  const handleJobs = async (data) => {
    const NewData = await data.map((job) => {
      job.AssignTo = job.AssignTo ? job.AssignTo : []
      job.Client = Client.find((C) => C.id === job.Client)?.name
      job.Status = Status.find((S) => S.id === job.Status)?.name
      job.SubStatus = SubStatus.find((SS) => SS.id === job.SubStatus)?.name
      job.Owner = Owner.find((O) => O.id === job.Owner)?.name
      job.AssignTo = Users.filter(U => job.AssignTo.includes(U.id)).map((user) => `${user.firstName}${user.lastName}`).join(',')
      return job
    });
    setMyTask(NewData)
    setLoading(false)
  };
  const getFullName = () => {
    AsyncStorage.getItem('fullname').then(name => {
      setName(name);
    }).catch((err) => {
      console.log(err);
    })
  };
  useFocusEffect(
    useCallback(() => {
      getFullName()
      getStatus()
      getSubStatus()
      getClient()
      getUsers()
      setheaders(['UID', 'Status', 'JobId', 'Owner'])
      getOwner()
    }, [])
  );
  useEffect(() => {
    getmytask();
    getalljobs();
    getaudit();
    getcompleted();
  }, [Owner]);
  if (loading) {
    return <View style={jobsstyles.loadingbox}>
      <Loader />

    </View>
  }
  return (
    <View style={styles.container}>
      {/* <View style={styles.headbox}>
        <View style={styles.head}>
          <MaterialIcons name={'dashboard'} size={iconsize.sm} color='#2B7FFF' />
          <Text style={styles.headtext}>Dashboard</Text>
        </View>
      </View> */}
      <View style={styles.profilebox}>
        <View style={styles.profileiconbox}><FontAwesome6 name={'circle-user'} size={iconsize.xl} color='#FF5C01' /></View>
        <View style={styles.profilename}>
          <Text style={jobsstyles.cw}>Welcome</Text>
          <Text style={jobsstyles.cw}>{Name}!</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.box}>
          <View style={styles.box1}>
            <View style={styles.box1icon}>
              <FontAwesome name={'briefcase'} size={iconsize.sm} color='#FF5C01' />
            </View>
            <View style={styles.box1Text}>
              <Text style={styles.boxtext}>{Alljobs}</Text>
              <Text style={styles.boxtext}>All Jobs</Text>
            </View>
          </View>
          <View style={styles.box1}>
            <View style={styles.box1icon}><Ionicons name={'eye'} size={iconsize.sm} color='#FF5C01' /></View>
            <View style={styles.box1Text}>
              <Text style={styles.boxtext}>{Audit}</Text>
              <Text style={styles.boxtext}>Audit</Text>
            </View>
          </View>
          <View style={styles.box1}>
            <View style={styles.box1icon}><FontAwesome name={'bookmark'} size={iconsize.sm} color='#FF5C01' /></View>
            <View style={styles.box1Text}>
              <Text style={styles.boxtext}>{Completed}</Text>
              <Text style={styles.boxtext}>Completed</Text>
            </View>
          </View>
          <View style={styles.box1}>
            <View style={styles.box1icon}><FontAwesome name={'tasks'} size={iconsize.sm} color='#FF5C01' /></View>
            <View style={styles.box1Text}>
              <Text style={styles.boxtext}>{MyTask.length}</Text>
              <Text style={styles.boxtext}>My Task</Text>
            </View>
          </View>
        </View>
        <View style={styles.chartbox}>
          <View style={styles.textbox}><Text style={styles.boxtext}>All Jobs Status</Text></View>
          <PieChart
            data={Statusdata}
            width={screenWidth - 20}
            height={160}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'10'}
            absolute={false}
          />
        </View>
        {/* <View style={[styles.box, { backgroundColor: '#00796B' }]}>
          <FontAwesome name={'briefcase'} size={iconsize.lg} color='#fff' />
          <View style={styles.box1}>
            <Text style={styles.boxtext}>{Alljobs}</Text>
            <Text style={styles.boxtext}>All Jobs</Text>
          </View>
        </View>
        <View style={[styles.box, { backgroundColor: '#D81B60' }]}>
          <Ionicons name={'eye'} size={iconsize.lg} color='#fff' />
          <View style={styles.box1}>
            <Text style={styles.boxtext}>{Audit}</Text>
            <Text style={styles.boxtext}>Audit</Text>
          </View>
        </View>
        <View style={[styles.box, { backgroundColor: '#512DA8' }]}>
          <FontAwesome name={'bookmark'} size={iconsize.lg} color='#fff' />
          <View style={styles.box1}>
            <Text style={styles.boxtext}>{Completed}</Text>
            <Text style={styles.boxtext}>Completed</Text>
          </View>
        </View> */}
        {/* <View style={styles.tablebox}> */}
        {/* <Text style={{ fontSize: 18, height: 30, textAlign: 'center', textAlignVertical: 'center' }}>All Jobs Status</Text> */}
        {/* <View style={styles.table}>
            <PieChart
              data={Statusdata}
              width={screenWidth - 20}
              height={180}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor={'population'}
              backgroundColor={'transparent'}
              paddingLeft={'10'}
              absolute
              style={{ marginVertical: 10, }}
            /> */}
        {/* <ScrollView contentContainerStyle={{ gap: 10, justifyContent: 'center', alignItems: 'center', paddingBottom: 30, paddingTop: 10 }}>
              {
                MyTask.length > 0 ? MyTask.map((task, index) => {
                  return (
                    <Pressable style={styles.taskbox} key={index}
                      onPress={() => navigation.navigate('MyTask')}>
                      <View style={styles.fieldbox}>
                        <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">UID :</Text>
                        <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">{task.UID}</Text>
                      </View>
                      <View style={styles.fieldbox}>
                        <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">Job Id :</Text>
                        <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">{task.JobId}</Text>
                      </View>
                      <View style={styles.fieldbox}>
                        <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">Client :</Text>
                        <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">{task.Client}</Text>
                      </View>
                      <View style={styles.fieldbox}>
                        <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">Status :</Text>
                        <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">{task.Status}</Text>
                      </View>
                    </Pressable>
                  )
                }) : <View style={styles.Nodata}>
                  <Text style={{ color: 'red' }}>No Data Found</Text>
                </View>
              }
            </ScrollView> */}
        {/* {renderHeader()}
            <FlatList
              data={MyTask}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            /> */}
        {/* </View> */}
        {/* </View> */}
      </View>
    </View>
  )
}

export default Dashboard

