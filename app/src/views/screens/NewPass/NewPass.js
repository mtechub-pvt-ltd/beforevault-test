import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,

  Image,
  useColorScheme,
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  BackHandler
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
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function NewPass({ route,navigation }) {
const { email } = route.params;
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
  
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // register api call
  const callLogin = async () => {
    // setloading(true);
    if (password.length == 0 || cpassword.length == 0) {
      setloading(false);
      setSnackDetails({
        text: 'Please fill all the fields',
        backgroundColor: COLORS.red,
      });
      onToggleSnackBar()
    }
    else if 
    // test for strong password
    (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(password))
    {
      setloading(false);
      setSnackDetails({
        text: 'Password must be at least 6 characters long and must contain at least one uppercase letter, one lowercase letter, and one number',
        backgroundColor: COLORS.red,
      });
      onToggleSnackBar()
    }
    else if (cpassword != password) {
      setloading(false);
      setSnackDetails({
        text: 'Password does not match',
        backgroundColor: COLORS.red,
      });
      onToggleSnackBar()
    }
    else {
    setloading(true);
      var InsertAPIURL = base_url + '/user/updatePassword.php';
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
              backgroundColor: '#4caf50',
            });
            onToggleSnackBar()
             setTimeout(() => {
              navigation.navigate('Login')
             }, 1000);
              
              
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
      console.log(JSON.parse(jsonValue))
      const data = JSON.parse(jsonValue)
      // return jsonValue != null ? console.log(JSON.parse(jsonValue)) : null;
    } catch (e) {
      // error reading value
    }
  }
  function handleBackButtonClick() {
    if (route.name == 'NewPass') {
      navigation.navigate('Login')
      return true;
    }
  }
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
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
          zIndex: 999,
          backgroundColor: snackDetails.backgroundColor,

        }}

        duration={1000}
        onDismiss={onDismissSnackBar}
      >
        {snackDetails.text}
      </Snackbar>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: '5%',
          zIndex: -9,
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
            <Headline>Update Password</Headline>
            <Text
            style={{
              marginTop: '5%',
              color: COLORS.greylight,
            }}
            >
            update password for :
             {email}
             </Text>
            
          </View>

          <View style={styles.txtInptView}>
            
            <TextInput
              // left={<TextInput.Icon icon="email" color={COLORS.primary} />}
              style={[styles.txtInpt,{
                // marginTop:20,
                backgroundColor:COLORS.white
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
              left={<TextInput.Icon icon="lock" iconColor={COLORS.light}  />}
              right={<TextInput.Icon
                iconColor={COLORS.light} 
                icon={
                secureTextEntry ? 'eye' : 'eye-off'
              }
              onPress={() => {
                setSecureTextEntry(!secureTextEntry);
              }}
              color={COLORS.light} />}
            />
            <TextInput
              // left={<TextInput.Icon icon="email" color={COLORS.primary} />}
              style={[styles.txtInpt,{
                marginTop:20,
                backgroundColor:COLORS.white
              }]}
              color={COLORS.dark}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.dark}
              
              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              secureTextEntry={secureTextEntry}
              onChangeText={text => setCPassword(text)}
              left={<TextInput.Icon icon="lock" iconColor={COLORS.light}  />}
              right={<TextInput.Icon
                iconColor={COLORS.light} 
                icon={
                secureTextEntry ? 'eye' : 'eye-off'
              }
              onPress={() => {
                setSecureTextEntry(!secureTextEntry);
              }}
              color={COLORS.light} />}
            />
            
            
            <View
            style={{
              marginTop:height* 0.05,
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
                UPDATE
              </Text>
            </Button>
            
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>



  );
}

export default NewPass;
