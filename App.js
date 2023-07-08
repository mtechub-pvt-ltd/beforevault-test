import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Linking,
  Platform,
  Alert,
  BackHandler,
  
} from 'react-native';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
  useNavigationState,
  useRoute,
  useNavigationContainerRef,
  StackActions,
  NavigationActions,
  useIsFocused
} from '@react-navigation/native';
import COLORS from './app/src/consts/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import { event } from 'react-native-reanimated';
import Onboarding from './app/src/views/screens/Onboarding/Onboarding';
import Login from './app/src/views/screens/Login/Login';
import Signup from './app/src/views/screens/Signup/Signup';
import CreateProfile from './app/src/views/screens/CreateProfile/CreateProfile';
import ForgetPass from './app/src/views/screens/ForgetPass/ForgetPass';
import NewPass from './app/src/views/screens/NewPass/NewPass';
import VerifyOtp from './app/src/views/screens/VerifyOtp/VerifyOtp';
import HomePage from './app/src/views/screens/HomePage/HomePage';
import TestLayout from './app/src/views/screens/HomePage/TestLayout';
import Category from './app/src/views/screens/Category/Category';
import MyCategory from './app/src/views/screens/MyCategory/MyCategory';
import Contact from './app/src/views/screens/Contact/Contact';
import Checklist from './app/src/views/screens/Checklist/Checklist';
import Profile from './app/src/views/screens/Profile/Profile';
import SubCategory from './app/src/views/screens/SubCategory/SubCategory';
import MySubCategory from './app/src/views/screens/MySubCategory/MySubCategory';
import CameraScreenCrop from './app/src/views/screens/CameraScreenCrop/CameraScreenCrop';
import CameraScreenCropAndroid from './app/src/views/screens/CameraScreenCrop/CameraScreenCropAndroid';
import AddContact from './app/src/views/screens/AddContact/AddContact';
import ViewContact from './app/src/views/screens/ViewContact/ViewContact';
import EditContact from './app/src/views/screens/EditContact/EditContact';
import Crop from './app/src/views/screens/Crop/Crop';
import ViewPdf from './app/src/views/screens/ViewPdf/ViewPdf';
import ViewDoc from './app/src/views/screens/ViewDoc/ViewDoc';
import ViewDoc1 from './app/src/views/screens/ViewDoc/ViewDoc1';
import ViewImage from './app/src/views/screens/ViewImage/ViewImage';
import ViewSingleImage from './app/src/views/screens/ViewSingleImage/ViewSingleImage';
import ChecklistItem from './app/src/views/screens/ChecklistItem/ChecklistItem';
import ItemsList from './app/src/views/screens/ItemsList/ItemsList';
import ItemsList_p from './app/src/views/screens/ItemsList/ItemsList_p';
import ForgetPassword from './app/src/views/screens/ForgetPassword/ForgetPassword';
import RecentFiles from './app/src/views/screens/RecentFiles/RecentFiles';
import Faqs from './app/src/views/screens/Faqs/Faqs';
import EditProfile from './app/src/views/screens/EditProfile/EditProfile';
import Trash from './app/src/views/screens/Trash/Trash';
import webForm from './app/src/views/screens/webForm/webForm';
import Share from './app/src/views/screens/Share/Share';
import ShareContactList from './app/src/views/screens/Share/ShareContactList';

