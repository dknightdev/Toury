//Native imports
import React, { useCallback, useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, Linking, RefreshControl, ActivityIndicator } from 'react-native'

//External components
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import {LayoutProvider, DataProvider, RecyclerListView} from 'recyclerlistview'

//Components
import { CardEvent2 } from '../../../components/CardEvent2'
import { ModalSelect } from '../../../components/ModalSelect'

//Styles
import { appColors, stylesContainers, stylesInputs, stylesShadows, uniqueColors } from '../../../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

//Redux
import { useSelector } from "react-redux"

//Api
import { conexionPetitionGeneral } from '../../../services/apiConnection'

let layoutProvider = new LayoutProvider(index => { return 'default'}, (type, dim) => {dim.width = responsiveWidth(100); dim.height = responsiveHeight(25)})

export const EventList = (props) => {

    //Variables
    const [filter, setFilter] = useState({id: 1, text: 'Mes'})
    const { dataUser } = useSelector(state => state.generalReducer)
    const [dataModal, setDataModal] = useState({text: '', visible: false})
    const [processing, setProcessing] = useState({loading: false, refreshing: false})
    const [dataEvents, setDataEvents] = useState({data: [], dataFiltered: new DataProvider((r1, r2) => {return r1})})

    useEffect(() => {
        const executeEffect = async () => { getEvents() }
        executeEffect()
    }, [])

    const onRefresh = useCallback(() => {
        setProcessing({loading: true, refreshing: true})
        getEvents()
    }, [])

    const getEvents = async () => {
        setProcessing({loading: true, refreshing: false})

        const res = await conexionPetitionGeneral({user : dataUser.document}, 'getDataEvents')
        setDataEvents({data: res.data, dataFiltered: dataEvents.dataFiltered.cloneWithRows(getDataFiltered(res.data, filter))})

        setProcessing({loading: false, refreshing: false})
    }

    const rowRenderer = (type, item, index, extendedState) => {
        return (
            <CardEvent2 item={item} func={() => {props.navigation.navigate('Event', {data: item})}}/>
        )
    }

    const getDataFiltered = (data, fil) => {
        setFilter(fil)
        const date = new Date()

        const currentMonth = date.getMonth()
        const currentYear = date.getFullYear()
        const currentDay = date.getDate()

        switch (fil.id){
            case 1:
                return data.filter(el => {
                    const [year, month] = el.date.split('T')[0].split('-')

                    if(year == currentYear && month == currentMonth + 1) {
                        return el
                    }
                }) 
            case 2:
                return data.filter(el => {
                    const [year, month, day] = el.date.split('T')[0].split('-')
                    
                    if(year == currentYear && month == currentMonth + 1 && (day >= currentDay + 7)) {
                        return el
                    }
                })
            case 3:
                return data.filter(el => {
                    const [year, month, day] = el.date.split('T')[0].split('-')
                    
                    if(year == currentYear && month == currentMonth + 1 && day == currentDay) {
                        return el
                    }
                })
        }

    }

    return(
        <>
            {/* Modales */}
            <ModalSelect
                text={dataModal.text}
                visible={dataModal.visible}
                func={(el) => {setDataEvents({...dataEvents, dataFiltered: dataEvents.dataFiltered.cloneWithRows(getDataFiltered(dataEvents.data, el))})}}
                dataSelect={[{id: 1, text: 'Mes'}, {id: 2, text: 'Semana'}, {id: 3, text: 'Hoy'}]}
                toggleOverlay={() => setDataModal({...dataModal, text: '', visible: false})}
            />

            {/* Pagina */}
            <View style={[stylesContainers.containerPage, eventListStyles.containerPage]}>
                <TouchableOpacity activeOpacity={0.6} style={eventListStyles.buttonReturn} onPress={() => props.navigation.navigate('BarNavigation')}>
                    <Icon color={appColors.word1} size={Math.round(responsiveHeight(4.2))} name='arrow-back'/>
                </TouchableOpacity>

                <View style={eventListStyles.containerSection1}>
                    <TouchableOpacity activeOpacity={0.8} style={[eventListStyles.buttonFilter, stylesShadows.shadow2]} 
                        onPress={() => {setDataModal({...dataModal, text: 'Selecciona el filtro que deseas aplicar', visible: true})}}>
                        <View style={eventListStyles.contentButtonFilter}>
                            <Text style={eventListStyles.textButtonFilter}>{filter.text}</Text>
                            <Icon color={appColors.white2} size={Math.round(responsiveHeight(3.2))} name='keyboard-arrow-down'/>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={eventListStyles.containerSection2}>
                    <TouchableOpacity activeOpacity={0.8} style={[eventListStyles.buttonNew, stylesShadows.shadow2]} onPress={() => {props.navigation.navigate('EventAdd')}}>
                        <IconM color={appColors.white2} size={Math.round(responsiveHeight(5))} name='plus'/>
                    </TouchableOpacity>
                    <Text style={eventListStyles.textTittle}>
                        Lista Eventos
                    </Text>

                    {
                        processing.loading ? (
                            <View style={eventListStyles.containerReplaceRecylcer}>
                                <ActivityIndicator size={responsiveHeight(7)} color={appColors.primary}/>
                            </View>
                        ) : (
                            dataEvents.dataFiltered._data.length > 0 ?
                            (<View style={eventListStyles.containerRecyclerList}>
                                <RecyclerListView
                                    dataProvider={dataEvents.dataFiltered}
                                    layoutProvider={layoutProvider}
                                    rowRenderer={rowRenderer}
                                    contentContainerStyle={{paddingBottom: responsiveHeight(11), paddingTop: responsiveHeight(1.5)}}
                                    style = {eventListStyles.recyclerList}
                                    onEndReachedThreshold={0.5}
                                    scrollViewProps={{
                                        refreshControl: (<RefreshControl refreshing={processing.refreshing} onRefresh={onRefresh}/>)
                                    }}
                                />
                            </View>) 
                            : 
                            (<View style={eventListStyles.containerTextEmpty}>
                                <IconM name='filter-remove' size={Math.round(responsiveWidth(6))} color={appColors.word1} />
                                <Text style={eventListStyles.textEmpty}>No se encontraron datos</Text>
                            </View>)
                        )
                    }
                </View>
            </View>
        </>
    )
}

