import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { TextInput, RadioButton } from 'react-native-paper';
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { format } from "date-fns";
import { useFocusEffect } from '@react-navigation/native';
'../../Plugins/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
'../../Constants/dimensions';
import styles from '../../Styles/JobFormStyle';

const ClientForm = ({ route, navigation }) => {
  const ClientId = route.params.id;
  const PageName = route.params.name;
  const Action = route.params.action;
  const [clientdata, setclientdata] = useState({})

  const [Language, setLanguage] = useState('English');
  const Fields = [
    {
      name: 'Company Name',
      value: 'name'
    },
    {
      name: 'Company Display Name',
      value: 'displayname'
    },
    {
      name: 'Executive Name',
      value: 'executiveName'
    },
    {
      name: 'Executive Contact No.',
      value: 'executivePhone'
    },
    {
      name: 'Executive Email',
      value: 'executiveEmail',
    },
    {
      name: 'Contact Focal Name',
      value: 'contactFocalName',
    },
    {
      name: 'Contact Focal No.',
      value: 'contactFocalPhone'
    },
    {
      name: 'Contact Focal Email',
      value: 'contactFocalEmail'
    },
    {
      name: 'Address',
      value: 'address'
    },
    {
      name: 'City',
      value: 'city'
    },
    {
      name: 'State',
      value: 'state'
    },
    {
      name: 'Pincode',
      value: 'pincode'
    },
    {
      name: 'GSTIN',
      value: 'GSTIN'
    },
    {
      name: 'Permanent Account Number (PAN)',
      value: 'Pan'
    }
  ]
  AsyncStorage.getItem('Language').then((name) => {
    setLanguage(name);
  });
  const handleinput = (key, value) => {
    setclientdata(prev => (
      { ...prev, [key]: value }
    ))
  };
  const handlesubmit = async () => {
    console.log(clientdata);
    await api.put(`/clients/${ClientId}`, clientdata).then((res) => {
      // const data = res.data;
      navigation.navigate(PageName)
    })
      .catch((err) => {
        console.log('err', err);
      });
  };
  useEffect(() => {
    setclientdata(route.params.data);
  }, [ClientId])
  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.headtext}>{clientdata.name}</Text>
      </View>
      <View style={styles.fieldsbox1}>
        <ScrollView contentContainerStyle={{ gap: 15, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
          {
            Fields.map((field, index) => (
              <View style={styles.fieldbox} key={index}>
                <View style={styles.labelbox}>
                  <Text>{field.name}</Text>
                </View>
                <TextInput
                  mode="outlined"
                  outlineStyle={{ borderColor: '#71717B', borderWidth: 1 }}
                  style={styles.input}
                  value={clientdata[field.value]}
                  onChangeText={(text) => handleinput(field.value, text)}
                />
              </View>
            ))
          }

        </ScrollView>
      </View>
      <View style={styles.actionbox}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#8C93A1' }]} onPress={() => navigation.navigate(PageName)}><Text style={{ color: '#fff' }}>Close</Text></TouchableOpacity>
        {
          Action &&
          <TouchableOpacity style={[styles.btn, { backgroundColor: 'green' }]} onPress={handlesubmit}><Text style={{ color: '#fff' }}>Submit</Text></TouchableOpacity>
        }
      </View>
    </View>
  )
}

export default ClientForm