//Native imports
import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native'

//External components
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'

//Components
import { Map } from '../../components/Map'

//Styles
import { appColors, stylesContainers, stylesInputs, stylesShadows, uniqueColors } from '../../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

export const Site = (props) => {
    const [data, setData] = useState({})
    const [ stateImage, setStateImage ] = useState({fail: false, loading: true})

    useEffect(() => {
        const executeEffect = async () => {
            if(props.route.params){
                setData(props.route.params.data)
            }
        }
        executeEffect()
    }, [props.route.params])

    const openWhatsApp = () => {
        Linking.openURL(`https://wa.me/+57${data.contact_wsp}?text=Hola buen dia, me gustaria obtener informacion acerca de tu establecimiento en Charalá`)
    }

    const openLlamadas = () => {
        Linking.openURL(`tel:${data.contact_phone}`)
    }

    const openInstagram = () => {
        Linking.openURL(`https://www.instagram.com/${data.contact_insta}`)
    }

    const openFacebook = () => {
        Linking.openURL(`fb://page/${data.contact_facebook}`)
    }

    return(
        <>
            {/* Pagina */}
            <View style={[stylesContainers.containerPage, siteStyles.containerPage]}>
                <TouchableOpacity activeOpacity={0.6} style={siteStyles.buttonReturn} onPress={() => props.navigation.navigate('BarNavigation')}>
                    <Icon color={appColors.word1} size={Math.round(responsiveHeight(4.2))} name={'arrow-back'}/>
                </TouchableOpacity>
                
                <ScrollView style={siteStyles.ScrollView}>
                    <View style={siteStyles.containerImage}>
                        <View style={[siteStyles.containerImage2, stylesShadows.shadow1]}>
                            <Image 
                                resizeMode='contain' 
                                style={{height: '100%', width: '100%'}}
                                onError={() => setStateImage({...stateImage,fail: true})}
                                onLoadEnd={() => setStateImage({...stateImage,loading: false})} 
                                source={(stateImage.fail || stateImage.loading || !data.image) ? require('../../../public/imagenesGeneral/caminataimg.png') : {uri: data.image}}
                            />
                        </View>
                    </View>
                    <View style={siteStyles.containerBody}>
                        <Text style={siteStyles.textName}>{data.name}</Text>
                        <Text style={siteStyles.textDesc}>
                            {data.description ? data.description : 'Empresa prestadora de servicios turisticos, con variedad de planes ofrece caminatas turisticas, deportes extremos gamplings etc.'} 
                        </Text>
                        <View style={siteStyles.containerReview}>
                            <Text style={siteStyles.textCal}>{data.reviewAverage}</Text>
                            <View style={siteStyles.containerCalI}>
                                <View style={siteStyles.containerStars}>
                                    {[0,0,0,0,0].map((el, index) => {
                                        return (
                                            <IconM 
                                                key={index}
                                                size={Math.round(responsiveWidth(5.5))} color={uniqueColors.item3}
                                                name={data.reviewAverage == 0 ? 'star-half-full' : data.reviewAverage/(index+1) >= 1 ? 'star' : 'star-half-full'} 
                                            />
                                        )
                                    })}
                                </View>
                                <Text style={siteStyles.textReviewCount}>{data.reviewQuantity} reseñas</Text>
                            </View>

                            <TouchableOpacity activeOpacity={0.6} onPress={() => {props.navigation.navigate('Review', {siteId: data.id})}} style={[siteStyles.containerIconReview, stylesShadows.shadow1]}>
                                <IconM name='text-box-plus' size={Math.round(responsiveWidth(8))} color={appColors.word1}/>
                            </TouchableOpacity>
                        </View>               
                    </View>
                    <View style={siteStyles.line}/>
                    <View style={siteStyles.containerMap}>
                        <Text style={siteStyles.text1}>Mapa</Text>
                        <Map name={data.name} coordinates={data.coordinates} dim={{width: '100%', height: responsiveHeight(35.5)}}/>
                    </View>
                    <View style={siteStyles.line}/>
                    <View style={siteStyles.containerContact}>
                        <Text style={siteStyles.text1}>Contacto</Text>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => openWhatsApp()} style={[siteStyles.buttonContact, stylesShadows.shadow1, !data.contact_wsp ? {display: 'none'} : {}]}>
                            <View style={siteStyles.contentButtonContact}>
                                <View style={[siteStyles.containerIconContact, stylesShadows.shadow2]}><IconM name='whatsapp' size={Math.round(responsiveWidth(8))} color={appColors.primary}/></View>
                                <Text style={siteStyles.textButtonContact}>{data.contact_wsp}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => openLlamadas()} style={[siteStyles.buttonContact, stylesShadows.shadow1, !data.contact_phone ? {display: 'none'} : {}]}>
                            <View style={siteStyles.contentButtonContact}>
                                <View style={[siteStyles.containerIconContact, stylesShadows.shadow2]}><IconM name='phone' size={Math.round(responsiveWidth(7.5))} color={appColors.primary}/></View>
                                <Text style={siteStyles.textButtonContact}>{data.contact_phone}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => openInstagram()} style={[siteStyles.buttonContact, stylesShadows.shadow1, !data.contact_insta ? {display: 'none'} : {}]}>
                            <View style={siteStyles.contentButtonContact}>
                                <View style={[siteStyles.containerIconContact, stylesShadows.shadow2]}><IconM name='instagram' size={Math.round(responsiveWidth(7.8))} color={appColors.primary}/></View>
                                <Text style={siteStyles.textButtonContact}>@{data.contact_insta}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => openFacebook()} style={[siteStyles.buttonContact, stylesShadows.shadow1, {marginBottom: responsiveHeight(2)}, !data.contact_facebook ? {display: 'none'} : {}]}>
                            <View style={siteStyles.contentButtonContact}>
                                <View style={[siteStyles.containerIconContact, stylesShadows.shadow2]}><IconM name='facebook' size={Math.round(responsiveWidth(8.5))} color={appColors.primary}/></View>
                                <Text style={siteStyles.textButtonContact}>@{data.contact_facebook_show}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

