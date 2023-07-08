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
  Alert,
  ToastAndroid,
  Toast,
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
  Paragraph,
  Appbar,
  
} from 'react-native-paper';
import COLORS from '../../../consts/colors';
import base_url from '../../../consts/base_url';
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
import RBSheet from 'react-native-raw-bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import image_url from '../../../consts/image_url';
// import ReactNativeBlobUtil from 'react-native-blob-util';
import ReactNativeBlobUtil from 'react-native-blob-util'

import {WebView} from 'react-native-webview';
import Share from 'react-native-share';



const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function HomePage({route, navigation}) {
  const refRBSheet = useRef();
  const refRBSheetViewDoc = useRef();
  const isFocused = useIsFocused();
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
  const [filePath, setFilePath] = useState('');
  const [actionData, setActionData] = useState({
    link: '',
    doc_type: '',
    doc_id: '',
    item: null,
  });

  const renderItem = ({item}) => (
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
              item.doc_type == 'pdf' ||
              item.doc_type == 'xlsx' ||
              item.doc_type == 'xls' ||
              item.doc_type == 'docx' ||
              item.doc_type == 'doc'
            ) {
              // console.log('item.local_link', item.local_link);
              // setActionData({
              //   link:'https://docs.google.com/gview?embedded=true&url='+image_url + item.local_link,
              //   doc_type: item.doc_type,
              //   doc_id: item.id,
              //   item:item
              // });
              // refRBSheetViewDoc.current.open();
              // navigation.navigate('ViewDoc', {
              navigation.navigate('ViewDoc1', {
                link: image_url + item.local_link,
                doc_type:
                  item.doc_type == 'pdf'
                    ? 'PDF'
                    : item.doc_type == 'png' ||
                      item.doc_type == 'jpeg' ||
                      item.doc_type == 'jpg'
                    ? 'Image'
                    : item.doc_type == 'xlsx' || item.doc_type == 'xls'
                    ? 'Doc'
                    : 'Doc',
                uniq_id: item.uniq_id,

                // item.doc_type
              });
            } else if (item.doc_type == 'album') {
              navigation.navigate('ViewImage', {
                pdfData: null,
                uniq_id: item.uniq_id,
              });
            } else {
              navigation.navigate('ViewSingleImage', {
                uniq_id: item.uniq_id,
                // link: image_url+item.local_link,
                link: image_url + item.local_link,
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
                : item.doc_type == 'png' ||
                  item.doc_type == 'jpeg' ||
                  item.doc_type == 'jpg'
                ? 'file-image'
                : item.doc_type == 'xlsx' || item.doc_type == 'xls'
                ? 'file-excel'
                : item.doc_type == 'docx' || item.doc_type == 'doc'
                ? 'file-word'
                : 'list'
            }
            size={item.doc_type == 'album' ? 15 : 20}
            color={
              item.doc_type == 'pdf'
                ? COLORS.red
                : item.doc_type == 'png' ||
                  item.doc_type == 'jpeg' ||
                  item.doc_type == 'jpg'
                ? COLORS.primary
                : COLORS.blue
            }
            style={{
              margin: 10,
              backgroundColor:
                item.doc_type == 'pdf'
                  ? COLORS.red + '30'
                  : item.doc_type == 'png' ||
                    item.doc_type == 'jpeg' ||
                    item.doc_type == 'jpg'
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
              {item.name}
            </Text>

            <Text
              style={{
                fontSize: 10,
                color: COLORS.light,
              }}>
              {item.upload_date}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.light,
              }}>
              {item.cat_name}
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
            setActionData({
              link: image_url + item.local_link,
              doc_type: item.doc_type,
              doc_id: item.id,
              item: item,
            });
            refRBSheet.current.open();
          }}>
          <Icon name="ellipsis-v" size={15} color={COLORS.light} />
        </TouchableOpacity>
      </View>
      <Divider style={{backgroundColor: COLORS.greylight}} />
    </>
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

  const [visibledel, setVisibleDel] = useState(false);
  const showDialog = () => setVisibleDel(true);
  const hideDialog = () => setVisibleDel(false);

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
  }, [recentFiles, total_contact, total_custom_category, total_document]);

  const getRecentFiles = async id => {
    setloading(true);
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
        setloading(false);
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
  const deleteFile = async () => {
    hideDialog();
    var InsertAPIURL = base_url + '/document/trashDoc.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        doc_id: actionData.doc_id,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setRefreshing(false);
        setActionData({
          link: '',
          doc_type: '',
          doc_id: '',
        });

        if (response[0].error == false) {
          getRecentFiles(user_id);
          setSnackDetails({
            text: response[0].message,
            backgroundColor: COLORS.red,
          });
          onToggleSnackBar();
        }
      })
      .catch(error => {
        setRefreshing(false);
        setActionData({
          link: '',
          doc_type: '',
          doc_id: '',
        });
        hideDialog();
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

      getRecentFiles(data.user_id);
      setUserId(data.user_id);
    } catch (e) {
      // error reading value
    }
  };
  // adding share feature 
  const shareFile = async (filePath) => {
    setloading(true);
    // refRBSheet.current.close();
     await ReactNativeBlobUtil
      .config({
        fileCache: true,
        appendExt: 'pdf',
        // add  ios only option here
        // path:  ReactNativeBlobUtil.fs.dirs.DocumentDir + '/'+actionData.item.name+'.'+actionData.item.doc_type
        path:  ReactNativeBlobUtil.fs.dirs.DocumentDir + '/'+actionData.item.name+'.'+actionData.item.doc_type

      })
      .fetch('GET',filePath, {
        //some headers ..
      })
      .then(async (res) => {
        // the temp file path
        console.log('The file saved to ', res.path())
        setloading(false);
        // return res.readFile('base64')
        try {
          const options = {
            title: 'Share file',
            url: res.path(),
            type: 'file/*',
          };
      
          await Share.open(options);
          refRBSheet.current.close();
        } catch (error) {
          refRBSheet.current.close();
          console.log('Error sharing file:', error);
        }
      }
      )
      .catch((err) => {
        console.log(err)
      alert('Error : ' + err); 
      }
      )

    
  };
  useEffect(() => {
    getData();
   
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [isFocused]);
  return (
    <Provider>
      <Dialog
        style={{
          backgroundColor: COLORS.white,
          zIndex: 1000,
        }}
        visible={visibledel}
        onDismiss={() => {
          setVisibleDel(false);
        }}>
        <Dialog.Content
          style={{
            alignSelf: 'center',
          }}>
          <Icon
            style={{
              marginVertical: 10,
              alignSelf: 'center',
            }}
            name="exclamation"
            size={40}
            color={COLORS.red + '80'}
          />
          <Paragraph
            style={{
              textAlign: 'center',
              color: COLORS.dark,
            }}>
            Are you sure you want to delete this file?
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button textColor={COLORS.primary} onPress={deleteFile}>
            Yes
          </Button>
          <Button textColor={COLORS.red} onPress={hideDialog}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          zIndex: -99,
        }}>
        <Snackbar
          visible={visible}
          style={{
            zIndex: 9999,
            backgroundColor: snackDetails.backgroundColor,
          }}
          duration={5000}
          onDismiss={onDismissSnackBar}>
          {snackDetails.text}
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
                width: '100%',
                justifyContent: 'flex-start',
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  marginRight: 30,
                }}
                onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={15} color={COLORS.light} />
              </TouchableOpacity>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginVertical: 10,
                  color: COLORS.light,
                }}>
                Recent Files
              </Text>
            </View>
            {
               loading==true?
               <ActivityIndicator
              animating={loading}
              color={COLORS.primary}
              size="small"
              style={{
                position: 'absolute',
                alignSelf: 'center',
                zIndex: 999,
                top:height/3
              }}
            /> : 
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={recentFiles}
              style={{
                width: width * 0.9,
                height: height,
              }}
              renderItem={renderItem}
              ListFooterComponent={
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 120,
                  }}>
                  <Text
                    style={{
                      color: COLORS.white,
                    }}>
                    No Record Found
                  </Text>
                </View>
              }
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
            }
            
            
          </View>
        </View>
      </SafeAreaView>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={400}
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
            width: '100%',
            justifyContent: 'space-between',
            paddingHorizontal: '5%',
            paddingVertical: '3%',
            alignItems: 'center',
          }}>
          <Headline
            style={{
              color: COLORS.dark,
              fontSize: 18,
            }}>
            Actions
          </Headline>
          <TouchableOpacity
            onPress={() => {
              refRBSheet.current.close();
            }}
            style={{
              padding: '2%',
            }}>
            <Icon name="times" size={20} color={COLORS.light} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (
              actionData.item.doc_type == 'pdf' ||
              actionData.item.doc_type == 'xlsx' ||
              actionData.item.doc_type == 'xls' ||
              actionData.item.doc_type == 'docx' ||
              actionData.item.doc_type == 'doc'
            ) {
              
              refRBSheet.current.close();
              navigation.navigate('ViewDoc1', {
                link:image_url+ actionData.item.local_link,
                uniq_id: actionData.item.uniq_id,
                doc_type:
                  actionData.item.doc_type == 'pdf'
                    ? 'PDF'
                    : actionData.item.doc_type == 'png' ||
                      actionData.item.doc_type == 'jpeg' ||
                      actionData.item.doc_type == 'jpg'
                    ? 'Image'
                    : actionData.item.doc_type == 'xlsx' ||
                      actionData.item.doc_type == 'xls'
                    ? 'Doc'
                    : 'Doc',

                // item.doc_type
              });
            } else if (actionData.item.doc_type == 'album') {
              refRBSheet.current.close();
              navigation.navigate('ViewImage', {
                pdfData: null,
                uniq_id: actionData.item.uniq_id,
              });
              
            } else {
              refRBSheet.current.close();
              navigation.navigate('ViewSingleImage', {
                uniq_id: actionData.item.uniq_id,
                link: image_url + actionData.item.local_link,
              });
             
            }
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingVertical: '3%',
            paddingHorizontal: '5%',
          }}>
          <Icon
            name="eye"
            size={20}
            style={{marginHorizontal: '4%'}}
            color={COLORS.secondary}
          />
          <Text
            style={{
              fontSize: 16,
              marginHorizontal: '1%',
              color: COLORS.light,
            }}>
            View
          </Text>
        </TouchableOpacity>
        <Divider
          style={{
            backgroundColor: COLORS.greylight,
            height: 0.5,
            width: '90%',
            alignSelf: 'center',
          }}
        />

        {actionData.link == 'https://beforevault.com/login/none' ? null : (
          <>
            <TouchableOpacity
              onPress={() => {
                refRBSheet.current.close();

                var uniq_id = Math.floor(Math.random() * 1000000000);
                ReactNativeBlobUtil.config({
                  fileCache: true,
                  appendExt: 'png',
                  path:
                    ReactNativeBlobUtil.fs.dirs.DownloadDir +
                    '/' +
                    actionData.item.name +
                    '.' +
                    actionData.item.doc_type,
                })
                  .fetch('GET', image_url + actionData.item.local_link, {
                    Authorization: 'Bearer access-token',
                    // more headers  ..
                  })
                  // download progress handler
                  .progress((received, total) => {
                    console.log('progress', received / total);
                    // ios toasts
                    if (Platform.OS === 'ios') {
                      console.log('Downloading...');
                    } else {
                      ToastAndroid.show('Downloading...', ToastAndroid.SHORT);
                    }
                  })
                  .then(res => {
                    console.log('The file saved to ', res.path());

                    // ios toasts
                    if (Platform.OS === 'ios') {
                      console.log('Downloaded in Download Folder');
                      setSnackDetails({
                        text: 'Downloaded in Download Folder',
                        backgroundColor: COLORS.primary,
                      });
                      onToggleSnackBar();
                    } else {
                      ToastAndroid.show(
                        'Downloaded in Download Folder',
                        ToastAndroid.SHORT,
                      );
                    }
                  })
                  // Something went wrong:
                  .catch((errorMessage, statusCode) => {
                    console.log(errorMessage);
                  });
              }}
              style={{
                flexDirection: 'row',
                width: '100%',
                // backgroundColor: COLORS.red,
                padding: '4%',
                alignItems: 'center',
                marginHorizontal: '5%',
              }}>
              <Icon name="download" size={20} color={COLORS.primary} />
              <Text
                style={{
                  fontSize: 16,
                  marginHorizontal: '5%',
                  color: COLORS.light,
                }}>
                Download
              </Text>
            </TouchableOpacity>
            <Divider
              style={{
                backgroundColor: COLORS.greylight,
                height: 0.5,
                width: '90%',
                alignSelf: 'center',
              }}
            />
          </>
        )}

        <TouchableOpacity
          onPress={() => {
            refRBSheet.current.close();
            navigation.navigate('ShareContactList',{
              item:actionData
            })
            // showDialog();
          }}
          activeOpacity={0.6}
          style={{
            flexDirection: 'row',
            width: '100%',
            // backgroundColor: COLORS.red,
            padding: '4%',
            alignItems: 'center',
            marginHorizontal: '5%',
          }}>
          <Icon name="share" size={20} color={'orange'} />
          <Text
            style={{
              fontSize: 16,
              marginHorizontal: '5%',
              color: COLORS.light,
            }}>
            Share with BV Contacts
          </Text>
        </TouchableOpacity>
        <Divider
          style={{
            backgroundColor: COLORS.greylight,
            height: 0.5,
            width: '90%',
            alignSelf: 'center',
          }}
        />
        <TouchableOpacity
          onPress={() => {
            shareFile(image_url + actionData.item.local_link);
          }}
          style={{
            flexDirection: 'row',
            width: '100%',
            // backgroundColor: COLORS.red,
            padding: '4%',
            alignItems: 'center',
            marginHorizontal: '5%',
          }}>
          <View
          style={{
            flexDirection: 'row',
          }}
          >
            <Icon name="share-alt" size={20} color={COLORS.primary} />
            <Text
              style={{
                fontSize: 16,
                marginHorizontal: '5%',
                color: COLORS.light,
                marginLeft:'12%'
              }}>
              External Share  
            </Text>
          </View>
          <View
          style={{
            flexDirection: 'row',
            backgroundColor: COLORS.white,
            width: '40%',
            justifyContent: 'space-between',
            alignSelf: 'flex-end',
          }}
          >
            <Icon name="envelope" size={20} color={'purple'} />
            <Icon name="comments" size={20} color='orange' />
            <Icon name="whatsapp" size={20} color={'green'} />
            <Icon name="skype" size={20} color={'blue'} />
            
          </View>
         
        </TouchableOpacity>
        <Divider
          style={{
            backgroundColor: COLORS.greylight,
            height: 0.5,
            width: '90%',
            alignSelf: 'center',
          }}
        />
        <TouchableOpacity
          onPress={() => {
            refRBSheet.current.close();
            showDialog();
          }}
          style={{
            flexDirection: 'row',
            width: '100%',
            // backgroundColor: COLORS.red,
            padding: '4%',
            alignItems: 'center',
            marginHorizontal: '5%',
          }}>
          <Icon name="trash" size={20} color={COLORS.red} />
          <Text
            style={{
              fontSize: 16,
              marginHorizontal: '5%',
              color: COLORS.light,
            }}>
            Delete
          </Text>
        </TouchableOpacity>
      </RBSheet>
      <RBSheet
        ref={refRBSheetViewDoc}
        closeOnDragDown={true}
        closeOnPressMask={true}
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
            width: '100%',
            // backgroundColor:'red',
            alignContent: 'center',
            alignItems: 'center',
            paddingVertical: '3%',
          }}>
          <Text
            style={{
              fontSize: 20,
              marginHorizontal: '5%',
              color: COLORS.light,
            }}>
            Preview
          </Text>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: COLORS.primary,
              borderRadius: 5,
              marginRight: 10,
            }}
            onPress={() => {
              refRBSheetViewDoc.current.close();
            }}>
            <Text
              style={{
                color: COLORS.white,
              }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
          }}>
          <WebView
            source={{
              uri: actionData.link,
            }}
            style={{flex: 1}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
          />
        </View>
      </RBSheet>
    </Provider>
  );
}

export default HomePage;
