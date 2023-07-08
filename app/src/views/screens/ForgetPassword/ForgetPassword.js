import 'react-native-gesture-handler';
import React, { useState, useEffect,useRef } from 'react';
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
  Platform,
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
  HelperText,
  Dialog,
  Divider

} from 'react-native-paper';
import COLORS from '../../../consts/colors';
import base_url from '../../../consts/base_url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginHeader from '../../../components/logins_comp/LoginHeader';
import Btn from '../../../components/button/Btn';
import FBBtn from '../../../components/button/FBBtn';
import styles from './styles';
import STYLES from '../../../components/button/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import CountryPicker from 'react-native-country-picker-modal';
import ReactNativeBlobUtil from 'react-native-blob-util';
import image_url from '../../../consts/image_url';
import RNRestart from 'react-native-restart';
import RBSheet from 'react-native-raw-bottom-sheet';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function CreateProfile({ route,navigation }) {
  const refRBSheet = useRef();  
  
  // snackbar
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [showPassword,setShowPassword]=useState(true);
  const [snackDetails, setSnackDetails] = useState({
    text: '',
    backgroundColor: '',
  });

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  // variables
  const [loading, setloading] = useState(false);
  const [user_id, setUser_id] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [cnewPassword, setCnewPassword] = useState('');
  
  // dialog
  const [dialogView, setDialogView] = useState(false);

  const showDialog = () => setDialogView(true);

  const hideDialog = () => setDialogView(false);
  // register api call
  
  // updaat user data
  const updateUserData = async () => {
    setloading(true);
    var InsertAPIURL = base_url + '/user/newPasswordNew.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: user_id,
        oldPassword:oldPassword,
        newPassword:newPassword,
        cnewPassword:cnewPassword,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setloading(false);
      console.log('response', response);
      if(response[0].error==true){
        setSnackDetails({
          text: response[0].message,
          backgroundColor: COLORS.red,
        });
        onToggleSnackBar();
      }else{
        setSnackDetails({
          text: response[0].message,
          backgroundColor: COLORS.primary,
        });
        onToggleSnackBar();
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      }
      })
      .catch(error => {
        console.error(error);
        alert('this is error' + error);
      });
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
      setUser_id(data.user_id)
      
    } catch (e) {
      // error reading value
    }
  }
  
  const removeData = async () => {
    try {
      await AsyncStorage.removeItem('userDetail')
      console.log('data Removed')
      RNRestart.Restart();

    } catch (e) {
      // remove error
    }

  }
  function handleBackButtonClick() {
    
    console.log(route);
    if (route.name == 'Login') {
      navigation.goBack();
      return true;
    }
  }
  useEffect(() => {
    getData ()
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
      {/* react native paper dialog */}

      
      

      <View
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

          <View style={{
            justifyContent: 'flex-start',
            marginVertical: '5%',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
               navigation.goBack()
              }}
              style={{
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '5%',
              }}
            >
             <Icon name="chevron-left" size={20} color={COLORS.light} />
            </TouchableOpacity>
            <View>
            <Headline>Change Password</Headline>
            <Text
            style={{
              color: COLORS.red,
              fontSize: 12,
              // width: '70%',
            }}
            >
            Must be 8 characters and include 1 Upper case,
            </Text>
            <Text
            style={{
              color: COLORS.red,
              fontSize: 12,
              // width: '0%',
            }}
            >
            1 lower case & 1 special character (^#$@*, etc.)
            </Text>
            </View>

            </View>
          

          <View style={styles.txtInptView}>
            <TextInput
              // left={<TextInput.Icon name="email" color={COLORS.primary} />}
              style={[styles.txtInpt,{
                backgroundColor: COLORS.white,
                marginBottom: '5%',
              }]}
              color={COLORS.dark}
              label="Old Password"
              labelTextColor={COLORS.dark}
              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              value={oldPassword}
              onChangeText={text => setOldPassword(text)}
              secureTextEntry={showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye' : 'eye-off'}
                  iconColor={COLORS.light}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <TextInput
              // left={<TextInput.Icon name="email" color={COLORS.primary} />}
              style={[styles.txtInpt,{
                backgroundColor: COLORS.white,
                marginBottom: '5%',
              }]}
              color={COLORS.dark}
              label="New Password"
              labelTextColor={COLORS.dark}
              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
              secureTextEntry={showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye' : 'eye-off'}
                  iconColor={COLORS.light}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <TextInput
              style={[styles.txtInpt,{
                backgroundColor: COLORS.white,
              }]}
              secureTextEntry={showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye' : 'eye-off'}
                  iconColor={COLORS.light}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              color={COLORS.dark}
              label="Confirm New Password"
              labelTextColor={COLORS.dark}
              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              value={cnewPassword}
              onChangeText={text => setCnewPassword(text)}
            />
          
            <Button
              mode='contained'
              style={[STYLES.btn,{
                width:Platform.OS=='android'? '40%':'100%',
                alignSelf: 'center',
              }]}

              contentStyle={STYLES.btnContent}
              onPress={() =>{
                if(
                  oldPassword == '' ||
                  newPassword == '' ||
                  cnewPassword == ''
                ) 
                {
                  setSnackDetails({
                    text: 'All fields are required',
                    backgroundColor: COLORS.red,
                  });
                  onToggleSnackBar();
                  return;
                } 
                else if(newPassword != cnewPassword){
                  setSnackDetails({
                    text: 'New Password must be same',
                    backgroundColor: COLORS.red,
                  });
                  onToggleSnackBar();
                  return;
                } 
                else {
                  updateUserData() 
                }
              }}
              loading={loading}
              disabled={loading}
            >
              <Text
                style={STYLES.btnText}
              >
                Update
              </Text>
            </Button>
             

          </View>
        </View>
       
      </View>
        
    </SafeAreaView>



  );
}

export default CreateProfile;