const eventListStyles = StyleSheet.create({
    containerPage: {
        backgroundColor: appColors.white1,
    },
    containerSection1:{
        width: '100%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'flex-end',

    },
    containerSection2:{
        width: '100%',
        height: '90%',
    },
    contentButtonFilter:{
        width: '100%',
        height: '100%',
        paddingHorizontal: responsiveWidth(3.5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    containerRecyclerList: {
        width: '100%', 
        height: '94%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerTextEmpty: {
        width: '100%',
        height: '85%',
        justifyContent: 'center', 
        alignItems: 'center',
        
    },
    containerReplaceRecylcer: {
        width: '100%', 
        height: '85%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recyclerList: {
        width: '100%', 
        height: '100%',
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
    buttonNew:{
        width: responsiveWidth(17),
        height: responsiveWidth(17),
        position: 'absolute',
        bottom: responsiveHeight(3),
        right: responsiveWidth(6),
        borderRadius: 50,
        backgroundColor: appColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
    },
    buttonFilter:{
        width: responsiveWidth(33),
        height: responsiveHeight(5),
        marginRight: responsiveWidth(6),
        backgroundColor: appColors.primary,
        borderRadius: 10
    },




    textButtonFilter:{
        color: appColors.white2,
        fontSize: responsiveHeight(2.2),
    },
    textTittle: {
        fontSize: responsiveHeight(2.8),
        fontWeight: '700',
        color: appColors.word1,
        marginLeft: responsiveWidth(8),
        marginBottom: responsiveHeight(1.5),
    },
    textEmpty: {
        fontSize: responsiveHeight(2), 
        color: appColors.word1,
        textAlign: 'center',
    },
})