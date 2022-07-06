//Native imports
import React, { useCallback, useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, Linking, RefreshControl, ActivityIndicator, TouchableHighlight } from 'react-native'

//External components
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'

//Components
import { ModalMessage } from '../../components/ModalMessage'

//redux
import { useSelector } from 'react-redux'

//Styles
import { appColors, stylesContainers, stylesInputs, stylesShadows, uniqueColors } from '../../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

//Api
import { conexionPetitionGeneral } from '../../services/apiConnection'

export const Event = (props) => {

    //Variables
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const { dataUser } = useSelector(state => state.generalReducer)
    const [ stateImage, setStateImage ] = useState({fail: false, loading: true})
    const [dataModal, setDataModal] = useState({textMain: '', text: '', buttonText: '', visible: false, success: false})

    useEffect(() => {
        const executeEffect = async () => {
            if(props.route.params){
                setData(props.route.params.data)
            }
        }
        executeEffect()
    }, [props.route.params])

    const openLlamadas = () => {
        Linking.openURL(`tel:${data.phone}`)
    }

    const asistEvent = async () => {
        setLoading(true)
        const res = await conexionPetitionGeneral({user: dataUser.document, event: data.event_id}, 'asistEvent')

        if(res.status === 200){
            setDataModal({textMain: '¡Genial!', buttonText: 'Aceptar', text: res.message, visible: true, success: true})
        }else if(res.status === 400){
            setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: res.message, visible: true, success: false})
        }
        
        setLoading(false)
    }

    const onPressButtonModal = () => {
        setDataModal({text: '', textMain: '', buttonText: '', visible: false})
        props.navigation.navigate('Home', {refresh: true})
    }

    return(
        <>
            {/* Modales */}
            <ModalMessage 
                text={dataModal.text}
                textMain={dataModal.textMain}
                buttonText={dataModal.buttonText}
                visible={dataModal.visible}
                success={dataModal.success}
                toggleOverlay={() => onPressButtonModal()}
            />

            {/* Pagina */}
            <View style={[stylesContainers.containerPage, eventStyles.containerPage]}>
                <TouchableOpacity activeOpacity={0.6} style={eventStyles.buttonReturn} onPress={() => props.navigation.navigate('BarNavigation')}>
                    <Icon color={appColors.word1} size={Math.round(responsiveHeight(4.2))} name='arrow-back'/>
                </TouchableOpacity>

                <View style={eventStyles.containerImage}>
                    <View style={[eventStyles.containerImage2, stylesShadows.shadow1]}>
                        <Image 
                            resizeMode='contain' 
                            style={{height: '100%', width: '100%'}}
                            onError={() => setStateImage({...stateImage,fail: true})}
                            onLoadEnd={() => setStateImage({...stateImage,loading: false})} 
                            source={(stateImage.fail || stateImage.loading || !data.image) ? require('../../../public/imagenesGeneral/caminataimg.png') : {uri: data.image}}
                        />
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={[eventStyles.buttonNew, stylesShadows.shadow2]} onPress={() => {props.navigation.navigate('EventAdd')}}>
                        <IconM color={appColors.white2} size={Math.round(responsiveHeight(5))} name='plus'/>
                    </TouchableOpacity>
                </View>
                <View style={[eventStyles.containerBody, stylesShadows.shadow1]}>
                    <ScrollView style={eventStyles.ScrollView} showsVerticalScrollIndicator={true} contentContainerStyle={{paddingBottom: responsiveHeight(4)}}>
                        <View style={[eventStyles.containerHeaderSection, {height: responsiveHeight(6)}]}>
                            <IconM color={appColors.primary} size={Math.round(responsiveHeight(3.4))} name='calendar-heart'/>
                            <Text style={[eventStyles.textHeader, {fontWeight: '700', fontSize: responsiveHeight(2.3)}]}>{data.name}</Text>
                        </View>

                        <View style={eventStyles.containerTag}>
                            <View style={[eventStyles.containerIcon, stylesShadows.shadow2]}>
                                <IconM color={appColors.primary} size={Math.round(responsiveHeight(4))} name='calendar'/>
                            </View>
                            <View style={eventStyles.containerContentTag}>
                                <Text style={eventStyles.text1}>{data?.date?.split('T')[0]}</Text>
                                <Text style={eventStyles.text2}>{data?.time?.slice(0,5)}</Text>
                            </View>
                        </View>
                        <View style={eventStyles.containerTag}>
                            <View style={[eventStyles.containerIcon, stylesShadows.shadow2]}>
                                <Icon color={appColors.primary} size={Math.round(responsiveHeight(4))} name='location-pin'/>
                            </View>
                            <View style={eventStyles.containerContentTag}>
                                <Text style={eventStyles.text1}>{data.address}</Text>
                            </View>
                        </View>

                        <View style={eventStyles.containerHeaderSection}>
                            <IconM color={appColors.primary} size={Math.round(responsiveHeight(3.4))} name='text'/>
                            <Text style={eventStyles.textHeader}>Descripción</Text>
                        </View>
                        <Text style={eventStyles.textDescription}>{data.description}</Text>

                        <View style={[eventStyles.containerHeaderSection, {marginTop: responsiveHeight(4)}]}>
                            <IconM color={appColors.primary} size={Math.round(responsiveHeight(3.4))} name='account'/>
                            <Text style={eventStyles.textHeader}>Organizador</Text>
                        </View>
                        <View style={eventStyles.containerTag}>
                            <View style={[eventStyles.containerIcon, stylesShadows.shadow2]}>
                                <IconM color={appColors.primary} size={Math.round(responsiveHeight(4))} name='account-circle'/>
                            </View>
                            <View style={eventStyles.containerContentTag}>
                                <Text style={eventStyles.text1}>{data.user_id == dataUser.document ? 'Tú' : data.user_name }</Text>
                            </View>
                        </View>
                        <View style={[eventStyles.containerTag, {marginVertical: 0}]}>
                            <View style={[eventStyles.containerIcon, stylesShadows.shadow2]}>
                                <IconM color={appColors.primary} size={Math.round(responsiveHeight(3.8))} name='phone'/>
                            </View>
                            <View style={eventStyles.containerContentTag}>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => openLlamadas()} style={[eventStyles.buttonContact, stylesShadows.shadow2, !data.phone ? {display: 'none'} : {}]}>
                                    <Text style={eventStyles.text1}>{data.phone}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[eventStyles.containerHeaderSection, {marginTop: responsiveHeight(4)}]}>
                            <Icon color={appColors.primary} size={Math.round(responsiveHeight(3.4))} name='people'/>
                            <Text style={eventStyles.textHeader}>Participantes</Text>
                        </View>
                        <Text style={eventStyles.textAmountPeople}>{data.amount}</Text>
                    </ScrollView>
                </View>
                <View style={eventStyles.containerButton}>
                    <TouchableHighlight disabled={loading || data.asist == 1 || data.user_id == dataUser.document} underlayColor={appColors.primaryUnderlay} style={[eventStyles.buttonPrincipal, stylesShadows.shadow2, loading || data.asist == 1 || data.user_id == dataUser.document ? {backgroundColor: appColors.primaryDisabled} : {backgroundColor: appColors.primary}]} onPress={() => asistEvent()}>
                        {loading ? 
                            <ActivityIndicator style={{position: 'absolute'}} size={responsiveHeight(3.3)} color={appColors.white1}/> : 
                            <Text style={eventStyles.textButtonPrincipal}>{data.asist == 1 || data.user_id == dataUser.document ? 'Asistente' : 'Asistir'}</Text>}
                    </TouchableHighlight>
                </View>
            </View>
        </>
    )
}

