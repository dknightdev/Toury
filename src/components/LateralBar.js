//Native imports
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native'

//External components
import { DrawerContentScrollView } from '@react-navigation/drawer'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/MaterialIcons'

//Components
import { ModalMessage } from '../components/ModalMessage'

//Styles
import { appColors } from '../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

//Redux
import { useDispatch, useSelector } from "react-redux"
import { stateLogged } from '../redux/actions/loginAction'

//Utils
import { secureStorage } from '../utils/preferences'

//Api
import { conexionPetitionGeneral } from '../services/apiConnection'

//Firebase Login
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const LateralBar = (props) => {
    //Variables
    const dispatch = useDispatch()
    const { dataUser } = useSelector(state => state.generalReducer)

    const [dataModal, setDataModal] = useState({textMain: '', text: '', buttonText: '', visible: false})

    const logOut = async () => {
        const res = await conexionPetitionGeneral({}, 'logOut')
        
        if(res.status === 200){
            let loginSocial = await secureStorage.getItem('loginSocial')
            
            if(loginSocial){
                if(loginSocial.length != 0){
                    loginSocial = JSON.parse(loginSocial)
                    
                    try{
                        auth()
                        .signOut()
                        .then( () => {console.log('User sing out!')})
                        
                        if(loginSocial.type == 'go'){
                            await GoogleSignin.signOut()
                        }
                    }catch(e){
                        console.log(e)
                    }
                }
            }
            
            props.navigation.closeDrawer()
            await secureStorage.removeItem('loginSocial')
            await secureStorage.removeItem('token')
            dispatch(stateLogged(null))
        }else if(res.status === 400){
            props.navigation.closeDrawer()
            setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: res.message, visible: true})
        }
    }

    return(
        <>
            {/* Modales */}
            <ModalMessage 
                text={dataModal.text}
                textMain={dataModal.textMain}
                buttonText={dataModal.buttonText}
                visible={dataModal.visible}
                toggleOverlay={() => setDataModal({text: '', textMain: '', buttonText: '', visible: false})}
            />

            {/* Pagina */}
            <DrawerContentScrollView scrollEnabled={false} contentContainerStyle={lateralBarStyles.drawerScrollView} style={lateralBarStyles.contentDrawerScrollView} {...props}>
                <View style={lateralBarStyles.containerLogo}>
                    <Image
                        resizeMode='contain' 
                        source={require('../../public/imagenesGeneral/logoToury.png')}
                        style={{height: '100%', width: '100%', position: 'absolute'}}
                    />
                </View>
                <View style={lateralBarStyles.containerHeader}>
                    <View style={lateralBarStyles.containerAvatar}>
                        <View style={lateralBarStyles.containerAvatar2}>
                            <Image
                                resizeMode='contain' 
                                source={require('../../public/user_images/imagen_user_0.png')}
                                style={{height: '100%', width: '100%'}}
                            />
                        </View>
                    </View>
                    <View style={lateralBarStyles.containerName}>
                        <Text style={lateralBarStyles.textName}>{dataUser?.user_name}</Text>
                    </View>
                </View>
                <View style={lateralBarStyles.line}/>
                <View style={lateralBarStyles.containerBody}>
                    <TouchableHighlight underlayColor={appColors.primaryUnderlay} style={lateralBarStyles.buttonDrawer} onPress={() => {props.navigation.reset({index: 0, routes: [{ name: 'BarNavigation' }]})}}>
                        <View style={lateralBarStyles.contentButtonDrawer}>
                            <IconM name="home" size={responsiveWidth(7)} color={appColors.white1}/>
                            <Text style={lateralBarStyles.textButton}>Inicio</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={appColors.primaryUnderlay} style={lateralBarStyles.buttonDrawer} onPress={() => {props.navigation.closeDrawer(), props.navigation.navigate('BarNavigation'), props.navigation.jumpTo('Search')}}>
                        <View style={lateralBarStyles.contentButtonDrawer}>
                            <IconM name="map-search" size={responsiveWidth(7)} color={appColors.white1}/>
                            <Text style={lateralBarStyles.textButton}>Buscar</Text>  
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={appColors.primaryUnderlay} style={lateralBarStyles.buttonDrawer} onPress={() => {props.navigation.closeDrawer(), props.navigation.navigate('EventList')}}>
                        <View style={lateralBarStyles.contentButtonDrawer}>
                            <Icon name="event" size={responsiveWidth(7)} color={appColors.white1}/>
                            <Text style={lateralBarStyles.textButton}>Eventos</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={appColors.primarySoft} style={[lateralBarStyles.buttonDrawer, {marginTop: responsiveHeight(10)}]} onPress={() => logOut()}>
                        <View style={lateralBarStyles.contentButtonDrawerCustom}>
                            <IconM name="power" size={responsiveWidth(7)} color={appColors.white1}/>
                            <Text style={lateralBarStyles.textButton}>Cerrar Sesión</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </DrawerContentScrollView>
        </>
    )
}

const lateralBarStyles = StyleSheet.create({
    drawerScrollView: {
        width: '100%',
        height: '100%',
    },
    contentDrawerScrollView: {
        width: '100%',
        height: '100%',
        paddingHorizontal: responsiveWidth(3),
        backgroundColor: appColors.primary,
        borderTopRightRadius: 25, 
        borderBottomRightRadius: 25,
    },
    containerLogo: {
        width: '100%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    containerHeader: {
        width: '100%',
        height: '30%',
        justifyContent: 'center',
        
    }, 
    containerBody: {
        width: '100%',
        height: '50%',
        paddingTop: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(3),
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
    },
    containerAvatar: {
        height: '65%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    containerAvatar2: {
        height: responsiveWidth(22), 
        width: responsiveWidth(22), 
        borderRadius: 100,
        overflow: 'hidden',
    },
    containerName: {
        height: '35%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        
    },


    buttonDrawer: {
        width: '100%',
        height: responsiveHeight(8),
        marginVertical: responsiveHeight(0.5),
        borderRadius: 20
    },
    contentButtonDrawer: {
        width: '100%',
        height: '100%',
        paddingLeft: responsiveWidth(8),
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentButtonDrawerCustom: {
        width: '100%',
        height: '100%',
        paddingLeft: responsiveWidth(8),
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1, borderColor: appColors.white2
    },

    line: {
        width: '90%',
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderColor: appColors.white1
    },


    textName: {
        fontSize: responsiveHeight(3),
        fontWeight: '500', 
        color: appColors.white1,
    },
    textButton: {
        fontSize: responsiveHeight(2.4),
        color: appColors.white1,
        marginLeft: responsiveWidth(6),
    },
})