const siteStyles = StyleSheet.create({
    containerPage: {
        backgroundColor: appColors.white1,
    },
    ScrollView: {
        width: '100%',
        height: '100%',
        marginTop: responsiveHeight(7),
    },
    containerImage: {
        width: '100%',
        height: responsiveHeight(30),
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
    containerBody: {
        width: '100%',
        paddingHorizontal: responsiveWidth(6),
    },
    containerMap: {
        width: '100%',
        height: responsiveHeight(40),
        paddingHorizontal: responsiveWidth(6),
        marginBottom: responsiveHeight(3),
    },
    containerContact: {
        width: '100%',
        paddingHorizontal: responsiveWidth(6),
    },
    containerReview: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: responsiveWidth(5),
        alignItems: 'center'
    },
    containerCalI: {
        width: responsiveWidth(30),
        marginLeft: responsiveWidth(3),
        marginRight: responsiveWidth(2)
    },
    containerStars: {
        width: '100%',
        flexDirection: 'row'
    },
    containerIconReview: {
        height: responsiveWidth(14),
        width: responsiveWidth(14),
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.3,
        borderColor: appColors.white3,
        backgroundColor: appColors.white1
    },
    containerIconContact: {
        height: '80%',
        width: '15%',
        marginLeft: responsiveWidth(2),
        marginRight: responsiveWidth(1),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: appColors.white3,
    },
    contentButtonContact:{
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },

    buttonContact: {
        height: responsiveHeight(9),
        width: '100%',
        marginBottom: responsiveHeight(1.5),
        borderRadius: 15,
        borderWidth: 0.3,
        borderColor: appColors.white4,
        backgroundColor: appColors.white1
    },

    buttonReturn: {
        width: responsiveWidth(15),
        height: responsiveWidth(15),
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: responsiveHeight(0.4),
        left: responsiveHeight(0.4),
        zIndex: 1
    },




    textName: {
        fontSize: responsiveHeight(2.8), 
        color: appColors.word1,
        fontWeight: '800',
        marginTop: responsiveHeight(1),
    },
    textDesc: {
        fontSize: responsiveHeight(2), 
        color: appColors.word1,
        fontWeight: '500',
        textAlign: 'justify',
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(2.5),
    },
    textCal: {
        fontSize: responsiveHeight(3.8), 
        color: appColors.word1,
        fontWeight: '700',
    },
    textReviewCount: {
        marginLeft: responsiveWidth(1),
        fontSize: responsiveHeight(2), 
        color: appColors.word1,
        fontWeight: '500',
    },
    text1: {
        fontSize: responsiveHeight(2.5), 
        color: appColors.word1,
        fontWeight: '500',
        marginLeft: responsiveWidth(1),
        marginBottom: responsiveHeight(1),
    },
    textButtonContact:{
        maxWidth: '80%',
        fontSize: responsiveHeight(2.35), 
        color: appColors.word1,
        fontWeight: '500',
        marginLeft: responsiveWidth(2),
    },


    line: {
        width: '90%',
        alignSelf: 'center',
        marginTop: responsiveHeight(2.3),
        marginBottom: responsiveHeight(3),
        borderColor: appColors.gray1,
        borderBottomWidth: 0.5,
    }
})