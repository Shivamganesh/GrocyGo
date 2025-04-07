import { View, Text, ViewStyle, StyleSheet } from 'react-native'
import React, { FC, ReactNode } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

//custom component 

interface CustomerSafeAreaViewProps{
    children:ReactNode,
    style?:ViewStyle
}

const CustomerSafeAreaView:FC<CustomerSafeAreaViewProps> = ({children,style}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
       <View style={[styles.container, style]}>
        
        {children}</View>
    </SafeAreaView>
  )
}

const styles =StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    }
})

export default CustomerSafeAreaView