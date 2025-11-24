import { Text, View, ScrollView, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import JobFormStyle from '../../Styles/JobForm';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import api from '../../../Plugins/axios';
import { iconsize } from '../../../Constants/dimensions';
import Toast from 'react-native-toast-message';


const ApprovalSubJobForm = ({ route, navigation }) => {
  const JobId = route.params.id;
  const PageName = route.params.name;

  const [Language, setLanguage] = useState('English');
  const [visible, setVisible] = useState(false);
  const [ShowApproval, setShowApproval] = useState(false);
  const [TabName, setTabName] = useState('');
  const [Tabs, setTabs] = useState([]);
  const [selectedTab, setselectedTab] = useState(0);
  const [TabFields, setTabFields] = useState([]);
  const [SJob, setSJob] = useState('');
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
  const getData = async () => {
    await api.get(`/ApprovalData/subjob/${JobId}`).then(res => {
      const { fields, Name, SJobId, subjobData } = res.data;
      const fieldIds = JSON.parse(fields) ? JSON.parse(fields) : []
      getFields(fieldIds)
      setTabName(Name)
      setSJob(SJobId)
      setForm(subjobData)
      // console.log(Name);
    }).catch(err => {
      console.log(err);
    });
  };
  const getFields = async (fids) => {
    await api.get('/fields/subjobconfig').then(res => {
      const data = fids.map(id => res.data.find(obj => obj.id === id));
      // setTabFields(data);
      // setFields(data);
      // console.log(data);
      getApprovalData(data)
    }).catch(err => {
      console.log(err);
    });
  };
  const getApprovalData = async (fields) => {
    await api.get(`/ApprovalData/fields/subjob/${JobId}`).then(res => {
      setApprovaldata(res.data)
      const Approvalids = res.data.map(obj => obj.Fid);
      setApprovalFields(Approvalids);
      const data = fields.filter(obj => Approvalids.includes(obj.id));
      const tabsData = [
        {
          name: TabName,
          fields: fields
        },
        {
          name: 'Approval',
          fields: data
        }
      ];
      setTabs(tabsData)
      setselectedTab(1)
      setTabFields(data)
      // console.log(data);
    }).catch(err => {
      console.log(err);
    });
  };
  const handleTabs = (ind) => {
    setselectedTab(ind);
    const data = Tabs[ind]?.fields
    data.forEach(element => {
      element.name = element.name.replace(/^primary\./, '')
      return element
    });
    setTabFields(data)
    setVisible(false)
  };
  const Approved = async () => {
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
    // console.log(JobId);
    getData()
  }, [JobId])
  return (
    <View style={JobFormStyle.container}>
      <View style={JobFormStyle.head}>
        <Text style={JobFormStyle.headtext}>{SJob}</Text>
        <Text style={[JobFormStyle.headtext]}>{Tabs[selectedTab]?.name?.toString() || ''}</Text>
        <Icon name="tab" size={iconsize.md} color="#FFF" onPress={() => setVisible(true)} />
      </View>
      <View style={JobFormStyle.fieldsbox1}>
        <ScrollView contentContainerStyle={JobFormStyle.scrollbox}>
          {
            TabFields.length > 0 && TabFields.map((field, index) => {
              // console.log(field);
              return <View style={JobFormStyle.formfieldbox} key={field.id}>
                {
                  ApprovalFields.includes(field.id) && form[field.id] ? <>
                    <TextInput label={field.name} mode="outlined" style={[JobFormStyle.input, JobFormStyle.w90]} value={String(form[field.id])} editable={false} />
                    <View style={JobFormStyle.InputIconBox}>
                      <Icon name="lock" size={iconsize.sm} color="#0054D1" onPress={() => { setShowApproval(true); setApprovalField(field.id) }} />
                    </View>
                  </> :
                    <TextInput label={field.name} mode="outlined" style={[JobFormStyle.input, JobFormStyle.w100]} value={String(form[field.id] || '')} editable={false} />
                }
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

export default ApprovalSubJobForm