const eventStyles = StyleSheet.create({
    containerPage: {
        backgroundColor: appColors.white4,
    },
    containerImage: {
        width: '100%',
        height: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },  
    containerImage2: {
        height: '100%', 
        width: '100%',
        backgroundColor: appColors.white2,
        borderWidth: 0.4, 
        borderColor: appColors.gray1,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        overflow: 'hidden',
    },
    containerBody: {
        width: '100%',
        height: '60%',
        paddingBottom: responsiveHeight(2.5),
        paddingTop: responsiveHeight(3.5),
        paddingHorizontal: responsiveWidth(6),
        borderTopLeftRadius: 50, 
        borderTopRightRadius: 50,
        backgroundColor: appColors.white2,
    },
    containerTag: {
        width: '100%',
        height: responsiveHeight(8),
        paddingHorizontal: responsiveWidth(7),
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: responsiveHeight(1.2),
        // borderWidth: 0.5, borderColor: appColors.gray,
    },
    containerContentTag: {
        height: '100%',
        justifyContent: 'center'
    },
    containerIcon:  {
        width: responsiveWidth(12),
        height: responsiveWidth(12),
        marginRight: responsiveWidth(5),
        marginLeft: responsiveWidth(2),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: appColors.white3,
    },
    containerHeaderSection: {
        width: '100%',
        height: responsiveHeight(5),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveHeight(1.5),
        marginTop: responsiveHeight(2.5),
        paddingHorizontal: responsiveWidth(2),
        borderWidth: 0.4, 
        borderColor: appColors.gray1,
        borderRadius: 10,
        backgroundColor: appColors.white3,
    },
    containerButton: {
        width: '100%',
        height: '10%',
        paddingHorizontal: responsiveWidth(8),
        justifyContent: 'flex-start',
        backgroundColor: appColors.white2,
    },
    ScrollView: {
        width: '100%',
        borderBottomColor: appColors.gray,
        borderBottomWidth: 0.5,
    },

    buttonReturn: {
        width: responsiveWidth(15),
        height: responsiveWidth(15),
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: responsiveHeight(0.4),
        left: responsiveHeight(0.4),
        zIndex: 2
    },
    buttonNew: {
        width: responsiveWidth(17),
        height: responsiveWidth(17),
        position: 'absolute',
        bottom: -responsiveHeight(4),
        right: responsiveWidth(4),
        borderRadius: 50,
        backgroundColor: appColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
    },
    buttonPrincipal: {
        height: responsiveHeight(6.5),
        width: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },


    buttonContact: {
        height: '70%',
        width: responsiveWidth(50),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: appColors.whitePrimaryBackground,
        backgroundColor: appColors.white2
    },



    textHeader:{
        fontSize: responsiveHeight(2.2),
        fontWeight: '600',
        color: appColors.word1,
        marginLeft: responsiveWidth(2.5)
    },
    text1: {
        fontSize: responsiveHeight(2.1), 
        fontWeight: '500',
        color: appColors.word1
    },
    text2: {
        fontSize: responsiveHeight(2.1), 
        color: appColors.word1
    },
    textDescription: {
        fontSize: responsiveHeight(2.2), 
        color: appColors.word1,
        marginHorizontal: responsiveWidth(5)
    },
    textButtonPrincipal: {
        color: appColors.white1, 
        fontSize: responsiveHeight(2.6),
        alignSelf: 'center', 
        fontWeight: '500', 
    },
    textAmountPeople: {
        color: appColors.primary, 
        fontSize: responsiveHeight(4),
        alignSelf: 'center', 
        fontWeight: '500', 
    }
})