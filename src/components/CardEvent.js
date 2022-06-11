//Native imports
import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'

//External components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

//Styles
import { appColors } from '../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'


export const CardEvent = ({item, size, func}) => {
    
    return(
        <TouchableOpacity activeOpacity={0.9} key={item.id} style={[eventStyles.continer, size]} onPress={func}>
            <View style={eventStyles.containerImage1}>
                <View style={eventStyles.containerImage2}>
                    <Image
                        resizeMode='cover' 
                        source={require('../../public/imagenesGeneral/caminataimg.png')}
                        style={{height: '100%', width: '100%'}}
                    />
                </View>
            </View>
            <View style={eventStyles.containerFooter}>
                <Text style={eventStyles.textName}>{ item.name.length > 25 ? item.name.slice(0,25) + '...' : item.name }</Text>
                <View style={eventStyles.containerHorizontal}>
                    <Icon name='calendar-heart' size={Math.round(responsiveWidth(5))} color={appColors.white3}/>
                    <Text style={eventStyles.textDate}>{item.date.split('T')[0]}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const eventStyles = StyleSheet.create({
    continer: {
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appColors.primarySoft,
        borderRadius: 15
    },
    containerImage1: {
        height: '60%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerImage2: {
        height: '80%', 
        width: '80%',
        borderRadius: 15,
        overflow: 'hidden',
    },
    containerHorizontal: {
        width: '100%',
        height: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: responsiveHeight(0.3)
    },
    containerFooter: {
        width: '100%',
        height: '40%',
        paddingHorizontal: responsiveWidth(2.6),
    },


    textName: {
        fontSize: responsiveHeight(1.6), 
        color: appColors.white3,
        fontWeight: '600',
        textAlign: 'left',
        alignSelf: 'center',
    },
    textDate: {
        fontSize: responsiveHeight(1.7), 
        color: appColors.white3,
        marginLeft: responsiveWidth(1.5),
        fontWeight: '500'
    },
})