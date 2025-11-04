import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
  scrollbox: {
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10
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
    backgroundColor: '#0396FF',
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
    height: '90%',
    width: '100%',
    // backgroundColor: '#8EC5FF',
  },
  fieldsbox1: {
    height: '83%',
    width: '100%',
    // backgroundColor: '#8EC5FF',
  },
  fieldbox: {
    height: 60,
    width: '90%',
    backgroundColor: '#fff',
    // backgroundColor: '#BEDBFF',
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow
    elevation: 5,
    paddingHorizontal: 5,
    borderRadius: 5

  },
  input: {
    height: 35,
    width: '100%',
    borderColor: 'gray',
    borderRadius: 5,
    // backgroundColor: 'yellow',
  },
  commentbox: {
    height: '65%'
  },
  TextBox: {
    height: '70%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  TextInput: {
    height: 35,
    borderColor: '#71717B',
    borderWidth: 1,
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
    // backgroundColor: '#204D74',
    gap: 10
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

})
export default styles;