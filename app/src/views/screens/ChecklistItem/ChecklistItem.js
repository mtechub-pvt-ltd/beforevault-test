import 'react-native-gesture-handler';
import React, {useState,
  useEffect,
  useRef,
} from 'react';
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
  List,
  Divider,
  Dialog
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
import {he} from 'date-fns/locale';
import { useIsFocused } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function ChecklistItem({route,navigation}) {
  const refRBSheet = useRef();  
  const isFocused = useIsFocused();
  const {list} = route.params;
  console.log(list);
  // vaiuables
  
  const [itemsList, setItemsList] = useState([]);
  
  const [user_id, setuser_id] = useState('');
  const [item, setItem] = useState('');
  const [activeCat, setActiveCat] = useState({
    id: '',
    name: '',
  });
  
  // refresh
  const [refreshing, setRefreshing] = React.useState(false);

  const renderItem = ({item}) => (
    <View
    >
 <List.Item
    title={()=>{
      return(
        <Text
        style={{textDecorationLine: item.markAsDone==1 ? 'line-through' :'none', textDecorationStyle: 'solid'}}
        >{item.item}</Text>
      )
    }}
    
    right={() => (
      <TouchableOpacity
      style={{
        alignSelf :"center",
        padding: 5,
        backgroundColor:item.markAsDone==1 ? COLORS.red : null,
        borderRadius: 5,
      }}
      onPress={()=>{
        item.markAsDone==0 ?
        updateItemStatus(item.id,1) :
        updateItemStatus(item.id,0) 

      }}
      >
        {
          item.markAsDone==0 ?
          <Icon name="check" size={15} color={COLORS.secondary} />
          :
          <Icon name="minus" size={15} color={COLORS.white} />
        } 
      </TouchableOpacity>

    )
  }
    
  
    
  />
  <Divider />
    </View>
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

  /// call api
  const onRefresh = () => {
    setRefreshing(true);
    getCheckListItem(user_id);
  };
  const getCheckListItem = async id => {
    setloading(true);
    var InsertAPIURL = base_url + '/checklist/getAllItems.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: id,
        category_id: list.id,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setloading(false);
        setRefreshing(false);
        console.log(response);
        // if (response[0].error == false) {
          setItemsList(response.data);
        //   setmyCategory(response[0].my_categories);
        // }
      })
      .catch(error => {
        alert('this is error' + error);
      });
  };
  const addItem = async () => {
    var InsertAPIURL = base_url + '/checklist/add_item.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: user_id,
        category_id: activeCat.id,
        item: item,
       }),
    })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        
        if (response[0].error == false) {
          refRBSheet.current.close();
          setActiveCat({
            id: '',
            name: '',
          })
          setItem('')
          setVisible1(true)
         
            
          }
      })
      .catch(error => {
        alert('this is error' + error);
      });
  };
  const updateItemStatus = async (item_id,status) => {
    setloading(true);
    var InsertAPIURL = base_url + '/checklist/updateItemStatus.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        item_id: item_id,
        status: status
       }),
    })
      .then(response => response.json())
      .then(response => {
        getCheckListItem(user_id)
        setSnackDetails({
          text: response[0].msg,
          backgroundColor: response[0].error == false ? 'green' : COLORS.red,
        });
        onToggleSnackBar();
        // if (response[0].error == false) {
            
        //   }
      })
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
      getCheckListItem(data.user_id);
      setuser_id(data.user_id);
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    getData();
    setActiveCat({
          id: list.id,
          name: list.name,
        });
  }, [isFocused]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
         <Dialog
          visible={visibleDia}
          dismissable={false}
          onDismiss={() => {
            setVisibleDia(false);
          }}>
          <Dialog.Title
            style={{
              color: COLORS.red,
              alignSelf: 'center',
              paddingVertical:2,
            }}>
              <View
              >
              <Icon name="exclamation-triangle" size={35} color={COLORS.red} />
           </View>
          </Dialog.Title>
          <Dialog.Content>
          <Text style={{
            textAlign:'center',
          }}>Once you delete this contact,  </Text>
          <Text style={{
            textAlign:'center',
          }}>it cannot be recovered. </Text>
          <Text
          style={{
            textAlign:'center',
          }}
          >Are you sure you want to proceed?</Text>
            
            
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              color={COLORS.red}
              
              onPress={() => {
                setVisibleDia(false);
              }}>
              Yes
            </Button>
            <Button
              color={COLORS.light}
              onPress={() => {
                setVisibleDia(false);
              }}>
              No
            </Button>
          </Dialog.Actions>
        </Dialog>
      <Modal
        visible={visible1}
        onDismiss={hideModal}
        dismissable={false}
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 20,
          zIndex: 9,
          width: width - 100,
          alignSelf: 'center',
          borderRadius: 20,
          height: height / 3.4,
        }}>
        <View style={{alignItems: 'center'}}>
          <Icon name="check-circle" size={70} color={COLORS.secondary} />
          <Text
            style={{
              marginVertical: '10%',
            }}>
            Item Added Successfully
          </Text>

          
          <Button 
style={{
  backgroundColor: COLORS.primary,
  width:Platform.OS === 'ios' ? '100%' :'50%',
  alignSelf: 'center',
}}

mode="contained" onPress={() => {
  hideModal();  
  getCheckListItem(user_id);
}}>
    Close
  </Button>
        </View>
      </Modal>
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
              justifyContent: 'space-between',
              marginVertical: '3%',
              alignItems: 'center',
            }}>
              <TouchableOpacity
              style={{
                padding: 5,
                paddingHorizontal: 10,
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
              }}>
              {list.name}
          
            </Text>
            <TouchableOpacity
              style={{
                padding: 5,
                paddingHorizontal: 5,
              }}
              onPress={() => {
                  refRBSheet.current.open();
                
              }}
              >
              <Icon name="plus" size={15} color={COLORS.primary} />
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
            refreshControl={  
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
             pullToRefresh={true}
              data={itemsList}
              style={{
                width: width * 0.95,
                height: height,
              }}
              renderItem={renderItem}
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
          )}
        </View>
      </View>
      <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={250}
          openDuration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
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
          <View>
          <Text
          style={{
            color: COLORS.primary,
            fontSize: 20,
            fontWeight: '700',
          }}
          >{activeCat.name}</Text>
          
          </View>
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
        <TextInput
                  label="Add Item"
                  style={{
                    marginBottom: 10,
                    backgroundColor: COLORS.white,
                    color: COLORS.dark,
                    width: '90%',
                    alignSelf : 'center',
                  }}
                  activeUnderlineColor={COLORS.primary}
                  underlineColor={COLORS.light}
                  placeholderTextColor={COLORS.greylight + '80'}
                  textColor={COLORS.dark}
                  value={item}
                  onChangeText={text => {
                    setItem (text)
                  }}
                  
                />

<Button 
style={{
  width:Platform.OS === 'ios' ? '100%' :'50%',
  alignSelf: 'center',
  // marginTop: 10,
  backgroundColor: COLORS.secondary,
  paddingVertical:Platform.OS === 'ios' ?  5 :0,
}}
mode="contained" onPress={() => {
  if (item) {
    addItem()
  }
}}>
    Save
  </Button>
        </RBSheet>
    </SafeAreaView>
  );
}

export default ChecklistItem;
