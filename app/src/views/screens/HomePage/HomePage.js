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
  BackAndroid,

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
  Divider,
  Dialog,
  Menu,
  Provider,
  FAB,
  Portal,
  Badge,
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
import {RBSheet} from 'react-native-raw-bottom-sheet';
import {useIsFocused,useNavigation,StackActions,CommonActions} from '@react-navigation/native';
// import { StackActions, NavigationActions } from '@react-navigation';

import RNExitApp from 'react-native-exit-app';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function HomePage({route,navigation}) {
  const nav= useNavigation();
  const refRBSheet = useRef();
  const isFocused = useIsFocused();
 
  
  // routes 
  const currentRoute='Home';
  // vaiuables
  const [refreshing, setRefreshing] = useState(false);
  const [user_id, setUserId] = useState('');
  const [total_contact, setTotalContact] = useState(0);
  const [total_custom_category, setTotalCustomCategory] = useState(0);
  const [total_document, setTotalDocument] = useState(0);
  const [recentFiles, setRecentFiles] = useState([]);
  const [defaultCategory, setdefaultCategory] = useState([]);
  const [myCategory, setmyCategory] = useState([]);
  const [category, setCategory] = useState('');
  const [categoryName, setCategoryName] = useState('Select/Add Category');
  const [catActive, setCatActive] = useState(false);
  const [folderName, setFolderName] = useState('');

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        navigation.navigate('SubCategory', {cat: item});
      }}
      style={{
        // flexDirection: 'row',
        width: item.name == 'After' ? width * 0.84 : width * 0.4,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2%',
        padding:Platform.OS==='ios'? '4%': '4%',
        borderRadius: 10,
        borderColor: COLORS.light,
        marginHorizontal: '2%',
        // height: item.name == 'After' ? 80 : 110,
        backgroundColor: COLORS.primary + '20',
      }}>
      <Image
        style={{
          width: item.name == 'After' ? 40 : 45,
          height: item.name == 'After' ? 26 : 45,
        }}
        source={{uri: image_url + item.image}}
      />

      <Text
        style={{
          fontSize: 12,
          color: COLORS.light,
          textAlign: 'center',
          marginTop: 5,
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

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
  // dilaog
  const [visibleDia, setVisibleDia] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  // Menu
  const [visibleMenu, setVisibleMenu] = useState(false);
  const openMenu = () => setVisibleMenu(true);
  const closeMenu = () => setVisibleMenu(false);

  // fab
  const [state, setState] = useState({open: false});

  const onStateChange = ({open}) => setState({open});

  const {open} = state;

  

  /// call api
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getRecentFiles(user_id);
    getTotal(user_id);
  }, [recentFiles, total_contact, total_custom_category, total_document]);
  const getTotal = async id => {
    var InsertAPIURL = base_url + '/home/getHomeDetail.php';
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
        if (response[0].error == false) {
          setTotalContact(response[0].total_contact);
          setTotalCustomCategory(response[0].total_custom_cat);
          setTotalDocument(response[0].total_doc);
          setRefreshing(false);
        }
      })
      .catch(error => {
        alert('this is error' + error);
        setRefreshing(false);
      });
  };
  const getRecentFiles = async id => {
    var InsertAPIURL = base_url + '/home/getAllRecentFiles.php';
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
        if (response[0].error == false) {
          setRecentFiles(response[0].docs);
        } else if (response[0].error == true) {
          setRecentFiles([]);
        }
        setRefreshing(false);
      })
      .catch(error => {
        alert('this is error' + error);
        setRefreshing(false);
      });
  };

  const getCat = async id => {
    setloading(true);
    var InsertAPIURL = base_url + '/category/getAll.php';
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
        setdefaultCategory(response[0].default);
        setmyCategory(response[0].my_categories);
        setloading(false);
      })
      .catch(error => {
        alert('this is error' + error);
      });
  };
  const createFolder = async () => {
    var InsertAPIURL = base_url + '/category/create.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: user_id,
        folderName: folderName,
      }),
    })
      .then(response => response.json())
      .then(response => {})
      .catch(error => {
        alert('this is error' + error);
      });
  };
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
      getTotal(data.user_id);
      getRecentFiles(data.user_id);
      setUserId(data.user_id);
      getCat(data.user_id);
     
    } catch (e) {
      // error reading value
    }
  };
  const convert = value => {
    var newValue = value;
    if (value >= 1000) {
      var suffixes = ['', 'k', 'm', 'b', 't'];
      var suffixNum = Math.floor(('' + value).length / 3);
      var shortValue = '';
      for (var precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum != 0
            ? value / Math.pow(1000, suffixNum)
            : value
          ).toPrecision(precision),
        );
        var dotLessShortValue = (shortValue + '').replace(
          /[^a-zA-Z 0-9]+/g,
          '',
        );
        if (dotLessShortValue.length <= 2) {
          break;
        }
      }
      if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
      newValue = shortValue + suffixes[suffixNum];
    }
    return (newValue = newValue.toString().toUpperCase());
  };
  
  const getuploadStatus = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('uploadStatus');
     console.log('uploadStatus', jsonValue)
     if(jsonValue == 'true'){
      setSnackDetails({
        text: 'Document Uploaded Successfully',
        backgroundColor: COLORS.success,
      });

      setTimeout(() => {
        onToggleSnackBar();
      }, 1000);
      
      AsyncStorage.removeItem('uploadStatus');
    }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getData();
    getuploadStatus();
    // if (Platform.OS === 'ios') {
    //   navigation.addListener('beforeRemove', (e) => {
    //     e.preventDefault();
    //     RNExitApp.exitApp();
    //   });
    // }
  

   
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
      getuploadStatus();
    });
    return unsubscribe;

    
    
  }, [isFocused]);
  return (
    <Provider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          zIndex: -99,
        }}>
             <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                marginVertical: Platform.OS === 'ios' ? '5%' : '4%',
                alignItems: 'center',
                paddingHorizontal: '5%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: 40,
                    height: 24,
                  }}
                  source={require('../../../assets/logo-small.png')}
                />
              </View>
              <Text
                style={{
                  color: COLORS.dark,
                  fontSize: 20,
                }}>
                Home
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('RecentFiles');
                }}
                style={{
                  // backgroundColor: COLORS.primary,
                  padding: '2%',
                }}
                >
                <Text
                  style={{
                    color: COLORS.light,
                    fontSize: 14,
                  }}>
                  Recent Files
                </Text>
              </TouchableOpacity>
            </View>
          {
            loading == true ?
            <View
          style={{
            flexDirection: 'row',
            height: height/2,
            marginTop: 200,
            alignItems: 'center',
            paddingHorizontal: 20,
            justifyContent: 'center',
            backgroundColor: COLORS.white,
            position: 'absolute',
            width: '100%',
            zIndex: 99,
          }}
          >
              <ActivityIndicator
               
                size="small"
                color={COLORS.primary}
              />

          </View> : <>
          <FAB.Group
          icon={'camera'}
          color={COLORS.white}
          backdropColor={COLORS.dark + '90'}
          actions={[
            {
              icon: 'image',
              label: 'Take Photo(s)',
              onPress: () => {
                navigation.navigate('CameraScreenCrop', {
                  cameraType: 'image',
                  categoryName: categoryName,
                  categoryId: category,
                  defaultCategory: defaultCategory,
                  myCategory: myCategory,
                  typeExsist:'false'
                });
              },
              style: {
                backgroundColor: COLORS.white,
              },
              small: false,
              color: COLORS.secondary,
              labelStyle: {
                color: COLORS.secondary,
                backgroundColor: COLORS.white,
                paddingHorizontal: 14,
                paddingVertical: 3,
                borderRadius: 10,
              },
            },
            {
              icon: 'file',
              label: 'Scan Document(s)',
              onPress: () => {
                navigation.navigate('CameraScreenCrop', {
                  cameraType: 'doc',
                  categoryName: categoryName,
                  categoryId: category,
                  defaultCategory: defaultCategory,
                  myCategory: myCategory,
                  typeExsist:'true'
                });
              },
              style: {
                backgroundColor: COLORS.white,
              },
              small: false,
              color: COLORS.secondary,
              labelStyle: {
                color: COLORS.secondary,
                backgroundColor: COLORS.white,
                paddingHorizontal: 14,
                paddingVertical: 3,
                borderRadius: 10,
              },
            },
          ]}
          fabStyle={{
            backgroundColor: COLORS.primary,
            marginBottom: Platform.OS === 'ios' ? height * 0.07 : height * 0.1,
            zIndex: 999,
            right: width * 0.39,
          }}
          onStateChange={onStateChange}
          onPress={() => {
            if (Platform.OS === 'android') {
              navigation.navigate('CameraScreenCropAndroid', {
                categoryName: categoryName,
                categoryId: category,
                defaultCategory: defaultCategory,
                myCategory: myCategory,
                typeExsist:false
              });
            }
            else {
              navigation.navigate('CameraScreenCrop', {
                categoryName: categoryName,
                categoryId: category,
                defaultCategory: defaultCategory,
                myCategory: myCategory,
                typeExsist:false
              });
            }
          }}
        />

        <Snackbar
          visible={visible}
          style={{
            zIndex: 999,
            backgroundColor: snackDetails.backgroundColor,
            position: 'absolute',
            bottom: 80,
            width: width * 0.96,
          }}
          duration={1000}
          onDismiss={onDismissSnackBar}>
          {snackDetails.text}
        </Snackbar>
        <View
          style={{
            paddingHorizontal: '5%',
            zIndex: -9,
          }}>
          <View style={styles.mainView}>
         
            <>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginBottom: '5%',
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    borderWidth: 1,
                    padding: '3%',
                    borderColor: 'lightgrey',
                    borderRadius: 10,
                    width: '32%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => {
                    navigation.navigate('RecentFiles');
                  }}>
                  <Image
                    source={require('../../../assets/doc.png')}
                    style={{
                      width: 44,
                      height: 40,
                      marginBottom: '4%',
                    }}
                  />

                  <Headline
                    style={{
                      color: '#12BF24',
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>
                    {convert(total_document)}
                  </Headline>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Contact');
                  }}
                  activeOpacity={0.7}
                  style={{
                    borderWidth: 1,
                    padding: '3%',
                    borderColor: 'lightgrey',
                    borderRadius: 10,
                    width: '32%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Image
                    source={require('../../../assets/contact.png')}
                    style={{
                      width: 44,
                      height: 40,
                    }}
                  />
                  <Headline
                    style={{
                      color: '#8932FF',
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>
                    {convert(total_contact)}
                  </Headline>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('MyCategory')}
                  activeOpacity={0.7}
                  style={{
                    borderWidth: 1,
                    padding: '3%',
                    borderColor: 'lightgrey',
                    borderRadius: 10,
                    width: '32%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Image
                    source={require('../../../assets/category.png')}
                    style={{
                      width: 44,
                      height: 40,
                      marginBottom: '4%',
                    }}
                  />
                  <Headline
                    style={{
                      color: '#E72E7A',
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>
                    {convert(total_custom_category)}
                  </Headline>
                </TouchableOpacity>
              </View>
              
            </>
            <FlatList
                numColumns={2}
                data={defaultCategory}
                style={{
                  width: width * 0.9,
                  height: height,
                }}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                  <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'center',
                  // marginVertical: Platform.OS === 'ios' ? '3%' : '6%',
                  alignItems: 'center',
                }}>                
                <TouchableOpacity
                  onPress={() => navigation.navigate('MyCategory')}
                  style={{
                    backgroundColor: COLORS.secondary,
                    paddingHorizontal: 7,
                    paddingVertical: Platform.OS==='android'?6: 10,
                    width: 150,
                    textAlign: 'center',
                    borderRadius: 10,
                    alignItems: 'center',
                  }}
                  >
                  <Text
                  style={{
                    color: COLORS.white,
                  }}
                  >
                    More Folders
                  </Text>
                </TouchableOpacity>
              </View>
                }
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
           
          </View>
        </View>
          </>
          }
          
        
      </SafeAreaView>
    </Provider>
  );
}

export default HomePage;
