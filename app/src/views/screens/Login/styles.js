import {StyleSheet} from 'react-native'
import COLORS from '../../../consts/colors';

const STYLES = StyleSheet.create({
    mainView:{
        justifyContent: 'center',
            alignItems: 'center',
            marginVertical: '10%',
    },
    txtInptView:{
        flexDirection: 'column',
            width: '100%',
            justifyContent: 'center',
    },
    txtInpt:{
        width: '95%',
                backgroundColor: COLORS.white,
                color: COLORS.dark,
                // borderBottomWidth: 1,
                // paddingVertical: '5%',
                fontSize: 15,
                alignSelf: 'center'
    },
    frgtpss:{
        alignSelf: 'flex-end',
                  color: COLORS.secondary,
                  marginHorizontal: '3%',
                  marginVertical: '1%',
                  
                  textTransform: 'uppercase',
    },
    // --or -- stlye 
    orView:{
        
        alignSelf: 'center',
        marginTop: '10%',
        color: COLORS.dark,},
    // --signup / login text style
    SgnOrIntxt:{
        fontFamily: 'Raleway-Regular',
                alignSelf: 'center',
                marginTop: '5%',
                color: COLORS.dark,
                alignContent: 'center',
                textAlign: 'center',
                alignItems: 'center',
                flexDirection: 'row',},






    
        
      
        
})

export default STYLES; 