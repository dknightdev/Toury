//Native imports
import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, TouchableHighlight, ActivityIndicator, TextInput } from 'react-native'

//External components
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import {LayoutProvider, DataProvider, RecyclerListView} from 'recyclerlistview'

//Components
import { ModalMessage } from '../../components/ModalMessage'

//redux
import { useSelector } from 'react-redux'

//Styles
import { appColors, stylesContainers, stylesInputs, stylesShadows, uniqueColors } from '../../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

//Api
import { conexionPetitionGeneral } from '../../services/apiConnection'

let layoutProvider = new LayoutProvider(index => { return 'default'}, (type, dim) => {dim.width = responsiveWidth(100); dim.height = responsiveHeight(30)})

export const Review = (props) => {
    //Variables
    const { dataUser } = useSelector(state => state.generalReducer)

    const [loading, setLoading] = useState({loadingData: false, loadingSubmit: false})
    const [dataForm, setDataForm] = useState({comment: '', score: -1})
    const [dataReviews, setDataReviews] = useState(new DataProvider((r1, r2) => {return r1}))
    const [dataModal, setDataModal] = useState({textMain: '', text: '', buttonText: '', visible: false, success: false})

    useEffect(() => {
        const executeEffect = async () => {
            if(props.route.params){
                setDataForm({comment: '', score: -1})
                await getDataReview()
            }
        }
        executeEffect()
    }, [props.route.params])


    //Render recycler
    const rowRenderer = (type, item, index, extendedState) => {
        return(
            <View style={[reviewStyles.containerReview, stylesShadows.shadow1]}>
                <View style={reviewStyles.containerReviewSection1}>
                    <View style={reviewStyles.containerReviewAvatar}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => {}} style={reviewStyles.containerReviewAvatar2}>
                            <Image
                                resizeMode='contain'
                                source={require('../../../public/user_images/imagen_user_0.png')}
                                style={{height: '100%', width: '100%'}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={reviewStyles.containerReviewHeader}>
                        <View style={reviewStyles.containerReviewHeaderSection1}>
                            <Text style={reviewStyles.textReviewName}>{item.document == dataUser.document ? 'Tú' : item.user_name }</Text>
                            <Text style={reviewStyles.textReviewDate}>{item.date.split('T')[0]}</Text>
                        </View>
                        <View style={reviewStyles.containerReviewHeaderSection2}>
                            {[0,0,0,0,0].map((el, index) => {
                                return (
                                    <IconM key={index} name='star' size={Math.round(responsiveWidth(6.4))} color={item.calification == 0 ? uniqueColors.item3UltraSoft : item.calification/(index+1) >= 1 ? uniqueColors.item3 : uniqueColors.item3UltraSoft}/>
                                )
                            })}
                        </View>
                    </View>
                </View>
                <View style={reviewStyles.containerReviewSection2}>
                    <ScrollView style={{width: '100%', height: '100%'}}>
                        <Text style={reviewStyles.textReviewComment}>{item.description}</Text>
                    </ScrollView>
                </View>
            </View>
        )
    }

    const getDataReview = async () => {
        setLoading({...loading, loadingData: true})

        const res = await conexionPetitionGeneral({siteId: props.route.params.siteId}, 'getDataReview')       
        if(res.status === 200){
            setDataReviews(dataReviews.cloneWithRows(res.data))
        }else if(res.status === 400){
            setDataModal({textMain: 'Ha ocurrido un error', buttonText: 'Continuar', text: res.message, visible: true, success: false})
        }

        setLoading({...loading, loadingData: false})
    }
    
    const onSubmit = async () => {
        setLoading({...loading, loadingSubmit: true})
        const res = await conexionPetitionGeneral({...dataForm, document: dataUser.document, siteId: props.route.params.siteId}, 'setReview')
        
        if(res.status === 200){
            setDataForm({comment: '', score: -1})
            setDataModal({textMain: '¡Genial!', buttonText: 'Aceptar', text: res.message, visible: true, success: true})
        }else if(res.status === 400){
            setDataModal({textMain: 'Inténtalo entalo de nuevo', buttonText: 'Aceptar', text: res.message, visible: true, success: false})
        }
        setLoading({...loading, loadingSubmit: false})

        if(res.status === 200){ await getDataReview() }
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
            <View style={[stylesContainers.containerPage, reviewStyles.containerPage]}>
                <TouchableOpacity activeOpacity={0.6} style={reviewStyles.buttonReturn} onPress={() => props.navigation.navigate('Site')}>
                    <Icon color={appColors.word1} size={Math.round(responsiveHeight(4.2))} name={'arrow-back'}/>
                </TouchableOpacity>

                <TouchableHighlight disabled={loading.loadingSubmit} underlayColor={appColors.primaryUnderlay} style={[reviewStyles.buttonPost, stylesShadows.shadow1, loading.loadingSubmit ? {backgroundColor: appColors.primaryDisabled} : {backgroundColor: appColors.primary}]} onPress={() => onSubmit()}>
                    {loading.loadingSubmit ? <ActivityIndicator style={{position: 'absolute'}} size={responsiveHeight(3.3)} color={appColors.white1}/> : <Text style={reviewStyles.textButtonPost}>Publicar</Text>}
                </TouchableHighlight>


                <View style={reviewStyles.containerHeader}>
                    <View style={reviewStyles.containerSection1}>
                        <View style={reviewStyles.containerAvatar}>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {}} style={reviewStyles.containerAvatar2}>
                                <Image
                                    resizeMode='contain'
                                    source={require('../../../public/user_images/imagen_user_0.png')}
                                    style={{height: '100%', width: '100%'}}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={reviewStyles.containerBodySection1}>
                            <Text style={reviewStyles.textName}>{dataUser.user_name}</Text>
                            <Text style={reviewStyles.texgInfo}>Recuerda que estas reseñas son públicas, evita usar malas palabras</Text>
                            <View style={reviewStyles.containerIcons}>
                                {[0,0,0,0,0].map((el, index) => {
                                    return (
                                        <TouchableHighlight key={index} onPress={() => setDataForm({...dataForm, score: index})} style={reviewStyles.buttonStar} underlayColor={appColors.white3}>
                                            <IconM name='star' size={Math.round(responsiveWidth(6.3))} color={dataForm.score >= index ? uniqueColors.item3 : appColors.gray}/>
                                        </TouchableHighlight>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                    <View style={reviewStyles.containerSection2}>
                        <TextInput
                            placeholder="Escribe tu experiencia"
                            placeholderTextColor={appColors.gray1}
                            style={reviewStyles.inputArea}

                            multiline={true}
                            onChangeText={value => setDataForm({...dataForm, comment: value})}
                            value={dataForm.comment}
                        />
                    </View>
                    <View style={reviewStyles.line}/>
                </View>
                <View style={reviewStyles.containerReviews}>
                    <View style={reviewStyles.containerHeaderBody}>
                        <IconM name='comment-multiple' size={Math.round(responsiveWidth(7))} color={appColors.word1}/>
                        <Text style={[reviewStyles.text1, {marginLeft: responsiveWidth(3), marginBottom: responsiveHeight(0.2)}]}>Reseñas</Text>
                    </View>
                    
                    {
                        loading.loadingData ? (
                            <View style={reviewStyles.containerReplaceRecylcer}>
                                <ActivityIndicator size={responsiveHeight(7)} color={appColors.primary}/>
                            </View>
                        ) : (
                            dataReviews._data.length > 0 ?
                            (<View style={reviewStyles.containerRecyclerList}>
                                <RecyclerListView
                                    dataProvider={dataReviews}
                                    layoutProvider={layoutProvider}
                                    rowRenderer={rowRenderer}
                                    contentContainerStyle={{alignItems: 'center', justifyContent: 'center',paddingHorizontal: responsiveWidth(2)}}
                                    style = {reviewStyles.recyclerList}
                                    onEndReachedThreshold={0.5}
                                />
                            </View>) 
                            : 
                            (<View style={reviewStyles.containerReplaceRecylcer}>
                                <IconM name='comment-text-multiple-outline' size={Math.round(responsiveWidth(8))} color={appColors.word1} />
                                <Text style={reviewStyles.textEmpty}>Aún no se han creado reseñas para este sitio</Text>
                            </View>)
                        )
                    }
                    
                    
                </View>
            </View>
        </>
    )
}

const reviewStyles = StyleSheet.create({
    containerPage: {
        backgroundColor: appColors.white1,
    },
    containerHeader: {
        width: '100%',
        height: '43%',
        paddingBottom: responsiveHeight(1)
    },
    containerReviews: {
        width: '100%',
        marginTop: responsiveHeight(1),
    },
    containerSection1: {
        width: '100%',
        height: '65%',
        paddingHorizontal: responsiveWidth(4),
        flexDirection: 'row',
    },
    containerSection2: {
        width: '100%',
        height: '35%',
        paddingHorizontal: responsiveWidth(5),
        paddingVertical: responsiveHeight(1),
    },
    containerAvatar: {
        height: '100%',
        width: '22%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerAvatar2: {
        height: responsiveWidth(16), 
        width: responsiveWidth(16), 
        borderRadius: 100,
        overflow: 'hidden',
    },
    containerBodySection1: {
        height: '100%',
        width: '78%',
        justifyContent: 'center',
        marginTop: responsiveHeight(0.5),
        paddingLeft: responsiveWidth(1),
        paddingRight: responsiveWidth(6.5),
    },
    containerIcons: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        marginBottom: responsiveHeight(1.5),
        flexDirection: 'row',
    },
    containerHeaderBody: {
        flexDirection: 'row', 
        alignItems: 'center',
        paddingLeft: responsiveWidth(1), 
        marginLeft: responsiveWidth(4), 
        marginTop: responsiveHeight(1),
    },
    containerReview: {
        width: '90%',
        height: responsiveHeight(28),
        alignSelf: 'center',
        paddingVertical: responsiveHeight(1),
        borderRadius: 20,
        backgroundColor: appColors.white1,
        borderWidth: 0.5, borderColor: appColors.gray
    },
    containerReviewSection1: {
        width: '100%',
        height: '50%',
        flexDirection: 'row',
        paddingHorizontal: responsiveWidth(3)
    },
    containerReviewSection2:{
        width: '100%',
        height: '50%',
        paddingHorizontal: responsiveWidth(4)
    },
    containerReviewAvatar: {
        height: '100%',
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerReviewAvatar2: {
        height: responsiveWidth(14), 
        width: responsiveWidth(14), 
        borderRadius: 100,
        overflow: 'hidden',
    },
    containerReviewHeader: {
        height: '100%',
        width: '80%',
        flexDirection: 'row'
    },
    containerReviewHeaderSection1: {
        height: '100%',
        width: '55%',
        justifyContent: 'center',
    },
    containerReviewHeaderSection2: {
        height: '100%',
        width: '55%',
        paddingTop: responsiveHeight(3),
        flexDirection: 'row',
    },
    containerRecyclerList: {
        width: '100%', 
        height: responsiveHeight(50),
        marginTop: responsiveHeight(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerReplaceRecylcer: {
        width: '100%', 
        height: responsiveHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: responsiveWidth(9)
    },
    recyclerList: {
        width: '100%', 
        height: responsiveHeight(51),
    },


    inputArea: {
        width: '100%',
        height: '100%',
        paddingHorizontal: responsiveWidth(2),
        fontSize: responsiveHeight(2.2),
        color: appColors.word1,
        textAlignVertical: 'top',
        backgroundColor: appColors.white3,
        borderWidth: 0.4, borderColor: appColors.gray1
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
    buttonPost: {
        height: responsiveHeight(5.5),
        width: responsiveWidth(36),
        position: 'absolute',
        top: responsiveHeight(2.5),
        right: responsiveHeight(2.5),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonStar: {
        width: responsiveWidth(10.5),
        height: responsiveWidth(10.5),
        marginHorizontal: responsiveWidth(0.6),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appColors.white1,
        borderRadius: 50,
        borderWidth: 0.4, borderColor: appColors.gray1
    },



    textButtonPost: {
        color: appColors.white1, 
        fontSize: responsiveHeight(2.6),
        alignSelf: 'center', 
        fontWeight: '500', 
    },
    textName: {
        fontSize: responsiveHeight(2.8),
        fontWeight: '700',
        color: appColors.word1,   
    },
    texgInfo: {
        fontSize: responsiveHeight(2.05),
        fontWeight: '500',
        color: appColors.gray,   
    },
    text1: {
        fontSize: responsiveHeight(2.8),
        fontWeight: '500',
        color: appColors.word1,   
    },
    textReviewName: {
        fontSize: responsiveHeight(2.3),
        fontWeight: '700',
        color: appColors.word1,   
    },
    textReviewDate: {
        fontSize: responsiveHeight(2),
        fontWeight: '500',
        color: appColors.gray1,
    },
    textReviewComment:{
        fontSize: responsiveHeight(2.1),
        color: appColors.gray,
        fontWeight: '500',
    },
    textEmpty: {
        fontSize: responsiveHeight(2.3),
        color: appColors.word1,
        fontWeight: '500',
        textAlign: 'center',
        alignSelf: 'center'
    },

    line:{
        width: '95%',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
        borderColor: appColors.gray1,
        borderBottomWidth: 0.5,
    },
})