import {View, Text, Animated as RNAnimated, StyleSheet, TouchableOpacity, Systrace} from 'react-native';
import React, {FC, useEffect, useRef} from 'react';
import {useAuthStore} from '@state/authStore';
import NoticeAnimation from './NoticeAnimation';
import {NOTICEHeight, screenHeight} from '@utils/Scaling';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import Visuals from './Visuals';
import {
  CollapsibleContainer,
  CollapsibleHeaderContainer,
  CollapsibleScrollView,
  useCollapsibleContext,
  withCollapsibleContext,
} from '@r0b0t3d/react-native-collapsible';
import AnimatedHeader from './AnimatedHeader';
import StickSearchbar from './StickSearchbar';
import Content from '@components/dashboard/Content';
import CustomText from '@components/ui/CoustemText';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '@utils/Constants';
import  Icon  from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';
import withCart from '@features/cart/WithCart';
import withLiveStatus from '@features/map/WithLiveStatus';


const NOTICE_HEIGHT = -(NOTICEHeight + 12);

const ProductDashboard:FC = () => {

  const {scrollY,expand} = useCollapsibleContext()

  const previousScroll = useSharedValue(0); // Use Reanimated shared value

  const isScrollingUp = useDerivedValue(() => {
    const scrollingUp = scrollY.value < previousScroll.value && scrollY.value > 180;
    previousScroll.value = scrollY.value;
    return scrollingUp;
  });
  
  const backToTopStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isScrollingUp.value ? 1 : 0, { duration: 300 }),
    transform: [{ translateY: withTiming(isScrollingUp.value ? 0 : 10, { duration: 300 }) }],
  }));
  //const {user} = useAuthStore()
  // console.log(user)

  const noticePosition = useRef(new RNAnimated.Value(NOTICE_HEIGHT)).current;

  const slideUp = () => {
    RNAnimated.timing(noticePosition, {
      toValue: NOTICE_HEIGHT,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  };

  const slideDown = () => {
    RNAnimated.timing(noticePosition, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    slideDown();
    const timeoutId = setTimeout(() => {
      slideUp();
    }, 3500);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <NoticeAnimation noticePosition={noticePosition}>
      <>
        <Visuals />
        <SafeAreaView />

        <Animated.View style={[styles.backToTopButton, backToTopStyle]}>
          <TouchableOpacity
          onPress={()=>{
            scrollY.value = 0;
            expand()
          }}
          
          style={{flexDirection:'row', alignItems:'center', gap:6}}>
            <Icon name='arrow-up-circle-outline' color='white' size={RFValue(12)} />
            <CustomText variant='h9' style={{color:'white'}} fontFamily={Fonts.SemiBold}>
              Back to top

            </CustomText>
          </TouchableOpacity>
        </Animated.View>
        <CollapsibleContainer style={styles.panelContainer}>
          <CollapsibleHeaderContainer containerStyle={styles.transparent}>
            <AnimatedHeader
            showNotice={()=>{
            slideDown()
            const timeoutId=setTimeout(()=>{
            slideUp()
            },3500)
            return ()=>clearTimeout(timeoutId)
            }}
             />
             <StickSearchbar />
          </CollapsibleHeaderContainer>

          <CollapsibleScrollView nestedScrollEnabled 
          style={styles.panelContainer} 
          showsVerticalScrollIndicator={false}>
            <Content />

            <View style={{backgroundColor:'#F8F8F8', padding:20}}>
              <CustomText fontSize={RFValue(32)} fontFamily={Fonts.Bold} style={{opacity:0.2}}>
                India's last minute app 🥭
              </CustomText>
              <CustomText fontSize={RFValue(10)}   fontFamily={Fonts.Bold} style={{paddingTop:100,opacity:0.2,bottom:90}}>
                Developed By ❤ Shivam Gupta
              </CustomText>

            </View>
          </CollapsibleScrollView>
        </CollapsibleContainer>
      </>
    </NoticeAnimation>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  backToTopButton:{
    position:'absolute',
    alignSelf:"center",
    top:Platform.OS==='ios' ? screenHeight*0.18 : 100,
    flexDirection:'row',
    alignItems:'center',
    gap:4,
    backgroundColor:'black',
    borderRadius:20,
    paddingHorizontal:10,
    paddingVertical:5,
    zIndex:999
  }
});

export default withLiveStatus(withCart( withCollapsibleContext(ProductDashboard)));