import RNExitApp from 'react-native-exit-app';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function CustomDrawerContent(props) {
  const [dashboardlink, setDashboardlink] = useState('');
  const [editlink, setEditlink] = useState('');
  const removeData = async () => {
    try {
      await AsyncStorage.removeItem('userDetail')
      console.log('data Removed')
      RNRestart.Restart();

    } catch (e) {
      // remove error
    }

  }

  // react native function to get oject from async storage
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userDetail');
      if (value !== null) {
        var x = JSON.parse(value);
        // console.log(x)

        setDashboardlink(x.dashboardlink);
        setEditlink(x.editprofilelink);
      } else {

        // console.log('no data');
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <DrawerContentScrollView
      style={{
        paddingHorizontal: '5%',
        display: 'none',
      }}>
      <View>
        <Text
          style={{
            fontWeight: '700',
            fontSize: 20,
            marginTop: 20,
            marginLeft: 10,
            color: COLORS.dark,
          }}>
          General
        </Text>
      </View>

      <TouchableOpacity

        onPress={() => {
          props.navigation.navigate('Dashboard', {
            dashboardlink: dashboardlink,
          });
        }}
      >
        <View
          style={{
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 5,
            marginVertical: 5,
          }}>
          <Icon
            name="angle-right"
            style={{
              // position: 'absolute',
              left: '35%',
              marginTop: 10,
            }}
            size={20}
            color={COLORS.light}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon
              name="th-large"
              style={{
                // position: 'absolute',
                right: '7%',
                marginTop: 10,
              }}
              size={20}
              color={COLORS.light}
            />
            <Text
              style={{
                marginTop: 10,
                marginLeft: 10,
                color: COLORS.dark,
              }}>
              Dashboard
            </Text>
          </View>
        </View>
      </TouchableOpacity>



      <TouchableOpacity
        onPress={() => {
          removeData();
        }}
      >
        <View
          style={{
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 5,
            marginVertical: 5,
          }}>
          <Icon
            name="angle-right"
            style={{
              // position: 'absolute',
              left: '35%',
              marginTop: 10,
            }}
            size={20}
            color={COLORS.light}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}

          >
            <Icon
              name="sign-out"
              style={{
                // position: 'absolute',
                right: '7%',
                marginTop: 10,
              }}
              size={20}
              color={COLORS.light}
            />
            <Text
              style={{
                marginTop: 10,
                marginLeft: 10,
                color: COLORS.dark,
              }}>
              Logout
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

function MyDrawer({ route ,naigation}) {
  return (
    <Drawer.Navigator
    screenOptions={
      { header: () => null,
      drawerStyle: {
        backgroundColor: COLORS.red,
        width: '70%',
        display: 'none',
      },
      overlayColor: 'transparent',
      }}
      >
      <Drawer.Screen 
      
      name="MyTabs" component={MyTabs} />
    </Drawer.Navigator>
  );
}

function MyTabs({ route ,naigation}) {
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { 
          position: 'absolute', height: Platform.  OS === 'ios' ? 70 :60, paddingTop: Platform.  OS === 'ios' ? 0 :5, paddingBottom:Platform.  OS === 'ios' ? 10 : 0 },
        tabBarActiveTintColor: COLORS.primary,
        headerShown: false,
        tabBarInactiveTintColor: COLORS.greylight,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,

      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <Icon name='home' size={24} color={focused ? COLORS.primary : COLORS.greylight} />
          ),
        }}
        name="Home" component={HomePage} />
      {/* <Tab.Screen
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <Icon name='list' size={24} color={focused ? COLORS.primary : COLORS.light} />
          ),
        }}
        name="Category" component={Category} /> */}
      <Tab.Screen
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <Icon name='id-badge' size={24} color={focused ? COLORS.primary : COLORS.light} />
          ),
        }}
        name="Contact" component={Contact} />
      
      <Tab.Screen
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <Icon name='share-alt' size={24} color={focused ? COLORS.primary : COLORS.light} />
          ),
        }}
        name="Share" component={Share} />
      <Tab.Screen
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <Icon name='user' size={24} color={focused ? COLORS.primary : COLORS.light} />
          ),
        }}
        name="Profile" component={Profile} />

    </Tab.Navigator>
  );
}
const  App = ({ navigation }) => {
 
  return (
    <NavigationContainer 
    independent={true}>
      <Stack.Navigator
        screenOptions={{ header: () => null }}
        
      >
        {/* <Stack.Screen name="TestLayout" component={TestLayout} /> */}
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} />
        <Stack.Screen name="ForgetPass" component={ForgetPass} />
        <Stack.Screen name="NewPass" component={NewPass} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
        <Stack.Screen name="MyDrawer" component={MyDrawer} />
        <Stack.Screen name="MyCategory" component={MyCategory} />
        <Stack.Screen name="SubCategory" component={SubCategory} />
        <Stack.Screen name="MySubCategory" component={MySubCategory} />
        <Stack.Screen name="CameraScreenCrop" component={CameraScreenCrop} />
        <Stack.Screen name="CameraScreenCropAndroid" component={CameraScreenCropAndroid} />
        <Stack.Screen name="Crop" component={Crop} />
        <Stack.Screen name="AddContact" component={AddContact} />
        <Stack.Screen name="ViewContact" component={ViewContact} />
        <Stack.Screen name="EditContact" component={EditContact} />
        <Stack.Screen name="ViewPdf" component={ViewPdf} />
        <Stack.Screen name="ViewDoc" component={ViewDoc} />
        <Stack.Screen name="ViewDoc1" component={ViewDoc1} />
        <Stack.Screen name="ViewImage" component={ViewImage} />
        <Stack.Screen name="ViewSingleImage" component={ViewSingleImage} />
        <Stack.Screen name="ChecklistItem" component={ChecklistItem} />
        <Stack.Screen name="ItemsList" component={ItemsList} />
        <Stack.Screen name="ItemsList_p" component={ItemsList_p} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="RecentFiles" component={RecentFiles} />
        <Stack.Screen name="Faqs" component={Faqs} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Trash" component={Trash} />
        <Stack.Screen name="webForm" component={webForm} />
        <Stack.Screen name="ShareContactList" component={ShareContactList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
