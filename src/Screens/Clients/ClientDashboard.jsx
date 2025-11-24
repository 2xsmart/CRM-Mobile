import { Text, View, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { iconsize } from '../../Constants/dimensions';
import styles from '../Styles/ClientDashboard';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../Plugins/axios';
import { PieChart } from 'react-native-chart-kit';
import DashStyles from '../Styles/Dashboard';
import JobStyles from '../Styles/Jobs';

const ClientDashboard = () => {
  const [Name, setname] = useState('');
  const [clientid, setclientid] = useState(null);
  const [clients, setclients] = useState([]);
  const [Jobs, setJobs] = useState([]);
  const [Audit, setAudit] = useState([]);
  const [Completed, setCompleted] = useState([]);
  const [Status, setStatus] = useState([]);
  const [Statusdata, setStatusdata] = useState([]);

  const screenWidth = Dimensions.get('window').width;

  // 🎨 Function to generate random bright colors
  const getRandomColor = () => {
    const letters = '89ABCDEF'; // use only bright hex codes
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };
  const getFullName = () => {
    AsyncStorage.getItem('client').then(cid => {
      setclientid(cid);
      getclients(cid);
    }).catch((err) => {
      console.log(err);
    })
    return true
  };
  const getclients = async (id) => {
    await api.get('/clients').then(async (res) => {
      if (clientid) {
        const clientname = res.data.find(obj => obj.id === Number(id))?.name;
        setname(clientname)
        console.log(clientname);
      }
      setclients(res.data);
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getJobs = async () => {
    await api.post('/jobs/client').then(async (res) => {
      setJobs(res.data);
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getAudit = async () => {
    await api.post('/jobs/client/audit').then(async (res) => {
      setAudit(res.data);
      // console.log(res.data);
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getCompleted = async () => {
    await api.post('/jobs/client/completed').then(async (res) => {
      setCompleted(res.data);
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
  const totalJobs = Jobs.length + Audit.length + Completed.length
  useFocusEffect(
    useCallback(() => {
      getStatus();
      const fetchData = async () => {
        getFullName();
        getJobs();
        getAudit();
        getCompleted();
      };
      fetchData();
    }, [])
  );
  useEffect(() => {
    const Value = Jobs.map((obj) => {
      const Statusid = obj.Status;
      const statusname = Status.find(th => th.id === Statusid)?.name;
      obj.Status = statusname
      return obj
    });
    const grouped = Value.reduce((acc, cur) => {
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
    })).filter(obj => obj.name && obj.name !== 'undefined');
    // console.log(data1);
    setStatusdata(data1)
    // setJobs(data)
    // 
  }, [Jobs])
  return (
    <View style={DashStyles.container}>
      <View style={DashStyles.profilebox}>
        <View style={DashStyles.profileiconbox}><FontAwesome6 name={'circle-user'} size={iconsize.xl} color='#FF5C01' /></View>
        <View style={DashStyles.profilename}>
          <Text style={JobStyles.cw}>Welcome</Text>
          <Text style={JobStyles.cw}>{Name} !</Text>
        </View>
      </View>
      <View style={DashStyles.content}>
        <View style={DashStyles.box}>
          <View style={DashStyles.box1}>
            <View style={DashStyles.box1icon}><FontAwesome name={'tasks'} size={iconsize.sm} color='#FF5C01' /></View>
            <View style={DashStyles.box1Text}>
              <Text style={DashStyles.boxtext}>{totalJobs}</Text>
              <Text style={DashStyles.boxtext}>Total Jobs</Text>
            </View>
          </View>
          <View style={DashStyles.box1}>
            <View style={DashStyles.box1icon}>
              <FontAwesome name={'briefcase'} size={iconsize.sm} color='#FF5C01' />
            </View>
            <View style={DashStyles.box1Text}>
              <Text style={DashStyles.boxtext}>{Jobs.length}</Text>
              <Text style={DashStyles.boxtext}>All Jobs</Text>
            </View>
          </View>
          <View style={DashStyles.box1}>
            <View style={DashStyles.box1icon}><Ionicons name={'eye'} size={iconsize.sm} color='#FF5C01' /></View>
            <View style={DashStyles.box1Text}>
              <Text style={DashStyles.boxtext}>{Audit.length}</Text>
              <Text style={DashStyles.boxtext}>Audit</Text>
            </View>
          </View>
          <View style={DashStyles.box1}>
            <View style={DashStyles.box1icon}><FontAwesome name={'bookmark'} size={iconsize.sm} color='#FF5C01' /></View>
            <View style={DashStyles.box1Text}>
              <Text style={DashStyles.boxtext}>{Completed.length}</Text>
              <Text style={DashStyles.boxtext}>Completed</Text>
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

export default ClientDashboard
