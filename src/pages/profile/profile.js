//Native imports
import React, { useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'

//Styles
import { appColors, stylesContainers } from '../../styles'


export const Profile = (props) => {

    return(
        <View style={[stylesContainers.containerPage, profileStyles.containerPage]}>
            <Text style={{color: 'black'}}>
                hola desde el perfil
            </Text>
        </View>
    )
}

const profileStyles = StyleSheet.create({
    containerPage: {
        backgroundColor: appColors.white1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})