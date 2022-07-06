//Native imports
import React, { useCallback, useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableHighlight, Image, TouchableOpacity, ScrollView, RefreshControl} from 'react-native'

//External components
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import {LayoutProvider, DataProvider, RecyclerListView} from 'recyclerlistview'

//Components
import { Banner } from '../../components/Banner'
import { Weather } from '../../components/Weather'
import { CardHome } from '../../components/CardHome'
import { CardEvent } from '../../components/CardEvent'
import { SkeletonHome } from '../../components/skeletons/SkeletonHome'
import { ModalMessage } from '../../components/ModalMessage'

//Styles
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { appColors, stylesContainers, stylesShadows, uniqueColors } from '../../styles'

//Redux
import { useDispatch, useSelector } from "react-redux"
import { setDataSites, setDataUser } from '../../redux/actions/generalAction'

//Utils
import { secureStorage } from '../../utils/preferences'

//Api
import { conexionPetitionGeneral } from '../../services/apiConnection'

let layoutProvider1 = new LayoutProvider(index => { return 'default'}, (type, dim) => {dim.width = responsiveWidth(40); dim.height = responsiveHeight(23)})
let layoutProvider2 = new LayoutProvider(index => { return 'default'}, (type, dim) => {dim.width = responsiveWidth(37); dim.height = responsiveHeight(21)})

