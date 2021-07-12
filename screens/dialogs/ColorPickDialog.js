import React, {useEffect} from 'react';
import {ScrollView, View, StyleSheet, FlatList, Dimensions} from 'react-native';
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
import {TriangleColorPicker} from 'react-native-color-picker';
import hexRgb from 'hex-rgb';

const ColorPickerDialog = ({visible, close}) => {
  const [checked, setChecked] = React.useState('normal');
  const [dialogVisible, setDialog] = React.useState(false);
  const [devices, setDevices] = React.useState([]);
  const [deviceStatus, setDeviceStatus] = React.useState(null);
  const [color, setColor] = React.useState('#ff0000');

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

  function setColorRGB(color) {
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
        // this.setState({connected: true});
      })
      .catch(err => console.log(err.message));
  }

  return (
    <Portal>
      <Dialog onDismiss={close} visible={visible}>
        <Dialog.Title>Palheta de cores</Dialog.Title>
        <Dialog.ScrollArea style={{height: '50%', padding: 10}}>
          <TriangleColorPicker
            onColorSelected={color => setColorRGB(color)}
            style={{flex: 1}}
          />
        </Dialog.ScrollArea>
        <BluetoothListDialog close={setDialogVisible} visible={dialogVisible} />
      </Dialog>
    </Portal>
  );
};

export default ColorPickerDialog;

// const styles = StyleSheet.create({
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   text: {
//     paddingLeft: 8,
//   },
// });
