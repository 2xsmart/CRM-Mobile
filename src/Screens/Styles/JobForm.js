import { StyleSheet } from 'react-native';

const JobFormStyle = StyleSheet.create({
  w100: {
    width: '100%',
  },
  w90: {
    width: '90%',
  },
  bb: {
    backgroundColor: '#155DFC',
  },
  blb: {
    backgroundColor: '#51A2FF',
  },
  green: {
    backgroundColor: 'green'
  },
  red: {
    backgroundColor: 'red'
  },
  gray: {
    backgroundColor: 'gray'
  },
  cw: {
    color: '#fff'
  },
  cr: {
    color: 'red'
  },
  cor: {
    color: '#FF5C01'
  },
  none: {
    display: 'none'
  },
  scrollbox: {
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  Nodata: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff'
    // backgroundColor: '#ffe9c9',

  },
  head: {
    height: '7%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#204D74',
    // backgroundColor: '#0396FF',
    // backgroundColor: '#069589'
  },
  headtext: {
    fontWeight: 'bold',
    color: '#fff'
  },
  Tabscontainer: {
    height: 50,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#00AEFF'
  },
  Tabbox: {
    height: 25,
    width: '80%',
    backgroundColor: '#008FD1',
    justifyContent: 'center',
  },
  Tabs: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    gap: 20,
  },
  TabCell: {
    width: '45%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TabText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fieldsbox: {
    height: '83%',
    width: '100%',
  },
  fieldsbox1: {
    height: '90%',
    width: '100%',
    // backgroundColor: '#8EC5FF',
  },
  fieldsbox2: {
    gap: 7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10
    // backgroundColor: '#8EC5FF',
  },
  fieldbox: {
    height: 55,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3
  },
  formfieldbox: {
    height: 40,
    width: '90%',
    // backgroundColor: '#BEDBFF',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 35,
    width: '100%',
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: '#fff',
    // backgroundColor: '#BEDBFF',
  },
  commentbox: {
    height: 100
  },
  TextBox: {
    height: '70%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  TextInput: {
    height: 35,
    // borderColor: '#71717B',
    // borderWidth: 1,
    textAlignVertical: 'center',
    paddingLeft: 5,
    borderRadius: 4,
    // backgroundColor: 'green'
  },
  TextInputoutline: {
    borderColor: '#71717B',
    borderWidth: 1
  },
  InputIconBox: {
    height: '100%',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  labelbox: {
    // height: 10,
    width: '98%',
    // justifyContent: 'flex-end',
    // backgroundColor: '#FF5C72'
  },
  dropdown: {
    height: 35,
    width: '100%',
    borderColor: 'gray',
    outlineColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: '#fff'
  },
  dropdownContainer: {
    borderRadius: 6,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#000'
  },
  itemTextStyle: {
    fontSize: 14,
    paddingVertical: 0,
  },
  inputSearchStyle: {
    height: 35
  },
  selectedStyle: {
    borderRadius: 8,
    backgroundColor: '#e5e5e5',
    padding: 6,
    margin: 4,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    // width: '40%',
    // backgroundColor: '#FF5C72',
  },
  option1: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    height: 30,
    width: '49%',
    // backgroundColor: '#FF5C72',
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: '100%',
    height: 35,
    flexDirection: 'row',
    gap: 10,
    // backgroundColor: '#FF2E4A'
  },
  actionbox: {
    height: '10%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow
    elevation: 3,
    backgroundColor: '#FFF',
    // backgroundColor: '#204D74',

  },
  btn: {
    height: 30,
    width: '20%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#7000D1'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: 'flex-end'
  },
  modalContent: {
    width: '100%',
    height: '50%',
    backgroundColor: "white",
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    paddingTop: 15
  },
  modalContent1: {
    width: '100%',
    height: '50%',
    backgroundColor: "white",
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    paddingTop: 15
  },
  ApprovalmodalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: 'center',
    alignItems: 'center'
  },
  ApprovalmodalContent: {
    width: '95%',
    height: 300,
    backgroundColor: "white",
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5
  },
  ApprovalmodalContentbox1: {
    height: '10%',
    width: '100%',
    // backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  ApprovalmodalContentbox2: {
    height: '55%',
    width: '95%',
    // backgroundColor: 'green',
    justifyContent: 'space-between'
  },
  ApprovalmodalContentbox3: {
    height: '20%',
    width: '100%',
    // backgroundColor: 'orange',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15
  },
  SupportmodalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: "white",
    alignItems: 'center',
    borderRadius: 5
  },
  supportHeadBox: {
    height: '10%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    // backgroundColor: 'orange'
  },
  supportFormBox: {
    height: '80%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    // backgroundColor: 'green'
  }
})
export default JobFormStyle;