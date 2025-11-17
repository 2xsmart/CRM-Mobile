import { StyleSheet } from 'react-native';
const getRandomColor = () => {
  const letters = '89ABCDEF'; // use only bright hex codes
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};
const DashStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#204D74',
    // backgroundColor: '#069589',
    justifyContent: 'flex-end'
  },
  headbox: {
    height: '5%',
    width: '100%',
    // backgroundColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  head: {
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
  content: {
    height: '80%',
    width: '100%',
    // justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    borderTopLeftRadius: '5%',
    borderTopRightRadius: '5%'
  },
  profilebox: {
    height: '20%',
    width: '80%',
    // backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  profileiconbox: {
    width: 65,
    height: 63,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    backgroundColor: '#fff',
    borderColor: '#FF5C01',
    borderWidth: 1
  },
  profilename: {
    // backgroundColor: 'green',
    height: '30%',
    width: '60%',
    justifyContent: 'center',

  },
  box: {
    height: '55%',
    width: '90%',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
    alignContent: 'center',
    // backgroundColor: 'green'
  },
  box1: {
    height: '40%',
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: '10%',
    justifyContent: 'center',
    alignItems: 'center'
    // paddingLeft: 15
    // alignItems: 'flex-end',
  },
  box1icon: {
    height: '35%',
    width: '80%',
    // justifyContent: 'center',
    alignItems: 'flex-end',
    // backgroundColor: 'green'
  },
  box1Text: {
    // backgroundColor: 'gray',
    height: '50%',
    width: '80%',
    gap: 5,
    justifyContent: 'center',
  },
  boxtext: {
    // fontWeight: 'bold',
    fontSize: 18,
    // color: '#fff'
  },
  chartbox: {
    height: '40%',
    width: '95%',
    backgroundColor: '#FFF',
    borderRadius: '5%',
  },
  textbox: {
    height: '10%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green'
  },
  tablebox: {
    height: '40%',
    width: '95%',
    // backgroundColor: '#0396FF',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  table: {
    height: '100%',
    // backgroundColor: '#0396FF'
  },
  taskbox: {
    height: 55,
    width: '95%',
    // backgroundColor: '#F79A64',
    backgroundColor: '#fff',
    // borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow
    elevation: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5
  },
  fieldbox: {
    height: 25,
    width: '50%',
    // backgroundColor: '#8A5CFF',
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    width: '30%',
    // color: '#fff'
    // backgroundColor: 'green',
  },
  value: {
    width: '70%',
    color: '#999',
    paddingRight: 2
    // color: '#fff'
    // backgroundColor: '#F4C267'
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
  },
  headerCell: {
    width: '25%',
    height: 40,
    backgroundColor: '#2B7FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 15,
    paddingRight: 5
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: '25%',
    height: 40,
    textAlignVertical: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#FFF',
    paddingLeft: 15,
    paddingRight: 5
  }
});

export default DashStyles;