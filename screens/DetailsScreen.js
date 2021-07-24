import React, {useEffect} from 'react';
import {ScrollView, View, StyleSheet, FlatList} from 'react-native';
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
import BluetoothListDialog from './dialogs/BluetoothListDialog';
import AsyncStorage from '@react-native-community/async-storage';

const DetailsScreen = () => {
  const [checked, setChecked] = React.useState('normal');
  const [dialogVisible, setDialog] = React.useState(false);
  const [devices, setDevices] = React.useState([]);
  const [deviceStatus, setDeviceStatus] = React.useState(null);
  const [deviceParams, setDeviceParams] = React.useState(null);

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
        let paramStatus;
        console.log('deviceStatus', bluetoothConnection);
        bluetoothConnection = null;
        paramStatus = null;
        try {
          bluetoothConnection = await AsyncStorage.getItem(
            'bluetoothConnection',
          );
          console.log('deviceStatus', bluetoothConnection);
          setDeviceStatus(JSON.parse(bluetoothConnection));

          paramStatus = await AsyncStorage.getItem('params');
          console.log('params', paramStatus);
          setDeviceParams(JSON.parse(paramStatus));
        } catch (e) {
          console.log(e);
        }
      }
    }, 1000);
  }, [dialogVisible]);

  function setDialogVisible() {
    setDialog(!dialogVisible);
  }

  async function disconnectBluetooth() {
    BluetoothSerial.disconnect();
    await AsyncStorage.removeItem('bluetoothConnection');
    BluetoothSerial.write('SET_MODE 0;')
      .then(res => {
        console.log('response SET_MODE 0' + res);
        console.log('Successfuly disconnectBluetooth');
      })
      .catch(err => console.log(err.message));
    setDeviceStatus(null);
  }

  return (
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
          {deviceParams && (
            <List.Section title="Parâmetros TV">
              <List.Item
                title="Leds Topo"
                description={deviceParams.paramTop}
                left={props => <List.Icon {...props} />}
              />

              <List.Item
                title="Leds Lateral Direito"
                description={deviceParams.paramRight}
                left={props => <List.Icon {...props} />}
              />

              <List.Item
                title="Leds Lateral Esquerdo"
                description={deviceParams.paramLeft}
                left={props => <List.Icon {...props} />}
              />

              <List.Item
                title="Leds Baixo"
                description={deviceParams.paramBottom}
                left={props => <List.Icon {...props} />}
              />
            </List.Section>
          )}
        </List.Section>
      </View>
      <BluetoothListDialog close={setDialogVisible} visible={dialogVisible} />
    </ScrollView>
  );
};

export default DetailsScreen;

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
