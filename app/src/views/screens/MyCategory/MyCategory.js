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
  Modal,
  Portal,
  Badge,
  Divider,
  Dialog,
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
import RBSheet from "react-native-raw-bottom-sheet";
import { IgnorePattern } from 'react-native/Libraries/LogBox/LogBox';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;




function MyCategory({ navigation }) {
// RBsheet
const refRBSheet = useRef();  
const refRBSheetOrder = useRef();  
const [rbfolderName, setRbFolderName] = useState('');
const [rbfolderId, setRbFolderId] = useState('');
const [edit, setEdit] = useState(false);
  
  // vaiuables 
  const [defaultCategory, setdefaultCategory] = useState([]);
  const [myCategory, setmyCategory] = useState([]);
  const color=['#AD81FF','#F45758','#37A5E8','#F5D76B','#5C86F6','#33DEDE']
  const [activeColor, setActiveColor] = useState('#AD81FF');
  const [folderName, setFolderName] = useState('');
  const [user_id, setUser_id] = useState('');

  // dialog delete
  const [visibledel, setVisibleDel] = useState(false);

  const showDialog = () => setVisibleDel(true);

  const hideDialog = () => setVisibleDel(false);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={.6}
      onPress={() => {
        // navigation.navigate('MySubCategory', { item: item })
        navigation.navigate('SubCategory', {
           cat: item,
           custom:true
           }) 
      }}
      onLongPress={() => {
        setRbFolderName(item.name)
        setRbFolderId(item.id)
        refRBSheet.current.open();
      }}
      style={{
        // flexDirection: 'row',
        width: item.name == 'After' ? width * .84 : width * .40,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary+'30',
        marginBottom: '4%',
        padding: 10,
        borderRadius: 10,
        
        marginHorizontal: '2%',
        height: 110
      }}
    >
      <Image
        style={{
          width: item.name == 'After' ? 70 : 45,
          height: 45
        }}
        source={{ uri: image_url + item.image }}
      />

      <Text
        style={{
          // fontSize:12,
          color: COLORS.secondary,
          textAlign: 'center',
          marginTop: 5
        }}
      >{item.name}</Text>


    </TouchableOpacity>
  );

  const listSort= [{
    name: 'A to Z',
    type: 'asc',
    icon: 'sort-up'
  },
  {
    name: 'Z to A',
    type: 'desc',
    icon: 'sort-down'
  },
  {
    name: 'Newest',
    type: 'newest' ,
    icon: 'sort-amount-down' 
  },
  {
    name: 'Oldest',
    type: 'oldest',
    icon: 'sort-amount-up'
  }
];
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
  /// call api 
  const getTotal = async (id,order) => {
    setloading(true)
    var InsertAPIURL = base_url + '/category/myCategories.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: id,
        orderBy: order,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setloading(false)
        if (response[0].error == false) {
          setdefaultCategory(response[0].default)
          setmyCategory(response[0].my_categories)
        }
      })
      .catch(error => {
        alert('this is error' + error);
      });

  };
  const createFolder = async () => {
    hideModal()
   setloading(true)
    var InsertAPIURL = base_url + '/category/create.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id:user_id,
        folderName:folderName
      }),
    })
      .then(response => response.json())
      .then(response => {
        setloading(false)
        if(response[0].error==false){
          setFolderName('')
          getTotal(user_id,'newest')
         
          setSnackDetails({
            text: response[0].message,
            backgroundColor: COLORS.primary,
          });
          onToggleSnackBar();
        } else {
          setSnackDetails({
            text: response[0].message,
            backgroundColor: COLORS.red,
          });
          onToggleSnackBar();
        }
      })
      .catch(error => {
        alert('this is error' + error);
      });

  };
  const updateFolder = async (name) => {
    hideModal()
   setloading(true)
    var InsertAPIURL = base_url + '/category/update.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        id:rbfolderId,
        folderName:rbfolderName,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setloading(false)
        if(response[0].error==false){
          setFolderName('')
          getTotal(user_id,'newest')
         
          setSnackDetails({
            text: response[0].message,
            backgroundColor: COLORS.primary,
          });
          onToggleSnackBar();
        } else {
          setSnackDetails({
            text: response[0].message,
            backgroundColor: COLORS.red,
          });
          onToggleSnackBar();
        }
      })
      .catch(error => {
        alert('this is error' + error);
      });

  };
  const deleteFolder = async () => {  
     console.log(rbfolderId)
   setloading(true)
    var InsertAPIURL = base_url + '/category/delete.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        cat_id:rbfolderId,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setloading(false)
        if(response[0].error==false){
          setFolderName('')
          getTotal(user_id,'newest')
         
          setSnackDetails({
            text: response[0].message,
            backgroundColor: COLORS.primary,
          });
          onToggleSnackBar();
        } else {
          setSnackDetails({
            text: response[0].message,
            backgroundColor: COLORS.red,
          });
          onToggleSnackBar();
        }
      })
      .catch(error => {
        alert('this is error' + error);
      });

  };
  // store user data in async storage
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('userDetail', jsonValue)
      // console.log('userDetail', jsonValue)
    }
    catch (e) {
      // saving error
      alert('Error : ' + e);
    }
  }
  // get user data from async storage
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userDetail')
      const data = JSON.parse(jsonValue)
      getTotal(data.user_id,'asc')
      setUser_id(data.user_id)
      getRecentFiles(data.user_id)
    } catch (e) {
      // error reading value
    }
  }
  useEffect(() => {
    getData()
  }, []);
  return (


    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,

      }}
    >

      <Modal visible={visible1} onDismiss={hideModal}
        dismissable={true}
        contentContainerStyle={{
          backgroundColor: 'white', padding: 20, zIndex: 9,
          width: width - 50,
          alignSelf: 'center',
          borderRadius: 20,
          height: height / 3.4,
        }}>
        <View style={{ alignItems: 'center' }}>
          <Text
          style={{
            fontSize: 18,
            fontWeight:'700',
            color: COLORS.secondary,
            marginBottom: '3%'
          }}
          >{edit ? 'Edit Folder' :'Create Folder' }</Text>
          <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: '3%'
          }}
          >
          </View>
          
          <TextInput
            style={[styles.txtInpt,{
              backgroundColor: COLORS.white,
            }]}
            color={COLORS.dark}
            placeholder="Enter Folder Name"
            placeholderTextColor={COLORS.light}
            keyboardType="email-address"
            autoCapitalize="none"
            underlineColor={COLORS.dark}
            activeUnderlineColor={COLORS.primary}
            autoCorrect={false}
            mode="flat"
            value={edit  ? rbfolderName : folderName}
          onChangeText={(text) => {
            edit  ? setRbFolderName(text) : setFolderName(text)
          }}
          />

          <Button
            mode='contained'
            style={[STYLES.btn, {
              marginTop: '7%',
              width: width / 2,
            }]}

            contentStyle={STYLES.btnContent}
            onPress={() => {
              if(edit==true) {
                setEdit(false)
                  hideModal()
                  updateFolder()

              } else {
                if(folderName.length>0){
                  createFolder()
                }
              }
            
                
            
            }}
            loading={loading}
            disabled={loading}
          >
            <Text
              style={STYLES.btnText}
            >
              {edit ? 'Update' :'Create'}
            </Text>
          </Button>
        </View>

      </Modal>
      <Snackbar
        visible={visible}
        style={{
          zIndex: 999,
          backgroundColor: snackDetails.backgroundColor,

        }}

        duration={1000}
        onDismiss={onDismissSnackBar}
      >
        {snackDetails.text}
      </Snackbar>
      <Dialog visible={visibledel} onDismiss={hideDialog}>
            <Dialog.Title
            style={{
              alignSelf:'center'
            }}
            >
              <Icon name="exclamation-triangle" size={30} color={COLORS.red} />
            </Dialog.Title>
            <Dialog.Content
            style={{
              alignSelf:'center'
            }}
            >
              <Paragraph
              style={{
                textAlign:'center',
              }}
              >Deleting this folder will delete 
              </Paragraph>
              <Paragraph
              style={{
                textAlign:'center',
              }}
              >all files and subfolders in it.
              </Paragraph>
              <Paragraph
              style={{
                textAlign:'center',
                marginTop:'5%'
              }}
              >
              Are you sure you want to proceed?
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button 
              color={COLORS.light}
              onPress={hideDialog}>No</Button>
              <Button
              color={COLORS.red}
              onPress={()=>{
                hideDialog()
                deleteFolder()
              }}>Yes</Button>
            </Dialog.Actions>
          </Dialog>
      
      {/* bottom sheet  */}
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
            }
          }}
        >
        <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          paddingHorizontal: '5%',
          paddingVertical: '3%',
          alignItems: 'center',
        }}
        >
          <Headline
          style={{
            color: COLORS.primary,
          }}
          >{rbfolderName}</Headline>
          <TouchableOpacity
          onPress={()=>{
            refRBSheet.current.close()
          }}
          style={{
            padding:'2%',
          }}
          >
          <Icon name="times" size={20} color={COLORS.light} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
        onPress={()=>{
          setEdit(true)
          refRBSheet.current.close()
          showModal()
        }}
        style={{
          flexDirection: 'row',
          width: '100%',
          // backgroundColor: COLORS.red,
          padding: '4%',
          alignItems: 'center',
          marginHorizontal: '5%',
        }}
        >
          <Icon name="edit" size={20} color={COLORS.secondary} />
          <Text
          style={{
            fontSize: 16,
            marginHorizontal: '5%',
          }}
          >Rename Folder</Text>
        </TouchableOpacity>
        <Divider 
        style={{
          backgroundColor: COLORS.greylight,
          height:.5,
          width: '90%',
          alignSelf: 'center',
        }}
        />
        <TouchableOpacity
        onPress={()=>{
          
          refRBSheet.current.close()
          showDialog()
        }}
        style={{
          flexDirection: 'row',
          width: '100%',
          // backgroundColor: COLORS.red,
          padding: '4%',
          alignItems: 'center',
          marginHorizontal: '5%',
        }}
        >
          <Icon name="trash" size={20} color={COLORS.red} />
          <Text
          style={{
            fontSize: 16,
            marginHorizontal: '5%',
          }}
          >Delete</Text>
        </TouchableOpacity>
    
        
        </RBSheet>
        {/* ordering */}
      <RBSheet
          ref={refRBSheetOrder}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={300}
          openDuration={250}
          customStyles={{
            container: {
              // justifyContent: "center",
              // alignItems: "center"
            }
          }}
        >
        <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'flex-end',
          paddingHorizontal: '5%',
          // paddingVertical: '3%',
          alignItems: 'center',
        }}
        >
          
          <TouchableOpacity
          onPress={()=>{
            refRBSheetOrder.current.close()
          }}
          style={{
            padding:'2%',
          }}
          >
          <Icon name="times" size={20} color={COLORS.light} />
          </TouchableOpacity>
        </View>
        {
          listSort.map((item, index)=>{
            return(
              <TouchableOpacity
              index={index}
              
              onPress={()=>{
                
                getTotal(user_id,item.type)
                refRBSheetOrder.current.close()
              }}
              style={{
                flexDirection: 'row',
                width: '90%',
                // backgroundColor: COLORS.red,
                padding: '4%',
                alignItems: 'center',
                
                justifyContent: 'flex-start',
              }}
              >
                <Icon name={item.icon} 
                style={{
                marginHorizontal: '5%',
                }}
                size={20} color={COLORS.light} />
                <Text
                style={{
                  fontSize: 16,
                  marginHorizontal: '5%',
                }}
                >{item.name}</Text>
                
              </TouchableOpacity>
            )

          })
        }
        
    
        
        </RBSheet>
      <View
        style={{
          paddingHorizontal: '5%',
          zIndex: -9
        }}
      >
        <View
          style={styles.mainView}
        >
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginVertical: '6%',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack()
                }}
              >
                <Icon name="chevron-left"
                  style={{
                    marginRight: 10,
                    paddingHorizontal: 10
                  }}
                  size={20} color={COLORS.light} />
              </TouchableOpacity>
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 20,
                  fontWeight: 'bold'
                }}
              > Other</Text>
            </View>
                <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                >
                <TouchableOpacity
                style={{
                  marginRight: 20,
                  padding:5
                }}
              onPress={() => {
                
                refRBSheetOrder.current.open()
              }}
            >
              <Icon name="sort" size={20} color={COLORS.light} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setVisible1(true)
              }}
            >
              <Icon name="plus-circle" size={20} color={COLORS.light} />
            </TouchableOpacity>
                </View>
            
          </View>
          {
            loading ? <ActivityIndicator
              style={{
                marginTop: height / 3
              }}
              size="small" color={COLORS.secondary} /> :
              <FlatList
                numColumns={2}
                data={myCategory}
                style={{
                  width: width * .9,
                  height:Platform.OS=='ios' ? height * .83 : height * .90,
                }}
                renderItem={renderItem}

                keyExtractor={(item, index) => item.toString()
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: height - 300
                    }}
                  >
                    <Icon name="exclamation-circle"
                      size={35}
                      color={COLORS.greylight}
                      style={{
                        marginBottom: 10
                      }}
                    />
                    <Text
                      style={{
                        color: COLORS.greylight
                      }}
                    >No Record Found</Text>
                  </View>
                } />
          }



        </View>
      </View>
    </SafeAreaView>



  );
}

export default MyCategory;
