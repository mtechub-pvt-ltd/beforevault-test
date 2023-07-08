import 'react-native-gesture-handler';
import React, {useState, useEffect,useRef} from 'react';
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
  Divider
} from 'react-native-paper';
import COLORS from '../../../consts/colors';
import base_url from '../../../consts/base_url';
import image_url from '../../../consts/image_url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import STYLES from '../../../components/button/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RBSheet from "react-native-raw-bottom-sheet";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function AddContact({route,navigation}) {
  const {item}=route.params;
  const refRBSheet = useRef();  
  // vaiuables
  const [user_id, setuser_id] = useState('');
  const [first_name, setfirst_name] = useState('');
  const [last_name, setlast_name] = useState('');
  const [email, setemail] = useState('');
  const [phone_no, setphone_no] = useState('');
  const [relation, setrelation] = useState('Select Relationship');
  const [relation_other, setrelation_other] = useState('');
  const relationList=[
    {id:1,name:'Spouse'},
    {id:2,name:'Brother'},
    {id:3,name:'Sister'},
    {id:4,name:'Son'},
    {id:5,name:'Daughter'},
    {id:6,name:'Father'},
    {id:7,name:'Mother'},
    {id:8,name:'Friend'},
    {id:9,name:'Other'},

  ]
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
  //  switch
  const [isEmergency, setisEmergency] = useState(false);
  const [isTrustee, setisTrustee] = useState(false);
  const [otherActive, setotherActive] = useState(false);

  // variables
  const [loading, setloading] = useState(false);
  /// call api
  const callApi = async () => {
    if(
      first_name.length == 0 ||
      last_name.length== 0 ||
      email.length== 0 ||
      phone_no.length== 0 ){
      setSnackDetails({
        text: 'Please fill all fields',
        backgroundColor: 'red',
      });
      onToggleSnackBar();
      }
    else  if(otherActive==true && relation_other.length==0){
        setSnackDetails({
          text: 'Kindly Enter Other Relationship',
          backgroundColor: 'red',
        });
        onToggleSnackBar();
      }
    else  if(relation==='Select Relationship'){
        setSnackDetails({
          text: 'Kindly select Relationship',
          backgroundColor: 'red',
        });
        onToggleSnackBar();
      }
      else {
        setloading(true);
    var InsertAPIURL = base_url + '/contact/create.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id:user_id,
        first_name:first_name,
        last_name:last_name,
        email:email,
        phone_no:phone_no,
        relation:relation=='Select Relationship'? '':relation,
        relation_other:relation_other,
        emergency:isEmergency==true?1:0,
        trustee:isTrustee==true?1:0,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setloading(false);
        if (response[0].error == false) {
          setSnackDetails({
            text: response[0].message,
            backgroundColor: '#44A42B',
          });
          onToggleSnackBar();
          setTimeout(() => {
            navigation.navigate('MyTabs',{
              screen:'Contact',
            });  
          }, 2000);
          
        }
      })
      .catch(error => {
        alert('this is error' + error);
      });
      }
    
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
      setuser_id(data.user_id);
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", ()=>{
      navigation.navigate('MyTabs',{
        screen:'Contact',
      });
      return true;
    }
    );
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", ()=>{
        navigation.navigate('MyTabs',{
          screen:'Contact',
        });
        return true;
      });
    };
    getData();
  }, []);
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
        }}
        duration={1000}
        onDismiss={onDismissSnackBar}>
        {snackDetails.text}
      </Snackbar>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
              marginVertical: '3%',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                paddingVertical: 7,
                paddingHorizontal: 12,
                marginRight: 30,
              }}
              onPress={() => navigation.goBack()}>
              <Icon name="chevron-left" size={20} color={COLORS.light} />
            </TouchableOpacity>
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              View Contact
            </Text>
          </View>
         <View
         style={{
            alignItems: 'flex-start',
            width: '100%',
            marginHorizontal: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: '3%',
         }}
         >
          <Text
           style={{
            color: COLORS.dark,
            fontSize: 16,
            fontWeight: 'bold',
         }}
          >First Name</Text>
          <Text>{item.first_name}</Text>
         </View>
         <Divider 
         style={{
            backgroundColor: COLORS.greylight,
            height: 1,
            width: '100%',
            marginVertical: '3%',
          }}
         />
         <View
         style={{
            alignItems: 'flex-start',
            width: '100%',
            marginHorizontal: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: '3%',
         }}
         >
          <Text
           style={{
            color: COLORS.dark,
            fontSize: 16,
            fontWeight: 'bold',
         }}
          >Last Name</Text>
          <Text>{item.last_name}</Text>
         </View>
         <Divider 
         style={{
            backgroundColor: COLORS.greylight,
            height: 1,
            width: '100%',
            marginVertical: '3%',
          }}
         />
         <View
         style={{
            alignItems: 'flex-start',
            width: '100%',
            marginHorizontal: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: '3%',
         }}
         >
          <Text
           style={{
            color: COLORS.dark,
            fontSize: 16,
            fontWeight: 'bold',
         }}
          >Email</Text>
          <Text>{item.email}</Text>
         </View>
         <Divider 
         style={{
            backgroundColor: COLORS.greylight,
            height: 1,
            width: '100%',
            marginVertical: '3%',
          }}
         />
         <View
         style={{
            alignItems: 'flex-start',
            width: '100%',
            marginHorizontal: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: '3%',
         }}
         >
          <Text
           style={{
            color: COLORS.dark,
            fontSize: 16,
            fontWeight: 'bold',
         }}
          >Phone No</Text>
          <Text>{item.phone_no}</Text>
         </View>
         <Divider 
         style={{
            backgroundColor: COLORS.greylight,
            height: 1,
            width: '100%',
            marginVertical: '3%',
          }}
         />
         <View
         style={{
            alignItems: 'flex-start',
            width: '100%',
            marginHorizontal: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: '3%',
         }}
         >
          <Text
           style={{
            color: COLORS.dark,
            fontSize: 16,
            fontWeight: 'bold',
         }}
          >Relationship</Text>
          <Text>{item.relation}</Text>
         </View>
         <Divider 
         style={{
            backgroundColor: COLORS.greylight,
            height: 1,
            width: '100%',
            marginVertical: '3%',
          }}
         />
         <View
         style={{
            alignItems: 'flex-start',
            width: '100%',
            marginHorizontal: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: '3%',
         }}
         >
          <Text
           style={{
            color: COLORS.dark,
            fontSize: 16,
            fontWeight: 'bold',
         }}
          >Other Relationship</Text>
          <Text>{item.relation_other==''
          ?
          'N/A'
          : item.relation_other }</Text>
         </View>
         <Divider 
         style={{
            backgroundColor: COLORS.greylight,
            height: 1,
            width: '100%',
            marginVertical: '3%',
          }}
         />
         <View
         style={{
            alignItems: 'flex-start',
            width: '100%',
            marginHorizontal: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: '3%',
         }}
         >
          <Text
           style={{
            color: COLORS.dark,
            fontSize: 16,
            fontWeight: 'bold',
         }}
          >Trustee</Text>
          <Text>{item.trustee==1 ?'Contact is Trustee': 'Contact is Not Trustee'}</Text>
         </View>
         <Divider 
         style={{
            backgroundColor: COLORS.greylight,
            height: 1,
            width: '100%',
            marginVertical: '3%',
          }}
         />
         <View
         style={{
            alignItems: 'flex-start',
            width: '100%',
            marginHorizontal: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: '3%',
         }}
         >
          <Text
           style={{
            color: COLORS.dark,
            fontSize: 16,
            fontWeight: 'bold',
         }}
          >Emergency</Text>
          <Text>{item.emergency==1 ?'Contact is Emergency': 'Contact is Not Emergency'}</Text>
         </View>
         
      
          <Button
              mode='contained'
              style={[STYLES.btn,{
                width: '100%',
                marginBottom: 20,
              }]}

              contentStyle={[STYLES.btnContent,{
                width: '100%',
              }]}
              onPress={() =>{
                navigation.navigate('EditContact', {
                  item: item,
                });
              }}
              loading={loading}
              disabled={loading}
            >
              <Text
                style={STYLES.btnText}
              >
                Edit
              </Text>
            </Button>
        </View>
      </ScrollView>
      {/* react naitve libray for crop image
      

      */}
            
      <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={height-200}
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
          <Headline
          style={{
            color: COLORS.primary,
          }}
          >Select Relationship</Headline>
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
        {
          relationList.map((item,index)=>{
            return(
              <View
              key={index}
              >
              <TouchableOpacity
              
              onPress={()=>{
                setrelation(item.name);
                if(item.name=='Other') {
                  setotherActive(true)
                }
                refRBSheet.current.close()
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
                <Text
                style={{
                  fontSize: 16,
                  marginHorizontal: '2%',
                }}
                >{item.name}</Text>
              </TouchableOpacity>
              <Divider 
              style={{
                backgroundColor: COLORS.greylight,
                height:.5,
                width: '90%',
                alignSelf: 'center',
              }}
              />
              </View>
            )
          }
          )
        }
        
    
        
        </RBSheet>
    </SafeAreaView>
  );
}

export default AddContact;