export const Home = (props) => {
    const dispatch = useDispatch()

    //Variables
    const [processing, setProcessing] = useState({loading: false, refreshing: false})
    const [dataModal, setDataModal] = useState({textMain: '', text: '', buttonText: '', visible: false})
    const [dataHome, setDataHome] = useState({
        dataUser: {},
        dataEvents: new DataProvider((r1, r2) => {return r1}),
        dataBanner: [],
        hoteles: new DataProvider((r1, r2) => {return r1}),
        restaurantes: new DataProvider((r1, r2) => {return r1})
    })

    //Metodos
    useEffect(() => {
        const executeEffect = async () => { getDataHome() }
        executeEffect()
    }, [processing.refreshing, props.route.params])

    const onRefresh = useCallback(() => {
        setProcessing({loading: true, refreshing: true})
        getDataHome()
    }, [])

    const getDataHome = async () => {
        setProcessing({loading: true, refreshing: false})
        const res = await conexionPetitionGeneral({}, 'getDataHome')

        if(res.status === 200){
            dispatch(setDataUser(res.dataHome.dataUser))
            dispatch(setDataSites(res.dataHome.dataSites))

            setDataHome({
                dataUser: res.dataHome.dataUser,
                dataEvents: dataHome.dataEvents.cloneWithRows(res.dataHome.dataEvents),
                dataBanner: res.dataHome.dataBanner.map(el => res.dataHome.dataSites.find(el2 => el2.id == el.id)),
                hoteles: dataHome.hoteles.cloneWithRows(res.dataHome.dataSites.filter(el => el.type == 0)),
                restaurantes: dataHome.restaurantes.cloneWithRows(res.dataHome.dataSites.filter(el => el.type == 1)),
            })
        }else if(res.status === 400){
            setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: res.message, visible: true})
        }
        setProcessing({loading: false, refreshing: false})
    }

    //Render recycler
    const rowRendererEvents = (type, item, index, extendedState) => {
        return (
            <CardEvent size={homeStyles.itemList1} item={item} func={() => {props.navigation.navigate('Event', {data: item})}}/>
        )
    }

    const rowRendererHoteles = (type, item, index, extendedState) => {
        return (
            <CardHome size={homeStyles.itemList2} item={item} func={() => {props.navigation.navigate('Site', {data: item})}}/>
        )
    }

    const rowRendererRestaurantes = (type, item, index, extendedState) => {
        return (
            <CardHome size={homeStyles.itemList2} item={item} func={() => {props.navigation.navigate('Site', {data: item})}}/>
        )
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
        <SkeletonHome visible={processing.loading}>
            <View style={[stylesContainers.containerPage, homeStyles.containerPage]}>
                <View style={homeStyles.header}>
                    <View style={homeStyles.containerHedaerText}>
                        <Text style={homeStyles.textHeader}>Hola {dataHome?.dataUser?.user_name}</Text>
                    </View>
                    <View style={homeStyles.containerAvatar}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => {props.navigation.navigate('Profile')}} style={homeStyles.containerAvatar2}>
                            <Image
                                resizeMode='contain'
                                source={require('../../../public/user_images/imagen_user_0.png')}
                                style={{height: '100%', width: '100%'}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={homeStyles.scrollView} refreshControl={<RefreshControl refreshing={processing.refreshing} onRefresh={onRefresh}/>}>
                    <View style={homeStyles.containerWeather}>
                        <Weather/>
                    </View>

                    <View style={homeStyles.line}/>

                    <View style={homeStyles.containerSection1}>
                        <View style={homeStyles.containerHeaderSection}>
                            <View style={homeStyles.containerHorizontal}>
                                <Text style={homeStyles.textSection1}>Descubre...</Text> 
                            </View>
                        </View>
                        <Banner data={dataHome?.dataBanner} func={(site) => {props.navigation.navigate('Site', {data: site})}}/>
                    </View>

                    <View style={homeStyles.line}/>

                    <View style={homeStyles.containerSection2}>
                        <View style={homeStyles.containerHeaderSection}>
                            <View style={homeStyles.containerHorizontal}> 
                                <Text style={homeStyles.textSection1}>Eventos</Text>
                                <TouchableOpacity activeOpacity={0.6} onPress={() => {props.navigation.navigate('EventList')}}>
                                    <Text style={homeStyles.textSection2}>Ver todos</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        

                        {dataHome.dataEvents._data.length > 0 ?
                            (<View style={homeStyles.containerRecyclerList1}>
                                <RecyclerListView
                                    dataProvider={dataHome.dataEvents}
                                    layoutProvider={layoutProvider1}
                                    rowRenderer={rowRendererEvents}
                                    isHorizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{paddingHorizontal: responsiveWidth(2)}}
                                    style = {homeStyles.recyclerList1}
                                    onEndReachedThreshold={0.5}
                                />
                            </View>) 
                            : 
                            (<View style={homeStyles.containerTextEmpty}>
                                <IconM name='calendar-heart' size={Math.round(responsiveWidth(6))} color={appColors.word1} />
                                <Text style={homeStyles.textEmpty}>Aún no se han creado eventos</Text>
                            </View>)
                        }
                    </View>

                    <View style={homeStyles.line}/>

                    <View style={homeStyles.containerSection3}>
                        <View style={homeStyles.containerHeaderSection}>
                            <View style={homeStyles.containerHorizontal}> 
                                <Text style={homeStyles.textSection1}>Hoteles</Text>
                                <TouchableOpacity activeOpacity={0.6} onPress={() => {props.navigation.navigate('Search', {type: 0})}}>
                                    <Text style={homeStyles.textSection2}>Ver todos</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {dataHome.hoteles._data.length > 0 ?
                            (<View style={homeStyles.containerRecyclerList2}>
                                <RecyclerListView
                                    dataProvider={dataHome.hoteles}
                                    layoutProvider={layoutProvider2}
                                    rowRenderer={rowRendererHoteles}
                                    isHorizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{paddingHorizontal: responsiveWidth(3)}}
                                    style = {homeStyles.recyclerList2}
                                    onEndReachedThreshold={0.5}
                                />
                            </View>) 
                            : 
                            (<View style={homeStyles.containerTextEmpty}>
                                <IconM name='calendar-heart' size={Math.round(responsiveWidth(6))} color={appColors.word1} />
                                <Text style={homeStyles.textEmpty}>Aún no se han agregado hoteles</Text>
                            </View>)
                        }
                    </View>

                    <View style={homeStyles.line}/>

                    <View style={homeStyles.containerSection3}>
                        <View style={homeStyles.containerHeaderSection}>
                            <View style={homeStyles.containerHorizontal}> 
                                <Text style={homeStyles.textSection1}>Restaurantes</Text>
                                <TouchableOpacity activeOpacity={0.6} onPress={() => {props.navigation.navigate('Search', {type: 1})}}>
                                    <Text style={homeStyles.textSection2}>Ver todos</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {dataHome.restaurantes._data.length > 0 ?
                            (<View style={homeStyles.containerRecyclerList2}>
                                <RecyclerListView
                                    dataProvider={dataHome.restaurantes}
                                    layoutProvider={layoutProvider2}
                                    rowRenderer={rowRendererRestaurantes}
                                    isHorizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{paddingHorizontal: responsiveWidth(3)}}
                                    style = {homeStyles.recyclerList2}
                                    onEndReachedThreshold={0.5}
                                />
                            </View>) 
                            : 
                            (<View style={homeStyles.containerTextEmpty}>
                                <IconM name='calendar-heart' size={Math.round(responsiveWidth(6))} color={appColors.word1}/>
                                <Text style={homeStyles.textEmpty}>Aún no se han agregado hoteles</Text>
                            </View>)
                        }
                    </View>

                    <View style={homeStyles.line}/>

                    <View style={homeStyles.containerSection4}>
                        <View style={homeStyles.containerHeaderSection}>
                            <View style={homeStyles.containerHorizontal}> 
                                <Text style={homeStyles.textSection1}>Puntos turisticos</Text>
                            </View>
                        </View>
                        
                        <View style={homeStyles.containerHorizontalFooter}>
                            <TouchableHighlight onPress={() =>{props.navigation.navigate('Search', {type: 2})}} underlayColor={appColors.white3} style={[homeStyles.itemFooter, stylesShadows.shadow1]}>
                                <View style={homeStyles.containerContentItemFooter}>
                                    <View style={[homeStyles.containerItemFooter, {backgroundColor: uniqueColors.item1}]}>
                                        <IconM name='pine-tree' size={Math.round(responsiveWidth(6))} color={appColors.white2}/>
                                    </View>
                                    <Text style={homeStyles.textItemFooter}>Parques</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() =>{props.navigation.navigate('Search', {type: 4})}} underlayColor={appColors.white3} style={[homeStyles.itemFooter, stylesShadows.shadow1]}>
                                <View style={homeStyles.containerContentItemFooter}>    
                                    <View style={[homeStyles.containerItemFooter, {backgroundColor: uniqueColors.item2}]}>
                                        <Icon name='museum' size={Math.round(responsiveWidth(6))} color={appColors.white2}/>
                                    </View>
                                    <Text style={homeStyles.textItemFooter}>Museos</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() =>{props.navigation.navigate('Search', {type: 6})}} underlayColor={appColors.white3} style={[homeStyles.itemFooter, stylesShadows.shadow1]}>
                                <View style={homeStyles.containerContentItemFooter}>    
                                    <View style={[homeStyles.containerItemFooter, {backgroundColor: uniqueColors.item3}]}>
                                        <IconM name='glass-cocktail' size={Math.round(responsiveWidth(6))} color={appColors.white2}/>
                                    </View>
                                    <Text style={homeStyles.textItemFooter}>Bares</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={homeStyles.containerHorizontalFooter}>
                            <TouchableHighlight onPress={() =>{props.navigation.navigate('Search', {type: 3})}} underlayColor={appColors.white3} style={[homeStyles.itemFooter, stylesShadows.shadow1]}>
                                <View style={homeStyles.containerContentItemFooter}>
                                    <View style={[homeStyles.containerItemFooter, {backgroundColor: uniqueColors.item4}]}>
                                        <IconM name='coffee' size={Math.round(responsiveWidth(6))} color={appColors.white2}/>
                                    </View>
                                    <Text style={homeStyles.textItemFooter}>Cafeteria</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() =>{props.navigation.navigate('Search', {type: 5})}} underlayColor={appColors.white3} style={[homeStyles.itemFooter, stylesShadows.shadow1]}>
                                <View style={homeStyles.containerContentItemFooter}>
                                    <View style={[homeStyles.containerItemFooter, {backgroundColor: uniqueColors.item5}]}>
                                        <Icon name='attractions' size={Math.round(responsiveWidth(6))} color={appColors.white2}/>
                                    </View>
                                    <Text style={homeStyles.textItemFooter}>Recreacion</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() =>{props.navigation.navigate('Search', {type: 7})}} underlayColor={appColors.white3} style={[homeStyles.itemFooter, stylesShadows.shadow1]}>
                                <View style={homeStyles.containerContentItemFooter}>
                                    <View style={[homeStyles.containerItemFooter, {backgroundColor: uniqueColors.item6}]}>
                                        <IconM name='store-24-hour' size={Math.round(responsiveWidth(6))} color={appColors.white2}/>
                                    </View>
                                    <Text style={[homeStyles.textItemFooter, {bottom: 0}]}>Prestador turistico</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SkeletonHome>
        </>
    )
}

