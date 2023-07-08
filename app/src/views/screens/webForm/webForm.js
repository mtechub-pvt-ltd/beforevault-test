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
  Alert,
  KeyboardAvoidingView,
  KeyboardAvoidingViewBase,
  TouchableWithoutFeedback,
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
} from 'react-native-paper';
import COLORS from '../../../consts/colors';
import base_url from '../../../consts/base_url';
import image_url from '../../../consts/image_url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {useIsFocused} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import RBSheet from 'react-native-raw-bottom-sheet';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import DatePicker from 'react-native-date-picker'
import { sub } from 'date-fns';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function CameraScreen({route, navigation}) {
  const {
    cat_id,
    sub_cat_id,
    uniq_id
  } = route.params;
 

  const focusInputRef = useRef(null);
  // snackbar
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackDetails, setSnackDetails] = useState({
    text: '',
    backgroundColor: '',
  });

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  // snackbar end
  // from handling
  const refRBSheet = useRef();
  const [user_id, setUserId] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [datalist, setDataList] = useState(null);
  const [actualDataList, setActualDataList] = useState(null);

// country 
  const [countrylist, setcountryList] = useState(null);
  const [actualcountryList, setActualcountryList] = useState(null);
  const [activeCountry, setActiveCountry] = useState(null);
  // state
  const [stateList, setStateList] = useState(null);
  const [actualStateList, setActualStateList] = useState(null);
  const [activeState, setActiveState] = useState(null);
  
  // city
  const [cityList, setCityList] = useState(null);
  const [actualCityList, setActualCityList] = useState(null);
  const [activeCity, setActiveCity] = useState(null);

  const [activeField, setActiveField] = useState({
    label: '',
  });
  const [activeFieldIndex, setActiveFieldIndex] = useState(0);
  const [activeFieldCountry, setActiveFieldCountry] = useState(null);
  // date
  const [dateView, setDateView] = useState(null);
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  // form
  const [formFields, setFormFields] = useState([]);
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userDetail');
      const data = JSON.parse(jsonValue);
      setUserId(data.user_id);
    } catch (e) {
      // error reading value
    }
  };

  // upload status
