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
  Checkbox,
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
import {useIsFocused} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';

import DatePicker from 'react-native-date-picker';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function ShareContactList({route, navigation}) {
  const {
    item,
  }=route.params;
  console.log(item.item.uniq_id)
  const refRBSheet = useRef();
  const isFocused = useIsFocused();
  // vaiuables
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [myContacts, setMyContacts] = useState([]);
  const [sharedtoUsers, setSharedtoUsers] = useState([]);
  const [user_id, setuser_id] = useState('');
  const [activeSharetoUsers, setActiveSharetoUsers] = useState({
    index: '',
    activeType: '',
    sharedtoUserData: '',
  });
  // refresh
  const [refreshing, setRefreshing] = React.useState(false);

  const renderItem = ({item, index}) => (
    <>
      <View
        style={{
          flexDirection: 'column',
        }}>
        <List.Item
          title={item.email}
          titleStyle={{
            color: COLORS.dark,
            fontSize: Platform.OS === 'ios' ? 14 : 12,
          }}
          right={() =>
            sharedtoUsers.find(
              x => x.sharedtoUserId === item.contact_user_id,
            ) ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    borderRadius: 5,
                    paddingHorizontal: 8,
                    paddingVertical: 9,
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    paddingHorizontal: 10,
                    backgroundColor: COLORS.white,
                    borderWidth: 1,
                    borderColor: COLORS.secondary,
                    marginLeft: 10,
                  }}
                  onPress={() => {
                    // get item from sharedtoUsers array and set to activeSharetoUsers
                    setActiveSharetoUsers({
                      index: index,
                      activeType: 'add',
                      sharedtoUserData: {
                        sharedtoUserId: item.contact_user_id,
                        email: item.email,
                        ExpDate: sharedtoUsers.find(
                          x => x.sharedtoUserId === item.contact_user_id,
                        ).ExpDate,
                        passcode: sharedtoUsers.find(
                          x => x.sharedtoUserId === item.contact_user_id,
                        ).passcode,
                      },
                    });
                    refRBSheet.current.open();
                  }}>
                  <Icon name="edit" size={10} color={COLORS.secondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    backgroundColor: COLORS.white,
                    borderWidth: 1,
                    borderColor: COLORS.red,
                    marginLeft: 10,
                  }}
                  onPress={() => {
                    setSharedtoUsers(
                      sharedtoUsers.filter(
                        x => x.sharedtoUserId !== item.contact_user_id,
                      ),
                    );
                  }}>
                  <Icon name="times" size={15} color={COLORS.red} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 10,
                  padding: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  paddingHorizontal: 10,
                }}
                activeOpacity={0.8}
                onPress={() => {
                  setActiveSharetoUsers({
                    index: index,
                    activeType: 'add',
                    sharedtoUserData: {
                      sharedtoUserId: item.contact_user_id,
                      email: item.email,
                      ExpDate: '',
                      passcode: '',
                    },
                  });
                  refRBSheet.current.open();
                }}>
                <Text
                  style={{
                    color: COLORS.white,
                  }}>
                  Add
                </Text>
              </TouchableOpacity>
            )
          }
          left={() => (
            <View
              style={{
                backgroundColor: COLORS.secondary,
                borderRadius: 50,
                width: 30,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 15,
                }}>
                {item.first_name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        />
      </View>
      <Divider />
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
          setMyContacts(response[0].result);
        }
      })
      .catch(error => {
        alert('this is error' + error);
      });
  };
  const shareNow = async () => {
    setloading(true);
    var InsertAPIURL = base_url + '/share/shareItemTest.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var data= JSON.stringify({
      shareType:"ITEM",
      sharedItemId:item.item.uniq_id,
      sharedbyUserId:user_id,
      sharedtoUsers:sharedtoUsers,
    })
    
    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(response => {
        setloading(false);
        if (response[0].error == false) {
          setSnackDetails({
            text: response[0].message,
            backgroundColor: COLORS.primary,
          });
          onToggleSnackBar();
          setTimeout(() => {
            navigation.goBack();
          }
          , 2000);
         
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
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getData();
  }, [isFocused]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <Snackbar
        visible={visible}
        style={{
          zIndex: 999,
          backgroundColor: snackDetails.backgroundColor,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: COLORS.greylight+'50',
        }}
        duration={1000}
        onDismiss={onDismissSnackBar}>
        {
           snackDetails.text.charAt(0).toUpperCase() +
            snackDetails.text.slice(1)
        }
       

      </Snackbar>
      <View
        style={{
          paddingHorizontal: '5%',
          zIndex: -9,
          flex: 1,
        }}>
        <View
          style={{
            position: 'absolute',
            width: width,
            alignSelf: 'center',
            bottom: 0,
            paddingVertical: 10,
            zIndex: 999,
            backgroundColor: COLORS.white,
          }}>
          {/* <TouchableOpacity
            style={{
              padding: Platform.OS === 'ios' ? 10 : 5,
              paddingHorizontal: 20,
              backgroundColor: COLORS.primary,
              borderRadius: 30,
              marginHorizontal: 5,
              textAlign: 'center',
              width: width * 0.9,
              alignSelf: 'center',
            }}
            onPress={() => 
              shareNow()
            }>
            <Text
              style={{
                color: COLORS.white,
                fontSize: 15,
                textAlign: 'center',
                paddingVertical: 10,
              }}>
              Save
            </Text>
          </TouchableOpacity> */}
          <Button
            textColor={COLORS.white}
            disabled={loading}
            style={{
              alignSelf: 'center',
              borderRadius: 50,
              borderWidth: 0,
              marginVertical: '2%',
            }}
            contentStyle={{
              height: 50,
              width: width * 0.9,
              backgroundColor: loading ? COLORS.greylight+'50' : COLORS.secondary,
            }}
            mode="outlined"
            onPress={() => {
            console.log(sharedtoUsers)
              if (!sharedtoUsers.length == 0) {
                shareNow();
              } else {
                setSnackDetails({
                  text: 'Please add atleast one contact to share',
                  backgroundColor: COLORS.red,
                });
                onToggleSnackBar();
              }
              
            }}>
            Share Now
          </Button>

        </View>

        <View style={styles.mainView}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginVertical: '3%',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  padding: 10,
                }}
                onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={20} color={COLORS.light} />
              </TouchableOpacity>
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: Platform.OS === 'ios' ? 20 : 18,
                  fontWeight: 'bold',
                  marginLeft: 10,
                }}>
                Share to Contacts
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  padding: Platform.OS === 'ios' ? 10 : 5,
                  paddingHorizontal: 20,
                }}
                onPress={() => {
                  setActiveSharetoUsers({
                    index: '',
                    activeType: 'newAdd',
                    sharedtoUserData: {
                      sharedtoUserId: '',
                      email: '',
                      ExpDate: '',
                      passcode: '',
                    },
                  });
                    refRBSheet.current.open();
                  }}>
                <Icon name="plus" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
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
              data={myContacts}
              style={{
                width: width * 0.95,
                height: height,
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

        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={false}
          height={height / 2}
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
              {activeSharetoUsers.activeType === 'newAdd' || 
              activeSharetoUsers.activeType === 'add'
                ? 'Add Contact to Sharelist'
                : 'Edit Contact to Sharelist'}
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
          <View
            style={{
              paddingHorizontal: '4%',
              marginTop: '3%',
            }}>
            {activeSharetoUsers.activeType === 'add'
            || activeSharetoUsers.activeType === 'newAdd'
            ? (
              <View>
                <TextInput
                  style={[
                    styles.txtInpt,
                    {
                      backgroundColor: COLORS.white,
                    },
                  ]}
                  label="Email"
                  mode="outlined"
                  
                  autoCapitalize="none"
                  value={activeSharetoUsers.sharedtoUserData.email}
                  activeColor={COLORS.primary}
                  placeholderTextColor={COLORS.dark}
                  activeOutlineColor={COLORS.primary}
                  onChangeText={text => {
                    setActiveSharetoUsers({
                      ...activeSharetoUsers,
                      sharedtoUserData: {
                        ...activeSharetoUsers.sharedtoUserData,
                        email: text,
                      },
                    });
                  }}
                />
                <TextInput
                  style={[
                    styles.txtInpt,
                    {
                      backgroundColor: COLORS.white,
                      marginTop: '2%',
                    },
                  ]}
                  label="Add Pincode (Optional)"
                  mode="outlined"
                  value={activeSharetoUsers.sharedtoUserData.passcode}
                  activeColor={COLORS.primary}
                  placeholderTextColor={COLORS.dark}
                  activeOutlineColor={COLORS.primary}
                  onChangeText={text => {
                    setActiveSharetoUsers({
                      ...activeSharetoUsers,
                      sharedtoUserData: {
                        ...activeSharetoUsers.sharedtoUserData,
                        passcode: text,
                      },
                    });
                  }}
                />
                <TouchableOpacity
                  onPress={() => setOpen(true)}
                  style={{
                    width: '95%',
                    backgroundColor: COLORS.white,
                    borderRadius: 5,
                    marginTop: '4%',
                    borderWidth: 1,
                    alignSelf: 'center',
                    borderColor: COLORS.greylight,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: COLORS.dark,
                      padding: '4.4%',
                    }}>
                    {activeSharetoUsers.sharedtoUserData.ExpDate == ''
                      ? 'Select Expiry Date (Optional)'
                      : // formate date as : 09 May 2021
                        new Date(
                          activeSharetoUsers.sharedtoUserData.ExpDate,
                        ).getDate() +
                        ' ' +
                        new Date(
                          activeSharetoUsers.sharedtoUserData.ExpDate,
                        ).toLocaleString('default', {month: 'short'}) +
                        ' ' +
                        new Date(
                          activeSharetoUsers.sharedtoUserData.ExpDate,
                        ).getFullYear()}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.greylight,
                      padding: '4.4%',
                    }}>
                    {activeSharetoUsers.sharedtoUserData.ExpDate == ''
                      ? null
                      : '(Press to Change Expiry Date)'}
                  </Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  mode="date"
                  open={open}
                  date={new Date()}
                  onConfirm={date => {
                    setOpen(false);
                    setActiveSharetoUsers({
                      ...activeSharetoUsers,
                      sharedtoUserData: {
                        ...activeSharetoUsers.sharedtoUserData,
                        ExpDate: date.toString(),
                      },
                    });
                  }}
                  onCancel={() => {
                    setOpen(false);
                    setActiveSharetoUsers({
                      ...activeSharetoUsers,
                      sharedtoUserData: {
                        ...activeSharetoUsers.sharedtoUserData,
                        ExpDate: // set previous date
                          activeSharetoUsers.sharedtoUserData.ExpDate,
                      },
                    });

                  }}
                />

                <Button
                  textColor={COLORS.white}
                  style={{
                    alignSelf: 'center',

                    borderRadius: 50,
                    borderWidth: 0,
                    marginVertical: '10%',
                  }}
                  contentStyle={{
                    height: 50,
                    width: width * 0.6,
                    backgroundColor: COLORS.secondary,
                  }}
                  mode="outlined"
                  onPress={() => {
                      // check if email is empty
                    if (activeSharetoUsers.sharedtoUserData.email != '') {
                    if (
                      sharedtoUsers.find(
                        x =>
                          x.email ===
                          activeSharetoUsers.sharedtoUserData.email,
                      )
                    ) {
                      setSharedtoUsers(
                        sharedtoUsers.map(item =>
                          item.email ===
                          activeSharetoUsers.sharedtoUserData.email
                            ? {
                                ...item,
                                ExpDate:
                                  activeSharetoUsers.sharedtoUserData.ExpDate,
                                passcode:
                                  activeSharetoUsers.sharedtoUserData.passcode,
                              }
                            : item,
                        ),
                      );
                    }
                    else  if(activeSharetoUsers.activeType === 'newAdd') {
                      var randomId='demo_'+Math.floor(Math.random() * 10000000000)
// add new contact to myContacts array to start of array
                      setMyContacts([
                        {
                          contact_user_id:randomId,
                          email:activeSharetoUsers.sharedtoUserData.email,
                          first_name:activeSharetoUsers.sharedtoUserData.email.split('@')[0],
                        },
                        ...myContacts,
                      ]);
                      setSharedtoUsers([
                        ...sharedtoUsers,
                        {
                          sharedtoUserId:randomId,
                          email:activeSharetoUsers.sharedtoUserData.email,
                          ExpDate:activeSharetoUsers.sharedtoUserData.ExpDate,
                          passcode:activeSharetoUsers.sharedtoUserData.passcode,
                        },
                      ]);
                    }
                    else {
                      setSharedtoUsers([
                        ...sharedtoUsers,
                        {
                          sharedtoUserId:activeSharetoUsers.sharedtoUserData.sharedtoUserId==''?'':activeSharetoUsers.sharedtoUserData.sharedtoUserId,
                          email:activeSharetoUsers.sharedtoUserData.email,
                          ExpDate:activeSharetoUsers.sharedtoUserData.ExpDate,
                          passcode:activeSharetoUsers.sharedtoUserData.passcode,
                        },
                      ]);

                      
                      }
                    refRBSheet.current.close();
                    }
                  }

                  }>
                  Save
                </Button>
              </View>
            ) : (
              <Text>Teewrf</Text>
            )}
          </View>
        </RBSheet>
      </View>
    </SafeAreaView>
  );
}

export default ShareContactList;
