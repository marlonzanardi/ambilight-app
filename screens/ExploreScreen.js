import React, {Component} from 'react';
import {useTheme} from '@react-navigation/native';
import {TriangleColorPicker} from 'react-native-color-picker';
import hexRgb from 'hex-rgb';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Switch,
  TouchableOpacity,
  ToastAndroid,
  StatusBar,
} from 'react-native';
var _ = require('lodash');
import BluetoothSerial from 'react-native-bluetooth-serial';
import AsyncStorage from '@react-native-community/async-storage';

class ExploreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      discovering: false,
      devices: [],
      unpairedDevices: [],
      connected: false,
    };
  }
  componentDidMount() {
    Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()]).then(
      values => {
        const [isEnabled, devices] = values;

        this.setState({isEnabled, devices});
      },
    );

    BluetoothSerial.on('bluetoothEnabled', () => {
      Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()]).then(
        values => {
          const [isEnabled, devices] = values;
          this.setState({devices});
        },
      );

      BluetoothSerial.on('bluetoothDisabled', () => {
        this.setState({devices: []});
      });
      BluetoothSerial.on('error', err => console.log(`Error: ${err.message}`));
    });
  }
  connect = async device => {
    const valor = await AsyncStorage.setItem(
      'bluetoothConnection',
      JSON.stringify(device),
    );

    this.setState({connecting: true});
    BluetoothSerial.connect(device.id)
      .then(res => {
        console.log(`Connected to device ${device.name}`);
        console.log('valor', valor);

        ToastAndroid.show(
          `Connected to device ${device.name}`,
          ToastAndroid.SHORT,
        );
      })
      .catch(err => console.log(err.message));
    // setUserData(valor);
  };
  getStatus = async () => {
    const valor = await AsyncStorage.getItem('bluetoothConnection');
    console.log('bluetoothCocction', valor);
  };
  // connect(device) {
  //   this.setState({connecting: true});
  //   BluetoothSerial.connect(device.id)
  //     .then(res => {
  //       console.log(`Connected to device ${device.name}`);

  //       ToastAndroid.show(
  //         `Connected to device ${device.name}`,
  //         ToastAndroid.SHORT,
  //       );
  //     })
  //     .catch(err => console.log(err.message));
  // }
  _renderItem(item) {
    return (
      <TouchableOpacity onPress={() => this.connect(item.item)}>
        <View style={styles.deviceNameWrap}>
          <Text style={styles.deviceName}>
            {item.item.name ? item.item.name : item.item.id}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  enable() {
    BluetoothSerial.enable()
      .then(res => this.setState({isEnabled: true}))
      .catch(err => Toast.showShortBottom(err.message));
  }

  disable() {
    BluetoothSerial.disable()
      .then(res => this.setState({isEnabled: false}))
      .catch(err => Toast.showShortBottom(err.message));
  }

  toggleBluetooth(value) {
    if (value === true) {
      this.enable();
    } else {
      this.disable();
    }
  }
  discoverAvailableDevices() {
    if (this.state.discovering) {
      return false;
    } else {
      this.setState({discovering: true});
      BluetoothSerial.discoverUnpairedDevices()
        .then(unpairedDevices => {
          const uniqueDevices = _.uniqBy(unpairedDevices, 'id');
          console.log(uniqueDevices);
          this.setState({unpairedDevices: uniqueDevices, discovering: false});
        })
        .catch(err => console.log(err.message));
    }
  }
  toggleSwitch() {
    BluetoothSerial.write('T')
      .then(res => {
        console.log(res);
        console.log('Successfuly wrote to device');
        this.setState({connected: true});
      })
      .catch(err => console.log(err.message));
  }
  toggleSwitch2() {
    BluetoothSerial.write('MODE_AMBILIGHT;')
      .then(res => {
        console.log(res);
        console.log('Successfuly wrote to device');
        this.setState({connected: true});
      })
      .catch(err => console.log(err.message));
  }
  toggleSwitch3() {
    BluetoothSerial.write('MODE_RGB;')
      .then(res => {
        console.log(res);
        console.log('Successfuly wrote to device');
        this.setState({connected: true});
      })
      .catch(err => console.log(err.message));
  }
  setColor() {
    BluetoothSerial.write('SET_COLOR 255 0 0;')
      .then(res => {
        console.log(res);
        console.log('Successfuly wrote to device');
        this.setState({connected: true});
      })
      .catch(err => console.log(err.message));
  }
  setColor2(color) {
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
        this.setState({connected: true});
      })
      .catch(err => console.log(err.message));
  }
  render() {
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>Bluetooth Device List</Text>
          <View style={styles.toolbarButton}>
            <Switch
              value={this.state.isEnabled}
              onValueChange={val => this.toggleBluetooth(val)}
              style={{marginRight: 10}}
            />
          </View>
        </View>
        <Button
          onPress={this.discoverAvailableDevices.bind(this)}
          title="Scan for Devices"
          color="#50C878"
        />
        <FlatList
          style={{flex: 1}}
          data={this.state.devices}
          keyExtractor={item => item.id}
          renderItem={item => this._renderItem(item)}
        />
        {/* <Button
          onPress={this.toggleSwitch.bind(this)}
          title="Switch(On/Off)"
          color="#50C878"
        /> */}
        <Button
          onPress={this.getStatus.bind(this)}
          title="Liga Ambiligth"
          color="#50C878"
        />
        <Button
          onPress={this.toggleSwitch3.bind(this)}
          title="Desliga Ambiligth"
          color="#50C878"
        />
        <Button
          onPress={this.setColor.bind(this)}
          title="Define cor"
          color="#50C878"
        />
      </View>
    );
  }
}

// const HomeScreen = ({navigation}) => {
//   const {colors} = useTheme();

//   const theme = useTheme();

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
//       <Text style={{color: colors.text}}>Home Screen</Text>
//       <Button
//         title="Go to details screen"
//         onPress={() => navigation.navigate('Details')}
//       />
//     </View>
//   );
// };

// export default HomeScreen;
export default ExploreScreen;

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
});
