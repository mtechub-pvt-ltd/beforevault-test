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
import styles from './styles';
import STYLES from '../../styles';


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
                style={styles.btn}
                
                contentStyle={styles.btnContent}
                // onPress={()=>{
                //     props.navigation.navigate(props.navigateTo)
                //     console.log(props.text)
                // }}
            >
                <Text
                    style={styles.btnText}
                >{
                        props.text
                    }
                </Text>
            </Button>
        </>
    );
}

export default Btn;
