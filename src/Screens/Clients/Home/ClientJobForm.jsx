import { View, Text, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native'
import { TextInput, RadioButton } from 'react-native-paper';
import React, { useCallback, useState } from 'react'
import JobStyles from '../../Styles/Jobs';
import Loader from '../../Loader';
import JobFormStyle from '../../Styles/JobForm';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { iconsize } from '../../../Constants/dimensions';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../../Plugins/axios';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const ClientJobForm = ({ route }) => {
  const JobId = route.params.id;

  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedTab, setselectedTab] = useState(0);
  const [Tabs, setTabs] = useState([]);
  const [fields, setfields] = useState([]);
  const [form, setForm] = useState({});
  const [Job, setJob] = useState({});
  const [show, setShow] = useState(false);
  const [Status, setStatus] = useState([]);
  const [SubStatus, setSubStatus] = useState([]);
  const [Client, setClient] = useState([]);

  const TabsData = {
    name: 'Home',
    fields: [
      {
        name: 'Job Id',
        code: 'Job Id'
      },
      {
        name: 'Client',
        code: 'Client'
      },
      {
        name: 'Status',
        code: 'Status'
      },
      {
        name: 'Sub Status',
        code: 'Sub-Status'
      }
    ]
  };
  const getStatus = async () => {
    try {
      const res = await api.get('/status');
      setStatus(res.data);
      return true;   // <-- return something
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  const getSubStatus = async () => {
    try {
      const res = await api.get('/subStatus');
      setSubStatus(res.data);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  const getClient = async () => {
    try {
      const res = await api.get('/clients');
      setClient(res.data);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  const getTabs = async () => {
    await api.post('/jobs/fields/client').then(res => {
      const data = [TabsData, res.data].flat();
      setLoading(false)
      setTabs(data);
      setfields(data[selectedTab].fields);
      // console.log();
    }).catch(err => {
      console.log(err);
    })

  };
  const getJobDetails = async () => {
    await api.get('/jobs/' + JobId).then(res => {
      const clientName = Client.find(obj => obj.id === res.data.Client)?.name;
      const StatusName = Status.find(obj => obj.id === res.data.Status)?.name;
      const SubStatusName = SubStatus.find(obj => obj.id === res.data.SubStatus)?.name;
      res.data.Client = clientName
      res.data.Status = StatusName
      res.data.SubStatus = SubStatusName
      setJob(res.data)
    }).catch(err => {
      console.log(err);
    })
    // console.log(JobId);
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
      setForm(data)
      // console.log(data);
    } catch (error) {
      console.log(error);
    }

  };
  const renderField = (field) => {
    switch (field.code) {
      case 'UID':
        return (<>
          <View style={JobFormStyle.labelbox}>
            <Text>{String(field.name)}<Text style={field.required ? JobFormStyle.cr : JobFormStyle.cw}>*</Text></Text>
          </View>
          <TextInput
            mode="outlined"
            style={JobFormStyle.input}
            value={String(Job.UID || '')}
            editable={false}
          />
        </>
        );
      case 'Job Id':
        return (
          <>
            <View style={JobFormStyle.labelbox}>
              <Text>{String(field.name)}<Text style={field.required ? JobFormStyle.cr : JobFormStyle.cw}>*</Text></Text>
            </View>
            <TextInput
              mode="outlined"
              outlineStyle={{ borderColor: '#71717B', borderWidth: 1 }}
              style={JobFormStyle.input}
              value={String(Job.JobId || '')}
              editable={false}
            />
          </>

        );
      case 'Status':
        return (
          <>
            <View style={JobFormStyle.labelbox}>
              <Text>{String(field.name)}<Text style={field.required ? JobFormStyle.cr : JobFormStyle.cw}>*</Text></Text>
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
              labelField="name"
              valueField="name"
              placeholder="Select Status"
              searchPlaceholder="Search..."
              value={String(Job.Status || '')}
              renderItem={(item) => selectedoption(item.name, Job.Status)}
              disable={true}
            />
          </>
        );
      case 'Sub-Status':
        return (
          <>
            <View style={JobFormStyle.labelbox}>
              <Text>{String(field.name)}<Text style={field.required ? JobFormStyle.cr : JobFormStyle.cw}>*</Text></Text>
            </View>
            <Dropdown
              style={JobFormStyle.dropdown}
              containerStyle={JobFormStyle.dropdownContainer}
              placeholderStyle={JobFormStyle.placeholderStyle}
              selectedTextStyle={JobFormStyle.selectedTextStyle}
              itemTextStyle={JobFormStyle.itemTextStyle}
              inputSearchStyle={JobFormStyle.inputSearchStyle}
              data={SubStatus}
              search
              maxHeight={300} // show ~7 items, then scroll
              labelField="name"
              valueField="name"
              placeholder="Select Sub Status"
              searchPlaceholder="Search..."
              value={String(Job.SubStatus || '')}
              renderItem={(item) => selectedoption(item.name, Job.SubStatus)}
              disable={true}
            />
          </>
        );
      case 'Client':
        return (
          <>
            <View style={JobFormStyle.labelbox}>
              <Text>{String(field.name)}<Text style={field.required ? JobFormStyle.cr : JobFormStyle.cw}>*</Text></Text>
            </View>
            <Dropdown
              style={JobFormStyle.dropdown}
              containerStyle={JobFormStyle.dropdownContainer}
              placeholderStyle={JobFormStyle.placeholderStyle}
              selectedTextStyle={JobFormStyle.selectedTextStyle}
              itemTextStyle={JobFormStyle.itemTextStyle}
              inputSearchStyle={JobFormStyle.inputSearchStyle}
              data={Client}
              search
              maxHeight={300}
              labelField="name"
              valueField="name"
              placeholder="Select Client"
              searchPlaceholder="Search..."
              value={String(Job.Client || '')}
              renderItem={(item) => selectedoption(item.name, Job.Client)}
              disable={true}
            />

          </>
        );
      default:
        if (field.type === 'text') {
          return (
            <>
              <View style={JobFormStyle.labelbox}>
                <Text>{String(field.name)}<Text style={field.required ? JobFormStyle.cr : JobFormStyle.cw}>*</Text></Text>
              </View>
              <TextInput
                mode="outlined"
                style={JobFormStyle.input}
                outlineStyle={JobFormStyle.TextInputoutline}
                placeholder={`Enter ${field.name}`}
                value={String(form[field.id] || '')}
                placeholderTextColor={'#999'}
                editable={true}
              />
            </>
          );
        }
        else if (field.type === 'textArea') {
          return (
            <>
              <View style={JobFormStyle.labelbox}>
                <Text>{String(field.name)}<Text style={field.required ? JobFormStyle.cr : JobFormStyle.cw}>*</Text></Text>
              </View>
              <TextInput
                mode="outlined"
                style={JobFormStyle.textArea}
                outlineStyle={JobFormStyle.TextInputoutline}
                placeholder={`Enter ${field.name}`}
                value={String(form[field.id] || '')}
                placeholderTextColor={'#999'}
                editable={true}
                multiline
              />
            </>
          );
        }
        else if (field.type === 'number') {
          return (
            <>
              <View style={JobFormStyle.labelbox}>
                <Text>{String(field.name)}<Text style={field.required ? JobFormStyle.cr : JobFormStyle.cw}>*</Text></Text>
              </View>
              <TextInput
                mode="outlined"
                style={JobFormStyle.input}
                outlineStyle={JobFormStyle.TextInputoutline}
                keyboardType="number-pad"
                placeholder={`Enter ${field.name}`}
                value={String(form[field.id] || '') || ''}
                placeholderTextColor={'#999'}
                editable={true}
              />
            </>
          );
        }
        else if (field.type === 'singleSelect') {
          return (<>
            <View style={JobFormStyle.labelbox}>
              <Text>{String(field.name)}<Text style={field.required ? JobFormStyle.cr : JobFormStyle.cw}>*</Text></Text>
            </View>
            <Dropdown
              style={JobFormStyle.dropdown}
              containerStyle={JobFormStyle.dropdownContainer}
              placeholderStyle={JobFormStyle.placeholderStyle}
              selectedTextStyle={JobFormStyle.selectedTextStyle}
              itemTextStyle={JobFormStyle.itemTextStyle}
              inputSearchStyle={JobFormStyle.inputSearchStyle}
              data={field.options}
              search
              maxHeight={300}
              labelField="name"
              valueField="value"
              placeholder={`Select ${field.name}`}
              searchPlaceholder="Search..."
              value={String(form[field.id] || '') || ''}
              renderItem={(item) => selectedoption(item.name, form[field.id])}
              disable={false}
            />
          </>
          );
        }
        else if (field.type === 'multiSelect') {
          return (
            <>
              <View style={JobFormStyle.labelbox}>
                <Text>{String(field.name)}<Text style={field.required ? JobFormStyle.cr : JobFormStyle.cw}>*</Text></Text>
              </View>
              <MultiSelect
                style={JobFormStyle.dropdown}
                containerStyle={JobFormStyle.dropdownContainer}
                placeholder={<Text>{displayText(form[field.id], field.name)}</Text>}
                placeholderStyle={{ color: form[field.id]?.length > 0 ? '#000' : '#999' }}
                selectedStyle={{ display: 'none' }}
                selectedTextStyle={{ color: 'transparent', }} // hide selected items
                itemTextStyle={JobFormStyle.itemTextStyle}
                inputSearchStyle={JobFormStyle.inputSearchStyle}
                searchPlaceholder="Search..."
                data={field.options}
                search
                labelField="name"
                valueField="value"
                multiple
                maxHeight={300}
                renderItem={(item) => selectedoptions(item, 'value', form[field.id])}
                disable={false}
              />
            </>
          );
        }
        else if (field.type === 'radio') {
          return (<>
            <View style={JobFormStyle.labelbox}>
              <Text>{String(field.name)}<Text style={field.required ? JobFormStyle.cr : JobFormStyle.cw}>*</Text></Text>
            </View>
            <View style={JobFormStyle.row}>
              {
                field.options.length > 0 && field.options.map((item, index) => (
                  <View key={item.value} style={JobFormStyle.option}>
                    <View style={{ transform: [{ scale: 0.8 }] }}>
                      <RadioButton
                        value={String(item.value || '')}
                        status={form[field.id] === item.value ? "checked" : "unchecked"}
                        disabled={false}   // ✔ button won't change anymore
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
              <View style={JobFormStyle.labelbox}>
                <Text>{String(field.name)}<Text style={field.required ? JobFormStyle.cr : JobFormStyle.cw}>*</Text></Text>
              </View>
              <TouchableOpacity style={JobFormStyle.calendar} >
                <FontAwesome5 name="calendar-alt" size={iconsize.sm} color="#FFF" style={{ backgroundColor: '#0343CE', width: '12%', paddingLeft: 10, paddingVertical: 6 }} onPress={() => setShow(field.id)} />
                <Text style={{ width: '100%', paddingVertical: 10 }}>{form[field.id]}</Text>
              </TouchableOpacity>
              {show === field.id && (
                <DateTimePicker
                  value={parseDate(form[field.id] || '') || ''}
                  mode="date"
                  display="default"
                />
              )}
            </>
          );
        }
        else if (field.type === 'file') {
          return (<>
            <View style={JobFormStyle.labelbox}>
              <Text>{String(field.name)}<Text style={field.required ? JobFormStyle.cr : JobFormStyle.cw}>*</Text></Text>
            </View>
            <TextInput
              mode="outlined"
              style={JobFormStyle.input}
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
  const displayText = (data, fname) => {
    let text = 'Select ' + fname;
    if (data && data.length > 0) {
      if (data.length > 1) {
        text = `${data[0]} +${data.length - 1} more`;
      } else {
        text = data[0];
      }
    }
    return String(text || '');
  };
  const parseDate = (str) => {
    if (!str) {
      return new Date(); // fallback: today
    }
    const [day, month, year] = str.split("-").map(Number);
    return new Date(year, month - 1, day); // month - 1 because JS months are 0-based
  };
  const handleTabs = (ind) => {
    setselectedTab(ind)
    const findFields = Tabs.find((_, i) => i === ind).fields;
    setfields(findFields);
    // console.log(findFields);
  }
  const check = () => {
    console.log(fields);
  };
  const loadData = async () => {
    await getStatus();        // step 1
    await getSubStatus();     // step 2
    await getClient();        // step 3
    await getJobDetails();    // step 4
    await getJobData();       // step 6
    await getTabs();          // step 5
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  if (loading) {
    return <View style={JobStyles.loadingbox}>
      <Loader />
    </View>
  }
  return (
    <View style={JobFormStyle.container}>
      <View style={JobFormStyle.head}>
        <Text style={JobFormStyle.headtext}>{Job.UID ? String(Job.UID) : ''}</Text>
        <Text style={[JobFormStyle.headtext]} onPress={check}>{Tabs[selectedTab] ? String(Tabs[selectedTab].name) : ''}</Text>
        <Icon name="tab" size={iconsize.md} color="#FFF" onPress={() => setVisible(true)} />
      </View>
      <View style={JobFormStyle.fieldsbox1}>
        <ScrollView contentContainerStyle={JobFormStyle.fieldsbox2}>
          {
            fields.length > 0 && fields.map((field, index) => {
              return <View style={JobFormStyle.fieldbox} key={index}>
                {renderField(field)}
              </View>
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
          <View style={JobFormStyle.modalOverlay}>
            <View style={JobFormStyle.modalContent}>
              {
                Tabs.length > 0 ? Tabs.map((tab, index) =>
                  <TouchableOpacity style={[JobFormStyle.TabCell, selectedTab === index ? JobFormStyle.blb : JobFormStyle.bb]} key={index} onPress={() => { handleTabs(index) }}>
                    {
                      tab.name && <Text style={JobFormStyle.TabText}>{tab.name.replace(/\b\w/g, (char) => char.toUpperCase())}</Text>
                    }
                  </TouchableOpacity>
                ) : <View style={JobFormStyle.Nodata}> <Text style={{ color: 'red' }}>No Tabs Found</Text> </View>
              }
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default ClientJobForm