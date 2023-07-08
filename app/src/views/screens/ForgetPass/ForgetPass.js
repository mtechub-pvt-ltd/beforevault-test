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
import image_url from '../../../consts/image_url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginHeader from '../../../components/logins_comp/LoginHeader';
import Btn from '../../../components/button/Btn';
import FBBtn from '../../../components/button/FBBtn';
import styles from './styles';
import STYLES from '../../../components/button/styles';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function ForgetPass({ route,navigation }) {

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
 
  const [email, setEmail] = useState('');

  // register api call
  const callLogin = async () => {
    setloading(true);
      var InsertAPIURL = image_url+'users/send_otp_mobile.php';
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };

      await fetch(InsertAPIURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          email: email
        }),
      })
        .then(response => response.json())
        .then(response => {
          setloading(false);
          console.log('response', response);
          if (response[0].error ==false) {
            setSnackDetails({
              text: response[0].message,
              backgroundColor: 'green',
            });
            onToggleSnackBar();
            // storeData(response.data);
            navigation.navigate('VerifyOtp',{
              email: email,
              otp: response[0].otp,
            })
          }
          else {
            setSnackDetails({
              text: response[0].message,
              backgroundColor: 'red',
            });
            onToggleSnackBar();
          }
        })
        .catch(error => {
          setloading(false);
          alert('this is error' + error);
        });
    }

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
    
    console.log(route);
    if (route.name == 'ForgetPass') {
      navigation.goBack();
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
            <Headline>Forget Password</Headline>
            <Text
            style={{
              marginTop: '5%',
              color: COLORS.greylight,
            }}
            >Enter your email address to receive 6 digit code.</Text>
          </View>

          <View style={styles.txtInptView}>
            <TextInput
              left={<TextInput.Icon icon="email" iconColor={COLORS.light} />}
              style={[styles.txtInpt,{
                backgroundColor: COLORS.white,
              }]}
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
            />
            <Button
              mode='contained'
              style={STYLES.btn}

              contentStyle={STYLES.btnContent}
              onPress={() => {
                callLogin();
                // navigation.navigate('VerifyOtp')
              }}
              loading={loading}
              disabled={loading}
            >
              <Text
                style={STYLES.btnText}
              >
                SEND OTP
              </Text>
            </Button>
           
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>



  );
}

export default ForgetPass;
