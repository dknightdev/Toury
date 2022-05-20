//Native imports
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native'

//External components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

//Styles
import { appColors, stylesShadows } from '../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

//Api
import { conexionPetitionGeneral } from '../services/apiConnection'

export const Weather = ({item, size, func}) => {

    const [dataWheater, setDataWheater] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const executeEffect = async () => {
            setLoading(true)
            const res = await conexionPetitionGeneral({lat: '6.817', lon: '-73.267'}, 'getWeather')
            setDataWheater(res)
            setLoading(false)
        }
        executeEffect()
    }, [])

    if(loading){
        return(<ActivityIndicator style={weatherStyles.activityIndicator} size={responsiveHeight(5)} color={appColors.primarySoft}/>)
    }else{
        return(
            <View style={weatherStyles.container}> 
                <Text style={weatherStyles.textDesc}>{'Clima actual \n  en Charalá'}</Text>
                <View style={[weatherStyles.containerCard, stylesShadows.shadow1]}>
                    <View style={weatherStyles.containerText}>
                        <Text style={weatherStyles.textTemp}>{dataWheater.data.main.temp} <Text style={{fontSize: responsiveHeight(3)}}>C°</Text></Text>
                        <Text style={weatherStyles.textState}>{dataWheater.data.weather[0].description}</Text>
                    </View>
                    <View style={weatherStyles.containerImage}>
                        <Image
                            resizeMode="contain" 
                            style={{width: responsiveWidth(20), height: responsiveWidth(20), position: 'absolute', right: 0}} 
                            source={{uri: `http://openweathermap.org/img/wn/${dataWheater.data.weather[0].icon}@2x.png`}}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const weatherStyles = StyleSheet.create({
    container: {
        height: '100%', 
        alignItems: 'center',
        flexDirection: 'row',
    },
    containerCard: {
        width: '50%',
        height: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: appColors.primarySoft,
    },
    containerText: {
        height: '100%',
        width: '70%',
        justifyContent: 'center',
    },
    containerImage: {
        height: '100%',
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityIndicator: {
        position: 'absolute',
        alignSelf: 'center'
    },
    textState: {
        fontSize: responsiveHeight(2),
        fontWeight: '500',
        alignSelf: 'center',
        marginHorizontal: responsiveWidth(3),
        color: appColors.white1,
    },
    textTemp: {
        fontSize: responsiveHeight(2.6),
        fontWeight: '500',
        alignSelf: 'center',
        color: appColors.white1,
    },
    textDesc: {
        fontSize: responsiveHeight(2.2),
        fontWeight: '600',
        marginRight: responsiveWidth(3.5),
        color: appColors.word1,
    }
})