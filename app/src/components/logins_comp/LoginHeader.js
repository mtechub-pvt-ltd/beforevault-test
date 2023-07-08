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
  TextInput
} from 'react-native';
import {
  Text,
  Button,
  Snackbar,
  Headline,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import COLORS from '../../consts/colors';
import base_url from '../../consts/base_url';
import STYLES from '../../styles';
import styles from './styles';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function LoginHeader(props) {


  useEffect(() => {

  }, []);
  return (
     <Image
            style={styles.img}
            source={require('../../assets/logo.png')}
          />
  )
 
}

export default LoginHeader;
