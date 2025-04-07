import { View, Text, StyleSheet, SafeAreaView, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@utils/Constants'
import { useAuthStore } from '@state/authStore'
import DeliveryHeader from '@components/delivery/DeliveryHeader'
import TabBar from '../../components/delivery/TabBar'
import { fetchOrders } from '@service/orderService'
import CustomText from '@components/ui/CoustemText'
import OrderItem from '@components/delivery/OrderItem'
import Geolocation from '@react-native-community/geolocation'
import { reverseGeocode } from '@service/mapService'
import withLiveOrder from './withLiveOrder'




const DeliveryDashboard = () => {

  const {user,setUser} = useAuthStore()
  const [selectedTab, setSelectedTab] = useState<'available' | 'delivered'>('available')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const updateUser=()=>{
    Geolocation.getCurrentPosition(
      position=>{
        const {latitude,longitude} = position.coords
        reverseGeocode(latitude,longitude,setUser)
      },
      err => console.log(err),
      {
        enableHighAccuracy:false,
        timeout:15000,
      }
    )
  }

  useEffect(()=>{
    updateUser()
  },[])

  const renderOrderItem = ({item, index}:any)=>{
    return(
      <OrderItem index={index} item={item} />
    )
  }

  const fetchData = async()=>{
    setData([])
      setRefreshing(true)
      setLoading(true)
      const data = await fetchOrders(selectedTab,user?._id, user?.branch)
      setData(data)
      setRefreshing(false)
      setLoading(false)
    
  }

  useEffect(()=>{
    fetchData()
  },[selectedTab])

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <DeliveryHeader name={user?.name} email={user?.email} />
        </SafeAreaView> 
        <View style={styles.subContainer}>
          <TabBar selectedTab={selectedTab} onTabChange={setSelectedTab} />

          <FlatList 
  data={data}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={async () => await fetchData()}
    />
  }
  ListEmptyComponent={() => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.secondary} size="small" />
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <CustomText>No Orders found yet!</CustomText>
      </View>
    );
  }}
  renderItem={renderOrderItem}
  keyExtractor={(item) => item._id?.toString() || item.order?.toString() || Math.random().toString()} 
  contentContainerStyle={styles.flatlistContainer}
/>


        </View>
    
    </View>
  )
}
const styles = StyleSheet.create({
  container:{
    backgroundColor:Colors.primary,
    flex:1
  },
  subContainer:{
    backgroundColor:Colors.backgroundSecondary,
    flex:1,
    padding:6
  },
  flatlistContainer:{
    padding:2,
  },
  center:{
    flex:1,
    marginTop:60,
    justifyContent:'center',
    alignItems:'center'
  }
})

const DeliveryDashboardWithLiveOrder = withLiveOrder(DeliveryDashboard)

export default DeliveryDashboardWithLiveOrder