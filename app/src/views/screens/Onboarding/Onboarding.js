import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
BackHandler,
  Image,
  useColorScheme,
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
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

} from 'react-native-paper';
import COLORS from '../../../consts/colors';
import base_url from '../../../consts/base_url';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginHeader from '../../../components/logins_comp/LoginHeader';
import Btn from '../../../components/button/Btn';
import STYLES from '../../../components/button/styles';
import FBBtn from '../../../components/button/FBBtn';
import styles from './styles';
import RNExitApp from 'react-native-exit-app';
import {useIsFocused,useNavigation,StackActions,CommonActions} from '@react-navigation/native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function Onboarding({ route,navigation }) {
const isFocused = useIsFocused();
  // variables
  const [loading, setloading] = useState(true);
  // get user data from async storage
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userDetail')
      // console.log(jsonValue)
      if (JSON.parse(jsonValue) != null) {
        setTimeout(() => {
          navigation.replace('MyDrawer',{
            userDetail:jsonValue
          })
        }, 1000);
      }
      else {
        setTimeout(() => {
          navigation.replace('Login')
        }, 1000);
      }
      // return jsonValue != null ? console.log(JSON.parse(jsonValue)) : null;
    } catch (e) {
      // error reading value
    }
  }
  useEffect(() => {
    getData()
  },[]);
  return (


    <SafeAreaView
      style={{
        flex: 1,
      }}
    >


      <View
        style={styles.mainView}
      >

        <ActivityIndicator animating={loading} color={COLORS.primary} />




      </View>

    </SafeAreaView>



  );
}

export default Onboarding;
