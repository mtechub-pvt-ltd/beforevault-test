import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
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
  Badge

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
import { he } from 'date-fns/locale';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function Category({ navigation }) {
  // vaiuables 
  const [defaultCategory, setdefaultCategory] = useState([]);
  const [myCategory, setmyCategory] = useState([]);


  const renderItem = ({ item }) => (
    <TouchableOpacity
    activeOpacity={.6}
      onPress={() => { 
        navigation.navigate('SubCategory', { cat: item }) 
       }}
      style={{
        // flexDirection: 'row',
        width: item.name=='After' ? width*.84 : width*.40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:'4%',
        padding:10,
        borderRadius:10,
        borderColor:COLORS.light,
        marginHorizontal:'2%',
        height:110,
        backgroundColor:COLORS.primary+'20',
      }}
    >
     <Image style={{
                  width: item.name=='After' ? 70 : 45,
                  height: 45
                }}
                source={{uri:image_url+ item.image}}
              />
     
      <Text 
      style={{
        // fontSize:12,
        color:COLORS.light,
        textAlign:'center',
        marginTop:5
      }}
      >{item.name}</Text>
      
     
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
  /// call api 
  const getTotal = async (id) => {
    setloading(true)
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
      getTotal(data.user_id)
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
        dismissable={false}
        contentContainerStyle={{
          backgroundColor: 'white', padding: 20, zIndex: 9,
          width: width - 100,
          alignSelf: 'center',
          borderRadius: 20,
          height: height / 3.4,
        }}>
        <View style={{ alignItems: 'center' }}>
          <Icon name="check-circle" size={70} color={COLORS.secondary} />
          <Text
            style={{
              marginVertical: '10%'
            }}
          >Account verified successfully</Text>

          <Button
            mode='contained'
            style={[STYLES.btn, {
              marginTop: 0,
              width: width / 3,
            }]}

            contentStyle={STYLES.btnContent}
            onPress={() => {

              hideModal()
              navigation.navigate('MyDrawer')
            }}
            loading={loading}
            disabled={loading}
          >
            <Text
              style={STYLES.btnText}
            >
              Ok
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
      <View
        style={{
          paddingHorizontal: '5%',
          zIndex: -9,

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
              marginVertical: Platform.OS === 'ios' ? '3%': '6%',
              alignItems: 'center',
            }}
          >
           
            <Text
              style={{
                color: COLORS.light,
                fontSize: 20,
                fontWeight: 'bold'
              }}
            > Default</Text>
            <TouchableOpacity
            onPress={() => navigation.navigate('MyCategory')}
            >
            <Badge
              style={{
                color: COLORS.white,
                height:30,
                backgroundColor:COLORS.secondary,
                paddingHorizontal:7,
                paddingVertical:4,
                borderRadius: Platform.OS === 'ios' ? 10:50
              }}
            > + Other</Badge>
            </TouchableOpacity>
          </View>
              {
                loading ? <ActivityIndicator 
                style={{
                  marginTop:height/3
                }}
                size="small" color={COLORS.secondary} /> : 
                <FlatList
                numColumns={2}
                  data={defaultCategory}
                  style={{
                    width: width*.9,
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
                    }
                />
              }
         



        </View>
      </View>
    </SafeAreaView>



  );
}

export default Category;
