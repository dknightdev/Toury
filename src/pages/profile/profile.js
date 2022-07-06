//Native imports
import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image, TouchableHighlight, ActivityIndicator } from 'react-native'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

//External components
import { Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'

//Components
import { ModalMessage } from '../../components/ModalMessage'

//Styles
import { appColors, stylesContainers, stylesInputs, stylesLabels, stylesShadows } from '../../styles'

//Redux
import { useSelector } from "react-redux"

//Api
import { conexionPetitionGeneral } from '../../services/apiConnection'

//Utils
import { patterPassword } from '../../utils/utilities'

export const Profile = (props) => {
    //Variables
    const { dataUser } = useSelector(state => state.generalReducer)

    const [loading, setLoading] = useState(false)
    const [focus, setFocus] = useState({oldPassword: false, newPassword: false, confirmPassword: false})
    const [dataModal, setDataModal] = useState({textMain: '', text: '', buttonText: '', visible: false, success: false})
    
    const [dataForm, setDataForm] = useState({oldPassword: '', newPassword: '', confirmPassword: ''})
    const [showPassword, setShowPassword] = useState({oldPassword: true, newPassword: true, confirmPassword: true})
    const [validateForm, setValidateForm] = useState({oldPassword: {text: '', state: false}, newPassword: {text: '', state: false}, confirmPassword: {text: '', state: false}})

    const submit = async () =>{
        const errorMessage = {oldPassword: '', newPassword: '', confirmPassword: ''}

        !dataForm.oldPassword ? errorMessage.oldPassword = 'Campo obligatorio' : !patterPassword.test(dataForm.oldPassword) ? errorMessage.oldPassword = 'La contraseña debe tener entre 8 y 15 dígitos' : {}
        !dataForm.newPassword ? errorMessage.newPassword = 'Campo obligatorio' : !patterPassword.test(dataForm.newPassword) ? errorMessage.newPassword = 'La contraseña debe tener entre 8 y 15 dígitos' : {}
        !dataForm.confirmPassword ? errorMessage.confirmPassword = 'Campo obligatorio' : !patterPassword.test(dataForm.confirmPassword) ? errorMessage.confirmPassword = 'La contraseña debe tener entre 8 y 15 dígitos' : {}

        !(errorMessage.newPassword || errorMessage.confirmPassword) ? (dataForm.newPassword !== dataForm.confirmPassword) ? errorMessage.confirmPassword = 'Las contraseñas no coinciden' : {} : {}
        
        setValidateForm({oldPassword: {text: errorMessage.oldPassword, state: false}, newPassword: {text: errorMessage.newPassword, state: false}, confirmPassword: {text: errorMessage.confirmPassword, state: false}})
        
        if(!(errorMessage.oldPassword || errorMessage.newPassword || errorMessage.confirmPassword)){
            setLoading(true)
            
            const dataChange = {
                oldPassword: dataForm.oldPassword,
                newPassword: dataForm.newPassword,
                user: dataUser.document
            }
            const res = await conexionPetitionGeneral({dataChange}, 'changePassword')
            
            if(res.status === 200){
                setDataModal({textMain: '¡Genial!', buttonText: 'Aceptar', text: res.message, visible: true, success: true})
                setDataForm({oldPassword: '', newPassword: '', confirmPassword: ''})
            }else if(res.status === 400){
                setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: res.message, visible: true, success: false})
                setDataForm({oldPassword: '', newPassword: '', confirmPassword: ''})
            }else if(res.status === 401){
                setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: res.message, visible: true, success: false})
            }

            setLoading(false)
        }
    }

    const onChangeOldPassword = (value) => {
        setDataForm({...dataForm, oldPassword: value.trim()})
        setValidateForm({...validateForm, oldPassword: {text: '', estado: true}})
    }

    const onChangeNewPassword = (value) => {
        setDataForm({...dataForm, newPassword: value})
        setValidateForm({...validateForm, newPassword: {text: '', estado: true}})
    }

    const onChangeConfirmPassword = (value) => {
        setDataForm({...dataForm, confirmPassword: value})
        setValidateForm({...validateForm, confirmPassword: {text: '', estado: true}})
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
                toggleOverlay={() => setDataModal({text: '', textMain: '', buttonText: '', visible: false})}
            />

            {/* Pagina */}
            <View style={[stylesContainers.containerPage, profileStyles.containerPage]}>
                <ScrollView style={profileStyles.scrollView} contentContainerStyle={{alignItems: 'center', paddingTop: responsiveHeight(3)}}>
                    <View style={[profileStyles.containerHeader, stylesShadows.shadow1]}>
                        <View style={profileStyles.containerImage1}>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {}} style={[profileStyles.containerImage2, stylesShadows.shadow1]}>
                                <Image
                                    resizeMode='contain'
                                    source={require('../../../public/user_images/imagen_user_0.png')}
                                    style={{height: '100%', width: '100%'}}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={profileStyles.textUserName}><Text style={profileStyles.textTag}>Usuario:</Text> {dataUser.user_name}</Text>
                        <Text style={profileStyles.textEmail}><Text style={profileStyles.textTag}>Correo:</Text> {dataUser.email}</Text>
                        <Text style={profileStyles.textPhone}><Text style={profileStyles.textTag}>Teléfono:</Text> {dataUser.phone}</Text>
                    </View>
                    <View style={profileStyles.containerBody}>
                        <View style={profileStyles.containerHeaderSection}>
                            <IconM color={appColors.primary} size={Math.round(responsiveHeight(3.4))} name='security'/>
                            <Text style={profileStyles.textHeader}>Cambia tu contraseña</Text>
                        </View>

                        <Input
                            label="Tu antigua contraseña"
                            labelStyle={stylesLabels.labelInputSesion}

                            placeholder="Contraseña"
                            placeholderTextColor={appColors.gray}
                            
                            inputContainerStyle={[stylesContainers.containerInputSesion2, focus.oldPassword ? {...stylesShadows.shadow2, ...stylesContainers.containerInputFocused} : {}]}
                            containerStyle={stylesContainers.containerInputSesion}
                            inputStyle={stylesInputs.inputSesion}

                            selectionColor={appColors.primary}
                            onFocus={() => {setFocus({oldPassword: true, newPassword: false, confirmPassword: false})}}
                            
                            onChangeText={value => {onChangeOldPassword(value)}}
                            value={dataForm.oldPassword}
                            textContentType='password'
                            secureTextEntry={showPassword.oldPassword}

                            renderErrorMessage={false}

                            rightIcon={
                                <TouchableOpacity activeOpacity={0.5} onPress={() => setShowPassword({...showPassword, oldPassword: !showPassword.oldPassword})} style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <IconM size={responsiveHeight(3.8)} name={showPassword.oldPassword ? 'eye-off' : 'eye'} color={appColors.gray}/>
                                </TouchableOpacity>
                            }
                            rightIconContainerStyle={stylesContainers.containerInputRightIcon}
                        />
                        <Text style={[stylesLabels.labelError, validateForm.oldPassword.text == '' ? {display: 'none'} : {}]}>{validateForm.oldPassword.text}</Text>

                        <Input
                            label="Tu nueva contraseña"
                            labelStyle={stylesLabels.labelInputSesion}

                            placeholder="Contraseña"
                            placeholderTextColor={appColors.gray}
                            
                            inputContainerStyle={[stylesContainers.containerInputSesion2, focus.newPassword ? {...stylesShadows.shadow2, ...stylesContainers.containerInputFocused} : {}]}
                            containerStyle={[stylesContainers.containerInputSesion, {marginTop: responsiveHeight(1.4)}]}
                            inputStyle={stylesInputs.inputSesion}

                            selectionColor={appColors.primary}
                            onFocus={() => {setFocus({oldPassword: false, newPassword: true, confirmPassword: false})}}
                            
                            onChangeText={value => {onChangeNewPassword(value)}}
                            value={dataForm.newPassword}
                            textContentType={'password'}
                            secureTextEntry={showPassword.newPassword}
                            
                            renderErrorMessage={false}

                            rightIcon={
                                <TouchableOpacity activeOpacity={0.5} onPress={() => setShowPassword({...showPassword, newPassword: !showPassword.newPassword})} style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <IconM size={responsiveHeight(3.8)} name={showPassword.newPassword ? 'eye-off' : 'eye'} color={appColors.gray}/>
                                </TouchableOpacity>
                            }
                            rightIconContainerStyle={stylesContainers.containerInputRightIcon}
                        />
                        <Text style={[stylesLabels.labelError, validateForm.newPassword.text == '' ? {display: 'none'} : {}]}>{validateForm.newPassword.text}</Text>
                        
                        <Input
                            label="Repite la contraseña"
                            labelStyle={stylesLabels.labelInputSesion}

                            placeholder="Contraseña"
                            placeholderTextColor={appColors.gray}
                            
                            inputContainerStyle={[stylesContainers.containerInputSesion2, focus.confirmPassword ? {...stylesShadows.shadow2, ...stylesContainers.containerInputFocused} : {}]}
                            containerStyle={[stylesContainers.containerInputSesion, {marginTop: responsiveHeight(1.4)}]}
                            inputStyle={stylesInputs.inputSesion}

                            selectionColor={appColors.primary}
                            onFocus={() => {setFocus({oldPassword: false, newPassword: false, confirmPassword: true})}}
                            
                            onChangeText={value => {onChangeConfirmPassword(value)}}
                            value={dataForm.confirmPassword}
                            textContentType={'newPassword'}
                            secureTextEntry={showPassword.confirmPassword}
                            
                            renderErrorMessage={false}

                            rightIcon={
                                <TouchableOpacity activeOpacity={0.5} onPress={() => setShowPassword({...showPassword, confirmPassword: !showPassword.confirmPassword})} style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <IconM size={responsiveHeight(3.8)} name={showPassword.confirmPassword ? 'eye-off' : 'eye'} color={appColors.gray}/>
                                </TouchableOpacity>
                            }
                            rightIconContainerStyle={stylesContainers.containerInputRightIcon}
                        />
                        <Text style={[stylesLabels.labelError, validateForm.confirmPassword.text == '' ? {display: 'none'} : {}]}>{validateForm.confirmPassword.text}</Text>

                        
                        <TouchableHighlight disabled={loading} underlayColor={appColors.primaryUnderlay} style={[profileStyles.buttonPrincipal, stylesShadows.shadow2, loading ? {backgroundColor: appColors.primaryDisabled} : {backgroundColor: appColors.primary}]} onPress={() => submit()}>
                            {loading ? <ActivityIndicator style={{position: 'absolute'}} size={responsiveHeight(3.3)} color={appColors.white1}/> : <Text style={profileStyles.textButtonPrincipal}>Continuar</Text>}
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

