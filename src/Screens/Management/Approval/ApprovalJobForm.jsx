import { Text, View, ScrollView, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import styles from '../../Styles/JobFormStyle';
'../../Constants/dimensions';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from '@react-navigation/native';
'../../Plugins/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import api from '../../../Plugins/axios';
import { iconsize } from '../../../Constants/dimensions';

const ApprovalJob = ({ route, navigation }) => {
  const JobId = route.params.id;
  const PageName = route.params.name;

  const [Language, setLanguage] = useState('English');
  const [visible, setVisible] = useState(false);
  const [ShowApproval, setShowApproval] = useState(false);
  const [Tabs, setTabs] = useState([]);
  const [selectedTab, setselectedTab] = useState(0);
  const [TabFields, setTabFields] = useState([]);
  const [Job, setJob] = useState({});
  const [form, setForm] = useState({});
  const [ApprovalFields, setApprovalFields] = useState([]);
  const [ApprovalField, setApprovalField] = useState(0);
  const [Fields, setFields] = useState([]);

  AsyncStorage.getItem('Language').then((name) => {
    setLanguage(name);
  }).catch(() => {
    setLanguage('English')
  });
  const getJob = async () => {
    try {
      const res = await api.get('/ApprovalData/job/' + JobId);
      setJob(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log('err', error);
    }
  };
  const getJobData = async () => {
    try {
      const res = await api.get('/jobData/' + JobId);
      const data = res.data;
      const data1 = {};
      data.forEach(obj => {
        if (obj.type === 'singleSelect') {
          const result = obj.value && typeof obj.value === 'object' ? obj.value.name : obj.value
          data1[obj.fieldId] = result
        } else if (obj.type === 'multiSelect') {
          let result = ''
          if (Array.isArray(obj.value)) {
            if (typeof obj.value[0] === 'object') {
              result = obj.value.map(item => `"${item.name || item.value}"`).join(',')
            } else {
              result = obj.value.map(item => `"${item}"`).join(',')
            }
          } else if (typeof obj.value === 'string') {
            result = obj.value
              .split(',')
              .map(item => `"${item.trim()}"`)
              .join(',')
          }
          data1[obj.fieldId] = [result][0].replace(/"/g, '').split(',').join(',')
        } else {
          data1[obj.fieldId] = obj.value
        }
      });
      // console.log(data1);
      setForm(data1);
    } catch (error) {
      console.log('err', error);
    }
  };
  const gettabs = async () => {
    try {
      const res = await api.get('/jobs/fields/' + Language);
      res.data.push({ name: 'Approval', fields: [] });
      setTabs(res.data);
    } catch (error) {
      console.log('err', error);
    }
  };
  const getFields = async () => {
    try {
      const res = await api.get('/fields/active');
      setFields(res.data)
      // console.log(res.data);
    } catch (error) {
      console.log('err', error);
    }
  }
  const getApprovalFields = async () => {
    try {
      const res = await api.get('/ApprovalData/fields/' + JobId);
      const data = res.data.map(obj => obj.Fid)
      const FindTab = Tabs.find((obj) => obj.name === 'Approval')
      const data1 = Fields.filter((obj) => data.includes(obj.id))
      FindTab.fields = data1
      setTabs(Tabs);
      handleTabs(Tabs.length - 1, Tabs)
      // handleTabs(11, Tabs)
      setApprovalFields(data1.map(obj => obj.id))
      // console.log(Tabs);
    } catch (error) {
      console.log('err', error);
    }
  };
  const handleTabs = async (ind, Tabs1) => {
    setselectedTab(ind);
    const data = Tabs1[ind]?.fields
    data.forEach(element => {
      element.name = element.name.replace(/^primary\./, '')
      return element
    });
    setTabFields(data)
    setVisible(false)
    // console.log(data);
  };
  const renderField = (field) => {
    // console.log(form[field.id]);

    switch (field.code) {
      case 'UID':
        return <ReadOnlyField label={field.name} value={String(Job.uid) || ''} Fid={field.id} />;
      case 'Job Id':
        return <ReadOnlyField label={field.name} value={String(Job.jobId) || ''} Fid={field.id} />;
      case 'Status':
        return <ReadOnlyField label={field.name} value={String(Job.status) || ''} Fid={field.id} />;
      case 'Sub-Status':
        return <ReadOnlyField label={field.name} value={String(Job.subStatus) || ''} Fid={field.id} />;
      case 'Owner':
        return <ReadOnlyField label={field.name} value={String(Job.Owner) || ''} Fid={field.id} />;
      case 'Client':
        return <ReadOnlyField label={field.name} value={String(Job.Client) || ''} Fid={field.id} />;
      case 'AssignTo':
        return <ReadOnlyField label={field.name} value={String(Job.AssignTo) || ''} Fid={field.id} />;
      default:
        switch (field.type) {
          case 'text':
          case 'textArea':
          case 'singleSelect':
          case 'multiSelect':
          case 'radio':
          case 'date':
            return <ReadOnlyField label={field.name} value={String(form[field.id]) || ''} Fid={field.id} />;
          case 'number':
            return (
              <ReadOnlyField
                label={field.name}
                value={form[field.id] ? String(form[field.id]) : ""}
                Fid={field.id}
              />
            );
          case 'file':
            return (
              <ReadOnlyField
                label={field.name}
                value={String(form[field.id]) || ''}
                Fid={field.id}
              />
            );
          default:
            return null;
        }
    }

  };
  const ReadOnlyField = ({ label, value, Fid }) => (
    <>
      <View style={styles.labelbox}><Text>{label}</Text></View>
      <View style={styles.TextBox}>
        {
          ApprovalFields.includes(Fid) && form[Fid] ? (
            <>
              <Text style={[styles.TextInput, styles.w90]}>
                {String(value ?? "")}
              </Text>
              <View style={styles.InputIconBox}>
                <Icon
                  name="lock"
                  size={iconsize.sm}
                  color="#0054D1"
                  onPress={() => {
                    setShowApproval(true);
                    setApprovalField(Fid);
                  }}
                />
              </View>
            </>
          ) : (
            <Text style={[styles.TextInput, styles.w100]}>
              {String(value ?? "")}
            </Text>
          )
        }

      </View>
    </>
  );
  useEffect(() => {
    if (Fields.length && Tabs.length) {
      getApprovalFields()
    }
  }, [Fields, Tabs, JobId])
  useEffect(() => {
    // console.log(JobId);
    getJob()
    getJobData()
    gettabs()
    getFields()
  }, [JobId])
  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.headtext}>{Job.uid}</Text>
        <Text style={[styles.headtext]}>{Tabs[selectedTab]?.name?.toString() || ''}</Text>
        <Icon name="tab" size={iconsize.md} color="#FFF" onPress={() => setVisible(true)} />
      </View>
      <View style={styles.fieldsbox1}>
        <ScrollView contentContainerStyle={styles.scrollbox}>
          {
            TabFields.length > 0 && TabFields.map((field, index) => {
              // console.log(field);
              return <View style={styles.fieldbox} key={field.id}>
                {renderField(field)}
              </View>
            })
          }
        </ScrollView>
      </View>
      <View style={styles.actionbox}>
        <TouchableOpacity style={[styles.btn, styles.gray]} onPress={() => navigation.navigate(PageName)}><Text style={styles.cw}>Back</Text></TouchableOpacity>
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
                      tab.name && <Text style={styles.TabText}>{tab.name}</Text>
                    }
                  </TouchableOpacity>
                ) : <View style={styles.Nodata}> <Text style={styles.cr}>No Tabs Found</Text> </View>
              }
            </View>
          </View>
        </TouchableWithoutFeedback>

      </Modal>
      <Modal
        visible={ShowApproval}
        transparent
        animationType="fade" // "fade", "none" also possible
        onRequestClose={() => setShowApproval(false)}
        onDismiss={() => setShowApproval(false)}>
        <TouchableWithoutFeedback onPress={() => setShowApproval(false)}>
          <View style={styles.ApprovalmodalOverlay}>
            <View style={styles.ApprovalmodalContent}>
              <View style={styles.ApprovalmodalContentbox1}>
                <Icon name="close" size={iconsize.sm} color='red' onPress={() => setShowApproval(false)} />
              </View>
              <View style={styles.ApprovalmodalContentbox2}>
                <TextInput label={Fields.find(f => f.id === ApprovalField)?.name} mode="outlined" style={styles.input} value={form[ApprovalField] ? String(form[ApprovalField]) : ''} />
                <TextInput label="Comment" mode="outlined" style={styles.commentbox} />
              </View>
              <View style={styles.ApprovalmodalContentbox3}>
                <TouchableOpacity style={[styles.btn, styles.green]}><Text style={styles.cw}>Approve</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.red]}><Text style={styles.cw}>Denied</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.gray]}><Text style={styles.cw}>Hold</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>

      </Modal>
    </View>
  )
}

export default ApprovalJob

