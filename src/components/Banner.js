//Native imports
import React, { useState } from 'react'
import {StyleSheet, Image, TouchableOpacity, View, Text} from 'react-native'

//External components
import Swiper from 'react-native-swiper'

//Styles
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { appColors } from '../styles'

export const Banner = ({data, func}) => {

    const [ stateImage, setStateImage ] = useState({fail: false, loading: true})

    return (
        (<Swiper 
            autoplay={true}
            autoplayTimeout={6} 
            showsButtons={true} 
            showsPagination={true} 
            dotColor={appColors.gray1}
            dotStyle={styles.dotPagination}
            containerStyle={styles.container} 
            activeDotColor={appColors.white3} 
            paginationStyle={styles.pagination} 
            activeDotStyle={styles.dotPagination}
            nextButton={<Text style={styles.buttonLeft}>{'›'}</Text>}
            prevButton={<Text style={styles.buttonRight}>{'‹'}</Text>}
        >
            {data.map((site)=>{
                return (
                    <TouchableOpacity key={site.id} style={styles.banner} activeOpacity={0.7} onPress={() => {func(site)}}>
                        <Image
                            resizeMode="cover" 
                            style={styles.imageBanner} 
                            onError={() => setStateImage({...stateImage,fail: true})}
                            onLoadEnd={() => setStateImage({...stateImage,loading: false})} 
                            source={(stateImage.fail || stateImage.loading || !site.image) ? require('../../public/imagenesGeneral/caminataimg.png') : {uri: site.image}}
                        />
                        <View style={styles.containerName}><Text style={styles.textName}>{site.name}</Text></View>
                    </TouchableOpacity>
                )
            })}
        </Swiper>)
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    containerName: {
        position: 'absolute',
        width: '100%',
        height: '25%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: responsiveHeight(0.15),
        bottom: 0,
        paddingHorizontal: responsiveWidth(3),
        textAlign: 'center',
        backgroundColor: appColors.primarySoft,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25, 
    },
    imageBanner: {
        height:'100%', 
        width:'100%', 
        borderRadius: 25,
        overflow:'hidden'
    },
    banner:{
        height: responsiveHeight(20),
        width:'90%', 
        borderRadius:25, 
        position: 'absolute',
        bottom: responsiveHeight(1),
        alignSelf:'center', 
        zIndex:1,
    },
    pagination: {
        position: 'absolute',
        bottom: responsiveWidth(2.5),
    },
    dotPagination: {
        width: responsiveWidth(1.5),
        height: responsiveWidth(1.5),
    },
    textName: {
        fontSize: responsiveHeight(1.9),
        marginTop: responsiveWidth(0.2),
        fontWeight: '500',
        color: appColors.white1,
        textAlign: 'center',
    },
    buttonLeft: {
        width: responsiveWidth(20),
        fontSize: responsiveHeight(8),
        left: responsiveWidth(3),
        bottom: responsiveHeight(2),
        textAlign: 'center',
        color: appColors.primarySoft,
    },
    buttonRight: {
        width: responsiveWidth(20),
        fontSize: responsiveHeight(8),
        right: responsiveWidth(3),
        bottom: responsiveHeight(2),
        textAlign: 'center',
        color: appColors.primarySoft,
    }
})