const homeStyles = StyleSheet.create({
    containerPage: {
        backgroundColor: appColors.white1,
        alignItems: 'center',
    },
    header: {
        height: responsiveHeight(8),
        width: '100%',
        position: 'absolute',
        top: 0,
        flexDirection: 'row',
        backgroundColor: appColors.secondarySoft,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        zIndex: 1
    },
    containerHedaerText: {
        height: '100%',
        width: '78%',
        paddingLeft: responsiveWidth(5),
        justifyContent: 'center',
    },
    containerAvatar: {
        height: '100%',
        width: '22%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerAvatar2: {
        height: responsiveWidth(11), 
        width: responsiveWidth(11), 
        borderRadius: 100,
        overflow: 'hidden'
    },
    scrollView: {
        width: '100%',
        height: '100%',
    },
    containerWeather: {
        width: '100%',
        height: responsiveHeight(13),
        marginTop: responsiveHeight(9),
        marginBottom: responsiveHeight(1),
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerSection1: {
        width: '100%',
        height: responsiveHeight(27),
    },
    containerSection2: {
        width: '100%',
        height: responsiveHeight(30),
    },
    containerSection3: {
        width: '100%',
        height: responsiveHeight(30),
    },
    containerSection4: {
        width: '100%',
        height: responsiveHeight(38),    
        marginBottom: responsiveHeight(11)
    }, 
    containerHeaderSection: {
        width: '90%',
        height: responsiveHeight(5),
        alignSelf: 'center',
    },
    containerHorizontal: {
        width: '100%',
        height: responsiveHeight(5),
        paddingHorizontal: responsiveWidth(0.5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    containerHorizontalFooter: {
        width: '100%',
        height: '42.5%',
        paddingHorizontal: responsiveWidth(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    containerItemFooter: {
        width: responsiveWidth(13),
        height: responsiveWidth(13),
        position: 'absolute',
        top: responsiveHeight(1.5),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    containerContentItemFooter: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerTextEmpty: {
        height: responsiveHeight(23.5),
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'center',
    },
    containerRecyclerList1: {
        width: '100%', 
        height: responsiveHeight(24),
        marginTop: responsiveHeight(0.5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerRecyclerList2: {
        width: '100%', 
        height: responsiveHeight(21),
        marginTop: responsiveHeight(0.5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    recyclerList1: {
        width: '100%', 
        height: responsiveHeight(23),
    },
    recyclerList2: {
        width: '100%', 
        height: responsiveHeight(21),
    },
    itemList1: {
        width: responsiveWidth(35), 
        height: responsiveHeight(23),
    },
    itemList2: {
        width: responsiveWidth(34), 
        height: responsiveHeight(21),
    },
    itemFooter: {
        height: responsiveWidth(23),
        width: responsiveWidth(23),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: appColors.white3,
        backgroundColor: appColors.white2,
    },


    textHeader: {
        fontSize: responsiveHeight(2.4),
        fontWeight: 'bold',
        color: appColors.white1,
    },
    textSection1: {
        fontSize: responsiveHeight(2.4),
        fontWeight: '600',
        color: appColors.word1,
    },
    textSection2: {
        fontSize: responsiveHeight(2.2),
        fontWeight: '600',
        color: appColors.primaryDisabled,
    },
    textEmpty: {
        fontSize: responsiveHeight(2), 
        color: appColors.word1,
        textAlign: 'center'
    },
    textItemFooter:{
        fontSize: responsiveHeight(1.5), 
        color: appColors.word1,
        textAlign: 'center',
        position: 'absolute',
        bottom: responsiveHeight(0.7),
    },

    line: {
        width: '90%',
        alignSelf: 'center',
        borderColor: appColors.gray1,
        borderBottomWidth: 0.5,
    }
})