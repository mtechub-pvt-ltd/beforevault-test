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
  FlatList,
  Linking,
  RefreshControl,
  Platform,
  BackHandler,
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
  Modal,
  Portal,
  Badge,
  List,
  Divider,
  Dialog,
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
import {he, is} from 'date-fns/locale';
import {isFocused} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function Share({route, navigation}) {
  const Tab = createMaterialTopTabNavigator();

  const [visible1, setVisible1] = useState(false);
  const [sharebyMe, setsharebyMe] = useState([]);
  const [user_id, setuser_id] = useState('');
  const [activeShare, setActiveShare] = useState('ShareWithMe');
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
  // dilaog
  const [visibleDia, setVisibleDia] = useState(false);

  /// call api
  const onRefresh = () => {
    setRefreshing(true);
    getTotal(user_id);
  };
  const getTotal = async id => {
    setloading(true);
    var InsertAPIURL = base_url + '/contact/getAll.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: id,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setloading(false);
        setRefreshing(false);
        if (response[0].error == false) {
          setdefaultCategory(response[0].result);
          setmyCategory(response[0].my_categories);
        }
      })
      .catch(error => {
        alert('this is error' + error);
      });
  };

  // get user data from async storage
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userDetail');
      const data = JSON.parse(jsonValue);
      setuser_id(data.user_id);
      getAllItemsSharedtoUserId(data.user_id);
    } catch (e) {
      // error reading value
    }
  };

  const renderItem = ({item, index}) => {
   return (
<View>
      {
        activeShare == 'ShareWithMe' ? 
        <>
        <View
        style={{
          flexDirection: 'row',
          width: width * 0.9,
          justifyContent: 'space-between',
          alignSelf: 'center',
          alignItems: 'center',
          // backgroundColor: COLORS.red,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (
              item.sharedItemDocDetail.doc_type == 'pdf' ||
              item.sharedItemDocDetail.doc_type == 'xlsx' ||
              item.sharedItemDocDetail.doc_type == 'xls' ||
              item.sharedItemDocDetail.doc_type == 'docx' ||
              item.sharedItemDocDetail.doc_type == 'doc'
            ) {
              
              navigation.navigate('ViewDoc1', {
                link: image_url + item.sharedItemDocDetail.local_link,
                doc_type:
                  item.sharedItemDocDetail.doc_type == 'pdf'
                    ? 'PDF'
                    : item.sharedItemDocDetail.doc_type == 'png' ||
                      item.sharedItemDocDetail.doc_type == 'jpeg' ||
                      item.sharedItemDocDetail.doc_type == 'jpg'
                    ? 'Image'
                    : item.sharedItemDocDetail.doc_type == 'xlsx' || item.sharedItemDocDetail.doc_type == 'xls'
                    ? 'Doc'
                    : 'Doc',
                uniq_id: item.sharedItemDocDetail.uniq_id,

                // item.doc_type
              });
            } else if (item.sharedItemDocDetail.doc_type == 'album') {
              navigation.navigate('ViewImage', {
                pdfData: null,
                uniq_id: item.sharedItemDocDetail.uniq_id,
              });
            } else {
              navigation.navigate('ViewSingleImage', {
                uniq_id: item.sharedItemDocDetail.uniq_id,
                // link: image_url+item.local_link,
                link: image_url + item.sharedItemDocDetail.local_link,
              });
            }
          }}
          style={{
            flexDirection: 'row',
            width: width * 0.88,
            alignSelf: 'center',
            alignItems: 'center',
            marginBottom: '2%',
            borderRadius: 10,
            borderColor: COLORS.greylight,
          }}>
          <Icon
            name={
              item.doc_type == 'pdf'
                ? 'file-pdf'
                : item.sharedItemDocDetail.doc_type == 'png' ||
                  item.sharedItemDocDetail.doc_type == 'jpeg' ||
                  item.sharedItemDocDetail.doc_type == 'jpg'
                ? 'file-image'
                : item.sharedItemDocDetail.doc_type == 'xlsx' || item.sharedItemDocDetail.doc_type == 'xls'
                ? 'file-excel'
                : item.sharedItemDocDetail.doc_type == 'docx' || item.sharedItemDocDetail.doc_type == 'doc'
                ? 'file-word'
                : 'list'
            }
            size={item.sharedItemDocDetail.doc_type == 'album' ? 15 : 20}
            color={
              item.sharedItemDocDetail.doc_type == 'pdf'
                ? COLORS.red
                : item.sharedItemDocDetail.doc_type == 'png' ||
                  item.sharedItemDocDetail.doc_type == 'jpeg' ||
                  item.sharedItemDocDetail.doc_type == 'jpg'
                ? COLORS.primary
                : COLORS.blue
            }
            style={{
              margin: 10,
              backgroundColor:
                item.sharedItemDocDetail.doc_type == 'pdf'
                  ? COLORS.red + '30'
                  : item.sharedItemDocDetail.doc_type == 'png' ||
                    item.sharedItemDocDetail.doc_type == 'jpeg' ||
                    item.sharedItemDocDetail.doc_type == 'jpg'
                  ? COLORS.primary + '30'
                  : COLORS.blue + '30',
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 50,
            }}
          />
          <View>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.dark,
              }}>
              {item.sharedItemDocDetail.name}
            </Text>

            <Text
              style={{
                fontSize: 10,
                color: COLORS.light,
              }}>
              {item.sharedItemDocDetail.upload_date}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.light,
              }}>
              {item.sharedItemCategoryDetail.name}
            </Text>
          
         
          <Text
          style={{
            fontSize: 10,
            color: COLORS.secondary,
            
          }}
          >Shared By : 
        {
          item.sharedByUserDetail.email
        }
          </Text>
        
          </View>
          
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            backgroundColor: COLORS.white,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          onPress={() => {
            if (
              item.sharedItemDocDetail.doc_type == 'pdf' ||
              item.sharedItemDocDetail.doc_type == 'xlsx' ||
              item.sharedItemDocDetail.doc_type == 'xls' ||
              item.sharedItemDocDetail.doc_type == 'docx' ||
              item.sharedItemDocDetail.doc_type == 'doc'
            ) {
              
              navigation.navigate('ViewDoc1', {
                link: image_url + item.sharedItemDocDetail.local_link,
                doc_type:
                  item.sharedItemDocDetail.doc_type == 'pdf'
                    ? 'PDF'
                    : item.sharedItemDocDetail.doc_type == 'png' ||
                      item.sharedItemDocDetail.doc_type == 'jpeg' ||
                      item.sharedItemDocDetail.doc_type == 'jpg'
                    ? 'Image'
                    : item.sharedItemDocDetail.doc_type == 'xlsx' || item.sharedItemDocDetail.doc_type == 'xls'
                    ? 'Doc'
                    : 'Doc',
                uniq_id: item.sharedItemDocDetail.uniq_id,

                // item.doc_type
              });
            } else if (item.sharedItemDocDetail.doc_type == 'album') {
              navigation.navigate('ViewImage', {
                pdfData: null,
                uniq_id: item.sharedItemDocDetail.uniq_id,
              });
            } else {
              navigation.navigate('ViewSingleImage', {
                uniq_id: item.sharedItemDocDetail.uniq_id,
                // link: image_url+item.local_link,
                link: image_url + item.sharedItemDocDetail.local_link,
              });
            }
          }}
          >
          <Text
          style={{
            fontSize: 10,
            color: COLORS.secondary,
            backgroundColor: COLORS.secondary + '10',
            padding: 3,
            borderRadius: 5,
            borderColor: COLORS.secondary+'80',
            borderWidth: .5,
          }}
          >
        View Detail
          </Text>
        </TouchableOpacity>
      </View>
      {/* <View
        style={{
          flexDirection: 'row',
          width: width * 0.9,
          flexWrap: 'wrap',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginHorizontal: '2%',
          backgroundColor: COLORS.white,
        }}
      >
        { 
            
          item.sharedtoUsers.map((item1, index1) => (
            <Text
            key={index1}
            style={{
              fontSize: 10,
              color: 'rgba(	200,71,0,0.5)',
              marginHorizontal:'1%',
              backgroundColor: 'rgba(	255, 197, 165,0.2)',
              paddingHorizontal:4,
              paddingVertical: 2,
              borderRadius:5,
              marginVertical: '1%',
              borderColor: 'rgba(	255, 197, 165,0.8)',
              borderWidth: .5,
              }}>
            
              {
                item1.sharedtoUserContactDetail.email
              }
            </Text>
          )) 
        }
      </View> */}
      <Divider 
      style={{backgroundColor: COLORS.greylight,
      marginVertical: '1%',
      }} />
        </> 
        : 
        <>
        <View
        style={{
          flexDirection: 'row',
          width: width * 0.9,
          justifyContent: 'space-between',
          alignSelf: 'center',
          alignItems: 'center',
          // backgroundColor: COLORS.red,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (
              item.sharedItemDetail.doc_type == 'pdf' ||
              item.sharedItemDetail.doc_type == 'xlsx' ||
              item.sharedItemDetail.doc_type == 'xls' ||
              item.sharedItemDetail.doc_type == 'docx' ||
              item.sharedItemDetail.doc_type == 'doc'
            ) {
              
              navigation.navigate('ViewDoc1', {
                link: image_url + item.sharedItemDetail.local_link,
                doc_type:
                  item.sharedItemDetail.doc_type == 'pdf'
                    ? 'PDF'
                    : item.sharedItemDetail.doc_type == 'png' ||
                      item.sharedItemDetail.doc_type == 'jpeg' ||
                      item.sharedItemDetail.doc_type == 'jpg'
                    ? 'Image'
                    : item.sharedItemDetail.doc_type == 'xlsx' || item.sharedItemDetail.doc_type == 'xls'
                    ? 'Doc'
                    : 'Doc',
                uniq_id: item.sharedItemDetail.uniq_id,

                // item.doc_type
              });
            } else if (item.sharedItemDetail.doc_type == 'album') {
              navigation.navigate('ViewImage', {
                pdfData: null,
                uniq_id: item.sharedItemDetail.uniq_id,
              });
            } else {
              navigation.navigate('ViewSingleImage', {
                uniq_id: item.sharedItemDetail.uniq_id,
                // link: image_url+item.local_link,
                link: image_url + item.sharedItemDetail.local_link,
              });
            }
          }}
          style={{
            flexDirection: 'row',
            width: width * 0.88,
            alignSelf: 'center',
            alignItems: 'center',
            marginBottom: '2%',
            borderRadius: 10,
            borderColor: COLORS.greylight,
          }}>
          <Icon
            name={
              item.doc_type == 'pdf'
                ? 'file-pdf'
                : item.sharedItemDetail.doc_type == 'png' ||
                  item.sharedItemDetail.doc_type == 'jpeg' ||
                  item.sharedItemDetail.doc_type == 'jpg'
                ? 'file-image'
                : item.sharedItemDetail.doc_type == 'xlsx' || item.sharedItemDetail.doc_type == 'xls'
                ? 'file-excel'
                : item.sharedItemDetail.doc_type == 'docx' || item.sharedItemDetail.doc_type == 'doc'
                ? 'file-word'
                : 'list'
            }
            size={item.sharedItemDetail.doc_type == 'album' ? 15 : 20}
            color={
              item.sharedItemDetail.doc_type == 'pdf'
                ? COLORS.red
                : item.sharedItemDetail.doc_type == 'png' ||
                  item.sharedItemDetail.doc_type == 'jpeg' ||
                  item.sharedItemDetail.doc_type == 'jpg'
                ? COLORS.primary
                : COLORS.blue
            }
            style={{
              margin: 10,
              backgroundColor:
                item.sharedItemDetail.doc_type == 'pdf'
                  ? COLORS.red + '30'
                  : item.sharedItemDetail.doc_type == 'png' ||
                    item.sharedItemDetail.doc_type == 'jpeg' ||
                    item.sharedItemDetail.doc_type == 'jpg'
                  ? COLORS.primary + '30'
                  : COLORS.blue + '30',
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 50,
            }}
          />
          <View>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.dark,
              }}>
              {item.sharedItemDetail.name}
            </Text>

            <Text
              style={{
                fontSize: 10,
                color: COLORS.light,
              }}>
              {item.sharedItemDetail.upload_date}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.light,
              }}>
              {item.sharedItemCategoryDetail.name}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            backgroundColor: COLORS.white,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          onPress={() => {
            if (
              item.sharedItemDetail.doc_type == 'pdf' ||
              item.sharedItemDetail.doc_type == 'xlsx' ||
              item.sharedItemDetail.doc_type == 'xls' ||
              item.sharedItemDetail.doc_type == 'docx' ||
              item.sharedItemDetail.doc_type == 'doc'
            ) {
              
              navigation.navigate('ViewDoc1', {
                link: image_url + item.sharedItemDetail.local_link,
                doc_type:
                  item.sharedItemDetail.doc_type == 'pdf'
                    ? 'PDF'
                    : item.sharedItemDetail.doc_type == 'png' ||
                      item.sharedItemDetail.doc_type == 'jpeg' ||
                      item.sharedItemDetail.doc_type == 'jpg'
                    ? 'Image'
                    : item.sharedItemDetail.doc_type == 'xlsx' || item.sharedItemDetail.doc_type == 'xls'
                    ? 'Doc'
                    : 'Doc',
                uniq_id: item.sharedItemDetail.uniq_id,

                // item.doc_type
              });
            } else if (item.sharedItemDetail.doc_type == 'album') {
              navigation.navigate('ViewImage', {
                pdfData: null,
                uniq_id: item.sharedItemDetail.uniq_id,
              });
            } else {
              navigation.navigate('ViewSingleImage', {
                uniq_id: item.sharedItemDetail.uniq_id,
                // link: image_url+item.local_link,
                link: image_url + item.sharedItemDetail.local_link,
              });
            }
          }}
          >
          <Text
          style={{
            fontSize: 10,
            color: COLORS.secondary,
            backgroundColor: COLORS.secondary + '10',
            padding: 3,
            borderRadius: 5,
            borderColor: COLORS.secondary+'80',
            borderWidth: .5,
          }}
          >
            View Detail
          </Text>
        </TouchableOpacity>
      </View>
      {/* <View
        style={{
          flexDirection: 'row',
          width: width * 0.9,
          flexWrap: 'wrap',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginHorizontal: '2%',
          backgroundColor: COLORS.white,
        }}
      >
        { 
            
          item.sharedtoUsers.map((item1, index1) => (
            <Text
            key={index1}
            style={{
              fontSize: 10,
              color: 'rgba(	200,71,0,0.5)',
              marginHorizontal:'1%',
              backgroundColor: 'rgba(	255, 197, 165,0.2)',
              paddingHorizontal:4,
              paddingVertical: 2,
              borderRadius:5,
              marginVertical: '1%',
              borderColor: 'rgba(	255, 197, 165,0.8)',
              borderWidth: .5,
              }}>
            
              {
                item1.sharedtoUserContactDetail.email
              }
            </Text>
          )) 
        }
      </View> */}
      <Divider 
      style={{backgroundColor: COLORS.greylight,
      marginVertical: '1%',
      }} />
        </> 
      }
      
    </View>
   )
    
};


  const getAllItemssharedbyUserId = async () => {
   
    setloading(true);
    var InsertAPIURL = base_url + '/share/getAllItemssharedbyUserId.php?sharedbyUserId='+user_id+'&shareType=ITEM';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    
   
    await fetch(InsertAPIURL, {
      method: 'GET',
      headers: headers,

    })
      .then(response => response.json())
      .then(response => {
        setloading(false);
        if (response.error == false) {
          setsharebyMe(response.data.reverse());
        }
        else if (response.error == true &&response.data == null ) {
          setsharebyMe([])
        }
        else {
          alert('this is error' + response.error);
        }
      })
      .catch(error => {
        alert('this is error' + error);
      });
  };
  const getAllItemsSharedtoUserId = async (id) => {
   
    setloading(true);
    setsharebyMe([]);
    id = id ? id : user_id;
    console.log('this is id ',id);
    var InsertAPIURL = base_url + '/share/getAllItemsSharedtoUserId.php?sharedtoUserId='+id+'&shareType=ITEM';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    
   
    await fetch(InsertAPIURL, {
      method: 'GET',
      headers: headers,

    })
      .then(response => response.json())
      .then(response => {
        setloading(false);
        if (response.error == false) {
          setsharebyMe(response.data.reverse())
        }
        else if (response.error == true &&response.data == null ) {
          setsharebyMe([])
        }
        else {
          alert('this is error' + response.error);
        }
      })
      .catch(error => {
        alert('this is error' + error);
      });
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
          zIndex: 9999,
          backgroundColor: 'red',
        }}
        duration={1000}
        onDismiss={onDismissSnackBar}>
        helo
      </Snackbar>
      <View
        style={{
          paddingHorizontal: '5%',
          zIndex: -9,
        }}>
        <View style={styles.mainView}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <TouchableOpacity
              style={{
                width: '50%',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: 2,
                borderBottomColor:
                  activeShare == 'ShareWithMe' ? COLORS.primary : COLORS.white,
              }}
              onPress={() => {
                setActiveShare('ShareWithMe')
                getAllItemsSharedtoUserId();
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color:
                    activeShare == 'ShareWithMe'
                      ? COLORS.primary
                      : COLORS.black,
                }}>
                Share With Me
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '50%',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: 2,
                borderBottomColor:
                  activeShare == 'ShareByMe' ? COLORS.primary : COLORS.white,
              }}
              onPress={() => {
                setActiveShare('ShareByMe')
                getAllItemssharedbyUserId(); 
              }
              }>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color:
                    activeShare == 'ShareByMe' ? COLORS.primary : COLORS.black,
                }}>
                Share By Me
              </Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator
              style={{
                marginTop: height / 3,
              }}
              size="small"
              color={COLORS.secondary}
            />
          ) : (
          <FlatList
              
              // pullToRefresh={true}
              data={sharebyMe}
              style={{
                width: width * 0.95,
                height: height*0.83,
                marginTop: '2%',
                backgroundColor: COLORS.white,
              }}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
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
              ListFooterComponent={
                <View
                  style={{
                    height: 200,
                  }}></View>
              }
          />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Share;
