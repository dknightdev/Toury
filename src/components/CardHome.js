//Native imports
import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'

//Styles
import { appColors } from '../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'


export const CardHome = ({item, size, func}) => {
    
    const [ stateImage, setStateImage ] = useState({fail: false, loading: true})

    return(
        <TouchableOpacity activeOpacity={0.9} key={item.id} style={[cardStyles.continer, size]} onPress={func}>
            <View style={cardStyles.containerImage1}>
                <View style={cardStyles.containerImage2}>
                    <Image 
                        resizeMode='cover' 
                        style={{height: '100%', width: '100%'}}
                        onError={() => setStateImage({...stateImage,fail: true})}
                        onLoadEnd={() => setStateImage({...stateImage,loading: false})} 
                        source={(stateImage.fail || stateImage.loading || !item.image) ? require('../../public/imagenesGeneral/caminataimg.png') : {uri: item.image}}
                    />
                </View>
            </View>
            <View style={cardStyles.containerFooter}>
                <Text style={cardStyles.textName}>{ item.name.length > 23 ? item.name.slice(0,23) + '...' : item.name }</Text>
            </View>
        </TouchableOpacity>
    )
}

const cardStyles = StyleSheet.create({
    continer: {
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25
    },
    containerImage1: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerImage2: {
        height: '100%', 
        width: '100%',
        borderRadius: 25,
        overflow: 'hidden',
    },
    containerFooter: {
        position: 'absolute',
        width: '100%',
        height: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: responsiveHeight(0.15),
        paddingHorizontal: responsiveWidth(2),
        bottom: 0,
        textAlign: 'center',
        backgroundColor: appColors.primarySoft,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25, 
    },

    textName: {
        fontSize: responsiveHeight(1.7), 
        color: appColors.white3,
        fontWeight: '700',
        textAlign: 'center'
    },
})