// store user data in async storage
const storeuploadStatus = async (value) => {
  try {
    await AsyncStorage.setItem('uploadStatus', value)
  }
  catch (e) {
    alert('Error : ' + e);
  }
}

  const uploadData = async () => {
    setLoading(true)
    var InsertAPIURL = base_url + '/form/addData.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const formData = JSON.stringify({
      cat_id:cat_id,
      subcat_id:sub_cat_id,
      uniq_id:uniq_id,
      user_id:user_id,
      data:formFields
    });
    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
       setLoading(false)
        if(response[0].error == false){
          storeuploadStatus('true')
          navigation.navigate('MyDrawer')
          }
          else{
            setSnackDetails({
              text: response[0].message,
              backgroundColor: COLORS.primary,
            });
          }

        
      })
      .catch(error => {
        setLoading(false)
        alert('this is error' + error);
      });
  };
  const getFormFields = async () => {
    var InsertAPIURL = base_url + '/form/get.php?cat_id=1&subcat_id=1';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'GET',
      headers: headers,
      // body: JSON.stringify({
      //   email: email,
      //   password: password,
      // }),
    })
      .then(response => response.json())
      .then(response => {
        if (response[0].error == false) {
          setFormFields(response[0].data);
        } else {
          setSnackDetails({
            text: response[0].message,
            backgroundColor: COLORS.primary,
          });
        }
      })
      .catch(error => {
        alert('this is error' + error);
      });
  };
  const getCountry = async (e,id) => {
    
  if (e=='country' || e == undefined) {
   var InsertAPIURL = base_url + '/country/getAllCountry.php';
  }
  else if (e=='state') {
    var InsertAPIURL = base_url + '/country/getStates.php?country_id='+id;
    }
    else if (e=='city') {
      var InsertAPIURL = base_url + '/country/getCities.php?state_id='+id;
      }
   var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'GET',
      headers: headers,
      // body:
      
      // JSON.stringify({
      //   email: email,
      //   password: password,
      // }),
    })
      .then(response => response.json())
      .then(response => {

        if (e=='country' || e == undefined) {
          setcountryList(response.data);
          setActualcountryList(response.data);
         }
         else if (e=='state') {
          setStateList(response.data);
          setActualStateList(response.data);
           }
           else if (e=='city') {
            setCityList(response.data);
            setActualCityList(response.data);
             }
        // setDataList(response.data);
        // setActualDataList(response.data);
        

      })
      .catch(error => {
        alert('this is error' + error);
      });
  };

  useEffect(() => {
    getData();
    getFormFields();
  }, []);


  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
      // style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled>
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
        <DatePicker
        modal
        open={open}
        date={date}
        theme="auto"
        mode='date'
        title={activeField.label}
        textColor={COLORS.primary}
        confirmText="Add"
        cancelText="Cancel"
        
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
          console.log('confirm', date)
          // change date format to dd/mm/yyyy
          var d = new Date(date);
          var dd = d.getDate();
          var mm = d.getMonth() + 1;
          var yyyy = d.getFullYear();
          var formattedDate = dd + '/' + mm + '/' + yyyy;
          setDateView(formattedDate)

          setFormFields(prevState => {
            return prevState.map((field, index) => {
              if (index === activeFieldIndex) {
                return {
                  ...field,
                  value: date,
                };
              }
              return field;
            });
          });

        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
          
          <Appbar.Header
            style={{
              backgroundColor: '#f5f5f5',
              elevation: 0,
            }}>
            <Appbar.Content
              titleStyle={{
                color: COLORS.primary,
                fontSize: 20,
                fontWeight: 'bold',
                alignSelf: 'flex-start',
              }}
              title={'Add Details (optional)'}
            />
            {
              loading== true ?

              <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={{
                marginRight: 10,
              }}
              
              /> : 
              <TouchableOpacity
              style={{
                padding: 10,
                paddingHorizontal: 20,
                backgroundColor: COLORS.primary,
                borderRadius: 5,
                marginRight: 10,
                borderWidth:1,
                borderColor:COLORS.primary
              }}
              onPress={() => {
                uploadData();
             
              }}>
              <Text
                style={{
                  color: COLORS.white,
                }}>
                Save
              </Text>
            </TouchableOpacity>
            }
            
          </Appbar.Header>
          
          

          <FlatList
            data={formFields}
            style={{
              width: width,
              height: height,
              backgroundColor: '#f5f5f5',
            }}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'column',
                  width: width,
                  justifyContent: 'space-between',
                  alignSelf: 'flex-start',
                  alignItems: 'flex-start',
                  marginVertical: 3,
                  // backgroundColor: COLORS.red,
                }}>
                {item.label == 'country' 
                  || item.label == 'state' ||
                  item.label == 'city'
                   ? (
                  <TouchableOpacity
                    style={{
                      width: '100%',
                    }}
                    activeOpacity={0.6}
                    onPressIn={() => {
                        if(item.label == 'country'){
                          getCountry();
                          setActiveField(item);
                        setActiveFieldIndex(formFields.indexOf(item));
                        refRBSheet.current.open();
                        }
                        else if(item.label == 'state'){
                          if (activeCountry) {
                            getCountry(item.label,activeCountry.id);
                            setActiveField(item);
                          setActiveFieldIndex(formFields.indexOf(item));
                          refRBSheet.current.open();
                          } else {
                            alert('Please select country first');
                          }
                        }
                        else if(item.label == 'city'){
                          if (activeState) {
                          getCountry(item.label,activeState.id);
                          setActiveField(item);
                        setActiveFieldIndex(formFields.indexOf(item));
                        refRBSheet.current.open();
                          } else {
                            alert('Please select state first');
                          }
                        }
                        
                        
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginHorizontal: '3%',
                        padding: '3.8%',
                        marginVertical: '1%',
                        borderWidth: 1,
                        borderColor: 'lightgrey',
                        backgroundColor: 'white',
                        justifyContent: 'space-between',
                        borderRadius: 5,
                        alignContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#010101',
                        }}>
                         {item.value == '' ? 'Select '+item.label: item.value}
                      </Text>
                      <Icon name="chevron-down" color="grey" />
                    </View>
                  </TouchableOpacity>
                
                ) : item.input_type == 'date' ?
                <TouchableOpacity
                style={{
                  width: '100%',
                }}
                activeOpacity={0.6}
                onPressIn={() => {
                  
                  setActiveField(item);
                  setActiveFieldIndex(formFields.indexOf(item));
                  setOpen(true)
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: '3%',
                    padding: '3.8%',
                    marginVertical: '1%',
                    borderWidth: 1,
                    borderColor: 'lightgrey',
                    backgroundColor: 'white',
                    justifyContent: 'space-between',
                    borderRadius: 5,
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                    }}>
                      {dateView=='' || dateView==undefined || dateView==null
                      
                      ? item.label: dateView}
                  </Text>
                  <Icon name="chevron-right" color="grey" />
                </View>
              </TouchableOpacity>
                : (
                  <TextInput
                    style={[
                      styles.txtInpt,
                      {
                        backgroundColor: COLORS.white,
                        zIndex: -9,
                      },
                    ]}
                    color={COLORS.dark}
                    label={item.label
                      .replace(/_/g, ' ')
                      .replace(/\w\S*/g, function (txt) {
                        return (
                          txt.charAt(0).toUpperCase() +
                          txt.substr(1).toLowerCase()
                        );
                      })}
                    placeholderTextColor={COLORS.dark}
                    keyboardType={
                    
                        item.input_type == 'text'
                        ? 'name-phone-pad'
                        : item.input_type == 'number'
                        ? 'numeric'
                        : item.input_type == 'password'
                        ? 'default'
                        : 'default'
                    }
                    autoCapitalize="none"
                    outlineColor="lightgrey"
                    activeOutlineColor={COLORS.primary}
                    autoCorrect={false}
                    mode="outlined"
                    // onChangeText={text => setEmail(text)}
                    right={
                      item.input_type == 'password' ? (
                        <TextInput.Icon
                          iconColor={COLORS.light}
                          icon={secureTextEntry ? 'eye' : 'eye-off'}
                          onPress={() => {
                            setSecureTextEntry(!secureTextEntry);
                          }}
                          color={COLORS.light}
                        />
                      ) : null
                    }
                    onChangeText={text => {
                      let temp = [...formFields];
                      temp[formFields.indexOf(item)].value = text;
                      setFormFields(temp);
                    }
                    }
                    value={item.value}
                    secureTextEntry={
                      item.input_type == 'password' ? secureTextEntry : false
                    }
                  
                  />
                )
                }
              </View>
            )}
            
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
          {/* bottom sheet  */}
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            height={height}
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
                Select {activeField.label}
              </Text>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  refRBSheet.current.close();
                }}>
                <Icon name="times" size={20} color={COLORS.light} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.txtInpt,
                {
                  backgroundColor: COLORS.white,
                  marginBottom: 20,
                },
              ]}
              color={COLORS.dark}
              placeholder="Search"
              placeholderTextColor={COLORS.dark}
              autoCapitalize="none"
              underlineColor="lightgrey"
              activeOutlineColor={COLORS.primary}
              autoCorrect={false}
              mode="outlined"
              onChangeText={text => {

                if (text.length > 0) {
                    if(activeField.label == 'country'){
                      if(countrylist.length < actualcountryList.length){
                        setcountryList(actualcountryList);
                      }
                      let temp = countrylist.filter(item => {
                        return item.name.toLowerCase().includes(text.toLowerCase());
                      });
                      setcountryList(temp);
                    } else if(activeField.label == 'state'){
                      if(stateList.length < actualStateList.length){
                        setStateList(actualStateList);
                      }
                      let temp = stateList.filter(item => {
                        return item.name.toLowerCase().includes(text.toLowerCase());
                      });
                        setStateList(temp);
                    } else if(activeField.label == 'city'){
                      if(cityList.length < actualCityList.length){
                        setCityList(actualCityList);
                      }
                      let temp = cityList.filter(item => {
                        return item.name.toLowerCase().includes(text.toLowerCase());
                      });
                      setCityList(temp);
                    }
                  
                  } else {
                    if(activeField.label == 'country'){
                      setcountryList(actualcountryList);
                    }
                    else if(activeField.label == 'state'){
                      setStateList(actualStateList);
                    }
                    else if(activeField.label == 'city'){
                      setCityList(actualCityList);
                    }
                }
              }}
            />

            
              <FlatList
                data={
                  activeField.label == 'country'
                  ?countrylist:
                  activeField.label == 'state'
                  ?stateList:
                  activeField.label == 'city'
                  ?cityList:
                  null}
                style={{
                  width: width,
                  height: height,
                  backgroundColor: 'white',
                
                }}
                renderItem={({item}) => (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        activeField.label == 'country'
                        ?
                        setActiveCountry(item)
                        :
                        activeField.label == 'state'
                        ?
                        setActiveState(item)
                        :
                        activeField.label == 'city'
                        ?
                        setActiveCity(item)
                        :
                        null
                        
                        console.log('activeFieldCountry', activeFieldCountry);
                        setFormFields(prevState => {
                          return prevState.map((field, index) => {
                            if (index === activeFieldIndex) {
                              return {
                                ...field,
                                value: item.name,
                              };
                            }
                            return field;
                          });
                        });
                        refRBSheet.current.close();
                        

                      }}
                      style={{
                        flexDirection: 'column',
                        width: width,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        paddingVertical: '3%',
                        alignContent: 'center'
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          marginHorizontal: '5%',
                        }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                    <Divider
                      style={{
                        borderWidth: 0.5,
                        width: '100%',
                        // marginVertical: '3%',
                        borderBottomColor: 'lightgrey',
                      }}
                    />
                  </>
                )}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View>
                     <ActivityIndicator
                    size="small"
                    color={COLORS.primary}
                    style={{
                      marginTop: '20%',
                    }}
                  />
                  </View>
                }
              />
           
          </RBSheet>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default CameraScreen;
