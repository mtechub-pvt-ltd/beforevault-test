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
  Paragraph
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
import ReactNativeBlobUtil from 'react-native-blob-util';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function HomePage({route, navigation}) {
  const refRBSheet = useRef();
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
  const [dialogCont, setDialogCont] = useState('');
  const [actionData, setActionData] = useState({
    link: '',
    doc_type: '',
    doc_id: '',
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
              navigation.navigate('ViewDoc', {
                link: item.local_link,
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
                link: item.local_link,
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
            //
            // open url
            // console.log(item.local_link);
            // refRBSheet.current.open();

            // Linking.openURL(image_url+ item.local_link);
            setActionData({
              link: image_url + item.local_link,
              doc_type: item.doc_type,
              doc_id: item.id,
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
    var InsertAPIURL = base_url + '/home/trash.php';
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
  const permanentlyDelete = async () => {
    console.log(actionData.doc_id);
    hideDialog();
    var InsertAPIURL = base_url + '/document/permanentlyDeleteDoc.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        doc_id:  actionData.doc_id,
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
  const restoreTrashDoc = async () => {
    console.log(actionData.doc_id);
    hideDialog();
    var InsertAPIURL = base_url + '/document/restoreTrashDoc.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        doc_id:  actionData.doc_id,
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
            backgroundColor: COLORS.primary,
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
  useEffect(() => {
    getData();
    console.log(route);
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (route.name == 'RecentFiles') {
        navigation.goBack();
        return true;
      }
    });
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', () => {
        if (route.name == 'RecentFiles') {
          navigation.goBack();
          return true;
        }
      });
    };
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
              {
                dialogCont == 'restore this file?' ? <Icon
                style={{
                  marginVertical: 10,
                  alignSelf: 'center',
                }}
                name="undo"
                size={40}
                color={COLORS.primary+ '80'}
              /> : 
              <Icon
              style={{
                marginVertical: 10,
                alignSelf: 'center',
              }}
              name="exclamation"
              size={40}
              color={COLORS.red+ '80'}
            />
              }
            
            <Paragraph
              style={{
                textAlign: 'center',
                color: COLORS.dark,
              }}>
              Are you sure you want to 
            </Paragraph>
            <Paragraph
              style={{
                textAlign: 'center',
                color: COLORS.dark,
              }}>
               {
                dialogCont
               }
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
          <Button
              textColor={COLORS.primary}
              onPress={()=>{
                dialogCont != 'restore this file?' ?
                permanentlyDelete() : restoreTrashDoc()
              }}
             
              >
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
        duration={3000}
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
                Trash
              </Text>
            </View>

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
          </View>
        </View>
      </SafeAreaView>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={250}
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
            refRBSheet.current.close();
            setDialogCont('restore this file?');
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
          {/* restore icon
           */}
          <Icon name="undo" size={20} color={COLORS.primary} />
          <Text
            style={{
              fontSize: 16,
              marginHorizontal: '5%',
              color: COLORS.light,
            }}>
           Restore
          </Text>
        </TouchableOpacity>
        <Divider
          style={{
            backgroundColor: COLORS.light,
            marginHorizontal: '5%',
          }}
        />
        <TouchableOpacity
          onPress={() => {
            refRBSheet.current.close();
            setDialogCont('permanently delete this file?');
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
           Permanently Delete
          </Text>
        </TouchableOpacity>
      </RBSheet>
    </Provider>
  );
}

export default HomePage;
