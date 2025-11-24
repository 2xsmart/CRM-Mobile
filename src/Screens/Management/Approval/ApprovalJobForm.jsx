import { Text, View, ScrollView, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import api from '../../../Plugins/axios';
import { iconsize } from '../../../Constants/dimensions';
import Toast from 'react-native-toast-message';
import JobFormStyle from '../../Styles/JobForm';

const ApprovalJobForm = ({ route, navigation }) => {
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
  const [Approvaldata, setApprovaldata] = useState([]);
  const [ApprovalField, setApprovalField] = useState(0);
  const [Fields, setFields] = useState([]);
  const [UserId, setUserId] = useState([]);
  const [Comment, setComment] = useState('');

  AsyncStorage.getItem('Language').then((name) => {
    setLanguage(name);
  }).catch(() => {
    setLanguage('English')
  });
  AsyncStorage.getItem('userId').then((id) => {
    setUserId(Number(id))
    // console.log( );
  }).catch(() => {
    setUserId(Number(1))
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
      await api.get('/jobData/' + JobId).then(res => {
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
        setForm(data1);
        // console.log(data1)
      }).catch(err => {
        console.log(err);
      })
    } catch (error) {
      console.log('err', error);
    }
  };
  const gettabs = async () => {
    try {
      const res = await api.get('/jobs/fields/' + Language);
      res.data.push({ name: 'Approval', fields: [] });
      setTabs(res.data);
      // console.log(res.data);
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
      const res = await api.get('/ApprovalData/fields/job/' + JobId);
      const data = res.data
      const FindTab = Tabs.find((obj) => obj.name === 'Approval')
      const data1 = Fields.filter((obj) => data.map(val => val.Fid).includes(obj.id))
      FindTab.fields = data1
      setTabs(Tabs);
      handleTabs(Tabs.length - 1, Tabs)
      setApprovalFields(data.map(val => val.Fid))
      setApprovaldata(data)
      // console.log(data);
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
        return <ReadOnlyField label={field.name} value={String(Job.uid || '') || ''} Fid={field.id} />;
      case 'Job Id':
        return <ReadOnlyField label={field.name} value={String(Job.jobId || '') || ''} Fid={field.id} />;
      case 'Status':
        return <ReadOnlyField label={field.name} value={String(Job.status || '') || ''} Fid={field.id} />;
      case 'Sub-Status':
        return <ReadOnlyField label={field.name} value={String(Job.subStatus || '') || ''} Fid={field.id} />;
      case 'Owner':
        return <ReadOnlyField label={field.name} value={String(Job.Owner || '') || ''} Fid={field.id} />;
      case 'Client':
        return <ReadOnlyField label={field.name} value={String(Job.Client || '') || ''} Fid={field.id} />;
      case 'AssignTo':
        return <ReadOnlyField label={field.name} value={String(Job.AssignTo || '')} Fid={field.id} />;
      default:
        switch (field.type) {
          case 'text':
          case 'textArea':
          case 'singleSelect':
          case 'multiSelect':
          case 'radio':
          case 'date':
            return <ReadOnlyField label={field.name} value={String(form[field.id] || '')} Fid={field.id} />;
          case 'number':
            return (
              <ReadOnlyField label={field.name} value={form[field.id] ? String(form[field.id]) : ""} Fid={field.id} />
            );
          case 'file':
            return (
              <ReadOnlyField label={field.name} value={String(form[field.id] || '')} Fid={field.id} />
            );
          default:
            return null;
        }
    }

  };
  const ReadOnlyField = ({ label, value, Fid }) => (
    <>
      {
        ApprovalFields.includes(Fid) && form[Fid] ? (
          <>
            <TextInput label={label} mode="outlined" style={[JobFormStyle.input, JobFormStyle.w90]} value={value} editable={false} />
            <View style={JobFormStyle.InputIconBox}>
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
          <TextInput label={label} mode="outlined" style={[JobFormStyle.input, JobFormStyle.w100]} value={value} editable={false} />
        )
      }
    </>
  );
  const Approved = async () => {
    // console.log('Start');
    const Approval = Approvaldata.find(obj => obj.Fid === ApprovalField);
    Approval.Approvers.map(obj => {
      if (obj.userid === UserId) {
        obj.status = 'Approved'
        obj.comment = Comment
      }
      return obj
    });
    const ApprovalUsers = Approval.Users
    if (Approval.Type === 'Sequential') {
      const index = ApprovalUsers.indexOf(UserId) + 1;
      if (ApprovalUsers[index]) {
        Approval.Approvers.push({ userid: ApprovalUsers[index], status: 'Pending', comment: '' });
      } else {
        const ApprovalStatus = Approval.Approvers.every(val => val.status === 'Approved');
        if (ApprovalStatus) {
          Approval.Status = 'Approved'
        }
      }
    } else {
      const ApprovalStatus = Approval.Approvers.every(val => val.status === 'Approved');
      if (ApprovalStatus) {
        Approval.Status = 'Approved'
      }
    }
    const values = {
      Approvers: JSON.stringify(Approval.Approvers),
      Status: Approval.Status
    }
    await api.patch(`/ApprovalData/${Approval.id}`, values).then(res => {
      Toast.show({
        type: 'success',
        text1: 'Approval',
        text2: res.data,
        visibilityTime: 1000,
      });
      setApprovalFields(prev => prev.filter(uid => uid !== ApprovalField));
      const data = Tabs.map((obj, i) => {
        if (obj.name === 'Approval') {
          obj.fields = obj.fields.filter(val => val.id !== ApprovalField);
          if (obj.fields.length === 0) {
            navigation.navigate(PageName)
          }
        }
        return obj
      });
      setTabs(data);
      setTabFields(data[selectedTab].fields)
    }).catch(err => {
      console.log(err);
    });
    // console.log(data);
    // console.log(Tabs);
    setShowApproval(false);
  };
  const Denied = async () => {
    const Approval = Approvaldata.find(obj => obj.Fid === ApprovalField);
    Approval.Approvers.map(obj => {
      if (obj.userid === UserId) {
        obj.status = 'Denied'
        obj.comment = Comment
      }
      return obj
    });
    const ApprovalUsers = Approval.Users
    if (Approval.Type === 'Sequential') {
      const index = ApprovalUsers.indexOf(UserId) + 1;
      if (ApprovalUsers[index]) {
        Approval.Approvers.push({ userid: ApprovalUsers[index], status: 'Pending', comment: '' });
        Approval.Status = 'Denied'
      } else {
        const ApprovalStatus = Approval.Approvers.some(val => val.status === 'Denied');
        if (ApprovalStatus) {
          Approval.Status = 'Denied'
        }
      }
    } else {
      const ApprovalStatus = Approval.Approvers.some(val => val.status === 'Denied');
      if (ApprovalStatus) {
        Approval.Status = 'Denied'
      }
    }
    const values = {
      Approvers: JSON.stringify(Approval.Approvers),
      Status: Approval.Status
    }
    const res = await api.patch(`/ApprovalData/${Approval.id}`, values);
    Toast.show({
      type: 'success',
      text1: 'Denied',
      text2: res.data,
      visibilityTime: 1000,
    });
    setApprovalFields(prev => prev.filter(uid => uid !== ApprovalField));
    const data = Tabs.map((obj, i) => {
      if (obj.name === 'Approval') {
        obj.fields = obj.fields.filter(val => val.id !== ApprovalField);
        if (obj.fields.length === 0) {
          navigation.navigate(PageName)
        }
      }
      return obj
    });
    setTabs(data);
    setTabFields(data[selectedTab].fields)
    setShowApproval(false);
  };
  const Hold = async () => {
    const Approval = Approvaldata.find(obj => obj.Fid === ApprovalField);
    Approval.Approvers.map(obj => {
      if (obj.userid === UserId) {
        obj.status = 'Hold'
        obj.comment = Comment
      }
      return obj
    });
    const ApprovalUsers = Approval.Users
    if (Approval.Type === 'Sequential') {
      const index = ApprovalUsers.indexOf(UserId) + 1;
      if (ApprovalUsers[index]) {
        Approval.Approvers.push({ userid: ApprovalUsers[index], status: 'Pending', comment: '' });
        Approval.Status = 'Hold'
      } else {
        const ApprovalStatus = Approval.Approvers.some(val => val.status === 'Hold');
        if (ApprovalStatus) {
          Approval.Status = 'Hold'
        }
      }
    } else {
      const ApprovalStatus = Approval.Approvers.some(val => val.status === 'Hold');
      if (ApprovalStatus) {
        Approval.Status = 'Hold'
      }
    }
    const values = {
      Approvers: JSON.stringify(Approval.Approvers),
      Status: Approval.Status
    }
    const res = await api.patch(`/ApprovalData/${Approval.id}`, values);
    Toast.show({
      type: 'success',
      text1: 'Hold',
      text2: res.data,
      visibilityTime: 1000,
    });
    setApprovalFields(prev => prev.filter(uid => uid !== ApprovalField));
    const data = Tabs.map((obj, i) => {
      if (obj.name === 'Approval') {
        obj.fields = obj.fields.filter(val => val.id !== ApprovalField);
        if (obj.fields.length === 0) {
          navigation.navigate(PageName)
        }
        setTabFields(obj.fields)
      }
      return obj
    });
    setTabs(data);
    setShowApproval(false);
  };
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
    <View style={JobFormStyle.container}>
      <View style={JobFormStyle.head}>
        <Text style={JobFormStyle.headtext}>{Job.uid}</Text>
        <Text style={[JobFormStyle.headtext]}>{Tabs[selectedTab]?.name?.toString() || ''}</Text>
        <Icon name="tab" size={iconsize.md} color="#FFF" onPress={() => setVisible(true)} />
      </View>
      <View style={JobFormStyle.fieldsbox}>
        <ScrollView contentContainerStyle={JobFormStyle.scrollbox}>
          {
            TabFields.length > 0 && TabFields.map((field, index) => {
              // console.log(field);
              return <View style={JobFormStyle.formfieldbox} key={field.id}>
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
                  <TouchableOpacity style={[JobFormStyle.TabCell, selectedTab === index ? JobFormStyle.blb : JobFormStyle.bb]} key={index} onPress={() => { handleTabs(index, Tabs) }}>
                    {
                      tab.name && <Text style={JobFormStyle.TabText}>{tab.name}</Text>
                    }
                  </TouchableOpacity>
                ) : <View style={JobFormStyle.Nodata}> <Text style={JobFormStyle.cr}>No Tabs Found</Text> </View>
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
          <View style={JobFormStyle.ApprovalmodalOverlay}>
            <View style={JobFormStyle.ApprovalmodalContent}>
              <View style={JobFormStyle.ApprovalmodalContentbox1}>
                <Icon name="close" size={iconsize.sm} color='red' onPress={() => setShowApproval(false)} />
              </View>
              <View style={JobFormStyle.ApprovalmodalContentbox2}>
                <TextInput label={Fields.find(f => f.id === ApprovalField)?.name} mode="outlined" style={JobFormStyle.input} value={form[ApprovalField] ? String(form[ApprovalField]) : ''} />
                <TextInput label="Comment" mode="outlined" style={JobFormStyle.commentbox} multiline numberOfLines={5} onChangeText={(text) => setComment(text)} />
              </View>
              <View style={JobFormStyle.ApprovalmodalContentbox3}>
                <TouchableOpacity style={[JobFormStyle.btn, JobFormStyle.green]}><Text style={JobFormStyle.cw} onPress={Approved}>Approve</Text></TouchableOpacity>
                <TouchableOpacity style={[JobFormStyle.btn, JobFormStyle.red]}><Text style={JobFormStyle.cw} onPress={Denied}>Denied</Text></TouchableOpacity>
                <TouchableOpacity style={[JobFormStyle.btn, JobFormStyle.gray]}><Text style={JobFormStyle.cw} onPress={Hold}>Hold</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default ApprovalJobForm

