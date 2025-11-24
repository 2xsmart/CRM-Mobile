import { StyleSheet } from 'react-native';

const JobStyles = StyleSheet.create({
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
  Nodata: {
    height: 500,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green'
  },
  scrollbox: {
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10
  },
  loadingbox: {
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30
    // backgroundColor: 'green'
  },
  loader: {
    width: 50,
    height: 50,
    borderWidth: 5,
    borderColor: '#ddd',
    borderTopColor: '#00f',
    borderRadius: 25,
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    // backgroundColor: '#234853',
  },
  head: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'orange'
  },
  box1: {
    height: '100%',
    width: '25%',
    // backgroundColor: '#74D4FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  headtext: {
    fontWeight: 'bold'
  },
  searchBox: {
    height: '10%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10
  },
  search: {
    height: '70%',
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    paddingBottom: 7
  },
  Table: {
    height: '90%',
    width: '100%',
    // paddingTop: 10
    // paddingBottom: 10,
    // backgroundColor: 'green',
  },
  Table1: {
    height: '85%',
    width: '100%',
    paddingBottom: 10,
    // backgroundColor: 'green',
  },
  Tablebox: {
    height: 150,
    width: '90%',
    // borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow
    elevation: 5,
  },
  TableHead: {
    height: 30,
    width: '100%',
    backgroundColor: '#204D74',
    // backgroundColor: '#069589',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    elevation: 5,
  },
  openjobicon: {
    width: 30,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // backgroundColor: '#9D2EFF'
  },
  TableValues: {
    height: 120,
    width: '100%',
    justifyContent: 'space-around'
    // backgroundColor: 'green'
  },
  valuebox: {
    height: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#96F7E4',
    // borderWidth: 1
  },
  keybox: {
    height: 30,
    width: '45%',
    justifyContent: 'center',
    // backgroundColor: '#74D4FF'
  },
  keyvalue: {
    height: 30,
    width: '45%',
    justifyContent: 'center',
    // backgroundColor: '#51A2FF'
  },
  label: {
    // fontFamily: 'AntDesign',
    // fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: 'flex-end'
  },
  modalContent: {
    width: '100%',
    height: '30%',
    backgroundColor: "white",
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    paddingTop: 15
  },
  modalContent1: {
    width: '100%',
    // height: '30%',
    // backgroundColor: "white",
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    paddingTop: 10,
    flexGrow: 1
  },
  modelbox: {
    height: '90%',
    width: '100%',
    backgroundColor: 'white'
  },
  modelAction: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15
    // backgroundColor: 'green'
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

})

export default JobStyles;