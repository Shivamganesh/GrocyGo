import { View, Text, StyleSheet, Image } from 'react-native'
import React, { FC } from 'react'
import ScalePress from '@components/ui/ScalePress'
import { navigate } from '@utils/NavigationUtils'
import { Fonts } from '@utils/Constants'
import CustomText from '@components/ui/CoustemText'

const CategoryContainer:FC<{data:any}> = ({data}) => {

    const renderItems =(items:any[])=>{
        return (<>{items.map((item,index)=>{
            return (
                <ScalePress onPress={()=>navigate('ProductCategories')} key={index} style={styles.item}>
                    <View style={styles.imageContainer}
                    >
                        <Image source={item.image} style={styles.image} />

                    </View>
                    <CustomText style={styles.text} variant='h8' fontFamily={Fonts.Medium}></CustomText>
                </ScalePress>

            )

        })}</>
    )
    }
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {renderItems(data?.slice(0,4))}

      </View>
      <View style={styles.row}>
        {renderItems(data?.slice(4))}

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        marginVertical:15
    },
    row:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'baseline',
        marginBottom:25
    },
    text:{
        alignItems:'center'

    },
    item:{
        width:'22%',
        justifyContent:'center',
        alignItems:'center'

    },
    imageContainer:{
        width:'100%',
        justifyContent:'center',
        alignItems:'baseline',
        marginBottom:25,
        height:80,
        borderRadius:10,
        padding:6,
        backgroundColor:'#E5F3F3',
        

    },
    image:{
        width:'100%',
        height:'100%',
        resizeMode:'contain'
    }
})
export default CategoryContainer