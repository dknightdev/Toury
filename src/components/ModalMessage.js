//Native imports
import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, Linking, over } from 'react-native'

//External components
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import { Overlay } from "react-native-elements";

//Styles
import { appColors, stylesContainers, stylesInputs, stylesShadows, uniqueColors } from '../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

export const ModalMessage = ({textMain, text, buttonText, visible, toggleOverlay, success}) => {
    return(
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={[modalStyles.overlay, success ? stylesShadows.shadow2 : stylesShadows.shadow3]}>
            <View style={[modalStyles.header, success ? stylesShadows.shadow2 : stylesShadows.shadow3]}>
                <IconM color={success ? appColors.primary : appColors.secondary} size={Math.round(responsiveHeight(4.7))} name={ success ? 'comment-check' : 'message-alert-outline'}/>
            </View>

            <Text style={[modalStyles.textMessageMain, success ? {borderBottomColor: appColors.primarySoft} : {borderBottomColor: appColors.secondarySoft}]}>{textMain}</Text>
            <Text style={modalStyles.textMessage}>{text}</Text>


            <TouchableOpacity activeOpacity={0.8} style={[modalStyles.buttonSecondary, success ? {backgroundColor: appColors.primary} : {backgroundColor: appColors.secondary}]} onPress={toggleOverlay}>
                <Text style={modalStyles.textButton}>{buttonText}</Text>
            </TouchableOpacity>
        </Overlay>
    )
}

const modalStyles = StyleSheet.create({
    overlay: {
        width: '78%',
        paddingHorizontal: responsiveWidth(4),
        backgroundColor: appColors.white1,
        borderRadius: 15
    },
    header: {
        width: responsiveWidth(18),
        height: responsiveWidth(18),
        top: -responsiveHeight(4.5),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        borderRadius: 50,
        backgroundColor: appColors.white1
    },


    buttonSecondary:{
        height: responsiveHeight(7),
        width: '85%',
        marginBottom: responsiveHeight(1),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 15,
    },


    textMessageMain: {
        fontSize: responsiveHeight(2.7), 
        color: appColors.word1,
        fontWeight: '700',
        marginTop: responsiveHeight(4.3),
        borderBottomWidth: 1,
        alignSelf: 'center',
        textAlign: 'center'
    },
    textMessage:{
        fontSize: responsiveHeight(2.2), 
        color: appColors.word1,
        marginHorizontal: responsiveWidth(4),
        marginTop: responsiveHeight(2.5),
        marginBottom: responsiveHeight(3),
        fontWeight: '500',
        alignSelf: 'center',
        textAlign: 'center',
    },
    textButton:{
        fontSize: responsiveHeight(2.3), 
        color: appColors.white1,
        fontWeight: '700',
    }
})