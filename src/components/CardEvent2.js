//Native imports
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image, TouchableHighlight } from 'react-native'

//External components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

//Styles
import { appColors, stylesShadows } from '../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

export const CardEvent2 = ({item, func}) => {
    const [ stateImage, setStateImage ] = useState({fail: false, loading: true})
    const [expired, setExpired] = useState(false)

    useEffect(() => {
        const executeEffect = async () => { 
            
            const [year, month, day] = item.date.split('T')[0].split('-')
            const hour = item.time.split(':')[0]
            const minutes = item.time.split(':')[1]

            const date = new Date(year, month-1, day, hour, minutes)
            const now = new Date()

            if(date.getTime() < now.getTime()) {
                setExpired(true)
            }else{
                setExpired(false)
            }
        }
        executeEffect()
    }, [item])
    
    return(
        <TouchableHighlight disabled={expired} underlayColor={appColors.white3} onPress={func} style={[event2Styles.continerCard, stylesShadows.shadow1]}>
            <View style={event2Styles.contentCard}>
                <View style={[event2Styles.containerOpacity, expired ? {} : {display:'none'}]} />
                <Text style={[event2Styles.textExpired, expired ? {} : {display:'none'}]}>Expirado</Text>

                <View style={event2Styles.section1}>
                    <Text style={event2Styles.textName}>{item.name.length > 40 ? item.name.slice(0,40) + '...' : item.name}</Text>
                    <Text style={event2Styles.textDate}>{item.date.split('T')[0]/* .replace(/[-]/g, '/') */}</Text>
                </View>

                <View style={event2Styles.section2}>
                    <View style={event2Styles.containerImage}>
                        <View style={[event2Styles.containerImage2, stylesShadows.shadow1]}>
                            <Image 
                                resizeMode='contain' 
                                style={[{height: '100%', width: '100%'}, expired ? {opacity: 0.6} : {}]}
                                onError={() => setStateImage({...stateImage,fail: true})}
                                onLoadEnd={() => setStateImage({...stateImage,loading: false})} 
                                source={(stateImage.fail || stateImage.loading || !item.image) ? require('../../public/imagenesGeneral/caminataimg.png') : {uri: item.image}}
                            />
                        </View>
                    </View>
                    <Text style={event2Styles.textDescription}>{item.description}</Text>
                </View>

                <View style={event2Styles.section3}>
                    <Text style={event2Styles.textUbication}>{item.address}</Text>
                    <Text style={event2Styles.textHour}>{item.time.split(':')[0] + ':' + item.time.split(':')[1]}</Text>
                </View>
            </View>
        </TouchableHighlight>
    )
}

const event2Styles = StyleSheet.create({
    continerCard: {
        width: '85%',
        height: responsiveHeight(23),
        alignSelf: 'center',
        
        borderRadius: 20,
        backgroundColor: appColors.white1,
        borderWidth: 0.5, borderColor: appColors.gray
    },
    contentCard: {
        width: '100%',
        height: '100%',
        paddingVertical: responsiveHeight(1),
        alignItems: 'center',
        justifyContent: 'center'
    },
    section1: {
        width: '100%',
        minHeight: '16%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(5),
    },
    section2: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(2),
    },
    section3: {
        width: '100%',
        minHeight: '16%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(6),
    },
    containerImage: {
        width: '35%',
        height: '95%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerImage2: {
        height: '90%', 
        width: '90%',
        backgroundColor: appColors.white2,
        borderWidth: 0.4, 
        borderColor: appColors.white5,
        borderRadius: 20,
        overflow: 'hidden',
    },
    containerOpacity: {
        height: '110%', 
        width: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(233, 238, 240, 0.5)',
        borderRadius: 20,
        zIndex: 1,
    },




    textName: {
        width: responsiveWidth(50),
        fontSize: responsiveHeight(2.2), 
        fontWeight: '700',
        color: appColors.word1,
    },
    textDate: {
        fontSize: responsiveHeight(2), 
        fontWeight: '700',
        color: appColors.primary,
    },
    textUbication: {
        width: responsiveWidth(55),
        fontSize: responsiveHeight(2), 
        fontWeight: '500',
        color: appColors.word1,
    },
    textHour: {
        fontSize: responsiveHeight(2), 
        fontWeight: '500',
        color: appColors.word1,
    },
    textDescription:{
        width: '65%',
        paddingLeft: responsiveWidth(2.5),
        fontSize: responsiveHeight(2), 
        color: appColors.word1,
    },
    textExpired:{
        position: 'absolute', 
        color: appColors.word4, 
        fontWeight: 'bold', 
        fontSize: responsiveHeight(4),
        transform: [{ rotate: '-20deg'}],
        zIndex: 2,
    }
})