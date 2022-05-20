//Native imports
import React, { useState } from 'react'
import { StyleSheet, View, Text, Image, TouchableHighlight } from 'react-native'

//External components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

//Styles
import { appColors, stylesShadows, uniqueColors } from '../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'


export const CardSite = ({item, func}) => {

    const [ stateImage, setStateImage ] = useState({fail: false, loading: true})


    const getNameType = (type) => {
        const listNames = ['Hotel', 'Restaurante', 'Parque', 'Cafeteria', 'Museo', 'Recreacion', 'Bar', 'Prestador turistico']
        return listNames[type]
    }

    const getColor = (type) => {
        switch(type){
            case '0':
                return uniqueColors.itemHotel
            case '1':
                return uniqueColors.itemRestaurante
            case '2':
                return uniqueColors.item1
            case '3':
                return uniqueColors.item4
            case '4':
                return uniqueColors.item2
            case '5':
                return uniqueColors.item5
            case '6':
                return uniqueColors.item3   
            case '7':
                return uniqueColors.item6   
        }
    }

    return(
        <TouchableHighlight underlayColor={appColors.white3} key={item.id} style={[cardStyles.continer, stylesShadows.shadow1]} onPress={func}>
            <View style={cardStyles.containerHorizontal}>
                <View style={cardStyles.containerImage}>
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
                <View style={cardStyles.containerContent}>
                    <View style={[cardStyles.containerTitle, {borderBottomColor: getColor(item.type)}]}>
                        <View style={cardStyles.containerName}>
                            <Text style={cardStyles.textName}>{item.name.length > 35 ? item.name.slice(0,34) + '...' : item.name}</Text>
                        </View>
                        <View style={cardStyles.containerScore}>
                            <Icon name='star' size={Math.round(responsiveWidth(5))} color={getColor(item.type)}/>
                            <Text style={[cardStyles.textScore, {color: getColor(item.type)}]}>{item.reviewAverage}</Text>
                        </View>
                    </View>
                    <Text style={[cardStyles.textType, {color: getColor(item.type)}]}>{getNameType(item.type)}</Text>
                    <Text style={cardStyles.textAddress}>{item.address}</Text>
                </View>
            </View>
        </TouchableHighlight>
    )
}

const cardStyles = StyleSheet.create({
    continer: {
        width: '90%',
        height: '95%',
        position: 'absolute',
        alignSelf: 'center',
        overflow: 'hidden',
        borderRadius: 25,
        borderWidth: 1, 
        borderColor: appColors.white3,
        backgroundColor: appColors.white1,
    },
    containerHorizontal: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerImage: {
        height: '100%',
        width: '35%',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    containerImage2: {
        height: '80%', 
        width: '80%',
        borderRadius: 15,
        overflow: 'hidden',
    },
    containerContent: {
        height: '100%',
        width: '65%',
        justifyContent: 'center',
        paddingHorizontal: responsiveWidth(2),
        
    },
    containerTitle: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: responsiveHeight(1),
        paddingBottom: responsiveHeight(1),
        borderBottomWidth: 1.5
    },
    containerName: {
        width: '75%',
    },
    containerScore: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '25%',
    },





    textName: {
        fontSize: responsiveHeight(2.2), 
        color: appColors.word1,
        fontWeight: '700'
    },
    textScore:{
        fontSize: responsiveHeight(2.2), 
        fontWeight: 'bold'
    },
    textType: {
        fontSize: responsiveHeight(2.1), 
        fontWeight: '500',
        marginBottom: responsiveHeight(0.2),
    },
    textAddress: {
        fontSize: responsiveHeight(2), 
        color: appColors.word1,
    },
})