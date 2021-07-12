import React, {useEffect} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  ToastAndroid,
} from 'react-native';
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
import BluetoothListDialog from './BluetoothListDialog';
import AsyncStorage from '@react-native-community/async-storage';

const ConfigDialog = ({visible, close}) => {
  const [checked, setChecked] = React.useState('normal');
  const [dialogVisible, setDialog] = React.useState(false);
  const [devices, setDevices] = React.useState([]);
  const [deviceStatus, setDeviceStatus] = React.useState(null);
  const [lastSession, setLastSession] = React.useState(null);

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

  useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      console.log('entrou no use', deviceStatus);
      if (!deviceStatus) {
        let bluetoothConnection;
        let lastSessionConnected;
        console.log('deviceStatus', bluetoothConnection);
        bluetoothConnection = null;
        lastSessionConnected = null;
        try {
          bluetoothConnection = await AsyncStorage.getItem(
            'bluetoothConnection',
          );
          console.log('deviceStatus', bluetoothConnection);
          setDeviceStatus(JSON.parse(bluetoothConnection));

          lastSessionConnected = await AsyncStorage.getItem('lastConnection');
          console.log('lastSession', lastSessionConnected);
          setLastSession(JSON.parse(lastSessionConnected));
        } catch (e) {
          console.log(e);
        }
      }
    }, 1000);
  }, [dialogVisible, visible, deviceStatus]);

  async function verifyLastSession() {
    let lastSessionConnected = await AsyncStorage.getItem('lastConnection');
    console.log('lastsession', lastSessionConnected);
    if (lastSessionConnected) {
      connectLastSession(JSON.parse(lastSessionConnected));
    }
  }

  function setDialogVisible() {
    // if (dialogVisible) {
    //   close();
    // }
    setDialog(!dialogVisible);
  }

  async function disconnectBluetooth() {
    BluetoothSerial.disconnect();
    await AsyncStorage.removeItem('bluetoothConnection');
    setDeviceStatus(null);
  }

  async function connectLastSession(device) {
    const valor = await AsyncStorage.setItem(
      'bluetoothConnection',
      JSON.stringify(device),
    );

    BluetoothSerial.connect(device.id)
      .then(res => {
        console.log(`Connected to device ${device.name}`);

        setDeviceStatus(device);

        ToastAndroid.show(
          `Connected to device ${device.name}`,
          ToastAndroid.SHORT,
        );
      })
      .catch(err => console.log(err.message));
    // setUserData(valor);
  }

  return (
    <Portal>
      <Dialog onDismiss={close} visible={visible}>
        <Dialog.Title>Status Conexão</Dialog.Title>
        <Dialog.ScrollArea style={{maxHeight: 300, paddingHorizontal: 0}}>
          <ScrollView>
            <View style={styles.container}>
              <List.Section>
                <List.Item
                  title="Status conexão"
                  description={deviceStatus ? 'Conexão Ativa' : 'Sem conexão'}
                  left={props => <List.Icon {...props} icon="bluetooth" />}
                />
                {deviceStatus && (
                  <List.Item
                    title="Nome conexão"
                    description={deviceStatus.name}
                    left={props => <List.Icon {...props} />}
                  />
                )}

                <Button onPress={setDialogVisible}>Conectar</Button>
                {deviceStatus && (
                  <Button onPress={disconnectBluetooth}>Desconectar</Button>
                )}

                {lastSession && !deviceStatus && (
                  <Button onPress={verifyLastSession}>
                    Ultima sessão ({lastSession.name})
                  </Button>
                )}
              </List.Section>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <BluetoothListDialog close={setDialogVisible} visible={dialogVisible} />
      </Dialog>
    </Portal>
  );
};

export default ConfigDialog;

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
