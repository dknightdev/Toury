//Native imports
import React from 'react'
import { View, StyleSheet } from 'react-native'

//External components
import SkeletonPlaceholder from "react-native-skeleton-placeholder"

//Styles
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { appColors, stylesContainers } from '../../styles'

export const SkeletonHome = ({visible, children}) => {
    if (visible) {
        return (
            <SkeletonPlaceholder>
                <View style={[stylesContainers.containerPage, skeletonStyles.containerPage]}>
                    <View style={skeletonStyles.header}/>
                    <View style={skeletonStyles.containerWeather}/>
                    <View style={skeletonStyles.containerSection}>
                        <View style={skeletonStyles.containerHeaderSection}/>
                        <View style={skeletonStyles.contentSection}/>
                    </View>
                    <View style={skeletonStyles.containerSection}>
                        <View style={skeletonStyles.containerHeaderSection}/>
                        <View style={skeletonStyles.contentSection}/>
                    </View>
                    <View style={skeletonStyles.containerSection}>
                        <View style={skeletonStyles.containerHeaderSection}/>
                        <View style={skeletonStyles.contentSection}/>
                    </View>
                </View>
            </SkeletonPlaceholder>
        )
    }else {
        return (
            <>{children}</>
        )
    }
}

const skeletonStyles = StyleSheet.create({
    containerPage: {
        alignItems: 'center',
    },
    header: {
        height: responsiveHeight(8),
        width: responsiveWidth(100),
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: responsiveHeight(1)
    },
    containerWeather: {
        width: responsiveWidth(50),
        height: responsiveHeight(13),
        marginVertical: responsiveHeight(0.7),
        borderRadius: 20,
    },
    containerSection: {
        width: responsiveWidth(90),
        height: responsiveHeight(27),
        marginVertical: responsiveHeight(1),
        alignItems: 'center',
    },
    containerHeaderSection: {
        width: responsiveWidth(85),
        height: responsiveHeight(5),
        marginBottom: responsiveHeight(0.7),
        borderRadius: 15,
    },
    contentSection: {
        width: responsiveWidth(85),
        height: responsiveHeight(21),
        borderRadius: 15,
    }
})
