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
  ImageEditor,
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
  Divider,
  Appbar,
  Dialog,
  Paragraph,
} from 'react-native-paper';
import COLORS from '../../../consts/colors';
import base_url from '../../../consts/base_url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import ImagePicker from 'react-native-image-crop-picker';
import {CropView} from 'react-native-image-crop-tools';
import {launchImageLibrary} from 'react-native-image-picker';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function Crop({route, navigation}) {
  const {path, index, defaultCategory, myCategory,cameraType} = route.params;
  console.log(index, path);
  viewRef = useRef(null);
  const [image, setImage] = useState(path);
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userDetail');
      const data = JSON.parse(jsonValue);
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Appbar.Header
        style={{
          backgroundColor: COLORS.primary,
          height: 60,
        }}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
          iconColor="white"
        />
        <Appbar.Content
          titleStyle={{
            color: COLORS.white,
            fontSize: 20,
            fontWeight: 'bold',
          }}
          title={'Crop Image'}
        />

        <Appbar.Action
          iconColor="white"
          icon="content-save"
          onPress={() => {
            viewRef.current.saveImage(true, 100);
            // navigation.navigate('CameraScreenCrop',
            // {
            //   item:item,
            // });
          }}
        />
      </Appbar.Header>
      {image == null ? null : (
        <CropView
          sourceUrl={image}
          style={{
            width: width,
            height: height,
            backgroundColor: 'black',
            flex: 1,
          }}
          ref={viewRef}
          iosDimensionSwapEnabled
          onImageCrop={res => {
            console.log('res', res);
            navigation.navigate('CameraScreenCrop', {
              path:Platform.OS=='ios' ? res.uri : 'file://'+res.uri,
              index: index,
              defaultCategory: defaultCategory,
              myCategory: myCategory,
              cameraType:cameraType
            });
          }}
        />
      )}
    </View>
  );
}

export default Crop;
