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
  Platform,
  BackHandler
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

function Category({route,navigation}) {
  const refRBSheet = useRef();  
  const isFocused = useIsFocused();
  // vaiuables
  
  const [defaultCategory, setdefaultCategory] = useState([]);
  const [myCategory, setmyCategory] = useState([]);
  const [user_id, setuser_id] = useState('');
  const [activeUser, setActiveUser] = useState({
    id: '',
    first_name: '',
    last_name: '',
  });
  
  // refresh
  const [refreshing, setRefreshing] = React.useState(false);

  const renderItem = ({item}) => (
    <TouchableOpacity activeOpacity={0.6}
    onPress={() => {
      navigation.navigate('ViewContact', {
        item: item,
      });
    }}
    >
 <List.Item
    title={item.first_name+' '+item.last_name}
    description={
      item.phone_no
    }
    right={() => (
      <TouchableOpacity
      style={{
        alignSelf :"center",
        marginRight:-12,
        paddingHorizontal:13,
        paddingVertical:10,
        
      }}
      onPress={() => {
        setActiveUser(item);
        refRBSheet.current.open();
      }}
      >
      <Icon name="ellipsis-v" size={17} color={COLORS.light} />
      </TouchableOpacity>
    )
  }
    left={() => (
      <View
      style={{
        
        backgroundColor: COLORS.secondary,
        borderRadius: 50,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:'center',
      }}
      >
        <Text
        style={{
          color: COLORS.white,
          fontSize: 20,
        }}
        >{
          item.first_name.charAt(0).toUpperCase()
        }</Text>  
      </View>
    )
    }
  />
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
  const deleteContact = async () => {
    setloading(true);
    console.log('activeUser', activeUser);
    var InsertAPIURL = base_url + '/contact/delete.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        id: activeUser.id,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setloading(false);
        console.log('response', response);
        if (response[0].error == false) {
          setSnackDetails({
            text: response[0].message,
            backgroundColor: COLORS.primary,
          });
          onToggleSnackBar();
          getTotal(user_id);
        }
        else {
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
      setuser_id(data.user_id);
      getRecentFiles(data.user_id);
    } catch (e) {
      // error reading value
    }
  };
  
  useEffect(() => {
    getData();
    if (Platform.OS === 'ios') {
      navigation.addListener('beforeRemove', (e) => {
        e.preventDefault();
        // RNExitApp.exitApp();
      });
    }
    
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
              textColor={COLORS.red}
              
              onPress={() => {
                deleteContact ();
                setVisibleDia(false);
              }}>
              Yes
            </Button>
            <Button
            textColor={COLORS.light}
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
            Account verified successfully
          </Text>

          <Button
            mode="contained"
            style={[
              STYLES.btn,
              {
                marginTop: 0,
                width: width / 3,
              },
            ]}
            contentStyle={STYLES.btnContent}
            onPress={() => {
              hideModal();
              navigation.navigate('MyDrawer');
            }}
            loading={loading}
            disabled={loading}>
            <Text style={STYLES.btnText}>Ok</Text>
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
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              Contacts
            </Text>
            <TouchableOpacity
              style={{
                padding: 10,
              }}
              onPress={() => navigation.navigate('AddContact')}
            >
              <Icon name="plus" size={20} color={COLORS.light} />
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
              data={defaultCategory}
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
            color: COLORS.red,
            fontSize: 20,
            fontWeight: 'bold',
          }}
          >Actions</Text>
          <Text
          style={{
            color: COLORS.primary,
            fontSize: 20,
          }}
          >{
            activeUser.first_name.toUpperCase()
          }</Text>
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
        <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginHorizontal: '6%',
          marginVertical: '5%',
        }}
        onPress={()=>{
          navigation.navigate('EditContact', {
            item: activeUser,
          });
          refRBSheet.current.close()
        }}
        >
          <Icon name="edit" size={20} color={COLORS.light} />
          <Text
          style={{
            marginHorizontal: '5%',
            fontSize: 15,
            color: COLORS.light,
          }}
          >
            Edit
          </Text>
        </TouchableOpacity>
        <Divider
        style={{
          height: 1,
          width: '90%',
          alignSelf: 'center',
        }}
        />
        <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginHorizontal: '6%',
          marginVertical: '5%',
        }}
        onPress={()=>{
          refRBSheet.current.close()
          setVisibleDia(true)
        }
        }
        >
          <Icon name="trash" size={20} color={COLORS.light} />
          <Text
          style={{
            marginHorizontal: '5%',
            fontSize: 15,
            color: COLORS.light,
          }}
          >
            Delete
          </Text>
        </TouchableOpacity>
        </RBSheet>
    </SafeAreaView>
  );
}

export default Category;
