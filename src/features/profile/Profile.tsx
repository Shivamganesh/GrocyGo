import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {FC, useEffect, useState, useRef} from 'react';
import {useAuthStore} from '@state/authStore';
import {useCartStore} from '@state/cartStore';
import {fetchCustomerOrders} from '@service/orderService';
import CustomHeader from '@components/ui/CustomHeader';
import CustomText from '@components/ui/CoustemText';
import {Fonts} from '@utils/Constants';
import WalletSection from './WalletSection';
import ActionButton from './ActionButton';
import OrderItem from './OrderItem';
import {storage, tokenStorage} from '@state/storage';
import {resetAndNavigate} from '@utils/NavigationUtils';
import {launchImageLibrary} from 'react-native-image-picker';
import {MMKV} from 'react-native-mmkv';

const storageInstance = new MMKV();

const Profile: FC = () => {
  const [orders, setOrders] = useState([]);
  const {logout, user, setUserProfileImage} = useAuthStore();
  const {clearCart} = useCartStore();
  const [profileImage, setProfileImage] = useState<string | null>(
    storageInstance.getString('profileImage') || null,
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchOrders();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchOrders = async () => {
    const data = await fetchCustomerOrders(user?._id);
    setOrders(data);
  };

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

  const renderHeader = () => {
    return (
      <Animated.View style={[styles.headerContainer]}>
        {/* <CustomText variant='h3' fontFamily={Fonts.SemiBold}>Your account</CustomText> */}
        <TouchableOpacity
          onPress={selectProfileImage}
          style={styles.imageContainer}>
          <Image
            source={
              profileImage
                ? {uri: profileImage}
                : require('@assets/images/userprofile.jpg')
            }
            style={styles.profileImage}
          />
          <View style={styles.editIconContainer}>
            <Text style={styles.editIcon}>✎</Text>
          </View>
        </TouchableOpacity>

        <CustomText
          variant="h7"
          style={{textAlign: 'center'}}
          fontFamily={Fonts.Medium}>
          📱 {user?.phone}
        </CustomText>
        <CustomText
          variant="h7"
          style={{textAlign: 'center'}}
          fontFamily={Fonts.Medium}>
          {user?.name}
        </CustomText>

        <WalletSection />

        <CustomText variant="h8" style={styles.informativeText}>
          YOUR INFORMATION
        </CustomText>

        <ActionButton icon="book-outline" label="Address book" />
        <ActionButton icon="information-circle-outline" label="About Us" />
        <ActionButton
          icon="log-out-outline"
          label="Logout"
          onPress={() => {
            clearCart();
            logout();
            tokenStorage.clearAll();
            storage.clearAll();
            storageInstance.delete('profileImage'); // Clear the stored image
            setProfileImage(null); // Update UI immediately
            resetAndNavigate('CustomerLogin');
          }}
        />
        <CustomText variant="h8" style={styles.passText}>
          PAST ORDERS
        </CustomText>
      </Animated.View>
    );
  };

  const renderOrders = ({item, index}: any) => (
    <OrderItem item={item} index={index} />
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Profile" />
      <FlatList
        data={orders}
        ListHeaderComponent={renderHeader}
        renderItem={renderOrders}
        keyExtractor={(item: any) => item?.orderId}
        contentContainerStyle={styles.scrollViewContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    padding: 10,
    paddingTop: 20,
    paddingBottom: 100,
  },
  informativeText: {
    opacity: 0.7,

    marginBottom: 20,
  },
  passText: {
    marginVertical: 20,
    opacity: 0.7,
  },
  headerContainer: {
    marginBottom: 20,
  },
  imageContainer: {
    width:"30%",
    alignItems: 'center',
    //backgroundColor:"red",
    justifyContent:"center",
    left:130,
    position:'relative'
    
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: '25%',
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
});

export default Profile;
