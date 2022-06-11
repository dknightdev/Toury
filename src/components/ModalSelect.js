//Native imports
import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native'

//External components
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import { Overlay } from "react-native-elements";

//Styles
import { appColors, stylesContainers, stylesInputs, stylesShadows, uniqueColors } from '../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

export const ModalSelect = ({func, visible, dataSelect, text, toggleOverlay}) => {
    return(
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={[modalStyles.overlay, stylesShadows.shadow2]}>
            <Text style={modalStyles.textMessage}>{text}</Text>

            <FlatList
                data={dataSelect}
                onScroll={()=>{setAct(0)}}
                renderItem={ ({item}) => 
                    <TouchableOpacity activeOpacity={0.8} style={[modalStyles.containerItem, stylesShadows.shadow2]} onPress={() => {func(item); toggleOverlay()}}>
                        <Text style={modalStyles.textItem}>{item.text}</Text>
                    </TouchableOpacity>
                }
                keyExtractor={item => item.id}
            />
        </Overlay>
    )
}

const modalStyles = StyleSheet.create({
    overlay: {
        width: '78%',
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveHeight(2.5),
        backgroundColor: appColors.white1,
        borderRadius: 15
    },
    containerItem:{
        width: '90%',
        height: responsiveHeight(5),
        marginVertical: responsiveHeight(0.5),
        backgroundColor: appColors.primary,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },

    textMessage:{
        fontSize: responsiveHeight(2.2), 
        color: appColors.word1,
        marginHorizontal: responsiveWidth(4),
        marginBottom: responsiveHeight(2.5),
        fontWeight: '500',
        alignSelf: 'center',
        textAlign: 'center',
        paddingBottom: responsiveHeight(1),
        borderBottomWidth: 1, borderBottomColor: appColors.primarySoft,
    },

    textItem:{
        fontSize: responsiveHeight(1.8),
        fontWeight: '500', 
        color: appColors.white2,
    }
})