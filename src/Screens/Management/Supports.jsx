import { Text, View, ScrollView, Pressable, Modal, TouchableWithoutFeedback, TouchableOpacity, TextInput as Textinput } from 'react-native'
import { TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import React, { useCallback, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../Plugins/axios';
import { iconsize } from '../../Constants/dimensions';
import Loader from '../Loader';
import JobFormStyle from '../Styles/JobForm';
import JobStyles from '../Styles/Jobs';
import Toast from 'react-native-toast-message';

const Supports = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [ShowForm, setShowForm] = useState(false);
  const [Reports, setReports] = useState([]);
  const [Report, setReport] = useState({});
  const [Users, setUsers] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const Type = [
    { value: 'Issue', name: 'Issue' },
    { value: 'Change Request', name: 'Change Request' },
    { value: 'Service Request', name: 'Service Request' }
  ]
  const severity = [
    { value: 'Severity1 (Critical Impact like System Down. Complete system outage)', name: 'Severity1 (Critical Impact like System Down. Complete system outage)' },
    { value: 'Severity2 (Significant Impact/Severe downgrade of services)', name: 'Severity2 (Significant Impact/Severe downgrade of services)' },
    { value: 'Severity3 (Minor impact/Most of the system is functioning properly)', name: 'Severity3 (Minor impact/Most of the system is functioning properly)' },
    { value: 'Severity4 (Low Impact/Informational)', name: 'Severity4 (Low Impact/Informational)' },
  ];
  const Status = [
    { value: 'Open', name: 'Open' },
    { value: 'Closed', name: 'Closed' },
  ]
  const headers = [
    {
      text: 'Title',
      value: 'Title'
    },
    {
      text: 'Type',
      value: 'Type'
    },
    {
      text: 'Status',
      value: 'Status'
    },
    {
      text: 'User',
      value: 'UserId'
    },
    {
      text: 'E-Mail Id',
      value: 'Useremail'
    },
    {
      text: 'Priority',
      value: 'Severity'
    },
  ];
  const getUsers = async () => {
    await api.get('/users').then((res) => {
      setUsers(res.data)
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getReports = async () => {
    await api.get('/support').then((res) => {
      const data = res.data;
      if (data.length) {
        const NewData = data.map((val) => {
          const UserId = val.UserId;
          const userName = Users.find((user) => user.id === UserId);
          const fullName = userName ? `${userName.firstName} ${userName.lastName}` : '';
          val.UserId = fullName
          return val
        });
        setReports(NewData)
        // console.log(NewData);
      }
      else {
        setLoading(false);
      }
      // console.log(data);
    })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const selectedoption = (name1, name2) => {
    const isSelected = name1 === name2;
    return (
      <View style={{ padding: 8, backgroundColor: isSelected ? '#8AC0FF' : 'white' }} >
        <Text style={{ color: isSelected ? 'white' : 'black' }}>{String(name1)}</Text>
      </View>
    );
  };
  const handleReport = (id) => {
    const findReport = Reports.find(obj => obj.id === id)
    setReport(findReport);
    setShowForm(true);
    // console.log(findReport);
  };
  const handleChange = (key, value) => {
    setReport(prev => ({ ...prev, [key]: value }))
  };
  const submit = async () => {
    await api.put(`/support/${Report.id}`, Report).then((res) => {
      getReports()
      Toast.show({
        type: 'success',
        text1: 'Support',
        text2: res.data,
        visibilityTime: 1000,
      });
    }).catch((err) => {
      console.log('err', err);
    });
    // console.log(Report);
    setShowForm(false)
  }
  useFocusEffect(
    useCallback(() => {
      getUsers();
      getReports();
    }, [])
  );
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredJobs(Reports);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredJobs(
        Reports.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(lowerSearch)
          )
        )
      );
    }
  }, [search, Reports]);
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
          <Textinput
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
                        onPress={() => handleReport(obj.id)}
                      // onPress={() => navigation.navigate('JobForm', { id: obj.id, name: 'AllJobs', action: false})}
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
      <Modal
        visible={ShowForm}
        transparent
        animationType="fade">
        <TouchableWithoutFeedback>
          <View style={JobFormStyle.ApprovalmodalOverlay}>
            <View style={JobFormStyle.SupportmodalContent}>
              <View style={JobFormStyle.supportHeadBox}>
                <MaterialIcons name="support-agent" size={20} color="blue" style={JobStyles.icon} />
                <Text>Support</Text>
              </View>
              <View style={JobFormStyle.supportFormBox}>
                <View style={JobFormStyle.fieldbox}>
                  <View style={JobFormStyle.labelbox}>
                    <Text>Title<Text style={JobFormStyle.cr}>*</Text></Text>
                  </View>
                  <TextInput
                    mode="outlined"
                    style={JobFormStyle.input}
                    outlineStyle={JobFormStyle.TextInputoutline}
                    placeholder={'Enter Title'}
                    value={Report.Title || ''}
                    placeholderTextColor={'#999'}
                    onChangeText={(text) => handleChange('Title', text)}
                  />
                </View>
                <View style={JobFormStyle.fieldbox}>
                  <View style={JobFormStyle.labelbox}>
                    <Text>Type<Text style={JobFormStyle.cr}>*</Text></Text>
                  </View>
                  <Dropdown
                    style={JobFormStyle.dropdown}
                    containerStyle={JobFormStyle.dropdownContainer}
                    placeholderStyle={JobFormStyle.placeholderStyle}
                    selectedTextStyle={JobFormStyle.selectedTextStyle}
                    itemTextStyle={JobFormStyle.itemTextStyle}
                    inputSearchStyle={JobFormStyle.inputSearchStyle}
                    data={Type}
                    search
                    maxHeight={300}
                    labelField="name"
                    valueField="value"
                    placeholder={`Select`}
                    searchPlaceholder="Search..."
                    value={Report.Type || ''}
                    onChange={item => {
                      handleChange('Type', item.value)
                    }}
                    renderItem={(item) => selectedoption(item.name, Report.Type)}
                  />
                </View>
                <View style={JobFormStyle.fieldbox}>
                  <View style={JobFormStyle.labelbox}>
                    <Text>Severity<Text style={JobFormStyle.cr}>*</Text></Text>
                  </View>
                  <Dropdown
                    style={JobFormStyle.dropdown}
                    containerStyle={JobFormStyle.dropdownContainer}
                    placeholderStyle={JobFormStyle.placeholderStyle}
                    selectedTextStyle={JobFormStyle.selectedTextStyle}
                    itemTextStyle={JobFormStyle.itemTextStyle}
                    inputSearchStyle={JobFormStyle.inputSearchStyle}
                    data={severity}
                    search
                    maxHeight={300}
                    labelField="name"
                    valueField="value"
                    placeholder={`Select`}
                    searchPlaceholder="Search..."
                    value={Report.Severity || ''}
                    onChange={item => {
                      handleChange('Severity', item.value)
                    }}
                    renderItem={(item) => selectedoption(item.value, Report.Severity)}
                  />
                </View>
                <View style={JobFormStyle.fieldbox}>
                  <View style={JobFormStyle.labelbox}>
                    <Text>Status<Text style={JobFormStyle.cr}>*</Text></Text>
                  </View>
                  <Dropdown
                    style={JobFormStyle.dropdown}
                    containerStyle={JobFormStyle.dropdownContainer}
                    placeholderStyle={JobFormStyle.placeholderStyle}
                    selectedTextStyle={JobFormStyle.selectedTextStyle}
                    itemTextStyle={JobFormStyle.itemTextStyle}
                    inputSearchStyle={JobFormStyle.inputSearchStyle}
                    data={Status}
                    search
                    maxHeight={300}
                    labelField="name"
                    valueField="value"
                    placeholder={`Select`}
                    searchPlaceholder="Search..."
                    value={Report.Status || ''}
                    onChange={item => {
                      handleChange('Status', item.value)
                    }}
                    renderItem={(item) => selectedoption(item.value, Report.Status)}
                  />
                </View>
                <View style={JobFormStyle.fieldbox}>
                  <View style={JobFormStyle.labelbox}>
                    <Text>Attachment</Text>
                  </View>
                  <TextInput
                    mode="outlined"
                    style={JobFormStyle.input}
                    outlineStyle={JobFormStyle.TextInputoutline}
                    value={Report.Attachment || ''}
                    placeholderTextColor={'#999'}
                  />
                </View>
                <View style={JobFormStyle.fieldbox}>
                  <View style={JobFormStyle.labelbox}>
                    <Text>Remarks<Text style={JobFormStyle.cr}>*</Text></Text>
                  </View>
                  <TextInput
                    mode="outlined"
                    style={JobFormStyle.input}
                    outlineStyle={JobFormStyle.TextInputoutline}
                    placeholder={'Enter Remarks'}
                    value={Report.Remarks || ''}
                    placeholderTextColor={'#999'}
                    onChangeText={(text) => handleChange('Remarks', text)}
                  />
                </View>
                <View style={JobFormStyle.fieldbox}>
                  <View style={JobFormStyle.labelbox}>
                    <Text>Description</Text>
                  </View>
                  <TextInput
                    mode="outlined"
                    style={JobFormStyle.textArea}
                    outlineStyle={JobFormStyle.TextInputoutline}
                    placeholder={'Enter Description'}
                    value={Report.Description || ''}
                    placeholderTextColor={'#999'}
                    onChangeText={(text) => handleChange('Description', text)}
                    multiline
                  />
                </View>
              </View>
              <View style={JobFormStyle.actionbox}>
                <TouchableOpacity style={[JobFormStyle.btn, JobFormStyle.gray]} onPress={() => setShowForm(false)}><Text style={JobFormStyle.cw}>Close</Text></TouchableOpacity>
                <TouchableOpacity style={[JobFormStyle.btn, JobFormStyle.green]} onPress={submit}><Text style={JobFormStyle.cw}>Submit</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default Supports