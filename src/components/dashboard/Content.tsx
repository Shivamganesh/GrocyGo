import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { adData, categories } from '@utils/dummyData'
import AdCarousal from './AdCarousal'
import CustomText from '@components/ui/CoustemText'
import { Fonts } from '@utils/Constants'
import CategoryContainer from './CategoryContainer'

const Content = () => {
  return (
    <View style={styles.container}>
      <AdCarousal adData ={adData} />
      <CustomText variant='h5' fontFamily={Fonts.SemiBold} >Grocery & Kitchen</CustomText>
      <CategoryContainer data ={categories} />
      <CustomText variant='h5' fontFamily={Fonts.SemiBold} >BestSellers</CustomText>
      <CategoryContainer data ={categories} />
      <CustomText variant='h5' fontFamily={Fonts.SemiBold} >Snacks & Drinks</CustomText>
      <CategoryContainer data ={categories} />
      <CustomText variant='h5' fontFamily={Fonts.SemiBold} >Home & Lifestyle</CustomText>
      <CategoryContainer data ={categories} />

    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20
    }
})

export default Content