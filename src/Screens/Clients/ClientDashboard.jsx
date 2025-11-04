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
  // const data = [
  //   {
  //     name: 'JavaScript',
  //     population: 50,
  //     color: '#f39c12',
  //     legendFontColor: '#333',
  //     legendFontSize: 14,
  //   },
  //   {
  //     name: 'Python',
  //     population: 30,
  //     color: '#2ecc71',
  //     legendFontColor: '#333',
  //     legendFontSize: 14,
  //   },
  //   {
  //     name: 'Java',
  //     population: 20,
  //     color: '#3498db',
  //     legendFontColor: '#333',
  //     legendFontSize: 14,
  //   }
  // ];
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
    }).catch((err) => {
      console.log(err);
    })
    return true
  };
  const getclients = async () => {
    await api.get('/clients').then(async (res) => {
      if (clientid) {
        const clientname = res.data.find(obj => obj.id === Number(clientid))?.name;
        setname(clientname)
        // console.log(clientdata);
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
  useFocusEffect(
    useCallback(() => {
      getStatus();
      const fetchData = async () => {
        await getFullName();
        getclients();
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
    console.log(grouped);
    const data1 = Object.entries(grouped).map(([name, population], i) => ({
      name,
      population,
      color: getRandomColor(),
      legendFontColor: '#333',
      legendFontSize: 14
    }));
    setStatusdata(data1)
    // setJobs(data)
    // 
  }, [Jobs])
  return (
    <View style={styles.container}>
      <View style={styles.headbox}>
        <View style={styles.head}>
          <MaterialIcons name={'dashboard'} size={iconsize.sm} color='#2B7FFF' />
          <Text style={styles.headtext}>Dashboard</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={[styles.profilebox]}>
          <FontAwesome6 name={'circle-user'} size={iconsize.lg} />
          <Text >{Name}</Text>
        </View>
        <View style={[styles.box, { backgroundColor: '#00796B' }]}>
          <FontAwesome name={'briefcase'} size={iconsize.lg} color='#fff' />
          <View style={styles.box1}>
            <Text style={styles.boxtext}>{Jobs.length}</Text>
            <Text style={styles.boxtext}>Current</Text>
          </View>
        </View>
        <View style={[styles.box, { backgroundColor: '#D81B60' }]}>
          <Ionicons name={'eye'} size={iconsize.lg} color='#fff' />
          <View style={styles.box1}>
            <Text style={styles.boxtext}>{Audit.length}</Text>
            <Text style={styles.boxtext}>Audit</Text>
          </View>
        </View>
        <View style={[styles.box, { backgroundColor: '#512DA8' }]}>
          <FontAwesome name={'bookmark'} size={iconsize.lg} color='#fff' />
          <View style={styles.box1}>
            <Text style={styles.boxtext}>{Completed.length}</Text>
            <Text style={styles.boxtext}>Completed</Text>
          </View>
        </View>
        <View style={styles.chartbox}>
          <Text style={styles.title}>Current Jobs</Text>
          <PieChart
            data={Statusdata}
            width={screenWidth - 20}
            height={100}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'5'}
            absolute // shows actual numbers instead of percentage
          />
        </View>
      </View>
    </View>
  )
}

export default ClientDashboard
