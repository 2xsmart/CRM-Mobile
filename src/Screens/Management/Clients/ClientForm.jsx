import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-paper';
import JobFormStyle from '../../Styles/JobForm';
import api from '../../../Plugins/axios';

const ClientForm = ({ route, navigation }) => {
  const ClientId = route.params.id;
  const [clientdata, setclientdata] = useState({})

  const Fields = [
    {
      name: 'Company Name',
      value: 'name',
      type: 'text'
    },
    {
      name: 'Company Display Name',
      value: 'displayname',
      type: 'text'
    },
    {
      name: 'Executive Name',
      value: 'executiveName',
      type: 'text'
    },
    {
      name: 'Executive Contact No.',
      value: 'executivePhone',
      type: 'number'
    },
    {
      name: 'Executive Email',
      value: 'executiveEmail',
      type: 'text'
    },
    {
      name: 'Contact Focal Name',
      value: 'contactFocalName',
      type: 'text'
    },
    {
      name: 'Contact Focal No.',
      value: 'contactFocalPhone',
      type: 'number'
    },
    {
      name: 'Contact Focal Email',
      value: 'contactFocalEmail',
      type: 'text'
    },
    {
      name: 'Address',
      value: 'address',
      type: 'text'
    },
    {
      name: 'City',
      value: 'city',
      type: 'text'
    },
    {
      name: 'State',
      value: 'state',
      type: 'text'
    },
    {
      name: 'Country',
      value: 'country',
      type: 'text'
    },
    {
      name: 'Pincode',
      value: 'pincode',
      type: 'number'
    },
    {
      name: 'GSTIN',
      value: 'GSTIN',
      type: 'text'
    },
    {
      name: 'Permanent Account Number (PAN)',
      value: 'Pan',
      type: 'text'
    }
  ]
  const handleinput = (key, value) => {
    setclientdata(prev => (
      { ...prev, [key]: value }
    ))
  };
  const handlesubmit = async () => {
    // console.log(clientdata);
    await api.put(`/clients/${ClientId}`, clientdata).then((res) => {
      navigation.navigate('ClientStack', {
        screen: 'Clients'
      })
    })
      .catch((err) => {
        console.log('err', err);
      });
  };
  useEffect(() => {
    setclientdata(route.params.data);
  }, [ClientId])
  return (
    <View style={JobFormStyle.container}>
      <View style={JobFormStyle.head}>
        <Text style={JobFormStyle.headtext}>{clientdata.name || ''}</Text>
      </View>
      <View style={JobFormStyle.fieldsbox}>
        <ScrollView contentContainerStyle={JobFormStyle.fieldsbox2}>
          {
            Fields.length && Fields.map((field, index) => (
              <View style={JobFormStyle.fieldbox} key={index}>
                <View style={JobFormStyle.labelbox}>
                  <Text>{field.name}</Text>
                </View>
                {
                  field.type === 'text' ? <TextInput
                    mode="outlined"
                    outlineStyle={{ borderColor: '#71717B', borderWidth: 1 }}
                    style={JobFormStyle.input}
                    value={clientdata[field.value] ? String(clientdata[field.value]) : ''}
                    onChangeText={(text) => handleinput(field.value, text)}
                  />
                    :
                    <TextInput
                      mode="outlined"
                      outlineStyle={{ borderColor: '#71717B', borderWidth: 1 }}
                      keyboardType="number-pad"
                      style={JobFormStyle.input}
                      value={clientdata[field.value] ? String(clientdata[field.value]) : ''}
                      onChangeText={(text) => handleinput(field.value, text)}
                    />
                }

              </View>
            ))
          }
        </ScrollView>
      </View>
      <View style={JobFormStyle.actionbox}>
        <TouchableOpacity style={[JobFormStyle.btn, { backgroundColor: 'green' }]} onPress={handlesubmit}><Text style={{ color: '#fff' }}>Submit</Text></TouchableOpacity>
      </View>

    </View>
  )
}

export default ClientForm