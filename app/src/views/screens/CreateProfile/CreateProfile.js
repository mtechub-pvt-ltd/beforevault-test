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
  Platform,

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
import { Icon } from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import CountryPicker from 'react-native-country-picker-modal';
import ReactNativeBlobUtil from 'react-native-blob-util';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function CreateProfile({ route,navigation }) {
  const {userDetail} = route.params;
  console.log('userDetail',userDetail.user_id)
  
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
  const [imagePreview, setImagePreview] = useState(require('../../../assets/user.png'));
  const [image, setImage] = useState('');
  const [imageText, setImageText] = useState('Upload Picture');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phono_code, setPhonoCode] = useState('1');
  const [phone_no, setPhoneNo] = useState('');
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
  // register api call
  const updateProfile = async () => {
    setloading(true);
    if(
first_name=='' || first_name.length==0 ||
last_name=='' || last_name.length==0 ||
phone_no=='' || phone_no.length==0
    ) {
      setSnackDetails({
        text: 'Please fill all fields',
        backgroundColor: COLORS.red,
      });
      onToggleSnackBar();
      setloading(false);
      return;
    }
    else {
        // const newUrl = image.path.replace('file://', 'file:///');
        const fileName=Math.floor(Date.now() / 1000);
       
        
        const data = image.length == 0 || image.length == ''  ?
        [
        {name:'id',data:userDetail.user_id},
        {name:'first_name',data:first_name},
        {name:'last_name',data:last_name},
        {name:'phono_code',data:phono_code},
        {name:'phone_no',data:phone_no},
        {name:'referal_code',data:referal_code},
        {name:'address',data:address},
        {name:'country',data:country},
        {name:'about_me',data:about_me},
      ]
       : 
       [
        {
          name:'image',
          filename: fileName + '.png',
          type: 'image/png',
          data: Platform.OS === 'ios' ? ReactNativeBlobUtil.wrap(decodeURIComponent(image.path)) :ReactNativeBlobUtil.wrap(decodeURIComponent(image.path.replace('file://', 'file:///')))
      }
      ,
        {name:'user_id',data:userDetail.user_id},
        {name:'first_name',data:first_name},
        {name:'last_name',data:last_name},
        {name:'phono_code',data:phono_code},
        {name:'phone_no',data:phone_no},
        {name:'referal_code',data:referal_code},
        {name:'address',data:address},
        {name:'country',data:country},
        {name:'about_me',data:about_me},
      ]
       ;
      console.log('imge',data);
      ReactNativeBlobUtil.fetch('POST', base_url + '/user/createProfile.php', {
        Authorization: "Bearer access-token",
        otherHeader: "foo",
        'Content-Type': 'multipart/form-data',
      }, data)
      .uploadProgress((written, total) => {
        console.log('uploaded', written / total);
      })
      .progress((received, total) => {
        console.log('progress', received / total);
      })
        .then((response) => response.json())
        .then((response) => {
          setloading(false);
          
          if (response[0].error === false) {
            setSnackDetails({
              text: response[0].message,
              backgroundColor: COLORS.secondary,
            });
            onToggleSnackBar();
            storeData(response[0])
            getData()
            navigation.navigate('MyDrawer')
          } else {
            setSnackDetails({
              text: response[0].message,
              backgroundColor: COLORS.secondary,
            });
            onToggleSnackBar();
          }
         
           console.log('response', response);
        })
        .catch((error) => {
          alert('error' + error)
  
        })
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
  // camera 
  const takePhotoFromCamera = async () => {
    // console.warn('camera')
    const data = await ImagePicker.openCamera({
      width: 500,
      height: 500,
      quality: 0.8,
      cropping: true,
    }).then(imageDetail => {
      console.log ('imageDetail',imageDetail)
      setImagePreview({ uri: imageDetail.path })
      setImage(imageDetail)
      setImageText('Change Picture')
      hideDialog()

    });

  }
  const takePhotoFromGallery = async () => {
    // console.warn('gallery')
    const data = await ImagePicker.openPicker({
      width: 500,
      height: 500,
      quality: 0.5,

    }).then(imageDetail => {
      console.log ('imageDetail',imageDetail)
      setImagePreview({ uri: imageDetail.path })
      setImage(imageDetail)
      setImageText('Change Picture')
      hideDialog()
    });
  }
  useEffect(() => {

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

      <Dialog
        visible={dialogView}
        onDismiss={hideDialog}
        style={{
          // backgroundColor: 'transparent',
          zIndex: 999,
        }}
      >
        <Dialog.Content>

          <TouchableRipple
            onPress={() => {
              takePhotoFromCamera()
            }}
            style={{
              paddingHorizontal: '3%',
              paddingVertical: '5%',
            }}
          >
            <Text>Upload From Camera</Text>

          </TouchableRipple>
          <Divider
            style={{
              height: 1,
            }}
          />
          <TouchableRipple
            onPress={() => {
              takePhotoFromGallery()
            }}
            style={{
              paddingHorizontal: '3%',
              paddingVertical: '5%',
            }}
          >
            <Text>Upload From Gallery</Text>
          </TouchableRipple>
        </Dialog.Content>
      </Dialog>
      {/* couuntry pciker 1 */}
      {
        visible1 == true ?
          <CountryPicker
            onSelect={country => {
              setCountryCode(country.cca2)
              setPhonoCode(country.callingCode[0])
              setCountry(country.name)
            }
            }
            withCountryNameButton={true}
            withCallingCodeButton={true}
            withCallingCode={true}
            onClose={() => setVisible1(false)}
            withAlphaFilter={true}
            withFilter={true}
            visible={visible1}
          /> : null
      }

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

          <View style={{
            alignItems: 'center',
            marginBottom: '5%',
          }}>
            <Headline>Create Profile</Headline>
            <Image
              source={imagePreview}
              style={{
                width: 80,
                height: 80,
                borderRadius: 50,
                marginTop: 20,
                borderWidth: .5,
                borderColor: COLORS.greylight
              }}
            />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                // navigation.navigate('CreateProfile')
                showDialog()
              }}
            >
              <Text
                style={{
                  color: COLORS.dark,
                  marginTop: '2%',
                  borderWidth: 1,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderColor: COLORS.white,
                  backgroundColor: 'lightgray',
                  borderRadius: 5,
                  fontSize: 12
                }}>
                {imageText}
              </Text>
            </TouchableOpacity>

          </View>

          <View style={styles.txtInptView}>
            <TextInput
              // left={<TextInput.Icon name="email" color={COLORS.primary} />}
              style={[styles.txtInpt,{
                backgroundColor: COLORS.white,
              }]}
              color={COLORS.dark}
              label="First Name"
              labelTextColor={COLORS.dark}
              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              onChangeText={text => setFirstName(text)}
            />
            <TextInput
              style={[styles.txtInpt,{
                backgroundColor: COLORS.white,
              }]}
              color={COLORS.dark}
              label="Last Name"
              labelTextColor={COLORS.dark}

              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              onChangeText={text => setLastName(text)}
            />
            <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: '2%',
            }}
            >
            <TouchableOpacity
              // activeOpacity={1}
              onPress={() => {
                setVisible1(true)
              }}
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                backgroundColor: COLORS.white,
                width: '30%',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
                marginVertical: '2%',
                paddingVertical: '6.2%',
                paddingHorizontal: '3%',
              }}
            >

              <Text
                style={{
                  left: '5%',
                  
                  fontSize: 15,
                  color: COLORS.light,
                }}>
                {countryCode + ' + ' + phono_code}
              </Text>


            </TouchableOpacity>
            <TextInput
              style={[styles.txtInpt,{
                backgroundColor: COLORS.white,
                width: '65%',
              }]}
              color={COLORS.dark}
              label="Phone Number"
              labelTextColor={COLORS.dark}
              keyboardType="number-pad"
              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              onChangeText={text => setPhoneNo(text)}
            />
            </View>
            <TextInput
              style={[styles.txtInpt,{
                backgroundColor: COLORS.white,
              }]}
              color={COLORS.dark}
              label="Referal Code (Optional)"
              labelTextColor={COLORS.dark}

              autoCapitalize="none"
              underlineColor={COLORS.dark}
              activeUnderlineColor={COLORS.primary}
              autoCorrect={false}
              mode="flat"
              onChangeText={text => setReferalCode(text)}
            />
            <Button
              mode='contained'
              style={STYLES.btn}

              contentStyle={STYLES.btnContent}
              onPress={() => updateProfile()}
              loading={loading}
              disabled={loading}
            >
              <Text
                style={STYLES.btnText}
              >
                Create
              </Text>
            </Button>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>



  );
}

export default CreateProfile;
