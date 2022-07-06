//Native imports
import React, {useEffect, useState} from 'react'

//Navigation
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import {createDrawerNavigator } from "@react-navigation/drawer"

//Redux
import { useDispatch, useSelector } from "react-redux"
import { stateLogged, stateSplash } from './redux/actions/loginAction'

//Pages/Components
import { LateralBar } from './components/LateralBar'
import { BarNavigation } from './pages/BarNavigation'
import { Splash } from './pages/splash/Splash'
import { Login } from './pages/login/Login'
import { Register } from './pages/register/Register'
import { PreRegister } from './pages/preRegister/PreRegister'
import { Home } from './pages/home/home'
import { Profile } from './pages/profile/Profile'
import { SiteList } from './pages/site/siteList/SiteList'
import { Site } from './pages/site/Site'
import { Event } from './pages/event/Event'
import { Review } from './pages/review/Review'
import { EventList } from './pages/event/eventList/EventList'
import { EventAdd } from './pages/event/eventAdd/EventAdd'

//Utils
import { secureStorage } from './utils/preferences'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()
const configStyle = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 50,
      mass: 3,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
};

export default function Router () {
    const dispatch = useDispatch()
    const { splash, token } = useSelector(state => state.loginReducer)
    
    
    useEffect(() => {
        const executeEffect = async () => {
            let token = await secureStorage.getItem('token')
            dispatch(stateLogged(token))

            setTimeout(() => {
                dispatch(stateSplash(false))
            }, 2000);
        }
        executeEffect()
    }, [])


    return (
        <NavigationContainer>
            {
                splash ? (
                    <Stack.Navigator screenOptions={{headerShown: false}}>
                        <Stack.Screen name='Splash' component={Splash}/>
                    </Stack.Navigator>
                ):( token === null ? (
                    <Stack.Navigator 
                        screenOptions={{headerShown: false, gestureEnabled: true, gestureDirection: 'horizontal', transitionSpec: {open: configStyle, close: configStyle}}} 
                        initialRouteName='Login'
                        animation='fade' 
                    >
                        <Stack.Screen name='Login' component={Login}/>
                        <Stack.Screen name='Register' component={Register}/>
                        <Stack.Screen name='PreRegister' component={PreRegister}/>
                    </Stack.Navigator>
                    
                ):(
                    <Drawer.Navigator
                        screenOptions={{
                            headerShown: false, 
                            gestureEnabled: true, 
                            gestureDirection: 'horizontal', 
                            transitionSpec: {open: configStyle, close: configStyle},
                            drawerStyle: {borderTopRightRadius: 25, borderBottomRightRadius: 25, overflow: 'hidden'}
                        }}
                        drawerContent={props => <LateralBar {...props}/>}
                        initialRouteName="BarNavigation"
                        animation='fade'
                    >
                        {/* BarNavigation: Contiene las interfaces -> Home, Profile, SiteList*/}
                        <Stack.Screen name='BarNavigation' component={BarNavigation}/>
                        {/* <Stack.Screen name='Search' component={SiteList}/>
                        <Stack.Screen name='Profile' component={Profile}/>
                        <Stack.Screen name='Home' component={Home}/> */}


                        <Stack.Screen name='Site' component={Site}/>
                        <Stack.Screen name='Event' component={Event}/>
                        <Stack.Screen name='Review' component={Review}/>
                        <Stack.Screen name='EventAdd' component={EventAdd}/>
                        <Stack.Screen name='EventList' component={EventList}/>
                    </Drawer.Navigator>
                ))
            }
        </NavigationContainer>
    );
}