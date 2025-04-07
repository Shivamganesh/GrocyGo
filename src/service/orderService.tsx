import { appAxios } from "./apiInterceptors";
import { BRANCH_ID } from "./config";

export const createOrder = async (items: any, totalPrice: number) => {
    try {
        console.log("🟢 Sending Order Request...");
        console.log("📤 Order Payload:", JSON.stringify({
            items: items,
            branch: BRANCH_ID,  // Empty branch might be an issue
            totalPrice: totalPrice
        }, null, 2));

        const response = await appAxios.post(`/order`, {
            items: items,
            branch: BRANCH_ID,  // This might be causing an issue
            totalPrice: totalPrice,
        });

        console.log("✅ Order Response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("🔴 Create Order Error:", error?.response?.data || error.message);
        return null;
    }
};

export const getOrderById = async (id: string)=>{
    try{
        const response = await appAxios.get(`/order/${id}`)
        return response.data;
    } catch(error){
        console.log("Fetch Order Error",error)
        return null
    }
}


export const fetchCustomerOrders = async (userId:string) =>{
    try{
        const response = await appAxios.get(`/order?customerId=${userId}`);
        return response.data;
    } catch(error){
        console.log("Fetch Customer Order Error", error)
        return null
    }
}

export const fetchOrders = async (
    status:string,
    userId:string,
    branchId: string
) =>{

    let uri = status == "available" 
    ? `/order?status=${status}&branchId=${branchId}`
    : `/order?branchId=${branchId}&deliveryPartnerId=${userId}&status=delivered`;


    try{
        const response = await appAxios.get(uri);
        return response.data;
    } catch(error){
        console.log("Fetch Delivery Order Error", error)
        return null
    }
   
   
}

export const sendLiveOrderUpdates = async (id:string,location:any,status:string)=>{
   try{
    const response = await appAxios.patch(`/order/${id}/status`,{
        deliveryPersonLocation: location,
        status
    });
    return response.data
   }catch(error){
    console.log("sendLiveOrderUpdates Error", error)
    return null

   }
}


export const confirmOrder = async (id:string,location:any)=>{
    try{
     const response = await appAxios.post(`/order/${id}/confirm`,{
         deliveryPersonLocation: location
         
     });
     return response.data
    }catch(error){
     console.log("confirmOrder Error", error)
     return null
 
    }
 }
