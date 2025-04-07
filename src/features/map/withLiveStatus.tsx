import CustomText from "@components/ui/CoustemText"
import { useNavigationState } from "@react-navigation/native"
import { SOCKET_URL } from "@service/config"
import { getOrderById } from "@service/orderService"
import { useAuthStore } from "@state/authStore"
import { hocStyles } from "@styles/GlobalStyles"
import { Colors, Fonts } from "@utils/Constants"
import { navigate } from "@utils/NavigationUtils"
import { FC, useEffect } from "react"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import io from "socket.io-client"

const withLiveStatus = <P extends object>(WrappedComponent: React.ComponentType<P>): FC<P> => {
    const WithLiveStatusComponent: FC<P> = (props) => {

        const { currentOrder, setCurrentOrder } = useAuthStore();
        const routeName = useNavigationState(state => state.routes[state.index]?.name);

        const fetchOrderDetails = async () => {
            if (!currentOrder?._id) return;
            const data = await getOrderById(currentOrder._id as any);
            
            // if (data.status === 'delivered') {
            //     setCurrentOrder(null);  // ✅ Clear the order after delivery
            //     return;
            // }
        
            setCurrentOrder(data);
        };
        

        useEffect(() => {
            if (currentOrder?._id) {
                const socketInstance = io(SOCKET_URL, {
                    transports: ['websocket'], // ✅ Fixed typo
                    withCredentials: false
                });

                socketInstance.emit('joinRoom', currentOrder._id);

                socketInstance.on('liveTrackingUpdates', (updateOrder) => {
                    fetchOrderDetails();
                    console.log("🔴 RECEIVING LIVE UPDATES");
                });

                // socketInstance.on('orderConfirmed', (confirmOrder) => {
                //     fetchOrderDetails();
                //     console.log("🔴 ORDER CONFIRMATION LIVE UPDATES");
                // });

                 // ✅ Listen for "orderDelivered" event to reset order state
        // socketInstance.on("orderDelivered", () => {
        //     setCurrentOrder(null); // Reset the order after delivery
        // });

                return () => {
                    socketInstance.off('liveTrackingUpdates'); // ✅ Remove listener before disconnecting
                    socketInstance.off('orderConfirmed');
                    socketInstance.disconnect();
                };
            }
        }, [currentOrder]);

        // useEffect(() => {
        //     if (currentOrder?.status === 'delivered') {
        //         setCurrentOrder(null);  // ✅ Clear order from state
        //     }
        // }, [currentOrder?.status]);
        

        return (
            <View style={styles.container}>
                <WrappedComponent {...props} />

                {currentOrder && routeName === 'ProductDashboard' && (
                    <View style={[hocStyles.cartContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                        <View style={styles.flexRow}>
                            <View style={styles.img}>
                                <Image source={require('@assets/icons/bucket.png')} style={{ width: 20, height: 20 }} />
                            </View>

                            <View style={{ width: '68%' }}>
                                <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
                                    Order is {currentOrder?.status}
                                </CustomText>

                                <CustomText variant="h9" fontFamily={Fonts.Medium}>
                                    {currentOrder?.items?.length > 0
                                        ? `${currentOrder.items[0]?.item?.name ?? "Unknown Item"}${currentOrder.items.length > 1
                                            ? ` and ${currentOrder.items.length - 1} more item(s)`
                                            : ''}`
                                        : "No items in order"}
                                </CustomText>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => navigate("LiveTracking")} style={styles.btn}>
                            <CustomText fontFamily={Fonts.Medium} variant="h8" style={{ color: Colors.secondary }}>
                                View
                            </CustomText>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return WithLiveStatusComponent;
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderRadius: 15,
        marginBottom: 15,
        paddingVertical: 10,
        padding: 10
    },
    img: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderWidth: 0.7,
        borderColor: Colors.secondary,
        borderRadius: 5
    }
});

export default withLiveStatus;
