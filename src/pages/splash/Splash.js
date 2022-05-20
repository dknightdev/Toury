//Native imports
import React from 'react'
import { View, Image, StyleSheet } from "react-native"

//Styles
import { appColors, stylesContainers } from "../../styles"

export const Splash = ({route}) => {
    return (
        <>
            <View style={[stylesContainers.containerPage, splashStyles.containerPage]}>
                <Image
                    resizeMode='contain' 
                    source={require('../../../public/imagenesGeneral/logoToury.png')}
                    style={{height: '80%', width: '80%', position: 'absolute'}}
                />
            </View>
        </>
    )
}

const splashStyles = StyleSheet.create({
    containerPage: {
        backgroundColor: appColors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    }
})