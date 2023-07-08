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
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function CameraScreen({route, navigation}) {
  const isFocused = useIsFocused();
  const scrollViewRef = useRef();
  const refRBSheet = useRef();
  
  const {
    pdfData,
    uniq_id,
    fileName,
    cat_id,
    sub_cat_id
  } = route.params;

  const [formFields, setFormFields] = useState([]);
 
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
          title={'Preview Album'}
          // subtitle={}
        />
        {
            pdfData==null ?
             <TouchableOpacity
            style={{
              padding: 5,
              backgroundColor: COLORS.white,
              borderRadius: 5,
              marginRight: 10,
            }}
            onPress={() => {
                
              if(pdfData==null) {
                refRBSheet.current.open()
              } 
          }} 
            >
            <Text
            style={{
              color: COLORS.primary,
            }}
            >
              See Detail
            </Text>
            </TouchableOpacity> : null
          }
         
         <TouchableOpacity
        style={{
          padding: 5,
          backgroundColor: COLORS.white,
          borderRadius: 5,
          marginRight: 10,
        }}
        onPress={() => {
            
          if(pdfData==null) {
            navigation.goBack() 
              // alert('Please wait for a while')
          } 
          else 
           {
              
              navigation.navigate('webForm',{
                cat_id:cat_id,
                sub_cat_id:sub_cat_id,
                uniq_id:uniq_id,
              });
          }
        
        // makePdf()
      }} 
        >
        <Text
        style={{
          color: COLORS.primary,
        }}
        >
          {
            pdfData==null ? 'close' : 'Continue'
          }
     
        </Text>
        </TouchableOpacity>
      </Appbar.Header>
      {
       pdfData==null? 
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
          // height: height,
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

     source={{ uri: base_url+'pdf/viewAlbum.php?uniq_id='+ uniq_id+'&fileName='+fileName }}
      />
       :
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
          // height: height,
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

     source={{ uri: base_url+'pdf/create_album.php?uniq_id='+pdfData+'&fileName='+fileName }}
      />
      }
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
                Album Detail
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
                  }}>{
                  
                  item.label} :</Text>
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
