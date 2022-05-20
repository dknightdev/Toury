//Native imports
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Linking, TouchableOpacity, Text } from 'react-native'

//External components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MapView, { Callout, Circle, Marker } from 'react-native-maps';

//Styles
import { appColors, stylesShadows } from '../styles'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

//Api
import { conexionPetitionGeneral } from '../services/apiConnection'

export const Map = ({dim, coordinates, name}) => {

    const [localitation, setLocalitation] = useState({latitude: 0, longitude: 0})

    useEffect(() => {
        const executeEffect = async () => {
            if(coordinates){
                const [ lat, lon ] = coordinates.split(',').map(el => Number(el.trim()))
                setLocalitation({latitude: lat, longitude: lon})
            }
        }
        executeEffect()
    }, [coordinates])

    const openGoogleMaps = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });

        //recibir las coordenadas del sitio especifico
        const latLng = `${localitation.latitude},${localitation.longitude}`;
        const label = 'Custom Label';
        const url = Platform.select({ios: `${scheme}${label}@${latLng}`, android: `${scheme}${latLng}(${label})`});

        Linking.openURL(url);
    }

    
    return(
        <TouchableOpacity activeOpacity={0.9} onLongPress={() => {openGoogleMaps()}} style={[siteStyles.container, dim, stylesShadows.shadow1]}> 
            <MapView
                style={siteStyles.map}
                initialRegion={{
                    latitude: 6.28832113880824, 
                    longitude: -73.14794790092702,
                    latitudeDelta: 0,
                    longitudeDelta: 0.015,
                }}
            >
                <Marker
                    coordinate={localitation}
                    pinColor="blue"
                >
                </Marker>
            </MapView>
        </TouchableOpacity>
    )
    
}

const siteStyles = StyleSheet.create({
    container: {
        width: '100%',
        height: responsiveHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appColors.white1,
        borderRadius: 15,
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    },
})