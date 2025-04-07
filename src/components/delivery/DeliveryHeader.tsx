import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { FC, useState } from 'react'
import { useAuthStore } from '@state/authStore';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CoustemText';
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import { resetAndNavigate } from '@utils/NavigationUtils';
import { storage, tokenStorage } from '@state/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {MMKV} from 'react-native-mmkv';

interface DeliveryHeaderProps{
    name:string;
    email:string;
}
const storageInstance = new MMKV();

const DeliveryHeader:FC<DeliveryHeaderProps> = ({name,email}) => {
    const {logout,user, setUserProfileImage,} = useAuthStore();
    const [profileImage, setProfileImage] = useState<string | null>(
        storageInstance.getString('profileImage') || null,
      );


     const selectProfileImage = () => {
        launchImageLibrary({mediaType: 'photo'}, (response: any) => {
          if (response.assets && response.assets.length > 0) {
            const imageUri = response.assets[0].uri;
            setProfileImage(imageUri);
            storageInstance.set('profileImage', imageUri);
            setUserProfileImage(imageUri);
          }
        });
      };
    
  return (
    <View style={styles.flexRow}>
       <TouchableOpacity
                onPress={selectProfileImage}
                style={styles.imageContainer}>
                <Image
                  source={
                    profileImage
                      ? {uri: profileImage}
                      : require('@assets/images/delivery_boy.png')
                  }
                  style={styles.profileImage}
                />
                <View style={styles.editIconContainer}>
                  <Text style={styles.editIcon}>✎</Text>
                </View>
              </TouchableOpacity>
              
      <View style={styles.infoContainer}>
        <CustomText variant='h4' fontFamily={Fonts.SemiBold}>
            Hello {name}!

        </CustomText>
        <CustomText variant='h8' fontFamily={Fonts.Medium}>
           {email}

        </CustomText>
      </View>
      <TouchableOpacity onPress={()=>{
        resetAndNavigate('CustomerLogin')
        logout()
        storageInstance.delete('profileImage'); // Clear the stored image
            setProfileImage(null); // Update UI immediately
        tokenStorage.clearAll()
        storage.clearAll()
      }}>
        <Icon name='logout' size={30} color='black' />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    flexRow:{
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        padding:10,
    },
    imgContainer:{
        padding:4,
        borderRadius:100,
        height:60,
        width:60,
        overflow:'hidden',
        backgroundColor:Colors.backgroundSecondary
    },
    // img:{
    //     width:'100%',
    //     bottom:-8,
    //     height:'100%',
    //     resizeMode:'contain'
    // },
    infoContainer:{
        width:'70%'
    },
    imageContainer: {
      position: 'relative',
      alignItems: 'center',
      
    },
    profileImage: {
      width: 70,
      height: 70,
      borderRadius: 50,
      alignItems: 'center',
      backgroundColor:"#fff"
    },
    editIconContainer: {
      position: 'absolute',
      bottom: -5,
      right: '15%',
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 12,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editIcon: {
      color: '#fff',
      fontSize: 14,
      textAlign: 'center',
    },
})

export default DeliveryHeader