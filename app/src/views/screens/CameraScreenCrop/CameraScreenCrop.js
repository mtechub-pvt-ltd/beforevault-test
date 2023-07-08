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
  PermissionsAndroid,
  KeyboardAvoidingView,
  Keyboard,
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
  Menu,
  Provider,
} from 'react-native-paper';
import COLORS from '../../../consts/colors';
import base_url from '../../../consts/base_url';
import image_url from '../../../consts/image_url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeBlobUtil from 'react-native-blob-util';

import {it} from 'date-fns/locale';
import RNFS from 'react-native-fs';
import {CropView} from 'react-native-image-crop-tools';
// use is focused
import {useIsFocused} from '@react-navigation/native';
import DocumentScanner from 'react-native-document-scanner-plugin';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function CameraScreen({route, navigation}) {
  const isFocused = useIsFocused();
  const {
    // cameraType,
    categoryId,
    path,
    index,
    defaultCategory,
    myCategory,
    typeExsist,
    cat,
    subcat,
  } = route.params;

  const refInput = React.useRef(null);
  const [images, setImages] = React.useCallback(useState([]));
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);
  const [imageCropLoader, setImageCropLoader] = useState(false);
  const [cameraType, setCameraType] = useState('check');
  const [userId, setUserId] = useState(null);
  const [imagePdf, setImagePdf] = useState([]);
  const [toDel, seToDel] = useState();
  const scrollRef = useRef(null);
  const [visible, setVisible] = React.useState(false);
  const [delIndex, setDelIndex] = useState(null);
  const [indexx, setIndexx] = useState(0);
  const [uniqId, setUniqId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [folderName, setFolderName] = useState();
  const [subFolderName, setSubFolderName] = useState();
  const [fileName, setFileName] = useState('');
  const [catActive, setCatActive] = useState(false);
  const [subCatActive, setSubCatActive] = useState(false);
  const [category, setCategory] = useState(typeExsist == true ? cat.id : null);
  const [categoryName, setCategoryName] = useState(
    typeExsist == true ? cat.name : 'Select/Add Folder',
  );
  const [subCategory, setSubCategory] = useState(
    typeExsist == true ? subcat.id : null,
  );
  const [subCategoryName, setSubCategoryName] = useState(
    typeExsist == true ? subcat.name : 'Select Sub Folder',
  );
  const [subCatList, setSubCatList] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [visibledel, setVisibleDel] = useState(false);
  const showDialog = () => setVisibleDel(true);
  const hideDialog = () => setVisibleDel(false);
  // dilaog
  const [visibleDia, setVisibleDia] = useState(false);

  // snackbar
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackDetails, setSnackDetails] = useState({
    text: '',
    backgroundColor: '',
  });

  const onToggleSnackBar = () => setVisibleSnack(!visible);
  const onDismissSnackBar = () => setVisibleSnack(false);

  // Menu
  const [visibleMenu, setVisibleMenu] = useState(false);
  const openMenu = () => setVisibleMenu(true);
  const closeMenu = () => setVisibleMenu(false);
  const [visibleMenuSubCat, setVisibleMenuSubCat] = useState(false);
  const openMenuSubCat = () => setVisibleMenuSubCat(true);
  const closeMenuSubCat = () => setVisibleMenuSubCat(false);
  // const showDialog = () => setVisible(true);
  // const hideDialog = () => setVisible(false);

  const openCam = async () => {
    // setImageCropLoader(true);
    // const imageDetail = await ImagePicker.openCamera({
    //   cropping: false,
    //   imageLoader: true,
    //   mediaType: 'photo',
    //   compressImageQuality: 0.8,
    //   imageType: 'jpg',
    //   cameraType: 'back',
    //   // cropping: true,
    // }).then( image => {
    //   setLoading(true);

    //   navigation.navigate('Crop', {
    //     // path: Platform.OS == 'ios' ? lastItem.data.replace('ReactNativeBlobUtil-file://', 'file://') : lastItem.data.replace('ReactNativeBlobUtil-file://', ''),
    //     path:Platform.OS == 'ios' ? "file://"+image.path : image.path,
    //     index: indexx,
    //     defaultCategory: defaultCategory,
    //     myCategory: myCategory,
    //     cameraType: cameraType,
    //   });
    //   setImage(image.path);
    //   setIndexx(indexx + 1);
    // });

    const {scannedImages} = await DocumentScanner.scanDocument({
      letUserAdjustCropArea: true,
      saveInAppDocument: false,
      croppedImageQuality: Platform.OS === 'ios' ? 1 : 10,
    });
   if ( images.length < 25){
    if (scannedImages.length == 0) {
      console.log('scannedImages', scannedImages);
      setImages(scannedImages);
      setImage(scannedImages[0]);
    } else {
      console.log('new scannedImages', scannedImages);
      // append scanned images to existing images
      setImages([...images, ...scannedImages]);
      setImage(scannedImages[0]);
      scrollRef.current.scrollToEnd();
    }
   } else {
      alert('You can not select more than 25 images');
   }
    
  };

  const uploadImages = async () => {
    // setLoading2(true);
    // make unique id time stamp
    const uniqueId = new Date().getTime();

    console.log('uniqueId', uniqueId);
    const x = category == undefined ? 'no_cat_id' : category;
    const y = folderName == undefined ? 'no folder' : folderName;
    const url = encodeURI(
      base_url +
        'pdf/upload_image.php?u_id=' +
        userId +
        '&uniqueId=' +
        uniqueId +
        '&fileName=' +
        fileName +
        '&cat_id=' +
        x +
        '&sub_cat_id=' +
        subCategory +
        '&folderName=' +
        y +
        '&subCat=' +
        subFolderName,
    );

    var InsertAPIURL = url;
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(async response => {
        console.log('response', response);
        // final array of images
        var x = 0;
        await images.forEach(img => {
          setLoading2(true);
          setIndexx(1);
          // get index of image
          const index = images.indexOf(img);
          const fileExtension = img.split('.').pop();
          ReactNativeBlobUtil.fetch(
            'POST',
            base_url +
              '/pdf/upload_img_1.php?uniq_id=' +
              uniqueId +
              '&u_id=' +
              userId +
              '&cat_id=' +
              response.cat_id +
              '&sub_cat_id=' +
              response.sub_cat_id,
            {
              Authorization: 'Bearer access-token',
              otherHeader: 'foo',
              'Content-Type': 'multipart/form-data',
            },
            [
              {
                name: 'image',
                filename: uniqueId + '_0000' + index + '.' + fileExtension,
                type: 'image/jpg',
                data:
                  Platform.OS === 'android'
                    ? ReactNativeBlobUtil.wrap(img)
                    : ReactNativeBlobUtil.wrap(img.replace('file://', '')),
              },
            ],
          )
            .uploadProgress((written, total) => {
              console.log('uploaded', written / total);
            })
            .progress((received, total) => {
              console.log('progress', received / total);
            })
            .then(response1 => response1.json())
            .then(response1 => {
              setTimeout(() => {
                setLoading2(false);

                if (cameraType == 'doc') {
                  navigation.navigate('ViewPdf', {
                    pdfData: uniqueId,
                    fileName: fileName,
                    cat_id:response.cat_id,
                    sub_cat_id:response.sub_cat_id,
                  });
                } else if (cameraType == 'image') {
                  navigation.navigate('ViewImage', {
                    pdfData: uniqueId,
                    uniq_id: uniqueId,
                    fileName: fileName,
                    cat_id:response.cat_id,
                    sub_cat_id:response.sub_cat_id,
                  });
                }
                //        navigation.navigate('ViewPdf', {
                //   pdfData: uniqueId,
                // });
                console.log('done');
              }, 5000);
              console.log(response1);
            })
            .catch(error => {
              setLoading2(false);

              alert('error' + error);
            });
          setIndexx(indexx + 1);
        });
        // final array of images end
      })
      .catch(error => {
        alert('this is error' + error);
      });

    //   await  images.map((item, index) => {

    //     ReactNativeBlobUtil.fetch(
    //     'POST',base_url +'/pdf/upload_img_1.php',
    //   {
    //     Authorization: 'Bearer access-token',
    //     otherHeader: 'foo',
    //     'Content-Type': 'multipart/form-data',
    //   },
    //   [
    //     {
    //       name: 'image',
    //       filename: item,
    //       type: 'image/jpg',
    //       data: Platform.OS === 'android' ? ReactNativeBlobUtil.wrap(item) :
    //       ReactNativeBlobUtil.wrap(item.replace('file://', '')),
    //     }
    //   ],
    // )
    //   .uploadProgress((written, total) => {
    //     console.log('uploaded', written / total);
    //   })
    //   .progress((received, total) => {
    //     console.log('progress', received / total);
    //   })
    //   .then(response => response.json())
    //   .then(response => {
    //     console.log(response);
    //   })
    //   .catch(error => {
    //     setLoading2(false);
    //     alert('error' + error);
    //   });
    // })

    // alert('Image Uploaded Successfully');
    // setLoading2(false);
    // setImages([]);
    // setImage(null);
    // setLoading2(false);
    // setCategoryName('Select/Add Folder');
    // setFileName('');
    // setFolderName('');
    // setCategory('');
    // setCatActive(false);
    // setSubCategory('');
    // setSubCategoryName('Select Sub Folder');
    // setSubCatActive(false);
    // setSubCatList([]);

    /// previous code

    // const x = category == undefined ? 'no_cat_id' : category;
    // const y = folderName == undefined ? 'no folder' : folderName;
    // const url=encodeURI(base_url +'/pdf/upload_image.php?u_id='+userId +'&fileName=' +fileName +'&cat_id=' +x +'&sub_cat_id=' +subCategory+'&folderName=' +y+'&subCat=' +subFolderName);
    // console.log('url', images);
    // setLoading2(false);
    // await ReactNativeBlobUtil.fetch(
    //   'POST',Platform.OS === 'ios' ? url :
    //   base_url +'/pdf/upload_image.php?u_id='+userId +'&fileName=' +fileName +'&cat_id=' +x +'&sub_cat_id=' +subCategory+'&folderName=' +y+'&subCat=' +subFolderName,
    //   {
    //     Authorization: 'Bearer access-token',
    //     otherHeader: 'foo',
    //     'Content-Type': 'multipart/form-data',
    //   },
    //   images,
    // )
    //   .uploadProgress((written, total) => {
    //     console.log('uploaded', written / total);
    //   })
    //   .progress((received, total) => {
    //     console.log('progress', received / total);
    //   })
    //   .then(response => response.json())
    //   .then(response => {
    //     setImages([]);
    //     setImage(null);
    //     setLoading2(false);
    //     setCategoryName('Select/Add Folder');
    //     setFileName('');
    //     setFolderName('');
    //     setCategory('');
    //     setCatActive(false);
    //     setSubCategory('');
    //     setSubCategoryName('Select Sub Folder');
    //     setSubCatActive(false);
    //     setSubCatList([]);

    //     console.log(response);
    //     // if(cameraType=='doc') {
    //     //   navigation.navigate('ViewPdf', {
    //     //     pdfData: response,

    //     //   });
    //     // } else if(cameraType=='image') {
    //     //   navigation.navigate('ViewImage', {
    //     //     pdfData: response,
    //     //   });
    //     // }
    //   })
    //   .catch(error => {
    //     setLoading2(false);
    //     alert('error' + error);
    //   });
  };

  const getAllByAnyCatId = async id => {
    setSubCategoryName('loading ...');
    var InsertAPIURL = base_url + '/subcategory/getAllByAnyCatId.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        cat_id: id,
      }),
    })
      .then(response => response.json())
      .then(response => {
        console.log('response', response);
        if (response[0].error == true) {
          setSubCatActive(false);
          setSubCatList([]);
          setSubCategoryName('No Sub Folder for this Folder');
          return;
        } else {
          setSubCatList(response[0].list);
          setSubCategoryName('Select Sub Folder');
        }
      })
      .catch(error => {
        alert('this is error' + error);
      });
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userDetail');
      const data = JSON.parse(jsonValue);
      setUserId(data.user_id);
    } catch (e) {
      // error reading value
    }
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    getData();
    // setVisibleDia(true);
    Platform.OS === 'android' ? requestCameraPermission() : null;
    if (path != undefined && index != undefined) {
      setImageCropLoader(false);
      if (images.length != 0 && imageCropLoader == false) {
        scrollRef.current.scrollToEnd();
      }
      const fileName = path.split('/').pop();
      console.log('path', path);
      const newImages = [...images];
      // unique id
      newImages[index] = {
        name: 'image[]',
        filename: fileName,
        type: 'image/jpg',
        data:
          Platform.OS === 'android'
            ? ReactNativeBlobUtil.wrap(path)
            : ReactNativeBlobUtil.wrap(path.replace('file://', '')),
      };
      setImages(newImages);
      setImage(path);
    }
    // openCam();
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [isFocused]);

  return (
    <Provider>
      {imageCropLoader == true ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.white,
          }}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{
            backgroundColor: COLORS.white,
          }}>
          <Dialog
            visible={visibleDia}
            dismissable={false}
            style={{
              backgroundColor: COLORS.white,
              zIndex: -9999,
            }}
            onDismiss={() => {
              setVisibleDia(false);
            }}>
            <Dialog.Title
              style={{
                color: COLORS.primary,
                fontSize: 15,
                fontWeight: '700',
              }}>
              {cameraType == 'image' ? 'Save Album' : 'Save a File'}
            </Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Name a File"
                style={{
                  marginBottom: 10,
                  backgroundColor: COLORS.white,
                  color: COLORS.dark,
                }}
                activeUnderlineColor={COLORS.primary}
                underlineColor={COLORS.light}
                placeholderTextColor={COLORS.greylight + '30'}
                textColor={COLORS.light}
                value={fileName}
                ref={refInput}
                autoFocus={true}
                onChangeText={text => setFileName(text)}
              />
              {catActive == true ? null : (
                <View>
                  <Menu
                    visible={visibleMenu}
                    onDismiss={closeMenu}
                    anchor={
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={openMenu}
                        style={{
                          flexDirection: 'row',
                          alignContent: 'center',
                          alignItems: 'center',
                          backgroundColor: COLORS.white,
                          padding: 10,
                          paddingVertical: 15,
                          borderBottomWidth: 1,
                          borderBottomColor: COLORS.greylight + 50,
                          marginBottom: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Icon
                            name="folder"
                            size={20}
                            color={
                              categoryName == 'Select/Add Folder'
                                ? COLORS.greylight
                                : COLORS.secondary
                            }
                          />
                          <Text
                            style={{
                              color:
                                categoryName == 'Select/Add Folder'
                                  ? COLORS.greylight
                                  : COLORS.secondary,
                              marginLeft: '11%',
                            }}>
                            {categoryName}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    }>
                    <Menu.Item
                      onPress={() => {
                        setCatActive(true);
                        setSubCatActive(true);
                        closeMenu();
                      }}
                      title={'+ New Folder'}
                    />
                    {defaultCategory.map((item, index) => {
                      return (
                        <Menu.Item
                          key={index}
                          onPress={() => {
                            setCategory(item.id);
                            setCategoryName(item.name);
                            getAllByAnyCatId(item.id);
                            closeMenu();
                          }}
                          title={item.name}
                        />
                      );
                    })}

                    <Divider />
                    {myCategory == null
                      ? null
                      : myCategory.map((item, index) => {
                          return (
                            <Menu.Item
                              key={index}
                              onPress={() => {
                                setCategory(item.id);
                                setCategoryName(item.name);
                                closeMenu();
                                getAllByAnyCatId(item.id);
                              }}
                              title={item.name}
                            />
                          );
                        })}
                  </Menu>
                </View>
              )}
              {subCatActive == true ? null : (
                <View>
                  <Menu
                    visible={visibleMenuSubCat}
                    onDismiss={closeMenuSubCat}
                    anchor={
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          if (subCatList == null) {
                            setSnackDetails({
                              text: 'Please select a Folder first',
                              backgroundColor: COLORS.red,
                            });
                            setVisibleSnack(true);
                          } else {
                            openMenuSubCat();
                          }
                        }}
                        style={{
                          flexDirection: 'row',
                          alignContent: 'center',
                          alignItems: 'center',
                          backgroundColor: COLORS.white,
                          padding: 10,
                          paddingVertical: 15,
                          borderBottomWidth: 1,
                          borderBottomColor: COLORS.greylight + 50,
                          marginBottom: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Icon
                            name="folder"
                            size={20}
                            color={
                              subCategoryName == 'Select Sub Folder'
                                ? COLORS.greylight
                                : COLORS.secondary
                            }
                          />
                          <Text
                            style={{
                              color:
                                subCategoryName == 'Select Sub Folder'
                                  ? COLORS.greylight
                                  : COLORS.secondary,
                              marginLeft: '11%',
                            }}>
                            {subCategoryName}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    }>
                    {subCatList == null || subCatList == undefined
                      ? null
                      : subCatList.map((item, index) => {
                          return (
                            <Menu.Item
                              key={index}
                              onPress={() => {
                                setSubCategory(item.id);
                                setSubCategoryName(item.name);
                                closeMenuSubCat();
                              }}
                              title={item.name}
                            />
                          );
                        })}
                  </Menu>
                </View>
              )}

              <View>
                {catActive == true ? (
                  <TextInput
                    label="Folder Name"
                    style={{
                      marginBottom: 10,
                      backgroundColor: COLORS.white,
                      color: COLORS.dark,
                    }}
                    activeUnderlineColor={COLORS.primary}
                    underlineColor={COLORS.light}
                    placeholderTextColor={COLORS.greylight + '80'}
                    textColor={COLORS.dark}
                    value={folderName}
                    onChangeText={text => {
                      setCategoryName();
                      setCategory();
                      setFolderName(text);
                    }}
                    right={
                      <TextInput.Icon
                        icon="trash-can-outline"
                        onPress={() => {
                          setCatActive(false);
                          setSubCatActive(false);
                        }}
                        iconColor={COLORS.red}
                      />
                    }
                  />
                ) : null}
              </View>
              <View>
                {subCatActive == true ? (
                  <TextInput
                    label="Sub Folder Name"
                    style={{
                      marginBottom: 10,
                      backgroundColor: COLORS.white,
                      color: COLORS.dark,
                    }}
                    activeUnderlineColor={COLORS.primary}
                    underlineColor={COLORS.light}
                    placeholderTextColor={COLORS.greylight + '80'}
                    textColor={COLORS.dark}
                    value={subFolderName}
                    onChangeText={text => {
                      // setCategoryName();
                      // setCategory();
                      setSubCategoryName('');
                      setSubFolderName(text);
                    }}
                  />
                ) : null}
              </View>
            </Dialog.Content>
            <Dialog.Actions
              style={
                {
                  // width: '100%',
                  // justifyContent: 'center',
                }
              }>
              <Button
                onPress={() => {
                  if (fileName.length == 0) {
                    setSnackDetails({
                      text: 'Please enter a File Name',
                      backgroundColor: COLORS.red,
                    });
                    setVisibleSnack(true);
                  } else if (categoryName === 'Select/Add Folder') {
                    setSnackDetails({
                      text: 'Please select a Folder',
                      backgroundColor: COLORS.red,
                    });
                    setVisibleSnack(true);
                  } else if (subCategoryName === 'Select Sub Folder') {
                    console.log('subCategoryName', subCategoryName);
                    setSnackDetails({
                      text: 'Please select a Sub Folder',
                      backgroundColor: COLORS.red,
                    });
                    setVisibleSnack(true);
                  } else {
                    setCategoryName('Select/Add Folder');
                    refInput.current.focus();
                    setVisibleDia(false);
                    uploadImages();
                  }
                }}
                textColor={COLORS.primary}>
                Save
              </Button>
              <Button
                onPress={() => {
                  setVisibleDia(false);
                }}
                textColor={COLORS.red}>
                Cancel
              </Button>
            </Dialog.Actions>
          </Dialog>
          <Snackbar
            visible={visibleSnack}
            style={{
              backgroundColor: snackDetails.backgroundColor,
              zIndex: 999,
              marginBottom: isKeyboardVisible == false ? 10 : width / 1.6,
            }}
            duration={1000}
            onDismiss={onDismissSnackBar}>
            {snackDetails.text}
          </Snackbar>
          <Appbar.Header
            style={{
              backgroundColor: COLORS.primary,
              elevation: 0,
              zIndex: -9,
            }}>
            <Appbar.BackAction
              iconColor="white"
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Appbar.Content
              titleStyle={{
                color: COLORS.white,
                fontSize: 20,
                fontWeight: 'bold',
              }}
              // title={uniqId}
              title={
                cameraType == 'image'
                  ? 'Take Photo'
                  : cameraType == 'doc'
                  ? 'Scan PDF'
                  : 'Choose Option'
              }
              // subtitle={}
            />
          </Appbar.Header>
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
                name="alert-circle"
                size={45}
                color={COLORS.red}
              />
              <Paragraph
                style={{
                  textAlign: 'center',
                  color: COLORS.dark,
                }}>
                Are you sure you want to delete this image?
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor={COLORS.red} onPress={hideDialog}>
                Cancel
              </Button>
              <Button
                textColor={COLORS.primary}
                onPress={() => {
                  hideDialog();
                  images.splice(delIndex, 1);
                  setImages([...images]);
                  setImage(null);
                }}>
                Yes
              </Button>
            </Dialog.Actions>
          </Dialog>
          <View
            style={{
              flex: 0.72,
              zIndex: -9,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.white,
            }}>
            {image == null ? (
              <View
                style={{
                  borderRadius: 10,
                  width: width / 1.1,
                  height: images.length == 0 ? height / 1.34 : height / 1.7,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: COLORS.greylight,
                  borderStyle: 'dashed',
                  marginTop: '5%',
                }}>
                <Icon name="image" size={50} color={COLORS.light + '80'} />
                <Text
                  style={{
                    color: COLORS.light,
                  }}>
                  No Image Selected
                </Text>
              </View>
            ) : (
              <ImageBackground
                source={{uri: image}}
                style={{
                  resizeMode: 'cover',
                  padding: 10,
                  borderRadius: 10,
                  width: width / 1.1,
                  height: height / 1.7,
                  marginTop: '5%',
                  backgroundColor: COLORS.white,
                }}
                resizeMode="contain"
                // resizeMethod="scale"
              />
            )}
          </View>
          {images.length > 0 ? (
            <ScrollView
              ref={scrollRef}
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              style={{
                margin: 10,
                padding: 10,
                // position: 'absolute',
                // bottom: '9%',
                zIndex: -9,
              }}>
              {images.map((item, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setImage(item);
                  }}
                  key={index}>
                  <ImageBackground
                    source={{uri: item}}
                    style={{
                      width: 80,
                      height: 80,
                      backgroundColor: COLORS.white,
                      marginRight: 10,
                    }}
                    imageStyle={{
                      borderRadius: 6,
                      borderColor: COLORS.greylight,
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      {/* <TouchableRipple
                      onPress={() => {
                        // navigation.navigate('Crop', {
                        //   path: Platform.OS == 'ios' ? item.data.replace('ReactNativeBlobUtil-file://', 'file://') : item.data.replace('ReactNativeBlobUtil-file://', ''),
                        //   index: index,
                        //   defaultCategory: defaultCategory,
                        //   myCategory: myCategory,
                        //   cameraType: cameraType,
                        // });
                      }}
                      style={{
                        width: '40%',
                        alignSelf: 'flex-start',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.dark + '80',
                        borderBottomRightRadius: 5,
                        borderTopLeftRadius: 5,
                        paddingVertical: 3,
                      }}>
                      <Icon name="crop" size={20} color={COLORS.white} />
                    </TouchableRipple> */}
                      <TouchableRipple
                        onPress={() => {
                          setDelIndex(index);
                          setVisibleDel(true);
                          // images.splice(index, 1);
                          // setImages([...images]);
                          // console.log(images)
                        }}
                        style={{
                          width: '30%',
                          alignSelf: 'flex-end',
                          paddingVertical: 3,
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: COLORS.dark + '80',
                          borderBottomLeftRadius: 5,
                          borderTopRightRadius: 5,
                        }}>
                        <Icon name="close" size={20} color={COLORS.white} />
                      </TouchableRipple>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}
          {
          images.length > 25 ? (
            <View
              style={{
                position: 'absolute',
                bottom: '0%',
                zIndex: 1000,
                width: '100%',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: COLORS.red,
                }}>
                You can only upload 25 images
              </Text>
            </View>
          ) : <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            zIndex: -9,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,

              marginLeft: '5%',
              marginTop: '5%',
            }}>
            <Text
              style={{
                marginRight: 3,
                color: COLORS.dark,
              }}>
              {images.length} / {Platform.OS == 'ios' ? '25' : '10'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              openCam();
            }}
            activeOpacity={0.8}
            style={{
              width: 60,
              height: 60,
              backgroundColor: COLORS.secondary,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              marginTop: '5%',
              alignSelf: 'center',
            }}>
            <Icon name="plus" size={34} color={COLORS.white} />
          </TouchableOpacity>
          {loading2 ? (
            <View
              style={{
                padding: 10,
                marginRight: '5%',
                borderRadius: 5,
                marginTop: '5%',
              }}>
              <ActivityIndicator animating={true} color={COLORS.primary} />
            </View>
          ) : (
            <TouchableOpacity
              style={{
                padding: 10,
                marginRight: '5%',
                backgroundColor: COLORS.primary,
                borderRadius: 5,
                marginTop: '5%',
              }}
              onPress={() => {
                // if (images.length != 0) {
                setVisibleDia(true);
                // } else {
                //   setSnackDetails({
                //     text: 'Please Capture atleast one Image',
                //     backgroundColor: COLORS.red,
                //   });
                //   onToggleSnackBar();
                // }
                // uploadImages();
              }}>
              {/* <Icon name="Save" size={20} color={COLORS.white} /> */}
              <Text
                style={{
                  color: COLORS.white,
                }}>
                Save
              </Text>
            </TouchableOpacity>
          )}
        </View>
          }
          
        </ScrollView>
      )}

      {cameraType == 'check' ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingVertical: Platform.OS == 'android' ? 10 : 25,
            backgroundColor: COLORS.white,

            // marginTop: 120,
          }}>
          <Button
            buttonColor={COLORS.primary}
            textColor={COLORS.white}
            onPress={() => {
              openCam();
              setTimeout(() => {
                setCameraType('image');
              }, 1000);
            }}
            icon="camera"
            mode="contained"
            style={{
              width:'45%',
            }}>
            Take Picture
          </Button>
          <Button
            buttonColor={COLORS.secondary}
            textColor={COLORS.white}
            onPress={() => {
              openCam();
              setTimeout(() => {
                setCameraType('doc');
              }, 1000);
            }}
            icon="file-document"
            mode="contained"
            style={{
              width: '45%',
            }}>
            Scan PDF
          </Button>
        </View>
      ) : null}
    </Provider>
  );
}

export default CameraScreen;
