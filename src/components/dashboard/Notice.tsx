import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { NOTICEHeight } from '@utils/Scaling'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomText from '@components/ui/CoustemText'
import { Fonts } from '@utils/Constants'
import Svg, { Defs, G, Path, Use } from 'react-native-svg'
import { wavyData } from '@utils/dummyData'

const Notice:FC = () => {
  return (
    <View style={{height:NOTICEHeight}}>
        <View style={styles.container}>
            <View style={styles.noticeContainer}>
                <SafeAreaView style={{padding:8}}>
                    <CustomText style={styles.heading} variant='h8' fontFamily={Fonts.SemiBold} >
                        It's raining near this location 
                    </CustomText>
                    <CustomText variant='h9' style={styles.textCenter}>
                        Our delivery partners may take longer to reach you 
                    </CustomText>

                </SafeAreaView>

            </View>

        </View>

        <Svg 
        width='100%'
        height='35'
        fill='#CCD5E4'
        viewBox='0 0 4000 1000'
        preserveAspectRatio='none'
        style={styles.wave}
        
        >
            <Defs>
                <Path id='wavepath' d={wavyData} />
            </Defs>
            <G>
            <Use href='#wavepath' y="321" />
            </G>
            
        </Svg>
     
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#CCD5E4'
    },
    noticeContainer:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#CCD5E4'
    },
    textCenter:{
        textAlign:'center',
        marginBottom:8
    },
    heading:{
        color:'#2D3875',
        textAlign:'center',
        marginBottom:8
    },
    wave:{
        width:'100%',
        transform:[{rotateX:'180deg'}]
    }
})

export default Notice