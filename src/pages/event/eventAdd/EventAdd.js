//Native imports
import React, { useCallback, useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TouchableHighlight, ActivityIndicator, TextInput, ScrollView } from 'react-native'

//External components
import { Overlay } from "react-native-elements";
import DatePicker from 'react-native-modern-datepicker';
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'

//Components
import { ModalMessage } from '../../../components/ModalMessage'

//Styles
import { appColors, stylesContainers, stylesInputs, stylesLabels, stylesShadows, uniqueColors } from '../../../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

//Redux
import { useSelector } from "react-redux"

//Api
import { conexionPetitionGeneral } from '../../../services/apiConnection';

export const EventAdd = (props) => {
    //Variables
    const [loading, setLoading] = useState(false)
    const { dataUser } = useSelector(state => state.generalReducer)
    const [visibleCalendar, setVisibleCalendar] = useState({date: false, hour: false})
    const [validateForm, setValidateForm] = useState({title: '', address: '', description: ''})
    const [dataModal, setDataModal] = useState({textMain: '', text: '', buttonText: '', visible: false, success: false})
    const [dataForm, setDataForm] = useState({title: '', date: new Date(new Date().setDate(new Date().getDate() + 1)), hour: '12:00', address: '', description: ''})

    useEffect(() => {
        const executeEffect = async () => {
            
        }
        executeEffect()
    }, [])

    const formatDate = (date) => {
        return date.toISOString().split('T')[0]
    }
    
    const getMinimunDate = () => {
        const date = new Date()
        date.setDate(date.getDate() + 1)
        return date.toISOString().split('T')[0]
    }

    const setDate = (date) =>{ 
        setDataForm({...dataForm, date: new Date(Date.parse(date.replace(/[/]/g, '-')))})
        setVisibleCalendar({...visibleCalendar, date: false})
    }

    const setHour = (hour) =>{ 
        setDataForm({...dataForm, hour: hour})
        setVisibleCalendar({...visibleCalendar, hour: false})
    }

    const onChangeTextTitle = (value) => {
        setDataForm({...dataForm, title: value})
        setValidateForm({...validateForm, title: ''})
    }

    const onChangeTextAddress = (value) => {
        setDataForm({...dataForm, address: value})
        setValidateForm({...validateForm, address: ''})
    }

    const onChangeTextDescription = (value) => {
        setDataForm({...dataForm, description: value})
        setValidateForm({...validateForm, description: ''})
    }

    const onPressButtonModal = () => {
        setDataModal({text: '', textMain: '', buttonText: '', visible: false})
        props.navigation.navigate('Home', {refresh: true})
    }

    const submit = async () => {
        const errorMessage = {title: '', address: '', description: ''}

        !dataForm.title ? errorMessage.title = 'Campo obligatorio' : {}
        !dataForm.address ? errorMessage.address = 'Campo obligatorio' : {}
        !dataForm.description ? errorMessage.description = 'Campo obligatorio' : {}
        	
        setValidateForm({title: errorMessage.title, address: errorMessage.address, description: errorMessage.description})

        if(!(errorMessage.title || errorMessage.address || errorMessage.description)){
            setLoading(true)
            
            const dataSend = {
                title: dataForm.title,
                date: dataForm.date,
                hour: dataForm.hour,
                address: dataForm.address,
                description: dataForm.description,
                user: dataUser.document
            }

            const res = await conexionPetitionGeneral({dataSend}, 'setEvent')

            setDataForm({title: '', date: new Date(new Date().setDate(new Date().getDate() + 1)), hour: '12:00', address: '', description: ''})

            if(res.status === 200){
                setDataModal({textMain: '¡Genial!', buttonText: 'Aceptar', text: res.message, visible: true, success: true})
            }else if(res.status === 400){
                setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: res.message, visible: true, success: false})
            }

            setLoading(false)
        }
    }

    return(
        <>
            {/* Modales */}
                {/* Modal para la fecha */}
                <Overlay isVisible={visibleCalendar.date} overlayStyle={eventAddStyles.overlayCalendar} onBackdropPress={()=>{setVisibleCalendar({...visibleCalendar, date: false})}}>
                    <DatePicker
                        mode="calendar"

                        current={formatDate(dataForm.date)}
                        selected={formatDate(dataForm.date)}
                        minimumDate={getMinimunDate()}

                        style={[eventAddStyles.calendarDate, stylesShadows.shadow2]}
                        onDateChange={date => setDate(date)}

                        options={{
                            backgroundColor: appColors.white2,
                            textHeaderColor: appColors.primary,
                            textDefaultColor: appColors.word3,
                            selectedTextColor: appColors.white2,
                            mainColor: appColors.primary,
                            textSecondaryColor: appColors.primarySoftBackground,
                            borderColor: appColors.white5,
                        }}
                    />
                </Overlay>

                {/* Modal para la hora */}
                <Overlay isVisible={visibleCalendar.hour} overlayStyle={eventAddStyles.overlayCalendar} onBackdropPress={()=>{setVisibleCalendar({...visibleCalendar, hour: false})}}>
                    <DatePicker
                        mode="time"

                        minuteInterval={15}

                        style={[eventAddStyles.calendarHour, stylesShadows.shadow2]}
                        onTimeChange={hour => setHour(hour)}

                        options={{
                            backgroundColor: appColors.white2,
                            textDefaultColor: appColors.word3,
                            selectedTextColor: appColors.white2,
                            mainColor: appColors.primary,
                        }}
                    />
                </Overlay>

                {/* Modal de mensaje */}
                <ModalMessage 
                    text={dataModal.text}
                    textMain={dataModal.textMain}
                    buttonText={dataModal.buttonText}
                    visible={dataModal.visible}
                    success={dataModal.success}
                    toggleOverlay={() => onPressButtonModal()}
                />

            {/* Pagina */}
            <View style={[stylesContainers.containerPage, eventAddStyles.containerPage]}>
                <TouchableOpacity activeOpacity={0.6} style={eventAddStyles.buttonReturn} onPress={() => {props.navigation.navigate('BarNavigation')}}>
                    <Icon color={appColors.word1} size={Math.round(responsiveHeight(4.2))} name='arrow-back'/>
                </TouchableOpacity>

                <ScrollView style={eventAddStyles.containerBody}>
                    <View style={[eventAddStyles.containerHeaderSection, {marginTop: responsiveHeight(8)}]}>
                        <Icon color={appColors.primary} size={Math.round(responsiveHeight(3.8))} name='drive-file-rename-outline'/>
                        <Text style={eventAddStyles.textTitleInput}>Agrega un título</Text>
                    </View>
                    <TextInput
                        placeholder="Caminata al sendero de la vida"
                        placeholderTextColor={appColors.gray1}
                        style={eventAddStyles.input}
                        onChangeText={value => onChangeTextTitle(value)}
                        value={dataForm.title}
                    />
                    <Text style={[stylesLabels.labelError, {marginTop: responsiveHeight(.5)}, validateForm.title == '' ? {display: 'none'} : {}]}>{validateForm.title}</Text>

                    <View style={eventAddStyles.containerHeaderSection}>
                        <IconM color={appColors.primary} size={Math.round(responsiveHeight(3.8))} name='calendar'/>
                        <Text style={eventAddStyles.textTitleInput}>Selecciona la fecha y la hora</Text>
                    </View>
                    <View style={eventAddStyles.containerInputs}>
                        <TouchableOpacity style={eventAddStyles.buttonInput} activeOpacity={1} onPress={() => setVisibleCalendar({...visibleCalendar, date: true})}>
                            <Text style={eventAddStyles.textButtonInput}>{dataForm.date.toISOString().split('T')[0]}</Text>
                            <IconM color={appColors.gray} size={Math.round(responsiveHeight(3.2))} name='calendar-search'/>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[eventAddStyles.buttonInput, {width: '38%'}]} activeOpacity={1} onPress={() => setVisibleCalendar({...visibleCalendar, hour: true})}>
                            <Text style={eventAddStyles.textButtonInput}>{dataForm.hour}</Text>
                            <IconM color={appColors.gray} size={Math.round(responsiveHeight(3.2))} name='clock-time-seven-outline'/>
                        </TouchableOpacity>
                    </View>
                    

                    <View style={eventAddStyles.containerHeaderSection}>
                        <IconM color={appColors.primary} size={Math.round(responsiveHeight(3.8))} name='map-marker'/>
                        <Text style={eventAddStyles.textTitleInput}>Agrega una ubicación</Text>
                    </View>
                    <TextInput
                        placeholder="Cra. 1 # 1-1"
                        placeholderTextColor={appColors.gray1}
                        style={eventAddStyles.input}
                        onChangeText={value => onChangeTextAddress(value)}
                        value={dataForm.address}
                    />
                    <Text style={[stylesLabels.labelError, {marginTop: responsiveHeight(.5)}, validateForm.address == '' ? {display: 'none'} : {}]}>{validateForm.address}</Text>

                    <View style={eventAddStyles.containerHeaderSection}>
                        <IconM color={appColors.primary} size={Math.round(responsiveHeight(3.8))} name='text'/>
                        <Text style={eventAddStyles.textTitleInput}>Agrega una descripción</Text>
                    </View>
                    <TextInput
                        placeholder="Una caminata en la que se realizara con los amigos"
                        placeholderTextColor={appColors.gray1}
                        style={eventAddStyles.inputArea}
                        multiline={true}
                        onChangeText={value => onChangeTextDescription(value)}
                        value={dataForm.description}
                    />
                    <Text style={[stylesLabels.labelError, {marginTop: responsiveHeight(.5)}, validateForm.description == '' ? {display: 'none'} : {}]}>{validateForm.description}</Text>
                </ScrollView>

                <View style={eventAddStyles.containerButton}>
                    <TouchableHighlight disabled={loading} underlayColor={appColors.primaryUnderlay} style={[eventAddStyles.buttonPrincipal, stylesShadows.shadow2, loading ? {backgroundColor: appColors.primaryDisabled} : {backgroundColor: appColors.primary}]} onPress={() => submit()}>
                        {loading ? <ActivityIndicator style={{position: 'absolute'}} size={responsiveHeight(3.3)} color={appColors.white1}/> : <Text style={eventAddStyles.textButtonPrincipal}>Guardar</Text>}
                    </TouchableHighlight>
                </View>
            </View>
        </>
    )
}

