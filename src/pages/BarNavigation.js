//Native imports
import React, { useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'

//External components
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

//Pages
import { Home } from './home/home'
import { SiteList } from './site/siteList/SiteList'
import { Profile } from './profile/profile'

//Styles
import { appColors } from '../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'


const Tab = createBottomTabNavigator()

export const BarNavigation = (props) => {

    return(
        <Tab.Navigator
            initialRouteName='Home'
            backBehavior='order'
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: responsiveHeight(9.5),

                    position: 'absolute',
                    bottom: 0,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,

                    borderWidth: 0,
                    backgroundColor: appColors.primary,
                    shadowColor: appColors.primary,
                    ...barNavigationStyles.shadow
                }
            }}
        >
            <Tab.Screen name='Profile' component={Profile} options={{
                tabBarIcon: ({focused}) => (
                    <View style={[barNavigationStyles.containerButton, focused ? {backgroundColor: appColors.white2} : {}]}>
                        <Icon size={responsiveHeight(3.8)} name={'account-circle'} color={focused ? appColors.primary : appColors.white3}/>
                        <Text style={[barNavigationStyles.textButton, {color: focused ? appColors.primary : appColors.white3}]} numberOfLines={1}>Perfil</Text>
                    </View>
                )
            }}/>

            <Tab.Screen name='Home' component={Home} options={{
                tabBarIcon: ({focused}) => (
                    <View style={[barNavigationStyles.containerButton, focused ? {backgroundColor: appColors.white2} : {}]}>
                        <Icon size={responsiveHeight(3.8)} name={'home'} color={focused ? appColors.primary : appColors.white3}/>
                        <Text style={[barNavigationStyles.textButton, {color: focused ? appColors.primary : appColors.white3}]} numberOfLines={1}>Inicio</Text>
                    </View>
                )
            }}/>
            <Tab.Screen name='Search' component={SiteList} options={{
                tabBarIcon: ({focused}) => (
                    <View style={[barNavigationStyles.containerButton, focused ? {backgroundColor: appColors.white2} : {}]}>
                        <Icon size={responsiveHeight(3.8)} name={'map-search'} color={focused ? appColors.primary : appColors.white3}/>
                        <Text style={[barNavigationStyles.textButton, {color: focused ? appColors.primary : appColors.white3}]} numberOfLines={1}>Buscar</Text>
                    </View>
                )
            }}/>
        </Tab.Navigator>
    )
}

const barNavigationStyles = StyleSheet.create({
    containerButton: {
        height: responsiveWidth(14.5),
        width: responsiveWidth(14.5),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 20,
    },
    textButton: {
        fontSize: responsiveHeight(1.5),
        fontWeight: '500'
    },
    shadow: {
        shadowColor: appColors.primary,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
})