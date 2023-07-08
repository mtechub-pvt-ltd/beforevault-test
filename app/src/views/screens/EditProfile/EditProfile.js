import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
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
  Alert,
  PermissionsAndroid,
  Linking,
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
  Divider,
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

function EditProfile({route, navigation}) {
  const item = route.params;
  const refRBSheet = useRef();

  // snackbar
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [snackDetails, setSnackDetails] = useState({
    text: '',
    backgroundColor: '',
  });

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  // variables
  const [loading, setloading] = useState(false);
  const [loadingImage, setloadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    require('../../../assets/user.png'),
  );
  const [image, setImage] = useState(null);
  const [imageText, setImageText] = useState('Upload Picture');
  const [user_id, setUser_id] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phono_code, setPhonoCode] = useState('1');
  const [phone_no, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [referal_code, setReferalCode] = useState('');
  // const [profile_image, setProfileImage] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('United States');
  const [about_me, setAboutMe] = useState('');

  // dialog
  const [dialogView, setDialogView] = useState(false);

  const showDialog = () => setDialogView(true);
  const hideDialog = () => setDialogView(false);
// open camera
const openCam = async () => {
   await ImagePicker.openCamera({
    imageLoader: true,
    mediaType: 'photo',
    compressImageQuality: 0.8,
    imageType: 'jpg',
    cameraType: 'back',
    cropping: false,
  }).then(image => { 
    setImagePreview({uri: image.path});
    setImage(image);
    setImageText('Change Picture');
    setloadingImage(true);
     ReactNativeBlobUtil.fetch(
      'POST',
      base_url + 'user/updateProfileImage.php',
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'image',
          filename:Math.random().toString(36).substring(7) + '.jpg',
          data: ReactNativeBlobUtil.wrap(image.path),
        },
        {name: 'user_id', data: user_id},
      ],
    )
      .then(response => {
        const data = JSON.parse(response.data);
        console.log('data', data);
        if(data[0].error == false){
          setSnackDetails({
            text: data[0].message,
            backgroundColor: COLORS.primary,
          });
          onToggleSnackBar();
          storeData(data[0]);
          getData();
          setloadingImage(false);
        } else {
          setSnackDetails({
            text: data[0].message,
            backgroundColor: COLORS.red,
          });
          onToggleSnackBar();
          setloadingImage(false);
        }
      })
      .catch(err => {
        console.log('err', err);
        setloadingImage(false);
      }
      );
  });
  


  


};

const updateProfile =async () => {
  setloading(true);
    var InsertAPIURL = base_url + '/user/updateProfileData.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: user_id,
        first_name: first_name,
        last_name: last_name,
        phone_no: phone_no,
        email: email,
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
        storeData(response[0]);
        getData();
      }
      })
      .catch(error => {
        console.error(error);
        alert('this is error' + error);
      });
}

  // store user data in async storage
  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('userDetail', jsonValue);
      // console.log('userDetail', jsonValue)
    } catch (e) {
      // saving error
      alert('Error : ' + e);
    }
  };
  // get user data from async storage
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userDetail');
      console.log('jsonValue', jsonValue);
      const data = JSON.parse(jsonValue);
      setUser_id(data.user_id);
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setPhoneNo(data.phone_no);
      setEmail(data.email);
      if (data.profile_image != null || data.profile_image != '') {
        setImagePreview({uri: image_url + data.profile_image});
      }
      setImageText('Change Picture');
      setPhonoCode(data.phono_code);
    } catch (e) {
      // error reading value
    }
  };
 
  const removeData = async () => {
    try {
      await AsyncStorage.removeItem('userDetail');
      console.log('data Removed');
      RNRestart.Restart();
    } catch (e) {
      // remove error
    }
  };
 
  useEffect(() => {
    getData();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
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
        }}>
        <View style={styles.mainView}>
          <View
            style={{
              justifyContent: 'flex-start',
              marginVertical: '5%',
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
            }}>
              <TouchableOpacity
              style={{
                marginRight: '5%',
                paddingHorizontal: '5%',
              }}
              onPress={() => navigation.goBack()}>
              <Icon
              name="chevron-left" size={20} color={COLORS.black}/>
              </TouchableOpacity>
            <Headline>Edit Profile</Headline>
          </View>
          <View
            activeOpacity={0.7}
            style={{
              flexDirection: 'column',
              alignContent: 'center',
              alignItems: 'center',
              width: '100%',
              borderColor: COLORS.greylight,
              padding: '5%',
              borderRadius: 10,
            }}> 
            {
              loadingImage ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Image
                source={imagePreview}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 50,
                  borderWidth: 0.5,
                  borderColor: COLORS.greylight,
                }}
              />
              )
            }
           
            
              <TouchableOpacity
                onPress={() => openCam()}
                style={{
                  borderRadius: 10,
                  marginTop: '5%',
                }}>
                <Text
                  style={{
                    color: COLORS.secondary,
                  }}>
                  Update Picture
                </Text>
              </TouchableOpacity>
   
          </View>
          <TextInput
              style={[styles.txtInpt,{
                backgroundColor: COLORS.white,
                marginBottom: '5%',
              }]}
              color={COLORS.dark}
              label="First Name"
              labelTextColor={COLORS.dark}
              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              value={first_name}
              onChangeText={text => setFirstName(text)}
            />
          <TextInput
              style={[styles.txtInpt,{
                backgroundColor: COLORS.white,
                marginBottom: '5%',
              }]}
              color={COLORS.dark}
              label="Last Name"
              labelTextColor={COLORS.dark}
              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              value={last_name}
              onChangeText={text => setLastName(text)}
            />
          <TextInput

              style={[styles.txtInpt,{
                backgroundColor: COLORS.white,
                marginBottom: '5%',
              }]}
              color={COLORS.dark}
              label="Phone Number"
              labelTextColor={COLORS.dark}
              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              value={phone_no}
              onChangeText={text => setPhoneNo(text)}
            />
          <TextInput

              style={[styles.txtInpt,{
                backgroundColor: COLORS.white,
                marginBottom: '5%',
              }]}
              color={COLORS.dark}
              label="Email"
              labelTextColor={COLORS.dark}
              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              value={email}
              disabled={true}
              onChangeText={text => setEmail(text)}
            />
         <Button
            mode="contained"
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 10,
              marginBottom: '5%',
              width: '100%',
              borderRadius: 50,
              
            }}
            contentStyle={{
              paddingVertical: '3%',
            }}
            labelStyle={{
              fontSize: 16,
              color: COLORS.white,
            }}
            loading={loading}
            disabled={loading}

            onPress={() => updateProfile()}>
            Update
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default EditProfile;
