import {StyleSheet} from 'react-native'
import COLORS from '../../../consts/colors';

const STYLES = StyleSheet.create({
    mainView:{
        justifyContent: 'center',
            alignItems: 'center',
            marginVertical: '20%',
    },
    txtInptView:{
        flexDirection: 'column',
            width: '100%',
            justifyContent: 'center',
            
            
    },
    txtInpt:{
        width: '95%',
                // backgroundColor: COLORS.white,
                color: COLORS.dark,
                // borderBottomWidth: 1,
                // paddingVertical: '5%',
                fontSize: 15,
                alignSelf: 'center'
    },
    frgtpss:{
        alignSelf: 'flex-end',
                  color: COLORS.dark,
                  marginHorizontal: '3%',
                  marginVertical: '2%',
                  
                  textTransform: 'uppercase',
    },
    // --or -- stlye 
    orView:{
        
        alignSelf: 'center',
        marginTop: '0%',
        color: COLORS.dark,},
    // --signup / login text style
    SgnOrIntxt:{
        fontFamily: 'Raleway-Regular',
                alignSelf: 'center',
                marginTop: '1%',
                color: COLORS.dark,
                alignContent: 'center',
                textAlign: 'center',
                alignItems: 'center',
                flexDirection: 'row',},
                codeFieldRoot: {marginTop: 3,alignSelf:'center'},
                cell: {
                  width: 40,
                  height: 40,
                  lineHeight: 38,
                  fontSize: 24,
                  borderWidth: .5,
                  borderColor:COLORS.dark+'50',
                  borderRadius: 5,
                  textAlign: 'center',
                  margin:4,
                  color:COLORS.greylight
                },
                focusCell: {
                  borderColor: COLORS.primary,
                },
            })

export default STYLES; 