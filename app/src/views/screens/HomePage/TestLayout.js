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
  BackAndroid,
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
  Divider,
  Dialog,
  Menu,
  Provider,
  FAB,
  Portal,
  Badge,
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
import {RBSheet} from 'react-native-raw-bottom-sheet';
import {
  useIsFocused,
  useNavigation,
  StackActions,
  CommonActions,
} from '@react-navigation/native';
// import { StackActions, NavigationActions } from '@react-navigation';

import RNExitApp from 'react-native-exit-app';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function HomePage({route, navigation}) {
  // vaiuables

  const [folderName, setFolderName] = useState('');

  const renderItem = ({item}) => <Text>Hello</Text>;
  const data = [
    {
      id: 1,
      name: 'Folder 1',
    },
    {
      id: 2,
      name: 'Folder 2',
    },
    {
      id: 3,
      name: 'Folder 1',
    },
    {
      id: 4,
      name: 'Folder 2',
    },
    {
      id: 5,
      name: 'Folder 1',
    },
    {
      id: 6,
      name: 'Folder 2',
    },
    {
      id: 7,
      name: 'Folder 1',
    },
    {
      id: 8,
      name: 'Folder 2',
    },
    {
      id: 9,
      name: 'Folder 1',
    },
    {
      id: 10,
      name: 'Folder 2',
    },
    {
      id: 11,
      name: 'Folder 1',
    },
    {
      id: 12,
      name: 'Folder 2',
    },
    {
      id: 13,
      name: 'Folder 1',
    },
    {
      id: 14,
      name: 'Folder 2',
    },
    {
      id: 15,
      name: 'Folder 1',
    },
    {
      id: 16,
      name: 'Folder 2',
    },
    {
      id: 17,
      name: 'Folder 1',
    },
    {
      id: 18,
      name: 'Folder 2',
    },
    {
      id: 19,
      name: 'Folder 1',
    },
    {
      id: 20,
      name: 'Folder 2',
    },
    {
      id: 21,
      name: 'Folder 1',
    },
    {
      id: 22,
      name: 'Folder 2',
    },
  ]
  
  

  useEffect(() => {}, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        zIndex: -99,
      }}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          marginVertical:'4%',
          alignItems: 'center',
          paddingHorizontal: '5%',
        }}>
        
        <Text
          style={{
            color: COLORS.dark,
            fontSize: 20,
          }}>
          Home
        </Text>
        
      </View>
      {/* implement Instagram like flatlist(grid) in react native to show nth no of item in 2 or 3 column to make it look like instagram 
       */}
       <ScrollView>
      {
       
        data.map((item, index) => {
          return (
            // get three items in a row
            // if item id is even then show 3 items in a row else show 1 item in a row
          
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: '5%',
                marginBottom: '5%',
              }}>
              <View
                style={{
                  width: index % 2 == 0 ? '48%' : '100%',
                  height: index % 2 == 0 ? 200 : 400,
                  backgroundColor: COLORS.red,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text

                  style={{
                    color: COLORS.dark,
                    fontSize: 20,
                  }}>
                  {item.name}
                </Text>
              </View>
              {index % 2 == 0 ? (
                <View
                  style={{
                    width: '48%',
                    height: 200,
                    backgroundColor: COLORS.red,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.dark,
                      fontSize: 20,
                    }}>
                    {item.name}
                  </Text>
                </View>
              ) : null}
            </View>
          
            // <View
            //   style={{
            //     flexDirection: 'row',
            //     justifyContent: 'space-between',
            //     width: '100%',
            //     paddingHorizontal: '5%',
            //     marginBottom: '5%',
            //   }}>
            //   <View
            //     style={{
            //       width: '48%',
            //       height: 200,
            //       backgroundColor: COLORS.red,  
            //       borderRadius: 10,
            //       justifyContent: 'center',
            //       alignItems: 'center',
            //     }}>
            //     <Text
            //       style={{
            //         color: COLORS.dark,
            //         fontSize: 20,
            //       }}>
            //       {item.name}
            //     </Text>
            //   </View>
            //   {index % 2 == 0 ? (
            //     <View
            //       style={{
            //         width: '48%',
            //         height: 200,
            //         backgroundColor: COLORS.red,
            //         borderRadius: 10,
            //         justifyContent: 'center',
            //         alignItems: 'center',
            //       }}>
            //       <Text
            //         style={{
            //           color: COLORS.dark,
            //           fontSize: 20,
            //         }}>
            //         {item.name}
            //       </Text>
            //     </View>
            //   ) : null}
            // </View>


          );
        })
      }
      </ScrollView>
         
        
        
     
  
     
    </SafeAreaView>
  );
}

export default HomePage;
