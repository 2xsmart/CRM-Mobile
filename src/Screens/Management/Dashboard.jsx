import { Text, View, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useFocusEffect } from '@react-navigation/native';
import { iconsize } from '../../Constants/dimensions';
import api from '../../Plugins/axios';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobStyles from '../Styles/Jobs';
import DashStyles from '../Styles/Dashboard';
import Loader from '../Loader';

const screenWidth = Dimensions.get('window').width;

const Dashboard = ({ navigation }) => {

  const [Name, setName] = useState('')
  const [Alljobs, setAlljobs] = useState(0);
  const [Audit, setAudit] = useState(0);
  const [Completed, setCompleted] = useState(0);
  const [MyTask, setMyTask] = useState(0);
  const [headers, setheaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Status, setStatus] = useState([]);
  const [SubStatus, setSubStatus] = useState([]);
  const [Client, setClient] = useState([]);
  const [Owner, setOwner] = useState([]);
  const [Users, setUsers] = useState([]);
  const [Statusdata, setStatusdata] = useState([]);


  const baseColors = [
    "#E6194B", // Red
    "#3CB44B", // Green
    "#0082C8", // Blue
    "#F58231", // Orange
    "#911EB4", // Purple
    "#46F0F0", // Cyan
    "#F032E6", // Magenta
    "#D2F53C", // Lime
    "#FABEBE", // Pinkish
    "#008080", // Teal
    "#E6BEFF", // Lavender
    "#AA6E28", // Brown
    "#FFFAC8", // Cream
    "#800000", // Maroon
    "#AAFFC3", // Mint
    "#808000", // Olive
    "#FFD8B1", // Peach
    "#808080", // Gray
    "#B10DC9", // Deep Purple
  ];
  const randomNumArray = Array.from({ length: baseColors.length }, (_, i) => i + 1).sort(() => Math.random() - 0.5);

  const getalljobs = async () => {
    await api.post('/jobs/getData').then(async (res) => {
      const data = res.data;
      setAlljobs(data.length);
      const NewData = await data.map((job) => {
        job.AssignTo = job.AssignTo ? job.AssignTo : []
        job.Client = Client.find((C) => C.id === job.Client)?.name || job.Client
        job.Status = Status.find((S) => S.id === job.Status)?.name || job.Status
        job.SubStatus = SubStatus.find((SS) => SS.id === job.SubStatus)?.name || job.SubStatus
        job.Owner = Owner.find((O) => O.id === job.Owner)?.name || job.Owner
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
        color: baseColors[randomNumArray[i]],
        legendFontColor: '#333',
        legendFontSize: 14
      })).filter(obj => obj.name && obj.name !== 'undefined');
      console.log(data1)
      if (data1.length) {
        setStatusdata(data1)
      } else {
        setLoading(false)
      }
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
    // const letters = '89ABCDEF'; // use only bright hex codes
    const letters = '0123456789'; // allows some midrange tones too
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
      getOwner()
      getSubStatus()
      getClient()
      getUsers()
      setheaders(['UID', 'Status', 'JobId', 'Owner'])
      getStatus()
    }, [])
  );
  useEffect(() => {
    if (Status.length) {
      getmytask();
      getalljobs();
      getaudit();
      getcompleted();
    }
  }, [Status]);
  useEffect(() => {
    if (Statusdata) {
      setLoading(false)
    }

  }, [Statusdata]);
  if (loading) {
    return <View style={JobStyles.loadingbox}>
      <Loader />
    </View>
  }
  return (
    <View style={DashStyles.container}>
      <View style={DashStyles.profilebox}>
        <View style={DashStyles.profileiconbox}><FontAwesome6 name={'circle-user'} size={iconsize.xl} color='#FF5C01' /></View>
        <View style={DashStyles.profilename}>
          <Text style={JobStyles.cw}>Welcome</Text>
          <Text style={JobStyles.cw}>{Name}!</Text>
        </View>
      </View>
      <View style={DashStyles.content}>
        <View style={DashStyles.box}>
          <View style={DashStyles.box1}>
            <View style={DashStyles.box1icon}>
              <FontAwesome name={'briefcase'} size={iconsize.sm} color='#FF5C01' />
            </View>
            <View style={DashStyles.box1Text}>
              <Text style={DashStyles.boxtext}>{Alljobs}</Text>
              <Text style={DashStyles.boxtext}>All Jobs</Text>
            </View>
          </View>
          <View style={DashStyles.box1}>
            <View style={DashStyles.box1icon}><Ionicons name={'eye'} size={iconsize.sm} color='#FF5C01' /></View>
            <View style={DashStyles.box1Text}>
              <Text style={DashStyles.boxtext}>{Audit}</Text>
              <Text style={DashStyles.boxtext}>Audit</Text>
            </View>
          </View>
          <View style={DashStyles.box1}>
            <View style={DashStyles.box1icon}><FontAwesome name={'bookmark'} size={iconsize.sm} color='#FF5C01' /></View>
            <View style={DashStyles.box1Text}>
              <Text style={DashStyles.boxtext}>{Completed}</Text>
              <Text style={DashStyles.boxtext}>Completed</Text>
            </View>
          </View>
          <View style={DashStyles.box1}>
            <View style={DashStyles.box1icon}><FontAwesome name={'tasks'} size={iconsize.sm} color='#FF5C01' /></View>
            <View style={DashStyles.box1Text}>
              <Text style={DashStyles.boxtext}>{MyTask.length}</Text>
              <Text style={DashStyles.boxtext}>My Task</Text>
            </View>
          </View>
        </View>
        <View style={DashStyles.chartbox}>
          <View style={DashStyles.textbox}><Text style={DashStyles.boxtext}>All Jobs Status</Text></View>
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
      </View>
    </View>
  )
}

export default Dashboard

