import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput, RadioButton } from 'react-native-paper';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import DateTimePicker from "@react-native-community/datetimepicker";
import JobFormStyle from '../../Styles/JobForm';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import api from '../../../Plugins/axios';
import { iconsize } from '../../../Constants/dimensions';

const SubJobForm = ({ route, navigation }) => {
  const SJobId = route.params.id;
  const Action = route.params.action;

  const [Fields, setFields] = useState([]);
  const [Tab, setTab] = useState('');
  const [SubJob, setSubJob] = useState([]);
  const [SubJobData, setSubJobData] = useState({});
  const [show, setShow] = useState(false);


  const getcategory = async () => {
    try {
      const staticfield = await api.get('fields/onlystatic');
      const sjobs = await api.get(`/subjobscategory/subjobform/${SJobId}`);
      const JobId = sjobs.data[0].JobId ? sjobs.data[0].JobId : null
      const subjobconfigId = sjobs.data[0].category
      const categoryid = sjobs.data[0].id
      const config = await api.get('/subjobs');
      const subjobconfigname = config.data.find(th => th.id === subjobconfigId).name;
      const fields = config.data.find(th => th.id === sjobs.data[0].category)
      const data = JSON.parse(fields.fields)
      const body = {
        fields: data
      }
      const fieldoption = await api.post('/groupAccess/subjobs', body)
      getFields()
      setFields(fieldoption.data)
      setTab(subjobconfigname)
      setSubJob(sjobs.data)
      // console.log(fieldoption.data)
    } catch (error) {
      console.log('Err', error)
    }
  };
  const getFields = async () => {
    try {
      const fields = await api.get('/fields');
      // console.log(fields)
    } catch (error) {
      console.log('Err', error)
    }
  };
  const getSubJobData = async () => {
    try {
      const formData = await api.get(`/subjobsdata/${SJobId}`)
      const value = formData.data;
      const formvalue = {}
      value.forEach((form) => {
        if ((form.type === 'multiSelect' || form.type === 'checkbox') && (form.value !== null && form.value !== undefined)) {
          try {
            const jcvalue = JSON.parse(form.value)
            let data
            if (Array.isArray(jcvalue)) {
              data = jcvalue
            } else {
              const valueAsString = String(form.value || '')
              const cleanedString = valueAsString.replace(/^'|'$/g, '')
              data = cleanedString.split(/[,!?;…]+/).filter(Boolean)
            }
            formvalue[form.fieldId] = data
          } catch (e) {
            let data
            if (Array.isArray(form.value)) {
              data = form.value
            } else {
              const valueAsString = String(form.value || '')
              const cleanedString = valueAsString.replace(/^'|'$/g, '')
              data = cleanedString.split(/[,!?;…]+/).filter(Boolean)
            }
            formvalue[form.fieldId] = data
          }
        } else if ((form.type === 'radio' || form.type === 'singleSelect') && (form.value !== null && form.value !== undefined)) {
          // console.log(form.value, 'value')
          let data
          let radiodata
          try {
            // radiodata = JSON.parse(form.value)
            const data1 = JSON.parse(form.value)
            radiodata = data1.name ? data1.value : data1
            // console.log(val)
          } catch (e) {
            radiodata = form.value
          }
          if (Object.keys(radiodata)) {
            data = radiodata
          }
          formvalue[form.fieldId] = data
        } else {
          formvalue[form.fieldId] = form.value
        }
      });
      setSubJobData(formvalue)
      // console.log(formvalue)
    } catch (error) {
      console.log('Err', error)
    }
  };
  const renderField = (field) => {
    if (field.type === 'text' || field.type === 'textArea') {
      return (
        <>
          <View style={JobFormStyle.labelbox}>
            <Text>{field.name}</Text>
          </View>
          <TextInput
            mode="outlined"
            style={JobFormStyle.input}
            outlineStyle={{ borderColor: '#71717B', borderWidth: 1 }}
            placeholder={`Enter ${field.name}`}
            value={SubJobData[field.id] ? String(SubJobData[field.id]) : ''}
            placeholderTextColor={'#999'}
          // onChangeText={(text) => handleJobData(field.id, text)}
          />
        </>
      );
    }
    else if (field.type === 'number') {
      return (
        <>
          <View style={JobFormStyle.labelbox}>
            <Text>{field.name}</Text>
          </View>
          <TextInput
            mode="outlined"
            style={JobFormStyle.input}
            outlineStyle={{ borderColor: '#71717B', borderWidth: 1 }}
            keyboardType="number-pad"
            placeholder={`Enter ${field.name}`}
            value={SubJobData[field.id] ? String(SubJobData[field.id]) : ''}
            placeholderTextColor={'#999'}
          // onChangeText={(text) => handleJobData(field.id, text)}
          />
        </>
      );
    }
    else if (field.type === 'singleSelect') {
      return (<>
        <View style={JobFormStyle.labelbox}>
          <Text>{field.name}</Text>
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
          value={String(SubJobData[field.id]) || ''}
        // onChange={item => handleJobData(field.id, item.value)}
        // renderItem={(item) => selectedoption(item.name, form[field.id])}
        />
      </>
      );
    }
    else if (field.type === 'multiSelect') {
      return (
        <>
          <View style={JobFormStyle.labelbox}>
            <Text>{field.name}</Text>
          </View>
          <MultiSelect
            style={JobFormStyle.dropdown}
            containerStyle={JobFormStyle.dropdownContainer}
            placeholder={displayText(SubJobData[field.id], field.name)}
            placeholderStyle={{ color: SubJobData[field.id]?.length > 0 ? '#000' : '#999' }}
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
          // onChange={items => handleJobData(field.id, items)}
          // renderItem={(item) => selectedoptions(item, 'value', form[field.id])}
          />
        </>
      );
    }
    else if (field.type === 'radio') {
      return (<>
        <View style={JobFormStyle.labelbox}>
          <Text>{field.name}</Text>
        </View>
        <View style={JobFormStyle.row}>
          {
            field.options.length > 0 && field.options.map((item, index) => (
              <View key={item.value} style={JobFormStyle.option}>
                <View style={{ transform: [{ scale: 0.8 }] }}>
                  <RadioButton
                    value={String(item.value) || ''}
                    status={SubJobData[field.id] === item.value ? "checked" : "unchecked"}
                  // onPress={() => handleJobData(field.id, item.value)}
                  />
                </View>
                <Text>{item.name}</Text>
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
            <Text>{field.name}</Text>
          </View>
          <TouchableOpacity style={JobFormStyle.calendar} >
            <FontAwesome5 name="calendar-alt" size={iconsize.sm} color="#FFF" style={{ backgroundColor: '#0343CE', width: '12%', paddingLeft: 10, paddingVertical: 6 }} onPress={() => setShow(field.id)} />
            <Text style={{ width: '100%', paddingVertical: 10 }}>{SubJobData[field.id] ? String(SubJobData[field.id]) : ''}</Text>
          </TouchableOpacity>
          {show === field.id && (
            <DateTimePicker
              value={parseDate(SubJobData[field.id]) || ''}
              mode="date"
              display="default"
            // onChange={(event, selectedDate) => handleDateChange(field.id, event, selectedDate)}
            />
          )}
        </>
      );
    }
    else if (field.type === 'file') {
      return (<>
        <View style={JobFormStyle.labelbox}>
          <Text>{field.name}</Text>
        </View>
        <TextInput
          mode="outlined"
          style={JobFormStyle.input}
          placeholder={`Enter ${field.name}`}
          value={SubJobData[field.id] ? String(SubJobData[field.id]) : ''}
          placeholderTextColor={'#999'}
          editable={false}
        />
      </>
      );
    }
  };
  const displayText = (data, fname) => {
    if (data && data.length > 0) {
      if (data.length > 1) {
        return data[0] + ` +${data.length - 1} more`
      } else {
        return data[0]
      }
    }
    else {
      return 'Select ' + fname;
    }
  };
  const parseDate = (str) => {
    if (!str) {
      return new Date(); // fallback: today
    }
    const [day, month, year] = str.split("-").map(Number);
    return new Date(year, month - 1, day); // month - 1 because JS months are 0-based
  };
  useEffect(() => {
    // console.log(SJobId);
    getcategory()
    getSubJobData()
  }, [SJobId])

  return (
    <View style={JobFormStyle.container}>
      <View style={JobFormStyle.head}>
        <Text style={[JobFormStyle.headtext]}>{SubJob[0]?.SJUID?.toString() || ''}</Text>
        <Text style={JobFormStyle.headtext}>{Tab}</Text>
      </View>
      <View style={Action ? JobFormStyle.fieldsbox : JobFormStyle.fieldsbox1}>
        <ScrollView contentContainerStyle={JobFormStyle.scrollbox}>
          {
            Fields.length > 0 && Fields.map((field) => {
              return <View style={JobFormStyle.fieldbox} key={field.id}>
                {renderField(field)}
              </View>
            })
          }
        </ScrollView>
      </View>
      {
        Action && <View style={JobFormStyle.actionbox}>
          <TouchableOpacity style={[JobFormStyle.btn, JobFormStyle.green]}><Text style={JobFormStyle.cw}>Save</Text></TouchableOpacity>
          <TouchableOpacity style={[JobFormStyle.btn, JobFormStyle.green]}><Text style={JobFormStyle.cw}>Submit</Text></TouchableOpacity>
        </View>
      }
    </View>
  )
}

export default SubJobForm