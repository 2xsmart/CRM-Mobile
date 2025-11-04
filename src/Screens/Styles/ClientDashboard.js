import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
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
    height: '95%',
    width: '100%',
    // justifyContent: 'space-around',
    alignItems: 'center',
    gap: 20
    // backgroundColor: '#74D4FF',
  },
  profilebox: {
    height: '15%',
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    // backgroundColor: 'gray'
  },
  box: {
    height: '15%',
    width: '90%',
    // backgroundColor: '#31D492',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25
  },
  box1: {
    height: '60%',
    width: '70%',
    // backgroundColor: '#BEDBFF',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  boxtext: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff'
  },
  chartbox: {
    height: '40%',
    width: '95%',
    // backgroundColor: '#0396FF',
  },
  title: {
    height: '10%',
    width: '100%',
    textAlign: 'center',
    verticalAlign: 'middle',
    fontWeight: 'bold'
  },
  tablebox: {
    height: '40%',
    width: '95%',
    backgroundColor: '#0396FF',
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
  }
});

export default styles;