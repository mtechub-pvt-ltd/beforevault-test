import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
KeyboardAvoidingView,
  Image,
  useColorScheme,
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  Platform,
  Keyboard
} from 'react-native';
import {
  Text,
  Button,
  Snackbar,
  Headline,
  ActivityIndicator,
  Colors,
  TouchableRipple,
  TextInput,
  Switch
} from 'react-native-paper';
import COLORS from '../../../consts/colors';
import base_url from '../../../consts/base_url';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginHeader from '../../../components/logins_comp/LoginHeader';
import Btn from '../../../components/button/Btn';
import FBBtn from '../../../components/button/FBBtn';
import styles from './styles';
import STYLES from '../../../components/button/styles';
import RNExitApp from 'react-native-exit-app';
import { MotiView } from 'moti';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function Login({route, navigation }) {

  // snackbar
  const [visible, setVisible] = useState(false);
  const [snackDetails, setSnackDetails] = useState({
    text: '',
    backgroundColor: '',
  });

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  // variables
  const [loading, setloading] = useState(false);
  const [userName, setuserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // register api call
  // register api call
  const callLogin = async () => {
    setloading(true);
    if (password.length == 0 || email.length == 0) {
      setloading(false);
      setSnackDetails({
        text: 'Please fill all the fields',
        backgroundColor: COLORS.red,
      });
      onToggleSnackBar()
    }
    else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)
    ) {
      setloading(false);

      setSnackDetails({
        text: 'Please enter a valid email address',
        backgroundColor: COLORS.red,
      });
      onToggleSnackBar()
    }
    
    else {
      var InsertAPIURL = base_url + '/user/login.php';
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };

      await fetch(InsertAPIURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          email: email,
          password: password,

        }),
      })
        .then(response => response.json())
        .then(response => {
          setloading(false);
          
          if (response[0].error == true) {
            setSnackDetails({
              text: response[0].message,
              backgroundColor: COLORS.red,
            });
            onToggleSnackBar()
          }
          else {
            setSnackDetails({
              text: response[0].message,
              backgroundColor: COLORS.primary,
            });
            onToggleSnackBar()
            storeData(response[0])
              getData()
              navigation.replace('MyDrawer')
          }
        })
        .catch(error => {
          setloading(false);
          alert('this is error' + error);
        });
    }
  };
  // store user data in async storage
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('userDetail', jsonValue)
      // console.log('userDetail', jsonValue)
    }
    catch (e) {
      // saving error
      alert('Error : ' + e);
    }
  }
  // get user data from async storage
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userDetail')
      const data = JSON.parse(jsonValue)
      // return jsonValue != null ? console.log(JSON.parse(jsonValue)) : null;
    } catch (e) {
      // error reading value
    }
  }
  
  useEffect(() => {
    // if (Platform.OS === 'ios') {
    //   navigation.addListener('beforeRemove', (e) => {
    //     e.preventDefault();
    //     RNExitApp.exitApop();
    //   });
    // }
    // BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    // return () => {
    //   BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    // };
    
  }, []);
  return (


    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,

      }}
    >
      <Snackbar
        visible={visible}
        style={{
          zIndex: 9999,
          backgroundColor: snackDetails.backgroundColor,
            width: width - 20,
            alignSelf: 'center',
            position:Platform.OS==='ios' ? 'absolute':'relative',
            bottom : 30,
          }}
        duration={1000}
        onDismiss={onDismissSnackBar}
      >
        {snackDetails.text}
      </Snackbar>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          zIndex: -9,
        }}

      >
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: '5%',
          zIndex: -9
        }}
      >
        <View
          style={styles.mainView}
        >

          <LoginHeader navigation={navigation}/>
    
          <View style={{
            alignItems: 'center',
            marginBottom: '15%',
          }}>
            <Headline>Sign In</Headline>
            <Text
            style={{
              marginTop: '5%',
              color: COLORS.greylight,
            }}
            >Sign In to get started with BeforeVault</Text>
          </View>

          <View style={styles.txtInptView}>
            <TextInput
              // left={<TextInput.Icon name="email" color={COLORS.primary} />}
              style={styles.txtInpt}
              color={COLORS.dark}
              placeholder="Email"
              placeholderTextColor={COLORS.dark}
              keyboardType="email-address"
              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              onChangeText={text => setEmail(text)}
              left={<TextInput.Icon icon="email" iconColor={COLORS.light} />}
            />
            <TextInput
              // left={<TextInput.Icon name="email" color={COLORS.primary} />}
              style={[styles.txtInpt,{
                marginTop:20
              }]}
              color={COLORS.dark}
              placeholder="Password"
              placeholderTextColor={COLORS.dark}
              
              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              secureTextEntry={secureTextEntry}
              onChangeText={text => setPassword(text)}
              left={<TextInput.Icon icon="lock" iconColor={COLORS.light} />}
              right={<TextInput.Icon icon={
                secureTextEntry ? 'eye' : 'eye-off'
              }
              onPress={() => {
                setSecureTextEntry(!secureTextEntry);
              }}
              iconColor={COLORS.light}
              />}
              // onChangeText={text => setEmail(text)}
            />
            <View
            style={{
              flexDirection:'row',
              justifyContent:'flex-end',
              marginTop:20
            }}
            >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ForgetPass')
              }}
            >
              <Text
                style={styles.frgtpss}
              >Forget Password?</Text>
            </TouchableOpacity>
            </View>
            
            <View
            style={{
              // marginTop:height* 0.005,
              zIndex: -9,
            }}
            >
            <Button
              mode='contained'
              style={STYLES.btn}

              contentStyle={STYLES.btnContent}
              onPress={() => callLogin()}
              loading={loading}
              disabled={loading}
            >
              <Text
                style={STYLES.btnText}
              >
                Sign in
              </Text>
            </Button>
            <View
              style={[styles.SgnOrIntxt,{
                paddingVertical: '5%',
                backgroundColor: COLORS.white,
              }]}
            >
              <Text

                style={{
                  color: COLORS.dark,
                
                }}
              >Don’t have account?  </Text>
              <TouchableOpacity
                style={{
                  left: '5%',
                }}
                onPress={() => {
                  navigation.navigate('Signup')
                }}
              >
                <Text
                  style={{
                    color: COLORS.secondary,
                  }}
                >
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView> 
    </SafeAreaView>



  );
}

export default Login;