const profileStyles = StyleSheet.create({
    containerPage: {
        backgroundColor: appColors.white3,
    },
    scrollView: {
        flex: 1,
    },
    containerHeader: {
        width: responsiveWidth(80),
        height: responsiveHeight(40),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: responsiveHeight(3),
        borderRadius: 25,
        backgroundColor: appColors.white2,

    },
    containerBody: {
        width: '100%',
        minHeight: responsiveHeight(55),
        paddingHorizontal: responsiveWidth(8),
        paddingBottom: responsiveHeight(12),
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        backgroundColor: appColors.white2,
    },

    containerImage1: {
        height: responsiveHeight(16),
        width: '100%',
        marginBottom: responsiveHeight(3.5),
        justifyContent: 'center',
        alignItems: 'center',

    },
    containerImage2: {
        height: responsiveWidth(30), 
        width: responsiveWidth(30),
        borderRadius: 100,
        overflow: 'hidden',
        borderWidth: 0.2, borderColor: appColors.gray1

    },
    containerHeaderSection: {
        width: '100%',
        height: responsiveHeight(6),
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: responsiveHeight(3.5),
        paddingHorizontal: responsiveWidth(4),
        borderWidth: 0.4, 
        borderColor: appColors.gray1,
        borderRadius: 10,
        backgroundColor: appColors.white3,
    },


    buttonPrincipal: {
        height: responsiveHeight(7),
        width: '100%',
        marginTop: responsiveHeight(3),
        borderRadius: 10,
        backgroundColor: appColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },


    textTag: {
        fontSize: responsiveHeight(2.4),
        fontWeight: '600',
        textShadowColor: appColors.primaryTransparent,
        textShadowOffset: {width: 0.1, height: 0.1},
        textShadowRadius: 1,
    },
    textUserName: {
        fontSize: responsiveHeight(2.4),
        fontWeight: '400',
        color: appColors.primarySoft,
    },
    textPhone: {
        fontSize: responsiveHeight(2.4),
        fontWeight: '400',
        color: appColors.primarySoft,
    },
    textEmail: {
        fontSize: responsiveHeight(2.4),
        fontWeight: '400',
        color: appColors.primarySoft,
        marginVertical: responsiveHeight(0.2),
    },
    textHeader:{
        fontSize: responsiveHeight(2.3),
        fontWeight: '600',
        color: appColors.word3,
        marginLeft: responsiveWidth(3)
    },
    textButtonPrincipal: {
        color: appColors.white1, 
        fontSize: responsiveHeight(2.8),
        alignSelf: 'center', 
        fontWeight: '500', 
    },
})