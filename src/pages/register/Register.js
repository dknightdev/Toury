//Native imports
import React, { useCallback, useEffect, useState } from 'react'
import { View, Image, Text, TouchableHighlight, Platform, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from "react-native"

//External components
import Svg, { Path } from 'react-native-svg'
import { CheckBox, Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useBackHandler } from '@react-native-community/hooks'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'

//Components
import { ModalMessage } from '../../components/ModalMessage'

//Redux
import { useDispatch, useSelector } from 'react-redux'
import { stateLogged } from '../../redux/actions/loginAction'

//Styles
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import { appColors, stylesContainers, stylesInputs, stylesLabels, stylesShadows, uniqueColors } from "../../styles"

//Api
import { conexionPetitionSesion } from '../../services/apiConnection'

//Utils
import { patterDocument, patterEmail, patterPhone } from '../../utils/utilities'
import { secureStorage } from '../../utils/preferences'

//Firebsase
import { GoogleSignin } from '@react-native-google-signin/google-signin'

export const Register = (props) => {
    const dispatch = useDispatch()
    
    const [loading, setLoading] = useState(false)
    const [focus, setFocus] = useState({user: false, password: false, confirmPassword: false})
    const [dataModal, setDataModal] = useState({textMain: '', text: '', buttonText: '', visible: false})
    
    const [dataForm, setDataForm] = useState({document: '', email: '', phone: ''})
    const [validateForm, setValidateForm] = useState({document: {text: '', state: false}, email: {text: '', state: false}, phone: {text: '', state: false}, terms: {text: '', state: false}})

    useEffect(() => {
        if(props.route.params.dataEnv){
            setDataForm({...dataForm, phone: props.route.params.dataEnv.phone ?? '', email: props.route.params.dataEnv.email ?? ''})
        }
    }, [props.route.params])
    
    useBackHandler(useCallback(
        async () => {
            if(props.route.params.dataEnv){
                if(props.route.params.dataEnv.dataUid.type == 'go'){
                    await GoogleSignin.signOut()
                }
            }
            props.navigation.goBack()
        }, []
    ))

    const onChangeTextDocument = (value) => {
        setDataForm({...dataForm, document: value.trim()})
        setValidateForm({...validateForm, document: {text: '', estado: true}})
    }

    const onChangeTextEmail = (value) => {
        setDataForm({...dataForm, email: value.trim()})
        setValidateForm({...validateForm, email: {text: '', estado: true}})
    }

    const onChangeTextPhone = (value) => {
        setDataForm({...dataForm, phone: value.trim()})
        setValidateForm({...validateForm, phone: {text: '', estado: true}})
    }

    const submit = async () =>{
        const errorMessage = {document: '', email: '', phone: '', terms: ''}

        !dataForm.document ? errorMessage.document = 'Campo obligatorio' : !patterDocument.test(dataForm.document) ? errorMessage.document = 'Ingresa un documento valido' : {}
        !dataForm.email ? errorMessage.email = 'Campo obligatorio' : !patterEmail.test(dataForm.email) ? errorMessage.email = 'Ingresa un correo valido' : {}
        !dataForm.phone ? errorMessage.phone = 'Campo obligatorio' : !patterPhone.test(dataForm.phone) ? errorMessage.phone = 'Ingresa un teléfono valido' : {}

        if(!validateForm.terms.state){ errorMessage.terms = 'Es necesario aceptar los términos y condiciones' }
        
        setValidateForm({document: {text: errorMessage.document, state: false}, email: {text: errorMessage.email, state: false}, phone: {text: errorMessage.phone, state: false}, terms: {text: errorMessage.terms, state: validateForm.terms.state}})

        if(!(errorMessage.document || errorMessage.email || errorMessage.phone || errorMessage.terms)){
            setLoading(true)
            
            if(props.route.params.dataUser){
                const data = { dataUser: props.route.params.dataUser, dataForm}
            
                const resRegister = await conexionPetitionSesion(data, 'sesion/register')
                
                if(resRegister.status === 200) {
                    const data2 = {email: dataForm.email, password: props.route.params.dataUser.password}
                    const resLogin = await conexionPetitionSesion(data2, 'sesion/login')

                    if(resLogin.status === 200){
                        secureStorage.registerItem('token', resLogin.token)
                        dispatch(stateLogged(resLogin.token))
                    }else if(resLogin.status === 400){
                        setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: resLogin.message, visible: true})
                    }
                }else if(resRegister.status === 400){
                    setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: resRegister.message, visible: true})
                }
            }else {
                const data = {...dataForm, dataUid: props.route.params.dataEnv.dataUid, user: props.route.params.dataEnv.user }

                const resRegister = await conexionPetitionSesion(data, 'sesion/registerSocial')

                if(resRegister.status === 200) {
                    const data2 = {email: dataForm.email, dataUid: props.route.params.dataEnv.dataUid}
                    const resLogin = await conexionPetitionSesion(data2, 'sesion/loginSocial')

                    if(resLogin.status === 200){
                        secureStorage.registerItem('loginSocial', JSON.stringify(props.route.params.dataEnv.dataUid))
                        secureStorage.registerItem('token', resLogin.token)
                        dispatch(stateLogged(resLogin.token))
                    }else if(resLogin.status === 400){
                        setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: resLogin.message, visible: true})
                    }
                }else if(resRegister.status === 400){
                    setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: resRegister.message, visible: true})
                }
            }

            setLoading(false)
        }
    }

    const goBackAction = async () => {
        if(props.route.params.dataEnv){
            if(props.route.params.dataEnv.dataUid.type == 'go'){
                await GoogleSignin.signOut()
            }
        }
        props.navigation.goBack()
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
            <View style={[stylesContainers.containerPage, loginStyles.containerPage]}>
                {/* Fondo de la pagina */}
                <Svg width={responsiveWidth(100)} height={responsiveHeight(65)} style={{position: 'absolute', top: 0}} viewBox="0 0 411 508" xmlns="http://www.w3.org/2000/svg">
                    <Path d="M44.5687 -112.381C46.5017 -115.729 50.7828 -116.876 54.1308 -114.943L591.42 195.261C594.768 197.194 595.915 201.475 593.982 204.823L420.352 505.559C418.131 509.405 412.236 507.114 413.197 502.777V502.777C436.706 396.604 347.414 299.418 239.634 313.871L128.256 328.806V328.806C27.552 336.707 -70.7317 295.29 -135.409 217.698L-141.287 210.646C-141.516 210.372 -141.549 209.984 -141.371 209.675L44.5687 -112.381Z" fill={appColors.whitePrimaryBackground} fill-opacity="0.5"/>
                </Svg>
                
                <Svg width={responsiveWidth(100)} height={responsiveHeight(39)} style={{position: 'absolute', top: 0}} viewBox="0 0 411 277" xmlns="http://www.w3.org/2000/svg">
                    <Path d="M-120 -65C-120 -68.866 -116.866 -72 -113 -72H436C439.866 -72 443 -68.866 443 -65V235.068C443 238.99 437.491 239.858 436.285 236.126V236.126C406.994 145.474 297.095 110.709 220.997 168.023L140.082 228.966V228.966C66.0062 278.664 -27.2773 290.204 -111.23 260.057L-119.49 257.091C-119.796 256.981 -120 256.691 -120 256.365V-65Z" fill={appColors.primarySoftBackground}/>
                </Svg>

                <Svg width={responsiveWidth(100)} height="168" style={{position: 'absolute', bottom: 0}}  viewBox="0 0 411 168" xmlns="http://www.w3.org/2000/svg">
                    <Path d="M458.043 349.5C457.765 353.356 454.414 356.256 450.558 355.978L-97.022 316.52C-100.878 316.243 -103.779 312.891 -103.501 309.035L-81.9341 9.74318C-81.6523 5.83188 -76.0951 5.36212 -75.1607 9.17063C-52.4609 101.694 54.6555 144.268 134.676 92.5706L219.762 37.6008C297.218 -6.64413 391.09 -11.45 472.659 24.6533L480.684 28.2052C480.981 28.3368 481.164 28.6409 481.141 28.9653L458.043 349.5Z" fill={appColors.whitePrimaryBackground}/>
                </Svg>

                <TouchableOpacity activeOpacity={0.6} style={loginStyles.buttonReturn} onPress={() => goBackAction()}>
                    <Icon color={appColors.white1} size={Math.round(responsiveHeight(4.2))} name={'arrow-back'}/>
                </TouchableOpacity>

                <View style={[loginStyles.containerHeader]}>
                    <Text style={[loginStyles.textHeader]}>Registro</Text>
                </View>

                <View style={[loginStyles.containerForm]}>
                    <View style={loginStyles.containerTextForm}><Text style={[loginStyles.textPage1, {marginLeft: 0}]}>Crea tu cuenta</Text></View>
    
                    <View style={loginStyles.containerInputs}>
                        <Input
                            label="Documento"
                            labelStyle={stylesLabels.labelInputSesion}

                            placeholder="00000000"
                            placeholderTextColor={appColors.gray}
                            
                            inputContainerStyle={[stylesContainers.containerInputSesion2, focus.document ? {...stylesShadows.shadow2, ...stylesContainers.containerInputFocused} : {}]}
                            containerStyle={stylesContainers.containerInputSesion}
                            inputStyle={stylesInputs.inputSesion}
                            
                            selectionColor={appColors.primary}
                            onFocus={() => {setFocus({document: true, email: false, phone: false})}}
                            
                            onChangeText={value => {onChangeTextDocument(value)}}
                            value={dataForm.document}

                            renderErrorMessage={false}

                            rightIcon={<IconM size={responsiveHeight(3.8)} name="card-account-details" color={appColors.gray}/>}
                            rightIconContainerStyle={stylesContainers.containerInputRightIcon}
                        />
                        <Text style={[stylesLabels.labelError, validateForm.document.text == '' ? {display: 'none'} : {}]}>{validateForm.document.text}</Text>

                        <Input
                            label="Correo electrónico"
                            labelStyle={stylesLabels.labelInputSesion}

                            placeholder="ejemplo@correo.com"
                            placeholderTextColor={appColors.gray}
                            
                            inputContainerStyle={[stylesContainers.containerInputSesion2, focus.email ? {...stylesShadows.shadow2, ...stylesContainers.containerInputFocused} : {}]}
                            containerStyle={[stylesContainers.containerInputSesion, {marginTop: responsiveHeight(1.4)}]}
                            inputStyle={stylesInputs.inputSesion}

                            selectionColor={appColors.primary}
                            onFocus={() => {setFocus({document: false, email: true, phone: false})}}
                            
                            onChangeText={value => {onChangeTextEmail(value)}}
                            value={dataForm.email}
                            
                            renderErrorMessage={false}

                            rightIcon={<IconM size={responsiveHeight(3.8)} name="email" color={appColors.gray}/>}
                            rightIconContainerStyle={stylesContainers.containerInputRightIcon}
                        />
                        <Text style={[stylesLabels.labelError, validateForm.email.text == '' ? {display: 'none'} : {}]}>{validateForm.email.text}</Text>
                        
                        <Input
                            label="Teléfono"
                            labelStyle={stylesLabels.labelInputSesion}

                            placeholder="00000000"
                            placeholderTextColor={appColors.gray}
                            
                            inputContainerStyle={[stylesContainers.containerInputSesion2, focus.phone ? {...stylesShadows.shadow2, ...stylesContainers.containerInputFocused} : {}]}
                            containerStyle={[stylesContainers.containerInputSesion, {marginTop: responsiveHeight(1.4)}]}
                            inputStyle={stylesInputs.inputSesion}

                            selectionColor={appColors.primary}
                            onFocus={() => {setFocus({document: false, email: false, phone: true})}}
                            
                            onChangeText={value => {onChangeTextPhone(value)}}
                            value={dataForm.phone}
                            
                            renderErrorMessage={false}

                            rightIcon={<IconM size={responsiveHeight(3.8)} name="phone" color={appColors.gray}/>}
                            rightIconContainerStyle={stylesContainers.containerInputRightIcon}
                        />
                        <Text style={[stylesLabels.labelError, validateForm.phone.text == '' ? {display: 'none'} : {}]}>{validateForm.phone.text}</Text>
                    </View>
                    
                    <View style={loginStyles.containerFooterForm}>
                        <View style={loginStyles.containerCondiciones}>
                            <CheckBox
                                activeOpacity={0.7}
                                size={responsiveHeight(3.5)}
                                checkedColor={appColors.primary}
                                containerStyle={loginStyles.checkBox}
                                onPress={() => setValidateForm({...validateForm, terms: {text: '', state: !validateForm.terms.state}})}
                                checked={validateForm.terms.state}
                            />
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {Linking.openURL('https://tratamientodedatostoury.blogspot.com/2022/05/declaracion-de-privacidad-compartir-con.html')}}>
                                <Text style={[loginStyles.textPage3, {color: appColors.primary}]}>Acepto los términos y condiciones de utilización de toury</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={[stylesLabels.labelError, {alignSelf: 'center'}, validateForm.terms.text == '' ? {display: 'none'} : {}]}>{validateForm.terms.text}</Text>
                    </View>
                    
                </View>
                
                <View style={[loginStyles.containerButton]}>
                    <TouchableHighlight disabled={loading} underlayColor={appColors.primaryUnderlay} style={[loginStyles.buttonPrincipal, stylesShadows.shadow1, loading ? {backgroundColor: appColors.primaryDisabled} : {backgroundColor: appColors.primary}]} onPress={() => submit()}>
                        {loading ? <ActivityIndicator style={{position: 'absolute'}} size={responsiveHeight(3.3)} color={appColors.white1}/> : <Text style={loginStyles.textButtonPrincipal}>Registrar</Text>}
                    </TouchableHighlight>
                </View>
            </View>
        </>
    )
}