const eventAddStyles = StyleSheet.create({
    containerPage: {
        backgroundColor: appColors.white1,
    },
    containerBody: {
        width: '100%',
        height: '90%',
        paddingHorizontal: responsiveWidth(8),
    },
    containerHeaderSection: {
        width: '100%',
        height: responsiveHeight(5),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveHeight(1.5),
        marginTop: responsiveHeight(4),
        paddingHorizontal: responsiveWidth(2),
        borderWidth: 0.4, borderColor: appColors.gray1,
        borderRadius: 10,
    },
    containerButton: {
        width: '100%',
        height: '10%',
        paddingHorizontal: responsiveWidth(8),
        justifyContent: 'flex-start',
    },
    containerInputs: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },


    overlayCalendar:{ 
        borderRadius: 10,
        padding:0,
    },
    calendarDate: {
        width: responsiveWidth(90),
        height: responsiveHeight(50), 
        borderRadius:10,
    },
    calendarHour: {
        width: responsiveWidth(80),
        height: responsiveHeight(45), 
        borderRadius:10,
    },


    input: {
        width: '100%',
        height: responsiveHeight(6),
        paddingHorizontal: responsiveWidth(4),
        backgroundColor: appColors.white3,
        borderColor: appColors.gray1,
        borderWidth: 0.4, 
        borderRadius: 10,
        fontSize: responsiveHeight(2.25),
        color: appColors.word1,
    },
    inputArea: {
        width: '100%',
        height: responsiveHeight(15),
        paddingHorizontal: responsiveWidth(4),
        textAlignVertical: 'top',
        backgroundColor: appColors.white3,
        borderColor: appColors.gray1,
        borderWidth: 0.4, 
        borderRadius: 10,
        fontSize: responsiveHeight(2.1),
        color: appColors.word1,
    },

    buttonInput: {
        width: '57%',
        height: responsiveHeight(6),
        paddingHorizontal: responsiveWidth(4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: appColors.white3,
        borderWidth: 0.4, borderColor: appColors.gray1,
        borderRadius: 10,
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
    buttonPrincipal: {
        height: responsiveHeight(6.5),
        width: '100%',
        marginTop: responsiveHeight(1.5),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },


    textTitleInput:{
        fontSize: responsiveHeight(2.2),
        fontWeight: '600',
        color: appColors.word1,
        marginLeft: responsiveWidth(2.5)
    },
    textButtonInput: {
        fontSize: responsiveHeight(2.25),
        color: appColors.word1,
    },
    textButtonPrincipal: {
        color: appColors.white1, 
        fontSize: responsiveHeight(2.6),
        alignSelf: 'center', 
        fontWeight: '500', 
    },
})