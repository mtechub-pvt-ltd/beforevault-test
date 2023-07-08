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
  FlatList,
  Linking,
  Platform
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
import RBSheet from 'react-native-raw-bottom-sheet';



import { URL } from 'react-native-url-polyfill';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


const retries = 10


function ViewDoc({ route, navigation }){
  
  const {
    link,
    doc_type,
    uniq_id,
  } = route.params;
  

  
  const refRBSheet = useRef();
  const [formFields, setFormFields] = useState([]);
  
  const [visible1, setVisible1] = React.useState(false);
  const [testdata, setTestdata] = useState({ uri: link});
  const showModal = () => setVisible1(true);
  const hideModal = () => setVisible1(false);
  // snackbar
  const [visible, setVisible] = useState(false);
  const [snackDetails, setSnackDetails] = useState({
    text: '',
    backgroundColor: '',
  });

 

  // variables
  const [loading, setloading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const webViewRef = useRef(null);
  const [reloadKey, setReloadKey] = useState(0);

  const handleRefresh = () => {
    
   // reload webview here
    setReloadKey(reloadKey + 1);
    webViewRef.current.reload();
  };

  
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userDetail')
      const data = JSON.parse(jsonValue)
    } catch (e) {
      // error reading value
    }
  }
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
    getData()
    getDetail();
    console.log('refrseh call');
    if(Platform.OS=='android'){
      handleRefresh();
    }

  }, []);
  
  
  
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
      {/* <TouchableOpacity
      onPress={handleRefresh} 
      >
        <Text>Refresh</Text>
      </TouchableOpacity> */}
     
     <View style={{ flex: 1 }}>
      {/* {
        loading ? (
          <ActivityIndicator 
        animating={loading}
        color={COLORS.primary}
        size={'small'}
        style={{
          position: 'absolute',
          alignSelf: 'center',
          top: height / 3,
        }}
        />
        ) : ( 
          <Web/>
        )
      } */}
   

  
                   
        
       
       
          {/* <PDFView
           fadeInDuration={250.0}
          style={{ flex: 1 }}
          resource={link1}
          allowFileAccessFromFileURLs={true}
          // resource={'https://beforevault.com/login/assets/documents/pjnreqra.pdf'}
          resourceType={'url'}
          onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
           onError={(error) => console.log('Cannot render PDF', error)}
         /> */}

          {
            Platform.OS=='ios' ? 
            <WebView
            source={{
              html: `
              <html>
              <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              
              <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
              <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
              <style>
              body {
                margin: 0;
                padding: 0;
                background-color: #FFFFFF;
                color: #000000;
                font-size: 16px;
                font-family: Arial, Helvetica, sans-serif;
              }
              .pdfobject-container { height: 30rem; border: 1rem solid rgba(0,0,0,.1); }
              </style>
              </head>
              <body>
              
              <div 
              style="
              width: 100%;
              height: 100%;
              position: absolute;
              align-items: center;
              justify-content: center;
              display: flex;
              flex-direction: column;
              text-align: center;
              color: ${COLORS.primary};
              font-size: 20px;
              "
    
              id="example1"></div>
              </body>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js"></script>
              <script src="https://unpkg.com/pdfobject@2.2.11/pdfobject.min.js"></script>
              <script>
              
              var options = {
                fallbackLink: "<p>Loading ...<a id='pdfqq' href='[url]'></a></p>",
                forceIframe: true,
                forcePDFJS: true,
    
              };
              PDFObject.embed("${link}", "#example1", options)
              setTimeout(() => {
                document.getElementById('pdfqq').click();
              }, 1000);
              </script>
              </html>
              `,
            }}
         
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
           
            style={{ flex: 1 }}
          /> : 
          <WebView 
            ref={webViewRef}
          style={{ height: 500, width: '100%' }}
          // javaScriptEnabled={true}
          reloader={true}
          // check if content is loaded or not
          // onLoadEnd={}
          onError={() => {
            console.log('error in loading webview');
          }}
           source={{ uri: 'https://drive.google.com/viewerng/viewer?embedded=true&url='+link }} />
          }
        
       


           
        
      </View>

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
                PDF Detail
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

export default ViewDoc;
