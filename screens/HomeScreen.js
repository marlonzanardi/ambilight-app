import React, {useEffect} from 'react';
import {View, StyleSheet, ScrollView, FlatList, Text} from 'react-native';
import {
  Avatar,
  List,
  Subheading,
  Checkbox,
  Colors,
  TouchableRipple,
  Card,
  Button,
  IconButton,
  useTheme,
  FAB,
  Portal,
} from 'react-native-paper';
//import {ColorPicker} from 'react-native-color-picker';
import ConfigDialog from './dialogs/ConfigDialog';
import AsyncStorage from '@react-native-community/async-storage';
import BluetoothSerial from 'react-native-bluetooth-serial';
import hexRgb from 'hex-rgb';
import ColorPickerDialog from './dialogs/ColorPickDialog';

const HomeScreen = () => {
  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);
  const [checkedMode, setCheckedMode] = React.useState(false);
  const [checkedAmblight, setCheckedAmblight] = React.useState(true);
  const [checkedRGB, setCheckedRGB] = React.useState(false);
  const [checkedColorFull, setCheckedColorFull] = React.useState(false);

  const [textTitle, setTextTitle] = React.useState('Modo Ambilight');
  const [urlImage, setUrlImage] = React.useState(
    'http://s2.glbimg.com/KAqrwP9C32tZKr0FhskjvFPHuiA=/695x0/s.glbimg.com/po/tt2/f/original/2014/02/19/lightpack.png',
  );
  const [open, setOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [deviceStatus, setDeviceStatus] = React.useState(null);

  useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      console.log('device test');
      if (!deviceStatus) {
        let bluetoothConnection;
        console.log('deviceStatus', bluetoothConnection);
        bluetoothConnection = null;
        try {
          bluetoothConnection = await AsyncStorage.getItem(
            'bluetoothConnection',
          );
          console.log('deviceStatus', bluetoothConnection);
          if (!bluetoothConnection) {
            setDialogVisible(true);
          } else {
            setDeviceStatus(JSON.parse(bluetoothConnection));
          }
        } catch (e) {
          console.log(e);
        }
      }
    }, 1000);
  }, []);

  const {
    colors: {background},
  } = useTheme();

  function _toggleDialog(name) {
    setVisible(true);
  }

  function setAmblightMode(checkedAmblight) {
    setCheckedAmblight(true);
    setTextTitle('Modo Ambilight');
    setUrlImage(
      'http://s2.glbimg.com/KAqrwP9C32tZKr0FhskjvFPHuiA=/695x0/s.glbimg.com/po/tt2/f/original/2014/02/19/lightpack.png',
    );
    //setCheckedMode(false);
    setCheckedRGB(false);
    setCheckedColorFull(false);
    modeAmbilight();
  }

  function setRGBMode(checkedRGB) {
    setCheckedRGB(true);
    setTextTitle('Modo RGB');
    setUrlImage(
      'https://images-na.ssl-images-amazon.com/images/I/71myjDU0arL._SL1248_.jpg',
    );
    // setCheckedMode(false);
    setCheckedAmblight(false);
    setCheckedColorFull(false);
    // modeRGB('#fff');
  }

  function setColorFullMode(checkedColorFull) {
    setCheckedColorFull(checkedColorFull);
    setTextTitle('Modo Arco-Íris');
    setUrlImage(
      'https://images-na.ssl-images-amazon.com/images/I/61SC6M7GpjL._AC_SX425_.jpg',
    );
    // setCheckedMode(false);
    setCheckedAmblight(false);
    setCheckedRGB(false);
    modeColorFull();
  }

  async function setDialogStatus() {
    const valor = await AsyncStorage.getItem('params');
    console.log('valor parametros: ', valor);
  }

  function toggleSwitch() {
    BluetoothSerial.write('T')
      .then(res => {
        console.log(res);
        console.log('Successfuly wrote to device');
        this.setState({connected: true});
      })
      .catch(err => console.log(err.message));
  }
  function modeAmbilight() {
    BluetoothSerial.write('MODE_AMBILIGHT;')
      .then(res => {
        console.log(res);
        console.log('Successfuly wrote to device');
      })
      .catch(err => console.log(err.message));
  }
  function modeColorFull() {
    BluetoothSerial.write('MODE_RGB;')
      .then(res => {
        console.log(res);
        console.log('Successfuly wrote to device');
      })
      .catch(err => console.log(err.message));
  }
  function modeRGB(color) {
    console.log(color);
    color = hexRgb(color);
    console.log(
      'SET_COLOR ' + color.red + ' ' + color.green + ' ' + color.blue + ';',
    );
    BluetoothSerial.write(
      'SET_COLOR ' + color.red + ' ' + color.green + ' ' + color.blue + ';',
    )
      .then(res => {
        console.log(res);
        console.log('Successfuly wrote to device');
      })
      .catch(err => console.log(err.message));
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <Card style={styles.card}>
          <Card.Cover
            source={{
              uri: urlImage,
            }}
          />
          <TouchableRipple onPress={() => setCheckedMode(!checkedMode)}>
            <Card.Title
              title={textTitle}
              subtitle={textTitle + ' ' + 'Ativo'}
              right={(props: any) => (
                <IconButton
                  {...props}
                  icon="chevron-down"
                  onPress={() => setCheckedMode(!checkedMode)}
                />
              )}
            />
          </TouchableRipple>
        </Card>
        {checkedMode && (
          <View>
            <TouchableRipple onPress={() => setAmblightMode(!checkedAmblight)}>
              <View style={styles.row}>
                <Subheading>Modalidade Ambilight</Subheading>
                <View pointerEvents="none">
                  <Checkbox
                    color={Colors.blue500}
                    status={checkedAmblight ? 'checked' : 'unchecked'}
                  />
                </View>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => setRGBMode(!checkedRGB)}>
              <View style={styles.row}>
                <Subheading>Modalidade RGB</Subheading>
                <View pointerEvents="none">
                  <Checkbox
                    color={Colors.blue500}
                    status={checkedRGB ? 'checked' : 'unchecked'}
                  />
                </View>
              </View>
            </TouchableRipple>
            {/* {checkedRGB && (
              <View style={{height: '50%', padding: 10}}>
                <ColorPicker
                  onColorSelected={color => alert(`Color selected: ${color}`)}
                  style={{flex: 1}}
                />
              </View>
            )} */}
            <TouchableRipple
              onPress={() => setColorFullMode(!checkedColorFull)}>
              <View style={styles.row}>
                <Subheading>Modalidade Arco-Íris</Subheading>
                <View pointerEvents="none">
                  <Checkbox
                    color={Colors.blue500}
                    status={checkedColorFull ? 'checked' : 'unchecked'}
                  />
                </View>
              </View>
            </TouchableRipple>
          </View>
        )}
      </View>
      <Portal>
        <FAB.Group
          open={open}
          icon={open ? 'tools' : 'plus'}
          style={styles.fab}
          actions={[
            // {icon: 'plus', onPress: () => {}},
            {
              icon: 'bluetooth',
              label: 'Configurações',
              onPress: () => {
                setDialogVisible(!dialogVisible);
              },
            },
            // {
            //   icon: 'star',
            //   label: 'Status',
            //   onPress: () => {
            //     setDialogStatus();
            //   },
            // },
          ]}
          onStateChange={({open}: {open: boolean}) => setOpen(open)}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
          visible={visible}
        />
      </Portal>
      <ConfigDialog close={setDialogVisible} visible={dialogVisible} />
      <ColorPickerDialog close={setCheckedRGB} visible={checkedRGB} />
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    paddingTop: 30,
    paddingBottom: 30,
    flexDirection: 'row',
  },
  toolbarButton: {
    width: 100,
    marginTop: 8,
  },
  toolbarTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
    marginTop: 6,
  },
  deviceName: {
    fontSize: 17,
  },
  deviceNameWrap: {
    margin: 10,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    margin: 50,
    right: -50,
    bottom: 10,
  },
});
