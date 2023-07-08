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

function Btn(props) {
  
  const [loading, setloading] = useState(true);


  useEffect(() => {

  }, []);
  return (
    <>
<Button
            mode='contained'
            style={styles.Fbbtn}
            onPress={() => {
            console.log('asdfgh')
            }}
            contentStyle={styles.FbbtnContent}
            >
             <Text
             style={{
              
              color: COLORS.white,
             }}
             >{props.text} WITH FACEBOOK</Text>
            </Button>
    </>
  );
}

export default Btn;
