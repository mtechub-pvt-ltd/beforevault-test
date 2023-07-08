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
  BackHandler,
  Share,
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
  List,
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
import {useIsFocused, useNavigationState} from '@react-navigation/native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function Profile({route, navigation}) {
  const refRBSheet = useRef();
  const isFocused = useIsFocused();
  const routes = useNavigationState(state => state.routes);
  const currentRoute = routes[routes.length - 1].name;

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
  const [imagePreview, setImagePreview] = useState(
    require('../../../assets/user.png'),
  );
  const [image, setImage] = useState('');
  const [imageText, setImageText] = useState('Upload Picture');
  const [item, setItem] = useState(null);
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
      const data = JSON.parse(jsonValue);
      setItem(data);
      setUser_id(data.user_id);
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setPhoneNo(data.phone_no);
      setEmail(data.email);
      // if (data.profile_image != null || data.profile_image != '') {
      //   setImagePreview({uri: image_url + data.profile_image});
      // } else
      if (data.profile_image == '' || data.profile_image == null) {
        setImagePreview(require('../../../assets/user.png'));
      } else {
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

    // Error: Too many re-renders. React limits the number of renders to prevent an infinite loop

    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [isFocused]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
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
              justifyContent: 'space-between',
              marginVertical: '5%',
              flexDirection: 'row',
              width: '100%',
            }}>
            <Headline>Profile</Headline>
          </View>
          <View
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
              width: '100%',
              borderWidth: 0.5,
              borderColor: COLORS.greylight,
              padding: '5%',
              borderRadius: 10,
            }}>
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
            <View
              style={{
                marginLeft: '5%',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: COLORS.black,
                }}>
                {first_name} {last_name}
              </Text>
              <Text
                style={{
                  color: COLORS.light,
                }}>
                {email}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EditProfile', {
                    item: item,
                  });
                }}
                style={{
                  // backgroundColor: COLORS.primary,
                  borderRadius: 10,
                  // padding: '3%',
                  marginTop: '5%',
                }}>
                <Text
                  style={{
                    color: COLORS.secondary,
                  }}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: COLORS.black,
              marginVertical: '2%',
              alignSelf: 'flex-start',
            }}>
            Settings
          </Text>

          <List.Item
            onPress={() => navigation.navigate('ForgetPassword')}
            title="Change Password"
            titleStyle={{color: 'grey'}}
            style={{
              width: width,
              height: 50,
            }}
            left={props => (
              <List.Icon {...props} icon="lock" color={COLORS.primary} />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider
            style={{
              backgroundColor: 'grey',
              height: 0.5,
              width: width / 1.1,
              alignSelf: 'center',
            }}
          />
          <List.Item
            onPress={() => Linking.openURL('https://beforevault.com/terms')}
            title="Terms & Conditions"
            titleStyle={{color: 'grey'}}
            style={{
              width: width,
              height: 50,
            }}
            left={props => (
              <List.Icon {...props} icon="gavel" color={COLORS.primary} />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider
            style={{
              backgroundColor: 'grey',
              height: 0.5,
              width: width / 1.1,
              alignSelf: 'center',
            }}
          />
          <List.Item
            onPress={() => Linking.openURL('https://beforevault.com/privacy')}
            title="Privacy Policy"
            titleStyle={{color: 'grey'}}
            style={{
              width: width,
              height: 50,
            }}
            left={props => (
              <List.Icon
                {...props}
                icon="format-list-numbered"
                color={COLORS.primary}
              />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider
            style={{
              backgroundColor: 'grey',
              height: 0.5,
              width: width / 1.1,
              alignSelf: 'center',
            }}
          />
          <List.Item
            onPress={() => navigation.navigate('Faqs')}
            title="FAQs"
            titleStyle={{color: 'grey'}}
            style={{
              width: width,
              height: 50,
            }}
            left={props => (
              <List.Icon
                {...props}
                icon="head-question"
                color={COLORS.primary}
              />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider
            style={{
              backgroundColor: 'grey',
              height: 0.5,
              width: width / 1.1,
              alignSelf: 'center',
            }}
          />
         
          <List.Item
            onPress={() => {
              Linking.openURL(
                Platform.OS === 'ios'
                  ? 'https://apps.apple.com/pk/app/beforevault/id1667165865'
                  : 'https://play.google.com/store/apps/details?id=com.beforevaultapp',
              );
            }}
            title="Rate Us"
            titleStyle={{color: 'grey'}}
            style={{
              width: width,
              height: 50,
            }}
            left={props => (
              <List.Icon {...props} icon="star" color={COLORS.primary} />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider
            style={{
              backgroundColor: 'grey',
              height: 0.5,
              width: width / 1.1,
              alignSelf: 'center',
            }}
          />
          <List.Item
            onPress={() => {
              navigation.navigate('Trash');
            }}
            title="Trash"
            titleStyle={{color: 'grey'}}
            style={{
              width: width,
              height: 50,
            }}
            left={props => (
              <List.Icon {...props} icon="delete" color={COLORS.primary} />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider
            style={{
              backgroundColor: 'grey',
              height: 0.5,
              width: width / 1.1,
              alignSelf: 'center',
            }}
          />
          <List.Item
            onPress={removeData}
            title="Logout"
            titleStyle={{color: 'grey'}}
            style={{
              width: width,
              height: 50,
            }}
            left={props => (
              <List.Icon {...props} icon="logout" color={COLORS.primary} />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider
            style={{
              backgroundColor: 'grey',
              height: 0.5,
              width: width / 1.1,
              alignSelf: 'center',
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Profile;
