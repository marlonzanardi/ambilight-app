import React, {useEffect} from 'react';
import {ScrollView, View, StyleSheet, ToastAndroid} from 'react-native';
import {
  Subheading,
  List,
  Button,
  Portal,
  Dialog,
  RadioButton,
  TouchableRipple,
} from 'react-native-paper';
import BluetoothSerial from 'react-native-bluetooth-serial';
import AsyncStorage from '@react-native-community/async-storage';

const BluetoothListDialog = ({visible, close}) => {
  const [checked, setChecked] = React.useState('normal');
  const [dialogVisible, setDialog] = React.useState(false);
  const [devices, setDevices] = React.useState([]);
  const [deviceStatus, setDeviceStatus] = React.useState(null);
  const [configDialog, setConfigDialog] = React.useState(false);

  useEffect(() => {
    Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()]).then(
      values => {
        const [isEnabled, devices] = values;
        console.log('info', isEnabled, devices);
        setDevices(devices);
      },
    );

    BluetoothSerial.on('bluetoothEnabled', () => {
      Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()]).then(
        values => {
          const [isEnabled, devices] = values;
          setDevices(devices);
        },
      );

      BluetoothSerial.on('bluetoothDisabled', () => {
        setDevices(devices([]));
      });
      BluetoothSerial.on('error', err => console.log(`Error: ${err.message}`));
    });
  }, []);

  function setDialogVisible() {
    setConfigDialog(false);
  }

  // function connect(item) {
  //   console.log(item.name);
  // }

  // const connect = async item => {
  //   console.log(item.name);
  // };

  async function connect(device) {
    console.log('teste');
    const valor = await AsyncStorage.setItem(
      'bluetoothConnection',
      JSON.stringify(device),
    );

    const lastSession = await AsyncStorage.setItem(
      'lastConnection',
      JSON.stringify(device),
    );
    const deviceStatusStorage = await AsyncStorage.getItem(
      'bluetoothConnection',
    );

    BluetoothSerial.connect(device.id)
      .then(res => {
        console.log(`Connected to device ${device.name}`);
        setDeviceStatus(JSON.parse(deviceStatusStorage));
        //setConfigDialog(true);
        close();

        ToastAndroid.show(
          `Connected to device ${device.name}`,
          ToastAndroid.SHORT,
        );

        BluetoothSerial.write('BLUETOOTH_CONNECTED 1;')
          .then(resBth => {
            console.log('response BLUETOOTH_CONNECTED' + resBth);
            console.log('Successfuly BLUETOOTH_CONNECTED');
          })
          .catch(err => console.log(err.message));
      })
      .catch(err => console.log(err.message));
    // setUserData(valor);
  }

  return (
    <Portal>
      <Dialog onDismiss={close} visible={visible}>
        <Dialog.Title>Selecione a conexão</Dialog.Title>
        <Dialog.ScrollArea style={{maxHeight: 240, paddingHorizontal: 0}}>
          <ScrollView>
            <View style={styles.container}>
              {devices.map(item => (
                <TouchableRipple
                  key={item.id}
                  onPress={() => {
                    connect(item);
                  }}>
                  <List.Item key={item.id} title={item.name} />
                </TouchableRipple>
              ))}
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
};

export default BluetoothListDialog;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    paddingLeft: 8,
  },
});
