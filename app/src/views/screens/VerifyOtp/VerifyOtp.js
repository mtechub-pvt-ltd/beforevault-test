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
  Switch,
  Modal
} from 'react-native-paper';
import COLORS from '../../../consts/colors';
import base_url from '../../../consts/base_url';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginHeader from '../../../components/logins_comp/LoginHeader';
import Btn from '../../../components/button/Btn';
import FBBtn from '../../../components/button/FBBtn';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import styles from './styles';
import STYLES from '../../../components/button/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function VerifyOtp({ route,navigation }) {
  const { email,otp} = route.params;
  
  const [visible1, setVisible1] = React.useState(false);

  const showModal = () => setVisible1(true);
  const hideModal = () => setVisible1(false);
  // snackbar
  const [visible, setVisible] = useState(false);
  const [snackDetails, setSnackDetails] = useState({
    text: '',
    backgroundColor: '',
  });

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
 // code confrimation
 const [value, setValue] = useState('');
 const CELL_COUNT = 6;
 const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
 const [props, getCellOnLayoutHandler] = useClearByFocusCell({
   value,
   setValue,
 });
 // code confrimation end
  // variables
  const [loading, setloading] = useState(false);
  const [userName, setuserName] = useState('');
  const [password, setPassword] = useState('');

  
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
    if (route.name == 'VerifyOtp') {
      navigation.goBack()
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
          zIndex:-9
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
            <Headline>Verify OTP</Headline>
            <Text
            style={{
              marginTop: '5%',
              color: COLORS.greylight,
            }}
            >
              {email}
            </Text>
            <Text
            style={{
              marginTop: '2%',
              color: COLORS.greylight,
            }}
            >Enter your email address to receive 6 digit code.</Text>
          </View>

          <View style={[styles.txtInptView,{
            alignSelf: 'center',
          }]}>
          <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
            <Button
              mode='contained'
              style={STYLES.btn}

              contentStyle={STYLES.btnContent}
              onPress={() => {
                // showModal ()
                if(value == otp){
                  setSnackDetails({
                    text: 'OTP verified successfully',
                    backgroundColor: '#4caf50',
                  });
                  onToggleSnackBar();
                  setTimeout(() => {
                    navigation.navigate('NewPass',{
                      email: email,
                    })
                  }
                  , 1000);
                }
                else{
                  setSnackDetails({
                    text: 'Invalid OTP',
                    backgroundColor: COLORS.red,
                  });
                  onToggleSnackBar();
                }
              }}
              loading={loading}
              disabled={loading}
            >
              <Text
                style={STYLES.btnText}
              >
                Verify
              </Text>
            </Button>
           
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>



  );
}

export default VerifyOtp;
