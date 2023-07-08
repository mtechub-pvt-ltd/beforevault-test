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
  TextInput
} from 'react-native';
import {
  Text,
  Button,
  Snackbar,
  Headline,
  ActivityIndicator,
  Colors,
  TouchableRipple,
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

function EditContact({route,navigation}) {
  const {item} = route.params;

  const refRBSheet = useRef();  
  // vaiuables
  const [id, setId] = useState(item.id);
  const [user_id, setuser_id] = useState('');
  const [first_name, setfirst_name] = useState(item.first_name);
  const [last_name, setlast_name] = useState(item.last_name);
  const [email, setemail] = useState(item.email);
  const [phone_no, setphone_no] = useState(item.phone_no);
  const [relation, setrelation] = useState(item.relation);
  const [relation_other, setrelation_other] = useState(item.relation_other);
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
  const [isEmergency, setisEmergency] = useState(item.emergency == 1 ? true : false);
  const [isTrustee, setisTrustee] = useState(item.trustee == 1 ? true : false);
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
    var InsertAPIURL = base_url + '/contact/update.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        id:id,
        first_name:first_name,
        last_name:last_name,
        email:email,
        phone_no:phone_no,
        relation:relation=='Select Relationship'? '':relation,
        relation_other:relation_other==item.relation_other? '':relation_other,
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
          }, 1000);
          
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
    getData();
    console.log('item',item);
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
                padding: 10,
                marginRight: 10,
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
              Edit Contact
            </Text>
          </View>
        
            <Text
            style={{
              color: COLORS.light,
              fontSize: 16,
              fontWeight: 'bold',
              alignSelf : 'flex-start',
              marginHorizontal: '3%',
              marginVertical: 10,
            }}
            >
              First Name
            </Text>
          
          <TextInput
            style={styles.txtInpt}
            color={COLORS.dark}
            placeholderTextColor={COLORS.light}
            autoCapitalize="none"
            underlineColor={COLORS.dark}
            activeUnderlineColor={COLORS.primary}
            autoCorrect={false}
            mode="flat"
            onChangeText={text => setfirst_name(text)}
            value={first_name}
          />
           <Text
            style={{
              color: COLORS.light,
              fontSize: 16,
              fontWeight: 'bold',
              alignSelf : 'flex-start',
              marginHorizontal: '3%',
              marginVertical: 10,
            }}
            >
              Last Name
            </Text>
          <TextInput
            style={styles.txtInpt}
            color={COLORS.dark}
            placeholderTextColor={COLORS.light}
            autoCapitalize="none"
            underlineColor={COLORS.dark}
            activeUnderlineColor={COLORS.primary}
            autoCorrect={false}
            mode="flat"
            onChangeText={text => setlast_name(text)}
            value={last_name}
          />
          <Text
            style={{
              color: COLORS.light,
              fontSize: 16,
              fontWeight: 'bold',
              alignSelf : 'flex-start',
              marginHorizontal: '3%',
              marginVertical: 10,
            }}
            >
              Email
            </Text>
          <TextInput
            style={styles.txtInpt}
            color={COLORS.dark}
            placeholderTextColor={COLORS.light}
            autoCapitalize="none"
            underlineColor={COLORS.dark}
            activeUnderlineColor={COLORS.primary}
            autoCorrect={false}
            mode="flat"
            onChangeText={text => setemail(text)}
            value={email}
          />
           <Text
            style={{
              color: COLORS.light,
              fontSize: 16,
              fontWeight: 'bold',
              alignSelf : 'flex-start',
              marginHorizontal: '3%',
              marginVertical: 10,
            }}
            >
              Phone No
            </Text>
          <TextInput
            style={styles.txtInpt}
            color={COLORS.dark}
            placeholderTextColor={COLORS.light}
            autoCapitalize="none"
            underlineColor={COLORS.dark}
            activeUnderlineColor={COLORS.primary}
            autoCorrect={false}
            keyboardType="number-pad"
            mode="flat"
            onChangeText={text => setphone_no(text)}
            value={phone_no}
          />
           <Text
            style={{
              color: COLORS.light,
              fontSize: 16,
              fontWeight: 'bold',
              alignSelf : 'flex-start',
              marginHorizontal: '3%',
              marginVertical: 10,
            }}
            >
              Select Relationship
            </Text>
            {
              otherActive ? null : 
              <TouchableOpacity
          onPress={()=>{
            refRBSheet.current.open();
          }}
          style={{
            width: '95%',
            padding: '5%',
            borderBottomWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:COLORS.white,
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
            borderBottomColor:COLORS.greylight,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: relation=='Select Relationship'?COLORS.light:COLORS.primary,
          }}
          >
            <Text
            style={{
              color: relation=='Select Relationship'?COLORS.light:COLORS.dark,
              fontSize: 16,
              alignSelf: 'flex-start',
              left:-10,
             
            }}
            > {relation==='Other' ? 
            relation_other : relation
          }</Text>
          </TouchableOpacity>
            }

          
          {
            otherActive ?
            <TextInput
            style={[
              styles.txtInpt,
              {
                marginTop: 20,
              },
            ]}

            right={<TextInput.Icon name="close"
            onPress={()=>{
              setotherActive(false);
              setrelation('Select Relationship');
            }}
            color={COLORS.primary} />}
            color={COLORS.dark}
            placeholder="Add Other Relation"
            placeholderTextColor={COLORS.light}
            autoCapitalize="none"
            underlineColor={COLORS.dark}
            activeUnderlineColor={COLORS.primary}
            autoCorrect={false}
            mode="flat"
            onChangeText={text => setrelation_other(text)}
          />
            : null
          }
          
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
              marginVertical: '3%',
              paddingHorizontal: '5%',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                isEmergency ? setisEmergency(false) : setisEmergency(true);
              }}>
              <Text
                style={{
                  color: COLORS.dark,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Make Emergency
              </Text>
            </TouchableOpacity>
            <Switch
              color={COLORS.primary}
              value={isEmergency}
              onValueChange={() => {
                isEmergency ? setisEmergency(false) : setisEmergency(true);
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
              marginVertical: '3%',
              paddingHorizontal: '5%',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                isTrustee ? setisTrustee(false) : setisTrustee(true);
              }}>
              <Text
                style={{
                  color: COLORS.dark,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Make Trustee
              </Text>
            </TouchableOpacity>
            <Switch
              color={COLORS.primary}
              value={isTrustee}
              onValueChange={() => {
                isTrustee ? setisTrustee(false) : setisTrustee(true);
              }}
            />
          </View>
          <Button
              mode='contained'
              style={[STYLES.btn,{
                width: '100%',
                marginBottom: 20,
              }]}

              contentStyle={STYLES.btnContent}
              onPress={() =>callApi()}
              loading={loading}
              disabled={loading}
            >
              <Text
                style={STYLES.btnText}
              >
                Update
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

export default EditContact;
