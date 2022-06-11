//Native imports
import React, { useState } from 'react'
import { View, Image, Text, TouchableHighlight, Platform, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"

//External components
import { Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Svg, { Path } from 'react-native-svg'

//Components
import { ModalMessage } from '../../components/ModalMessage'

//Redux
import { useDispatch, useSelector } from 'react-redux'
import { stateLogged } from '../../redux/actions/loginAction'

//Styles
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import { appColors, stylesContainers, stylesInputs, stylesLabels, stylesShadows, uniqueColors } from "../../styles"

//Utils
import { patterEmail } from '../../utils/utilities'
import { secureStorage } from '../../utils/preferences'

//Api
import { conexionPetitionSesion } from '../../services/apiConnection'

//Firebsase
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

GoogleSignin.configure({
  webClientId: '418977230943-m00hkemhmtuhliuq9r0hjojijoqamli1.apps.googleusercontent.com',
});

export const Login = ({navigation}) => {
    const dispatch = useDispatch()

    //Variables
    const [loading, setLoading] = useState(false)
    const [focus, setFocus] = useState({email: false, password: false})
    const [dataModal, setDataModal] = useState({textMain: '', text: '', buttonText: '', visible: false})
    
    const [showPassword, setShowPassword] = useState(true)
    const [dataForm, setDataForm] = useState({email: '', password: ''})
    const [validateForm, setValidateForm] = useState({email: {text: '', state: false}, password: {text: '', state: false}})

    //Metodos
    const onChangeTextEmail = (value) => {
        setDataForm({...dataForm, email: value.trim()})
        setValidateForm({...validateForm, email: {text: '', estado: true}})
    }

    const onChangeTextPassword = (value) => {
        setDataForm({...dataForm, password: value})
        setValidateForm({...validateForm, password: {text: '', estado: true}})
    }

    const submit = async () =>{
        const errorMessage = {email: '', password: ''}

        !dataForm.email ? errorMessage.email = 'Campo obligatorio' : !patterEmail.test(dataForm.email) ? errorMessage.email = 'Ingresa un correo valido' : {}
        if(!dataForm.password){ errorMessage.password = 'Campo obligatorio' }
        
        setValidateForm({email: {text: errorMessage.email, state: false}, password: {text: errorMessage.password, state: false}})


        if(!(errorMessage.email || errorMessage.password)){
            setLoading(true)
            const res = await conexionPetitionSesion(dataForm, 'sesion/login')

            if(res.status === 200){
                secureStorage.registerItem('token', res.token)
                dispatch(stateLogged(res.token))
            }else if(res.status === 400){
                setDataModal({textMain: 'Inténtalo de nuevo', buttonText: 'Continuar', text: res.message, visible: true})
            }

            setLoading(false)
        }
    }

    const loginSocial = async (email, dataUid) => {
        setLoading(true)
        const res = await conexionPetitionSesion({email, dataUid: dataUid}, 'sesion/loginSocial')

        if(res.status === 200){
            secureStorage.registerItem('loginSocial', JSON.stringify(dataUid))
            secureStorage.registerItem('token', res.token)
            dispatch(stateLogged(res.token))
        }else if(res.status === 400){
            setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: res.message, visible: true})
        }

        setLoading(false)
    }

    const loginWithGoogle = async () => {
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();
      
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
        // Sign-in the user with the credential
        auth().signInWithCredential(googleCredential).then(async (data) => {
            const { user } = data

            const res = await conexionPetitionSesion({uid: user.uid, type: 'go'}, 'sesion/verifyUid')
            
            if(res.data){
                loginSocial(res.data.email, {uid: user.uid, type: 'go'})
            }else {
                const dataEnv = {
                    user: user.displayName.split(" ").map(word => word.replace(/[A-Za-z]/g, (char, index) => index === 0 ? char.toUpperCase() : char.toLowerCase())
                    ) .join(''),
                    phone: user.phoneNumber,
                    email: user.email,
                    dataUid: {uid: user.uid, type: 'go'}
                }

                navigation.navigate('Register', {dataEnv})
            }

        }).catch(e => {
            setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: 'Ha ocurrido un error, por favor vuelve a intentarlo mas tarde', visible: true})
            console.log(e)
        })
    }

    const loginWithFacebook = async () => {
        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
        if (result.isCancelled) { throw 'User cancelled the login process' }
      
        // Once signed in, get the users AccesToken
        const data = await AccessToken.getCurrentAccessToken();
      
        if (!data) { throw 'Something went wrong obtaining access token' }
      
        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      
        // Sign-in the user with the credential
        auth().signInWithCredential(facebookCredential).then(async (data) => {
            const { user } = data

            const res = await conexionPetitionSesion({uid: user.uid, type: 'fb'}, 'sesion/verifyUid')
            
            if(res.data){
                loginSocial(res.data.email, {uid: user.uid, type: 'fb'})
            }else {
                const dataEnv = {
                    user: user.displayName.replace(' ', ''),
                    phone: user.phoneNumber,
                    email: user.email,
                    dataUid: {uid: user.uid, type: 'fb'}
                }

                navigation.navigate('Register', {dataEnv})
            }
            
        }).catch(e => {
            setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: 'Ha ocurrido un error, por favor vuelve a intentarlo mas tarde', visible: true})
            console.log(e)
        })
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


                <View style={[loginStyles.containerHeader]}>
                    <Text style={[loginStyles.textHeader]}>Login</Text>
                </View>

                <View style={[loginStyles.containerForm]}>
                    <View style={loginStyles.containerTextForm}><Text style={[loginStyles.textPage1, {marginLeft: 0}]}>Ingresa a tu cuenta</Text></View>
    
                    <View style={loginStyles.containerInputs}>
                        <Input
                            label="Correo electrónico"
                            labelStyle={[stylesLabels.labelInputSesion]}

                            placeholder="ejemplo@correo.com"
                            placeholderTextColor={appColors.gray}
                            
                            inputContainerStyle={[stylesContainers.containerInputSesion2, focus.email ? {...stylesShadows.shadow2, ...stylesContainers.containerInputFocused} : {}]}
                            containerStyle={stylesContainers.containerInputSesion}
                            inputStyle={stylesInputs.inputSesion}
                            
                            selectionColor={appColors.primary}
                            onFocus={() => {setFocus({email: true, password: false})}}
                            
                            onChangeText={value => {onChangeTextEmail(value)}}
                            value={dataForm.email}

                            renderErrorMessage={false}

                            rightIcon={<Icon size={responsiveHeight(3.8)} name="email" color={appColors.gray}/>}
                            rightIconContainerStyle={stylesContainers.containerInputRightIcon}
                        />
                        <Text style={[stylesLabels.labelError, validateForm.email.text == '' ? {display: 'none'} : {}]}>{validateForm.email.text}</Text>

                        <Input
                            label="Contraseña"
                            labelStyle={stylesLabels.labelInputSesion}

                            placeholder="Contraseña"
                            placeholderTextColor={appColors.gray}
                            
                            inputContainerStyle={[stylesContainers.containerInputSesion2, focus.password ? stylesContainers.containerInputFocused : {}]}
                            containerStyle={[stylesContainers.containerInputSesion, {marginTop: responsiveHeight(1.4)}]}
                            inputStyle={stylesInputs.inputSesion}
                            
                            selectionColor={appColors.primary}
                            onFocus={() => {setFocus({email: false, password: true})}}
                            
                            onChangeText={value => {onChangeTextPassword(value)}}
                            value={dataForm.password}
                            textContentType={'password'}
                            secureTextEntry={showPassword}
                            
                            renderErrorMessage={false}

                            rightIcon={
                                <TouchableOpacity activeOpacity={0.5} onPress={() => setShowPassword(!showPassword)} style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon size={responsiveHeight(3.8)} name={showPassword ? 'eye-off' : 'eye'} color={appColors.gray}/>
                                </TouchableOpacity>
                            }
                            rightIconContainerStyle={stylesContainers.containerInputRightIcon}
                        />
                        <Text style={[stylesLabels.labelError, validateForm.password.text == '' ? {display: 'none'} : {}]}>{validateForm.password.text}</Text>
                    </View>


                    <View style={loginStyles.containerFooterForm}>
                        <View style={loginStyles.containerSection1}>
                            <View style={loginStyles.lineSection1}/>
                            <View style={loginStyles.containerTextSection1}><Text style={loginStyles.textPage2}>O inicia sesión con</Text></View>
                            <View style={loginStyles.lineSection1}/>
                        </View>
                        <View style={[loginStyles.containerSection2]}>
                            <View style={[loginStyles.buttonLogin]}>
                                <TouchableHighlight onPress={async() =>{ loginWithFacebook()}} underlayColor={appColors.white3} activeOpacity={1} style={[loginStyles.buttonSocial, stylesShadows.shadow1]}>
                                    <Icon size={responsiveHeight(5.5)} name="facebook" color={uniqueColors.facebook}/>
                                </TouchableHighlight>
                            </View>

                            {Platform.OS == 'android' ? (
                                <View style={[loginStyles.buttonLogin]}>
                                    <TouchableHighlight onPress={async() =>{ loginWithGoogle()}} underlayColor={appColors.white3} activeOpacity={1} style={[loginStyles.buttonSocial, stylesShadows.shadow1]}>
                                        <Image
                                            resizeMode='contain'
                                            source={require('../../../public/logoGoogle.png')}
                                            style={{width: '57%', height: '57%'}}
                                        />
                                    </TouchableHighlight>
                                </View>
                            ) : (
                                <View style={[loginStyles.buttonLogin]}>
                                    <TouchableHighlight onPress={() =>{}} underlayColor={appColors.white3} activeOpacity={1} style={[loginStyles.buttonSocial, stylesShadows.shadow1]}>
                                        <Icon size={responsiveHeight(5.5)} name="apple" color={uniqueColors.apple}/>
                                    </TouchableHighlight>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
                
                <View style={[loginStyles.containerButton]}>
                    <TouchableHighlight disabled={loading} underlayColor={appColors.primaryUnderlay} style={[loginStyles.buttonPrincipal, stylesShadows.shadow2, loading ? {backgroundColor: appColors.primaryDisabled} : {backgroundColor: appColors.primary}]} onPress={() => submit()}>
                        {loading ? <ActivityIndicator style={{position: 'absolute'}} size={responsiveHeight(3.3)} color={appColors.white1}/> : <Text style={loginStyles.textButtonPrincipal}>Iniciar sesión</Text>}
                    </TouchableHighlight>
                    <TouchableOpacity activeOpacity={0.6} style={{position: 'absolute', bottom: responsiveHeight(2)}} onPress={() => {navigation.navigate('PreRegister')}}>
                        <Text style={loginStyles.textPage2}>¿No tienes cuenta? - <Text style={{color: appColors.primary}}>Regístrate</Text></Text>
                    </TouchableOpacity>
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
        height: '55%',
        
    },
    containerTextForm: {
        height: '10%',
        width: '100%',
    },
    containerFooterForm: {
        width: '100%',
        height: '30%',
        position: 'absolute',
        bottom: 0,
        
    },
    containerSection1: {
        width: '100%',
        height: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        
    },
    containerTextSection1: {
        width: '53%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerSection2:{
        width: '100%',
        height: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        

    },
    containerInputs: {
        width: '100%',
    },
    containerButton:{
        width: '100%',
        height: '25%',
        justifyContent: 'center',
        paddingBottom: responsiveHeight(1),
        alignItems: 'center',
        
    },








    buttonLogin: {
        height: responsiveWidth(16),
        width: responsiveWidth(16),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: responsiveWidth(5),
        backgroundColor: appColors.white2,
        borderRadius: 10,
    },
    buttonSocial: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: appColors.white3,
        backgroundColor: appColors.white2,
    },
    buttonPrincipal: {
        height: responsiveHeight(7),
        width: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },



    textHeader:{
        fontSize: responsiveHeight(5),
        fontWeight: 'bold',
        color: appColors.white1,
    },
    textPage1: {
        fontSize: responsiveHeight(2.6),
        fontWeight: '700',
        color: appColors.white1,
        marginHorizontal: responsiveWidth(2)
    },
    textPage2: {
        fontSize: responsiveHeight(2.2),
        fontWeight: '400',
        color: appColors.word1,
        marginHorizontal: responsiveWidth(2)
    },
    textButtonPrincipal: {
        color: appColors.white1, 
        fontSize: responsiveHeight(2.8),
        alignSelf: 'center', 
        fontWeight: '500', 
    },



    lineSection1: {
        width: '23.5%',
        height: responsiveHeight(0),
        borderColor: appColors.gray, 
        borderTopWidth: 1.5
    }
})