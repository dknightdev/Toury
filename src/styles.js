import { StyleSheet } from 'react-native'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

const uniqueColors = {
    facebook: '#3b5998',
    apple: '#191919',


    item1: '#f12552',
    item2: '#f06f3e',
    item3: '#feb028',
    item4: '#169e88',
    item5: '#61b448',
    item6: '#bad546',

    itemHotel: '#564498',
    itemRestaurante: '#0e4d8c',

    item3UltraSoft:'#f7eadd',
}

const appColors = {
    primary: '#1976D2',
    primarySoft: '#4c84d6',
    primarySoftBackground: 'rgba(25, 118, 210, 0.75)',
    secondary: '#ff6737',
    secondarySoft: '#f88566',
    secondarySoftBackground: '#f5c9c1',
    primaryUnderlay: '#1561c6',
    primaryDisabled: '#4f81c8',
    
    white1: '#ffffff'/* '#fafafa' */,
    white2: '#fefefe',
    white3: '#f2f2f2',
    white4: '#eaebec',
    white5: '#e3e5e7',

    whitePrimary: '#ebecf1',
    whitePrimaryBackground: 'rgba(233, 238, 240, 0.8)',

    word1: '#353940',
    word2: '#393939',
    
    gray: '#a1a1a1',
    gray1: '#abb2bf',

    errorColor: '#e2080f',
}

const stylesContainers = StyleSheet.create({
    containerPage: {
        width: '100%',
        height: '100%',
        padding: 0,
        margin: 0,
    },
    containerAbsoluteBetween:{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    containerHorizontalBetween:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    containerFooter:{
        position: 'absolute',
        bottom: 0
    },

    //~~Contenedores para el input del login
    containerInputSesion: {
        width: '100%',
        height: responsiveHeight(10),
        marginBottom: responsiveHeight(0.5),
        justifyContent: 'center',
        paddingHorizontal: 0,
    },
    containerInputSesion2: {
        width: '100%',
        height: responsiveHeight(7),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: appColors.gray,
        backgroundColor: appColors.white2,
    },
    containerInputFocused: {
        borderColor: appColors.primary,
        backgroundColor: appColors.white1
    },
    //~~

    //~~Contenedores para el input del login
    containerInputSearch: {
        width: '100%',
        height: responsiveHeight(6.5),
        justifyContent: 'center',
        paddingHorizontal: 0,
    },
    containerInputSearch2: {
        width: '100%',
        height: responsiveHeight(6.5),
        borderRadius: 10
    },
    inputSearchFocused: {
        backgroundColor: appColors.white1,
        borderColor: appColors.secondary,
    },
    //~~





    containerInputRightIcon: {
        height: '100%',
        width: responsiveWidth(16),
    },
    containerInputLeftIcon: {
        height: '100%',
        width: responsiveWidth(16),
    }




    
})

const stylesInputs = StyleSheet.create({
    inputSesion:{
        height: responsiveHeight(7),
        width: '90%',
        paddingVertical: 0,
        paddingHorizontal: responsiveWidth(4),
        fontSize: responsiveHeight(2.2),
    },
    inputSearch: {
        height: responsiveHeight(6.5),
        width: '90%',
        paddingVertical: 0,
        paddingHorizontal: responsiveWidth(4),
        fontSize: responsiveHeight(2.1),
    }
})

const stylesLabels = StyleSheet.create({
    labelInputSesion:{
        color: appColors.word1,
        fontWeight: '700',
        fontSize: responsiveHeight(2),
    },
    labelError: {
        color:appColors.errorColor,
        fontSize:responsiveHeight(1.54),
        marginHorizontal: responsiveWidth(2)
    }
})

const stylesShadows = StyleSheet.create({
    shadow1:{
        shadowColor: appColors.gray,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    shadow2: {
        shadowColor: appColors.primary,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    shadow3: {
        shadowColor: appColors.secondary,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
})

export { uniqueColors, appColors, stylesContainers, stylesInputs, stylesLabels, stylesShadows }