const loginStyles = StyleSheet.create({
    containerPage: {
        backgroundColor: appColors.white1,
        paddingHorizontal: responsiveWidth(7),
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerHeader:{
        width: '100%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerForm:{
        width: '100%',
        height: '65%',
    },
    containerTextForm: {
        height: '8%',
        width: '100%',
    },

    containerInputs: {
        width: '100%',
    },
    containerButton:{
        width: '100%',
        height: '15%',
        justifyContent: 'center',
        paddingBottom: responsiveHeight(1),
        alignItems: 'center',
    },
    containerFooterForm: {
        width: '100%',
        height: '25%',
        position: 'absolute',
        bottom: 0,
    },
    containerCondiciones:{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: responsiveHeight(1.5),
        marginTop: responsiveHeight(3),
    },


    buttonPrincipal: {
        height: responsiveHeight(7),
        width: '100%',
        borderRadius: 10,
        backgroundColor: appColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonReturn: {
        width: responsiveWidth(15),
        height: responsiveWidth(15),
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: responsiveHeight(0.4),
        left: responsiveHeight(0.4)
    },
    


    textHeader:{
        fontSize: responsiveHeight(5),
        fontWeight: 'bold',
        color: appColors.white1,
    },
    textPage1: {
        fontSize: responsiveHeight(2.6),
        fontWeight: '500',
        color: appColors.white1,
        marginHorizontal: responsiveWidth(2)
    },
    textPage3: {
        fontSize: responsiveHeight(2.2),
        fontWeight: '400',
        color: appColors.gray,
        textDecorationLine: 'underline',
        marginHorizontal: responsiveWidth(2),
        textAlign: 'center'
    },
    textButtonPrincipal: {
        color: appColors.white1, 
        fontSize: responsiveHeight(2.8),
        alignSelf: 'center', 
        fontWeight: '500', 
    },


    checkBox:{
        width: responsiveWidth(10),
        height: responsiveWidth(10),
        marginRight: 0,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
    },
})