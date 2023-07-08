import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  ImageBackground,
  Image,
  useColorScheme,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Linking,
  Modal,
  Pressable,
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
  Divider,
  Appbar,
  Dialog,
  Paragraph,
  
} from 'react-native-paper';
import COLORS from '../../../consts/colors';
import base_url from '../../../consts/base_url';
import image_url from '../../../consts/image_url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useIsFocused } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import RBSheet from 'react-native-raw-bottom-sheet';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function CameraScreen({route, navigation}) {
  const isFocused = useIsFocused();
  const scrollViewRef = useRef();
    const refRBSheet = useRef();

  
  const {
    pdfData,
    fileName,
    cat_id,
    sub_cat_id
  } = route.params;
  
 
const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userDetail');
      const data = JSON.parse(jsonValue);
      
    } catch (e) {
      // error reading value
    }
  };
  
 
  
  useEffect(() => {
    getData();
   
  }, [isFocused]);

  return (
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
          title={'Preview PDF'}
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
          navigation.navigate('webForm',{
            cat_id:cat_id,
            sub_cat_id:sub_cat_id,
            uniq_id:pdfData,
          });
        }}
        >
        <Text
        style={{
          color: COLORS.primary,
        }}
        >
          Continue
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

      source={{ uri: base_url+'pdf/create_pdf.php?uniq_id='+pdfData+'&fileName='+fileName }} />
   
      </View>
  );
}

export default CameraScreen;
