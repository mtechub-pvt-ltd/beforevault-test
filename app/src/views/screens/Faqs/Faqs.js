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
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function CreateProfile({route, navigation}) {
  const refRBSheet = useRef();

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
  const [user_id, setUser_id] = useState('');

  // dialog
  const [dialogView, setDialogView] = useState(false);

  const showDialog = () => setDialogView(true);

  const hideDialog = () => setDialogView(false);
  // register api call

  // get user data from async storage
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userDetail');
      const data = JSON.parse(jsonValue);
      setUser_id(data.user_id);
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
        onDismiss={onDismissSnackBar}>
        {snackDetails.text}
      </Snackbar>
      {/* react native paper dialog */}

      <View
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
              activeOpacity={0.6}
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '5%',
              }}>
              <Icon name="chevron-left" size={20} color={COLORS.light} />
            </TouchableOpacity>

            <Headline>FAQs</Headline>
          </View>

          <View style={styles.txtInptView}>
            <List.AccordionGroup
              style={{
                width: '100%',
              }}>
              <List.Accordion
                onA
                style={{
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.greylight + '50',
                  borderBottomWidth: 0.5,
                }}
                titleStyle={{
                  color: COLORS.light,
                }}
                title="Question 1"
                id="1">
                <List.Item
                  titleStyle={{
                    display: 'none',
                  }}
                  descriptionStyle={{
                    color: COLORS.light,
                  }}
                  descriptionNumberOfLines={5}
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non ipsum sit amet libero imperdiet semper. Aliquam et purus non eros porta accumsan vel sed magna. Maecenas porta nec nunc non gravida. Integer congue erat a ornare congue."
                />
              </List.Accordion>
              <List.Accordion
                onA
                style={{
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.greylight + '50',
                  borderBottomWidth: 0.5,
                }}
                titleStyle={{
                  color: COLORS.light,
                }}
                title="Question 2"
                id="2">
                <List.Item
                  titleStyle={{
                    display: 'none',
                  }}
                  descriptionStyle={{
                    color: COLORS.light,
                  }}
                  descriptionNumberOfLines={5}
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non ipsum sit amet libero imperdiet semper. Aliquam et purus non eros porta accumsan vel sed magna. Maecenas porta nec nunc non gravida. Integer congue erat a ornare congue."
                />
              </List.Accordion>
              <List.Accordion
                onA
                style={{
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.greylight + '50',
                  borderBottomWidth: 0.5,
                }}
                titleStyle={{
                  color: COLORS.light,
                }}
                title="Question 3"
                id="3">
                <List.Item
                  titleStyle={{
                    display: 'none',
                  }}
                  descriptionNumberOfLines={5}
                  descriptionStyle={{
                    color: COLORS.light,
                  }}
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non ipsum sit amet libero imperdiet semper. Aliquam et purus non eros porta accumsan vel sed magna. Maecenas porta nec nunc non gravida. Integer congue erat a ornare congue."
                />
              </List.Accordion>
            </List.AccordionGroup>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default CreateProfile;
