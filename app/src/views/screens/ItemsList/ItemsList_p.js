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
  ToastAndroid,
  Toast
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
import RBSheet from 'react-native-raw-bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import ReactNativeBlobUtil from 'react-native-blob-util';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function ItemsList({route,
  navigation}) {
    const {
      subcat,cat
    } = route.params;
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
  const [actionData, setActionData] = useState({
    link: '',
    doc_type: '',
    doc_id: '',
    item:null
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
              navigation.navigate('ViewDoc1', {
                link:image_url+ item.local_link,
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
                link: image_url+item.local_link,
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
              item:item
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
  // dilaog
  const [visibleDia, setVisibleDia] = useState(false);
  const [visibledel, setVisibleDel] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const showDialog1 = () => setVisibleDel(true);
  const hideDialog1 = () => setVisibleDel(false);

  // Menu
  const [visibleMenu, setVisibleMenu] = useState(false);
  const openMenu = () => setVisibleMenu(true);
  const closeMenu = () => setVisibleMenu(false);

// fab
const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  /// call api
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getRecentFiles(user_id);
  }, [recentFiles, total_contact, total_custom_category, total_document]);
  
  const getRecentFiles = async id => {
    var InsertAPIURL = base_url + '/document/getDoc.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: id,
        subcat_id: subcat.id,
        cat_id: cat.id,
      }),
    })
      .then(response => response.json())
      .then(response => {
        console.log('this is response cat_id ' + response[0].cat_id);
        console.log('this is response subcat_id ' + response[0].subcat_id);
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
      })
      .catch(error => {
        alert('this is error' + error);
      });
  };
  const deleteFile = async () => {
    hideDialog1();
    var InsertAPIURL = base_url + '/document/trashDoc.php';
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
      getCat(data.user_id);
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    getData();
    // Error: Too many re-renders. React limits the number of renders to prevent an infinite loop

    const unsubscribe = navigation.addListener('focus', () => {
      getData()
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
              color={COLORS.red+ '80'}
            />
            <Paragraph
              style={{
                textAlign: 'center',
                color: COLORS.dark,
              }}>
              Are you sure you want to delete this File?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
          <Button
              textColor={COLORS.primary}
              onPress={deleteFile}
             
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
          zIndex:-99
        }}>
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
            marginBottom: Platform.OS === 'ios' ? height * 0.01 : height * 0.03,
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
                typeExsist:true,
                cat:cat,
                subcat:subcat
              });
            }
            else {
              navigation.navigate('CameraScreenCrop', {
                categoryName: categoryName,
                categoryId: category,
                defaultCategory: defaultCategory,
                myCategory: myCategory,
                typeExsist:true,
                cat:cat,
                subcat:subcat
              });
            }
          }}
        />
      
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
              marginVertical: '5%',
              alignItems: 'center',
              // backgroundColor:COLORS.red,
            }}>
              <TouchableOpacity
              style={{
                padding: 5,
                paddingHorizontal: 10,
                marginRight: '5%',
              }}
              onPress={() => {
                navigation.goBack();
              }}
              >
              <Icon name="chevron-left" size={15} color={COLORS.secondary} />
              </TouchableOpacity>
            <Text
              style={{
                color: COLORS.secondary,
                fontSize: 15,
                fontWeight: 'bold',
                width: '85%',
              }}>
             {cat.name} / {subcat.name}
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
        height={300}
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
                  navigation.navigate('ViewDoc', {
                    link: actionData.item.local_link,
                    doc_type:
                    actionData.item.doc_type == 'pdf'
                        ? 'PDF'
                        : actionData.item.doc_type == 'png' ||
                          actionData.item.doc_type == 'jpeg' ||
                          actionData.item.doc_type == 'jpg'
                        ? 'Image'
                        : actionData.item.doc_type == 'xlsx' || actionData.item.doc_type == 'xls'
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
                    link: actionData.item.local_link,
                  });
                }
              }}
              
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: '3%',
                paddingHorizontal: '5%',
              }}
              >
              <Icon name="eye" size={20} 
              style={{marginHorizontal: '4%'}}
              color={COLORS.secondary} />
              <Text
                style={{
                  fontSize: 16,
                  marginHorizontal: '1%',
                  color: COLORS.light
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
                      ReactNativeBlobUtil.fs.dirs.DownloadDir + '/' + uniq_id + '.'+actionData.doc_type,
                  })
                    .fetch('GET', actionData.link, {
                      Authorization: 'Bearer access-token',
                      // more headers  ..
                    })
                    // download progress handler
                    .progress((received, total) => {
                      console.log('progress', received / total);
                      // ios toasts
                      if (Platform.OS === 'ios') {
                        Toast.show({
                          text: 'Downloading...',
                          buttonText: 'Ok',
                          duration: 1000,
                          position: 'bottom',
                        });
                      } else {
                        ToastAndroid.show('Downloading...', ToastAndroid.SHORT);
                      }
                    })
                    .then(res => {
                      console.log('The file saved to ', res.path());
                      // ios toasts
                      if (Platform.OS === 'ios') {
                        Toast.show({
                          text: 'Downloaded',
                          buttonText: 'Ok',
                          duration: 1000,
                          position: 'bottom',
                        });
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
                  color: COLORS.light
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
            showDialog1();
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
              color: COLORS.light
            }}>
            Delete
          </Text>
        </TouchableOpacity>
      </RBSheet>
    </Provider>
  );
}

export default ItemsList;
