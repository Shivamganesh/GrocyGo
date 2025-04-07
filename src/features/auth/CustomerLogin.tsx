import { View, StyleSheet, Image, Keyboard, Alert } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import CustomerSafeAreaView from '@components/global/CustomerSafeAreaView';
import ProductSlider from '@components/login/ProductSlider';

import { resetAndNavigate } from '@utils/NavigationUtils';
import CustomText from '@components/ui/CoustemText' // Fixed typo in import
import { Colors, Fonts, lightColors } from '@utils/Constants';
import CustomInput from '@components/ui/CustomInput';
import CustomButton from '@components/ui/CustomButton';
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight';
import { Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import { customerLogin } from '@service/authService';

const bottomColors =[...lightColors].reverse()

const CustomerLogin: FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [gestureSequence, setGestureSequence] = useState<string[]>([]);
  const keyboardOffsetHeight = useKeyboardOffsetHeight()
  const  animatedValue = useRef(new Animated.Value(0)).current

  useEffect(()=>{
    if(keyboardOffsetHeight==0){
      Animated.timing(animatedValue, {
        toValue :0,
        duration:500,
        useNativeDriver:true
      }).start()
    }else{
      Animated.timing(animatedValue, {
        toValue :-keyboardOffsetHeight *0.84,
        duration:1000,
        useNativeDriver:true
      }).start()
    }
  })

  const handleAuth = async () => {
    Keyboard.dismiss()
    setLoading(true);
    try {
      // Add authentication logic here
      await customerLogin(phoneNumber)
      resetAndNavigate('ProductDashboard')
    } catch (error) {
      Alert.alert("Login Filed")
    } finally {
      setLoading(false);
    }
  };

  const handleGesture = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      const { translationX, translationY } = nativeEvent;
      let direction = '';

      if (Math.abs(translationX) > Math.abs(translationY)) {
        direction = translationX > 0 ? 'right' : 'left';
      } else {
        direction = translationY > 0 ? 'down' : 'up';
      }

      const newSequence = [...gestureSequence, direction].slice(-5);
      setGestureSequence(newSequence);
      console.log(newSequence)

      if (newSequence.join(' ') === 'up up down left right') {
        setGestureSequence([]);
        resetAndNavigate('DeliveryLogin');
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <CustomerSafeAreaView>
          <ProductSlider />
          <PanGestureHandler onHandlerStateChange={handleGesture}>
            <Animated.ScrollView
              bounces={false}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.subContainer}
              style={{transform:[{translateY:animatedValue}]}}
            >

              <LinearGradient colors={bottomColors} style={styles.gradient} />


              <View style={styles.content}>
                <Image
                  source={require('@assets/images/logo10.png')}
                  style={styles.logo}
                />
                <CustomText variant="h2" fontFamily={Fonts.Bold}>
                  India's Last Minute App
                </CustomText>
                <CustomText
                  variant="h2"
                  fontFamily={Fonts.SemiBold}
                  style={styles.text}
                >
                  Log in or Sign up
                </CustomText>

                <CustomInput
                  onChangeText={(text) => setPhoneNumber(text.slice(0, 10))}
                  onClear={() => setPhoneNumber('')}
                  value={phoneNumber}
                  left={
                    <CustomText
                      style={styles.phoneText}
                      variant="h6"
                      fontFamily={Fonts.SemiBold}
                    >
                      +91
                    </CustomText>
                    
                    
                  }
                  placeholder="Enter mobile number"
                  inputMode="numeric"
                />

                <CustomButton
                  disabled={phoneNumber?.length !== 10}
                  onPress={handleAuth}
                  loading={loading}
                  title="Continue"
                />
              </View>
            </Animated.ScrollView>
          </PanGestureHandler>
        </CustomerSafeAreaView>

        <View style={styles.footer}>
          <SafeAreaView>
            <CustomText fontSize={RFValue(8)}>By Continuing, you agree to our Terms of Service & Privacy Policy</CustomText>
          </SafeAreaView>


        </View>



      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    marginTop: 2,
    marginBottom: 25,
    opacity: 0.8,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  phoneText: {
    marginLeft: 10,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  logo: {
    height: 50,
    width: 50,
    borderRadius: 15,
    marginVertical: 10,
  },
  footer:{
    borderTopWidth:0.8,
    borderColor:Colors.border,
    paddingBottom:10,
    zIndex:22,
    position:'absolute',
    bottom:0,
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    backgroundColor:'#f8f9fc',
    width:'100%',

  },
  gradient:{
    paddingTop:60,
    width:'100%',
  }
});

export default CustomerLogin;
