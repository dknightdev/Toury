//Native imports
import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'

//External components
import { Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import {LayoutProvider, DataProvider, RecyclerListView} from 'recyclerlistview'

//Components
import { CardSite } from '../../../components/CardSite'

//redux
import { useSelector } from 'react-redux'

//Styles
import { appColors, stylesContainers, stylesInputs, stylesShadows, uniqueColors } from '../../../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'


let layoutProvider = new LayoutProvider(index => { return 'default'}, (type, dim) => {dim.width = responsiveWidth(100); dim.height = responsiveHeight(18)})

export const SiteList = (props) => {
    const { dataSites } = useSelector(state => state.generalReducer)

    const [processing, setProcessing] = useState({focus: false, loading: false})
    const [filter, setFilter] = useState({varSearch: '', varNameTag: '', type: -1, data: []})
    const [dataFiltered, setDataFiltered] = useState(new DataProvider((r1, r2) => {return r1}))

    useEffect(() => {
        const executeEffect = async () => {
            if(props.route.params){
                const type = props.route.params.type

                let dataTemp = filterByType(dataSites, type)
                if(filter.varSearch != ''){ dataTemp = filterByWord(dataTemp, filter.varSearch) }

                setFilter({...filter, type: type, data: dataSites})
                setDataFiltered(dataFiltered.cloneWithRows(dataTemp))
            }else {
                setFilter({...filter, type: -1, data: dataSites})
                setDataFiltered(dataFiltered.cloneWithRows(dataSites))
            }
        }
        executeEffect()
    }, [props.route.params])

    const filterOnChange = (value) => {
        setFilter({...filter, varSearch: value})

        setDataFiltered(
            dataFiltered.cloneWithRows(
                filter.type != -1 ? filterByWord(filterByType(filter.data, filter.type), value) : filterByWord(filter.data, value)
            )
        )
    }

    const getNameType = (type) => {
        const listNames = ['Hoteles', 'Restaurantes', 'Parques', 'Cafeterias', 'Museos', 'Centros Recreacionales', 'Bares', 'Prestadores turisticos']
        return listNames[type]
    }

    const removeAccents = (val) => {
        const accents = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
	    return val.split('').map(word => accents[word] || word).join('').toString();
    }

    const filterByType = (data, type) => {
        return data.filter(el => el.type == type)
    }

    const filterByWord = (data, word) => {
        return data.filter(el => el.name.toUpperCase().includes(word.toUpperCase()))
    }

    const removeFilterByType = () => {
        setFilter({...filter, type: -1})
        setDataFiltered(dataFiltered.cloneWithRows(filter.varSearch != '' ? filterByWord(filter.data, filter.varSearch) : filter.data))
    }

    const removeFilterByWord = () => {
        setFilter({...filter, varSearch: ''})
        setDataFiltered(dataFiltered.cloneWithRows(filter.type != -1 ? filterByType(filter.data, filter.type) : filter.data))
    }

    const rowRenderer = (type, item, index, extendedState) => {
        return (
            <CardSite item={item} func={() => {props.navigation.navigate('Site', {data: item})}}/>
        )
    }

    return(
        <View style={[stylesContainers.containerPage, siteListStyles.containerPage]}>
            <TouchableOpacity activeOpacity={0.6} style={siteListStyles.buttonReturn} onPress={() => props.navigation.jumpTo('Home')}>
                <Icon color={appColors.word1} size={Math.round(responsiveHeight(4.2))} name={'arrow-back'}/>
            </TouchableOpacity>

            <View style={siteListStyles.header}>
                <Input 
                    placeholder="Busca cualquier sitio ..."
                    placeholderTextColor={appColors.gray}
                    
                    inputContainerStyle={[stylesContainers.containerInputSearch2, {marginBottom: responsiveHeight(0)}, processing.focus ? {...stylesShadows.shadow2, ...stylesContainers.inputSearchFocused} : {}]}
                    containerStyle={stylesContainers.containerInputSearch}
                    inputStyle={stylesInputs.inputSearch}
                    
                    selectionColor={appColors.primary}
                    onFocus={() => {setProcessing({...processing,focus: true})}}
                    
                    onChangeText={value => {filterOnChange(value)}}
                    value={filter.varSearch}

                    renderErrorMessage={false}

                    rightIcon={<Icon size={responsiveHeight(3.4)} name="search" color={appColors.gray}/>}
                    rightIconContainerStyle={stylesContainers.containerInputRightIcon}
                />
            </View>
            <View style={siteListStyles.body}>
                <ScrollView horizontal={true} style={siteListStyles.containerTags} contentContainerStyle={{alignItems: 'center'}}>
                    
                        <View style={siteListStyles.tag}>
                            <Text style={siteListStyles.textTag}>Todos</Text>
                        </View>
                        <IconM size={responsiveHeight(3.4)} name="chevron-right" color={appColors.gray}/>

                        {filter.type != -1 && (
                            <View style={siteListStyles.tag}>
                                <Text style={siteListStyles.textTag}>{getNameType(filter.type)}</Text>
                                <TouchableOpacity activeOpacity={0.6} style={siteListStyles.buttonClose} onPress={() => {removeFilterByType()}}>
                                    <IconM size={responsiveHeight(2.8)} name="close-box" color={appColors.gray}/>
                                </TouchableOpacity>
                            </View>
                        )}
                        {filter.type != -1 && (<IconM size={responsiveHeight(3.4)} name="chevron-right" color={appColors.gray}/>)}

                        {filter.varSearch != '' && (
                            <View style={siteListStyles.tag}>
                                <Text style={siteListStyles.textTag}>{filter.varSearch.length > 13 ? filter.varSearch.slice(0,13) + '...' : filter.varSearch}</Text>
                                <TouchableOpacity activeOpacity={0.6} style={siteListStyles.buttonClose} onPress={() => {removeFilterByWord()}}>
                                    <IconM size={responsiveHeight(2.8)} name="close-box" color={appColors.gray}/>
                                </TouchableOpacity>
                            </View>
                        )}
                    

                </ScrollView>
                
                {dataFiltered._data.length > 0 ?
                    (<View style={siteListStyles.containerRecyclerList}>
                        <RecyclerListView
                            dataProvider={dataFiltered}
                            layoutProvider={layoutProvider}
                            rowRenderer={rowRenderer}
                            contentContainerStyle={{paddingBottom: responsiveHeight(13), paddingTop: responsiveHeight(1.5)}}
                            style = {siteListStyles.recyclerList}
                            onEndReachedThreshold={0.5}
                        />
                    </View>) 
                    : 
                    (<View style={siteListStyles.containerTextEmpty}>
                        <IconM name='filter-remove' size={Math.round(responsiveWidth(6))} color={appColors.word1} />
                        <Text style={siteListStyles.textEmpty}>No se encontraron datos</Text>
                    </View>)
                }
            </View>
        </View>
    )
}

const siteListStyles = StyleSheet.create({
    containerPage: {
        backgroundColor: appColors.white1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        width: '100%',
        height: '15%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: responsiveHeight(0.7),
        paddingHorizontal: responsiveWidth(7),
    },
    body: {
        width: '100%',
        height: '85%',
    },
    containerRecyclerList: {
        width: '100%', 
        height: '94%',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    containerTags: {
        width: '86%', 
        maxHeight: responsiveHeight(5),
        marginHorizontal: responsiveWidth(7),
    },
    containerTextEmpty: {
        width: '100%',
        height: '84%',
        justifyContent: 'center', 
        alignItems: 'center',
        
    },
    recyclerList: {
        width: '100%', 
        height: '100%',
    },


    tag: {
        height: responsiveHeight(4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    buttonClose: {
        height: responsiveHeight(4),
        width: responsiveWidth(7),
        marginLeft: responsiveWidth(1),
        marginRight: -responsiveWidth(1.5),
        alignItems: 'flex-start',
        justifyContent: 'center',
    },


    textEmpty: {
        fontSize: responsiveHeight(2), 
        color: appColors.word1,
        textAlign: 'center'
    },
    textTag: {
        fontSize: responsiveHeight(2), 
        color: appColors.primary,
        fontWeight: '500'
    },
})