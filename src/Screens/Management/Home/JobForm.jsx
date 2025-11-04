import { ScrollView, ActivityIndicator, Text, View, TouchableOpacity, Platform, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { TextInput, RadioButton } from 'react-native-paper';
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { format } from "date-fns";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../Styles/JobFormStyle';
import api from '../../../Plugins/axios';
import { iconsize } from '../../../Constants/dimensions';
import jobsstyles from '../../Styles/JobsStyle';
import Loader from '../../Loader';

const JobForm = ({ route, navigation }) => {
  const JobId = route.params.id;
  const PageName = route.params.name;
  const Action = route.params.action;


  const [Language, setLanguage] = useState('English');
  const [Status, setStatus] = useState([]);
  const [SubStatus, setSubStatus] = useState([]);
  const [Client, setClient] = useState([]);
  const [Owner, setOwner] = useState([]);
  const [Users, setUsers] = useState([]);
  const [Tabs, setTabs] = useState([]);
  const [selectedTab, setselectedTab] = useState(0);
  const [fields, setfields] = useState([]);
  const [Job, setJob] = useState({});
  const [form, setForm] = useState({});
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  AsyncStorage.getItem('Language').then((name) => {
    setLanguage(name);
  });

  const getStatus = async () => {
    try {
      const res = await api.get('/status');
      setStatus(res.data);
      // console.log(res.data);

    } catch (err) {
      console.log('Error fetching status:', err);
    }
  };
  const getSubStatus = async () => {
    try {
      const res = await api.get('/subStatus');
      setSubStatus(res.data);
    } catch (err) {
      console.log('Error fetching sub-status:', err);
    }
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
      res.data.map((user) => (user.fullname = `${user.firstName}${user.lastName}`));
      setUsers(res.data)
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const getJobDeatils = async () => {
    await api.get('/jobs/' + JobId).then((res) => {
      const job = res.data;
      job.Client = Client.find((C) => C.id === job.Client)?.name
      job.Status = Status.find((S) => S.id === job.Status)?.name
      job.SubStatus = SubStatus.find((SS) => SS.id === job.SubStatus)?.name
      job.Owner = Owner.find((O) => O.id === job.Owner)?.name
      const AssignTodata = Users.filter(U => job.AssignTo.includes(U.id)).map((user) => `${user.firstName}${user.lastName}`).join(',')
      job.AssignTo = AssignTodata.split(",")
      setJob(job);
      getJobData(job.id)
      // console.log(job);
    }).catch((err) => {
      console.log(err);

    })
  };
  const getJobData = async (id) => {
    // console.log(id);
    try {
      const res = await api.get('/jobData/' + id)
      const jobdata = res.data;
      const normalizedData = jobdata.map(obj => {
        if (Array.isArray(obj.value)) {
          return {
            ...obj,
            value: obj.value.map(val =>
              typeof val === "object" ? val.value : val
            )
          };
        } else if (obj.value && typeof obj.value === "object") {
          return {
            ...obj,
            value: obj.value.value
          };
        } else {
          return obj;
        }
      });
      const data = normalizedData.reduce((acc, obj) => {
        if (obj.value) {
          acc[obj.fieldId] = obj.value;
        }
        return acc;
      }, {});
      setForm(() => data)
      setLoading(false);
      // console.log(data);
    } catch (error) {
      console.log(error);
    }

  };
  const getTabs = async () => {
    await api.get(`/jobs/fields/${Language}`).then((res) => {
      setTabs(res.data);
      // console.log('tabs', res.data);
      handleTabs(0, res.data)
    }).catch((err) => {
      console.log('err', err);
    })
  };
  const handleTabs = async (ind, Tabs1) => {
    setselectedTab(ind);
    const data = Tabs1[ind].fields
    data.forEach(element => {
      element.name = element.name.replace(/^primary\./, '')
      return element
    });
    setfields(data)
    setVisible(false)
    // console.log(data);
  };
  const displayText = (data, fname) => {
    let text = 'Select ' + fname;
    if (data && data.length > 0) {
      if (data.length > 1) {
        text = `${data[0]} +${data.length - 1} more`;
      } else {
        text = data[0];
      }
    }
    return String(text);
  };
  const renderField = (field) => {
    switch (field.code) {
      case 'UID':
        return (<>
          <View style={styles.labelbox}>
            <Text>{String(field.name)}</Text>
          </View>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={String(Job.UID) || ''}
            editable={false}
          />
        </>

        );
      case 'Job Id':
        return (
          <>
            <View style={styles.labelbox}>
              <Text>{String(field.name)}</Text>
            </View>
            <TextInput
              mode="outlined"
              outlineStyle={{ borderColor: '#71717B', borderWidth: 1 }}
              style={styles.input}
              value={String(Job.JobId) || ''}
              onChangeText={(text) => handleJob("JobId", text)}
            />
          </>

        );
      case 'Status':
        return (
          <>
            <View style={styles.labelbox}>
              <Text>{String(field.name)}</Text>
            </View>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={Status}
              search
              labelField="name"
              valueField="name"
              placeholder="Select Status"
              searchPlaceholder="Search..."
              value={String(Job.Status) || ''}
              onChange={item => {
                handleJob('Status', item.name);
              }}
              renderItem={(item) => selectedoption(item.name, Job.Status)}
            />
          </>
        );
      case 'Sub-Status':
        return (
          <>
            <View style={styles.labelbox}>
              <Text>{String(field.name)}</Text>
            </View>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={SubStatus}
              search
              maxHeight={300} // show ~7 items, then scroll
              labelField="name"
              valueField="name"
              placeholder="Select Sub Status"
              searchPlaceholder="Search..."
              value={String(Job.SubStatus) || ''}
              onChange={item => {
                handleJob('SubStatus', item.name);
              }}
              renderItem={(item) => selectedoption(item.name, Job.SubStatus)}
            />
          </>
        );
      case 'Owner':
        return (
          <>
            <View style={styles.labelbox}>
              <Text>{String(field.name)}</Text>
            </View>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={Owner}
              search
              maxHeight={300} // show ~7 items, then scroll
              labelField="name"
              valueField="name"
              placeholder="Select Owner"
              searchPlaceholder="Search..."
              value={String(Job.Owner) || ''}
              onChange={item => {
                handleJob('Owner', item.name);
              }}
              renderItem={(item) => selectedoption(item.name, Job.Owner)}
            />
          </>
        );
      case 'Client':
        return (
          <>
            <View style={styles.labelbox}>
              <Text>{String(field.name)}</Text>
            </View>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={Client}
              search
              maxHeight={300}
              labelField="name"
              valueField="name"
              placeholder="Select Client"
              searchPlaceholder="Search..."
              value={String(Job.Client) || ''}
              onChange={item => handleJob('Client', item.name)}
              renderItem={(item) => selectedoption(item.name, Job.Client)}
            />

          </>
        );
      case 'AssignTo':
        return (
          <>
            <View style={styles.labelbox}>
              <Text>{String(field.name)}</Text>
            </View>
            <MultiSelect
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              placeholder={<Text>{displayText(Job.AssignTo)}</Text>}
              placeholderStyle={{ color: Job?.AssignTo && Job.AssignTo.length > 0 ? '#000' : '#999', fontSize: 14 }}
              selectedStyle={{ display: 'none' }}
              selectedTextStyle={{ color: 'transparent', }} // hide selected items
              itemTextStyle={styles.itemTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              searchPlaceholder="Search..."
              data={Users}
              search
              labelField="fullname"
              valueField="fullname"
              multiple
              maxHeight={300}
              onChange={item => {
                handleJob('AssignTo', item);
              }}
              renderItem={(item) => selectedoptions(item, 'fullname', Job.AssignTo)}
            />
          </>
        );
      default:
        if (field.type === 'text' || field.type === 'textArea') {
          return (
            <>
              <View style={styles.labelbox}>
                <Text>{String(field.name)}</Text>
              </View>
              <TextInput
                mode="outlined"
                style={styles.input}
                outlineStyle={styles.TextInputoutline}
                placeholder={`Enter ${field.name}`}
                value={String(form[field.id]) || ''}
                placeholderTextColor={'#999'}
                onChangeText={(text) => handleJobData(field.id, text)}
              />
            </>
          );
        }
        else if (field.type === 'number') {
          return (
            <>
              <View style={styles.labelbox}>
                <Text>{String(field.name)}</Text>
              </View>
              <TextInput
                mode="outlined"
                style={styles.input}
                outlineStyle={styles.TextInputoutline}
                keyboardType="number-pad"
                placeholder={`Enter ${field.name}`}
                value={String(form[field.id]) || ''}
                placeholderTextColor={'#999'}
                onChangeText={(text) => handleJobData(field.id, text)}
              />
            </>
          );
        }
        else if (field.type === 'singleSelect') {
          return (<>
            <View style={styles.labelbox}>
              <Text>{String(field.name)}</Text>
            </View>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={field.options}
              search
              maxHeight={300}
              labelField="name"
              valueField="value"
              placeholder={`Select ${field.name}`}
              searchPlaceholder="Search..."
              value={String(form[field.id]) || ''}
              onChange={item => {
                handleJobData(field.id, item.value)
              }}
              renderItem={(item) => selectedoption(item.name, form[field.id])}
            />
          </>
          );
        }
        else if (field.type === 'multiSelect') {
          return (
            <>
              <View style={styles.labelbox}>
                <Text>{String(field.name)}</Text>
              </View>
              <MultiSelect
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                placeholder={<Text>{displayText(form[field.id], field.name)}</Text>}
                placeholderStyle={{ color: form[field.id]?.length > 0 ? '#000' : '#999' }}
                selectedStyle={{ display: 'none' }}
                selectedTextStyle={{ color: 'transparent', }} // hide selected items
                itemTextStyle={styles.itemTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                searchPlaceholder="Search..."
                data={field.options}
                search
                labelField="name"
                valueField="value"
                multiple
                maxHeight={300}
                onChange={items => handleJobData(field.id, items)}
                renderItem={(item) => selectedoptions(item, 'value', form[field.id])}
              />
            </>
          );
        }
        else if (field.type === 'radio') {
          return (<>
            <View style={styles.labelbox}>
              <Text>{String(field.name)}</Text>
            </View>
            <View style={styles.row}>
              {
                field.options.length > 0 && field.options.map((item, index) => (
                  <View key={item.value} style={styles.option}>
                    <View style={{ transform: [{ scale: 0.8 }] }}>
                      <RadioButton
                        value={String(item.value) || ''}
                        status={form[field.id] === item.value ? "checked" : "unchecked"}
                        onPress={() => handleJobData(field.id, item.value)}
                      />
                    </View>
                    <Text>{String(item.name)}</Text>
                  </View>
                ))
              }
            </View>
          </>
          );
        }
        else if (field.type === 'date') {
          return (
            <>
              <View style={styles.labelbox}>
                <Text>{String(field.name)}</Text>
              </View>
              <TouchableOpacity style={styles.calendar} >
                <FontAwesome5 name="calendar-alt" size={iconsize.sm} color="#FFF" style={{ backgroundColor: '#0343CE', width: '12%', paddingLeft: 10, paddingVertical: 6 }} onPress={() => setShow(field.id)} />
                <Text style={{ width: '100%', paddingVertical: 10 }}>{form[field.id]}</Text>
              </TouchableOpacity>
              {show === field.id && (
                <DateTimePicker
                  value={parseDate(form[field.id]) || ''}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => handleDateChange(field.id, event, selectedDate)}
                />
              )}
            </>
          );
        }
        else if (field.type === 'file') {
          return (<>
            <View style={styles.labelbox}>
              <Text>{String(field.name)}</Text>
            </View>
            <TextInput
              mode="outlined"
              style={styles.input}
              placeholder={`Enter ${field.name}`}
              value={String(form[field.id] || '')}
              placeholderTextColor={'#999'}
              editable={false}
            />
          </>
          );
        }
        return null;
    }
  };
  const handleDateChange = (key, event, selectedDate) => {
    if (!selectedDate) return; // nothing picked

    if (Platform.OS === "android") {
      // Close picker if dismissed
      if (event.type === "dismissed") {
        setShow(false);
        return;
      }
      setShow(false); // close after selecting on Android
    }

    // iOS fires continuously as user scrolls → that’s okay if you want live updates
    const formatted = format(selectedDate, "dd-MM-yyyy");
    handleJobData(key, formatted);
  };
  const parseDate = (str) => {
    if (!str) {
      return new Date(); // fallback: today
    }
    const [day, month, year] = str.split("-").map(Number);
    return new Date(year, month - 1, day); // month - 1 because JS months are 0-based
  };
  const selectedoption = (name1, name2) => {
    const isSelected = name1 === name2;
    return (
      <View style={{ padding: 8, backgroundColor: isSelected ? '#8AC0FF' : 'white' }} >
        <Text style={{ color: isSelected ? 'white' : 'black' }}>{String(name1)}</Text>
      </View>
    );
  }
  const selectedoptions = (item, key, selectedValues) => {
    const isSelected = Array.isArray(selectedValues) && selectedValues.includes(item[key]);
    return (
      <View style={{ padding: 8, backgroundColor: isSelected ? '#8AC0FF' : 'white', }}>
        <Text style={{ color: isSelected ? 'white' : 'black' }}> {String(item[key])} </Text>
      </View>
    );
  };
  const handleJob = (key, value) => {
    setJob(prev => ({
      ...prev, [key]: value
    }));
    // console.log(key, value);
  }
  const handleJobData = (key, value) => {
    // console.log(key, value);
    setForm(prev => ({
      ...prev, [key]: value
    }));
  };
  useFocusEffect(
    useCallback(() => {
      getStatus()
      getSubStatus()
      getClient()
      getUsers()
      getTabs()
      getOwner()
    }, [])
  );
  useEffect(() => {
    getJobDeatils();
  }, [Owner]);
  if (loading) {
    return <View style={jobsstyles.loadingbox}>
      <Loader />
    </View>
  }
  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.headtext}>{Job.UID}</Text>
        <Text style={[styles.headtext]}>
          {Tabs[selectedTab]?.name?.toString().replace(/\b\w/g, (char) => char.toUpperCase()) || ''}
        </Text>
        <Icon name="tab" size={iconsize.md} color="#FFF" onPress={() => setVisible(true)} />
      </View>
      <View style={styles.fieldsbox1}>
        <ScrollView contentContainerStyle={{ gap: 15, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
          {
            fields.length > 0 && fields.map((field, index) => {
              return <View style={styles.fieldbox} key={index}>
                {renderField(field)}
              </View>
            })
          }
        </ScrollView>
      </View>
      <View style={styles.actionbox}>
        <TouchableOpacity style={[styles.btn, styles.gray]} onPress={() => navigation.navigate(PageName)}><Text style={styles.cw}>Close</Text></TouchableOpacity>
        {
          Action && <>
            <TouchableOpacity style={[styles.btn, styles.green]}><Text style={styles.cw}>Save</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.green]}><Text style={styles.cw}>Submit</Text></TouchableOpacity>
          </>
        }
      </View>
      <Modal
        visible={visible}
        transparent
        animationType="slide" // "fade", "none" also possible
        onRequestClose={() => setVisible(false)}
        onDismiss={() => setVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {
                Tabs.length > 0 ? Tabs.map((tab, index) =>
                  <TouchableOpacity style={[styles.TabCell, selectedTab === index ? styles.blb : styles.bb]} key={index} onPress={() => { handleTabs(index, Tabs) }}>
                    {
                      tab.name && <Text style={styles.TabText}>{tab.name.replace(/\b\w/g, (char) => char.toUpperCase())}</Text>
                    }
                  </TouchableOpacity>
                ) : <View style={styles.Nodata}> <Text style={{ color: 'red' }}>No Tabs Found</Text> </View>
              }
            </View>
          </View>
        </TouchableWithoutFeedback>

      </Modal>
    </View>
  )
}

export default JobForm

