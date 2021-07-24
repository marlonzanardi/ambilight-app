import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import {useTheme} from 'react-native-paper';

import {AuthContext} from '../components/context';

import Users from '../model/users';

import AsyncStorage from '@react-native-community/async-storage';

const SignInScreen = ({navigation}) => {
  const [data, setData] = React.useState({
    paramTop: 0,
    paramRight: 0,
    paramLeft: 0,
    paramBottom: 0,
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const {colors} = useTheme();

  const {signIn} = React.useContext(AuthContext);

  const topParamInputChange = val => {
    console.log('topparam', val);
    setData({
      ...data,
      paramTop: val,
    });
  };

  const rightParamInputChange = val => {
    setData({
      ...data,
      paramRight: val,
    });
  };

  const leftParamInputChange = val => {
    setData({
      ...data,
      paramLeft: val,
    });
  };

  const bottomParamInputChange = val => {
    setData({
      ...data,
      paramBottom: val,
    });
  };

  const handlePasswordChange = val => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidUser = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  const loginHandle = async (userName, password) => {
    const foundUser = Users.filter(item => {
      return userName == item.username && password == item.password;
    });

    console.log(
      'entrou aqui',
      data.paramTop,
      data.paramRight,
      data.paramLeft,
      data.paramBottom,
    );
    if (
      data.paramTop == 0 ||
      data.paramRight == 0 ||
      data.paramLeft == 0 ||
      data.paramBottom == 0
    ) {
      // Alert.alert('Wrong Input!', 'Params fields cannot be empty.', [
      //   {text: 'Okay'},
      // ]);
      setData({
        ...data,
        isValidUser: false,
      });
      return;
    }

    await AsyncStorage.setItem('params', JSON.stringify(data));
    signIn(foundUser);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>
          Vamos definir alguns dados de entrada.
        </Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
          },
        ]}>
        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}>
          Parametro Topo
        </Text>
        <View style={styles.action}>
          <FontAwesome name="tv" color={colors.text} size={20} />
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={text => topParamInputChange(text)}
            maxLength={10} //setting limit of input
          />
        </View>

        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}>
          Parametro Lateral Direito
        </Text>
        <View style={styles.action}>
          <FontAwesome name="tv" color={colors.text} size={20} />
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={text => rightParamInputChange(text)}
            maxLength={10} //setting limit of input
          />
        </View>

        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}>
          Parametro Lateral Esquerdo
        </Text>
        <View style={styles.action}>
          <FontAwesome name="tv" color={colors.text} size={20} />
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={text => leftParamInputChange(text)}
            maxLength={10} //setting limit of input
          />
        </View>

        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}>
          Parametro de Baixo
        </Text>
        <View style={styles.action}>
          <FontAwesome name="tv" color={colors.text} size={20} />
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={text => bottomParamInputChange(text)}
            maxLength={10} //setting limit of input
          />
        </View>

        <View style={styles.button}>
          {data.isValidUser ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Params fields cannot be empty.
              </Text>
            </Animatable.View>
          )}

          <TouchableOpacity
            style={styles.signIn}
            onPress={() => {
              loginHandle('user2', 'pass1234');
            }}>
            <LinearGradient
              colors={['#08d4c4', '#01ab9d']}
              style={styles.signIn}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#fff',
                  },
                ]}>
                Salvar
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: 'white',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
