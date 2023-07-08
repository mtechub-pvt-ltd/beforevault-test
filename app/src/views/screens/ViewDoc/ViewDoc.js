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
  FlatList,
  Linking
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
  Divider,
  Appbar,
  Dialog,
  Paragraph,
  
} from 'react-native-paper';
import COLORS from '../../../consts/colors';
import base_url from '../../../consts/base_url';
import image_url from '../../../consts/image_url';
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
import { WebView } from 'react-native-webview';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function ViewDoc({ route, navigation }){
  const {
    link,
    doc_type,
  } = route.params;

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

  // variables
  const [loading, setloading] = useState(false);

  
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userDetail')
      const data = JSON.parse(jsonValue)
    } catch (e) {
      // error reading value
    }
  }
  useEffect(() => {
    getData()
   
  }, []);
  return (
    // <WebView
    //   source={{ uri: 'https://mtechub.com' }}
    //   style={{ marginTop: 20 }}
    // />
    <View style={{
      flex: 1,
      backgroundColor: COLORS.white,
      
      }}>

     <Appbar.Header
        style={{
          backgroundColor: COLORS.primary,
          elevation: 0,
          
        }}>
       
        <Appbar.Content
        titleStyle={{
          color: COLORS.white,
          fontSize: 20,
          fontWeight: 'bold',
        }}
          // title={uniqId}
          title={'Preview '+doc_type}
          // subtitle={}
        />
         <TouchableOpacity
        style={{
          padding: 5,
          backgroundColor: COLORS.white,
          borderRadius: 5,
          marginRight: 10,
        }}
        onPress={() => {
          navigation.goBack();
        }}
        >
        <Text
        style={{
          color: COLORS.primary,
        }}
        >
          Closes
        </Text>
        </TouchableOpacity>
      </Appbar.Header>
     
      <WebView
      style={{
      // marginTop: 100,
      // backgroundColor: COLORS.red,
      }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      renderLoading={() => (
        <View
        style={{
          height: height,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.white,
        }}
        >
          <ActivityIndicator
          animating={true}
          color={COLORS.primary}
          size="small"
          style={{
            marginBottom: height/2.5,
          }}
        />
          </View>
      )}

      source={{ uri: 'https://docs.google.com/gview?embedded=true&url=https://beforevault.com/login/'+link }} />
   
          

      </View>
    );
}

export default ViewDoc;
