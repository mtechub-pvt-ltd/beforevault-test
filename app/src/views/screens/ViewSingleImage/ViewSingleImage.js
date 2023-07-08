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
import Icon from 'react-native-vector-icons/FontAwesome5';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useIsFocused } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from 'react-native-fast-image';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function CameraScreen({route, navigation}) {
  const isFocused = useIsFocused();
  const scrollViewRef = useRef();
  const [formFields, setFormFields] = useState([]);
  const [imgLink, setImgLink] = useState({uri:link});
  const refRBSheet = useRef();
  
  const {
    
    uniq_id,
    link
  } = route.params;
  console.log('img',route.params);
 
const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userDetail');
      const data = JSON.parse(jsonValue);
      
    } catch (e) {
      // error reading value
    }
  };
  const getDetail = async () => {
    
    var InsertAPIURL = base_url + '/form/viewAnItemByUniqIdUserId.php?uniq_id='+uniq_id;
   
 var headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  await fetch(InsertAPIURL, {
    method: 'GET',
    headers: headers,
    // body:JSON.stringify({
    //   email: email,
    //   password: password,
    // }),
  })
    .then(response => response.json())
    .then(response => {
      setFormFields(response[0].formdata)
    })
    .catch(error => {
      alert('this is error' + error);
    });
};
 
  
  useEffect(() => {
    getData();
    getDetail();
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
          title={'Preview Image'}
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
                refRBSheet.current.open()
          }} 
            >
            <Text
            style={{
              color: COLORS.primary,
            }}
            >
              See Detail
            </Text>
            </TouchableOpacity> 
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
          Close
        </Text>
        </TouchableOpacity>
      </Appbar.Header>
      
         <WebView
      style={{
      backgroundColor: COLORS.white,
      flex: 1,
      alignSelf: 'stretch',
      alignContent  : 'center',
      justifyContent: 'center',
      alignItems: 'center',
      }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      
      source={{
          html: `<html>
          <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body
          style="
          background-color:grey
          align-self: center;
          align-content: center;
          justify-content: center;
          align-items: center;
          display: flex;
          
          ">
          
          <img src="${link}" style="width:100%;height:auto" />
          </body>
          </html>`,
        }} />
   
      

        {/* bottom sheet  */}
     <RBSheet
            ref={refRBSheet}
            closeOnDragDown={false}
            closeOnPressMask={false}
            height={height / 1.1}
            openDuration={250}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '5%',
                marginHorizontal: '2%',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontStyle: 'normal',
                  marginHorizontal: '2%',
                }}>
                Image Detail
              </Text>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 5,
                  // backgroundColor: COLORS.primary,
                  marginHorizontal: '2%',
                }}
                onPress={() => {
                  refRBSheet.current.close();
                }}>
                <Icon name="times" size={20} color={COLORS.light} />
              </TouchableOpacity>
            </View>
            
            <FlatList
            data={formFields}
            style={{
              width: width,
              height: height,
              backgroundColor: 'white',
            }}
            renderItem={({item}) => (
             
              <View
                style={{
                  flexDirection: 'column',
                  width: width*0.90,
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  alignItems: 'flex-start',
                  paddingVertical: 10,
                  marginHorizontal: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.greylight+'50',
                  display: item.value===null || item.value==='' ? 'none' : 'flex',
                 
                  // backgroundColor: COLORS.red,
                }}>
               <Text style={{
                fontSize:Platform.OS=='ios'? 20 : 14,
                fontWeight:'bold',
                marginVertical: 10,
                color: COLORS.light,
                textTransform: 'capitalize',
                  }}> {item.label} :</Text>
               <Text style={{
                fontSize:Platform.OS=='ios'? 20 : 14,
               }}>{
                item.input_type==='date'?
                new Date(
                  item.value,
                ).getDate() +
                ' ' +
                new Date(
                  item.value,
                ).toLocaleString('default', {month: 'short'}) +
                ' ' +
                new Date(
                  item.value,
                ).getFullYear()
                :
               item.value}</Text>
              </View>
            )}
            
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: height - 300,
                }}>
                <Icon
                  name="exclamation-circle"
                  size={35}
                  color={COLORS.greylight}
                  style={{
                    marginBottom: 10,
                  }}
                />
                <Text
                  style={{
                    color: COLORS.greylight,
                  }}>
                  No Record Found
                </Text>
              </View>
            }
          />
            
           
           
          </RBSheet>
      </View>
      
  );
}

export default CameraScreen;
