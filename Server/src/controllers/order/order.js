import  {Customer,  DeliveryPartner }  from "../../models/user.js";
import  Branch  from "../../models/branch.js";
import  Order from "../../models/order.js";



export const createOrder = async (req, reply) => {
    try {
        const { userId } = req.user;
        const { items, branch, totalPrice } = req.body;
        

        // ✅ Ensure branch ID is provided
        if (!branch) {
            return reply.status(400).send({ message: "Branch ID is required" });
        }

        console.log("🟢 Order Request Received: ", { userId, items, branch, totalPrice });

        const customerData = await Customer.findById(userId);
        const branchData = await Branch.findById(branch);

        if (!customerData) {
            return reply.status(404).send({ message: "Customer Not Found" });
        }

        if (!branchData) {
            return reply.status(404).send({ message: "Branch Not Found" });
        }

        const newOrder = new Order({
            customer: userId,
            items: items.map((item) => ({
                id: item.id,
                item: item.item,
                count: item.count,
            })),
            branch,
            totalPrice,
            deliveryLocation: {
                latitude: customerData.livelocation?.latitude || 0,
                longitude: customerData.livelocation?.longitude || 0,
                address: customerData.address || "No address available",
            },
            pickupLocation: {
                latitude: branchData.livelocation?.latitude || 0,
                longitude: branchData.livelocation?.longitude || 0,
                address: branchData.address || "No address available",
            },
        });

        const savedOrder = await newOrder.save();
        return reply.status(201).send(savedOrder);
    } catch (error) {
        console.error("🔴 Order Creation Error:", error);
        return reply.status(500).send({ message: "An Error Occurred", error });
    }
};


export const confirmOrder = async(req, reply)=>{
    try{
        const {orderId} = req.params;
        const {userId} = req.user;
        const {deliveryPersonLocation} = req.body;

        const deliveryPerson= await DeliveryPartner.findById(userId)
        if(!deliveryPerson){
            return reply.status(404).send({message:"Deliver Person Not Found"});
        }

        const order = await Order.findById(orderId)
        if(!order)  return reply.status(404).send({message:"Order Not Found"});

        if(order.status!=='available'){
            return reply.status(404).send({message:"Order is Not Available"});
        }

        order.status = 'confirmed'

        order.deliveryPartner = userId;
        order.deliveryPersonLocation={
            latitude:deliveryPersonLocation?.latitude,
            longitude:deliveryPersonLocation?.longitude,
            address:deliveryPersonLocation.address || ""
        }

        req.server.io.to(orderId).emit('orderConfirmed',order)

        await order.save()

        return reply.send(order)



    }catch(error){
        return reply.status(500).send({message:"Failed To Confirm Order", error});
    }

};


export const updateOrderStatus = async (req, reply) => {
    try {
        console.log("🚀 Incoming Update Request:", req.body);
        console.log("📌 Order ID:", req.params.orderId);
        console.log("📦 User ID (Delivery Partner):", req.user?.userId);

        const { orderId } = req.params;
        const { status, deliveryPersonLocation } = req.body;
        const { userId } = req.user;

        // Check if the delivery person exists
        const deliveryPerson = await DeliveryPartner.findById(userId);
        if (!deliveryPerson) {
            console.log("❌ Delivery Partner Not Found");
            return reply.status(404).send({ message: "Delivery Person Not Found" });
        }

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            console.log("❌ Order Not Found");
            return reply.status(404).send({ message: "Order Not Found" });
        }

        console.log("📝 Current Order Status:", order.status);

        // Prevent status update if it's already "delivered" or "cancelled"
        if (["cancelled", "delivered"].includes(order.status)) {
            console.log("⛔ Order Cannot Be Updated. Current Status:", order.status);
            return reply.status(400).send({ message: "Order Can Not Be Updated" });
        }

        // Ensure only the assigned delivery partner can update the order
        if (order.deliveryPartner.toString() !== userId) {
            console.log("🚫 Unauthorized Access: Order Assigned To:", order.deliveryPartner);
            return reply.status(403).send({ message: "Unauthorized" });
        }

        // Update the order status and location
        order.status = status;
        order.deliveryPersonLocation = deliveryPersonLocation;

        // Save the order
        await order.save();


       // ✅ Emit socket event when order is delivered
        // if (status === "delivered") {
        //     req.app.get("io").to(orderId).emit("orderDelivered", order);
        // }


        console.log("✅ Order Status Updated Successfully:", order.status);
        console.log("🛠 Updated Delivery Location:", order.deliveryPersonLocation);

        // Emit live tracking update via WebSocket
        req.server.io.to(orderId).emit("liveTrackingUpdate", order);

        return reply.send(order);

    } catch (error) {
        console.error("🔥 Error Updating Order Status:", error);
        return reply.status(500).send({ message: "Failed To Update Order Status", error });
    }
};



export const getOrders = async(req, reply)=>{
    try{
        const {status, customerId, deliveryPartnerId, branchId } = req.query;

        let query = {}
        if(status){
            query.status=status
        }
        if(customerId){
            query.customer=customerId;
        }
        if(deliveryPartnerId){
            query.deliveryPartner=deliveryPartnerId;
            query.branch=branchId;
        }
       


        const orders = await Order.find(query).populate(
            "customer branch items.item deliveryPartner"
        )

        return reply.send(orders);

    }
    catch(error){
        return reply.status(500).send({message:"Failed To Retrieve Orders", error});
    }

}

export const getOrderById = async(req, reply)=>{
    try{
        const {orderId } = req.params;

        const order = await Order.findById(orderId).populate(
            "customer branch items.item deliveryPartner"
        );

        if(!order){
            return reply.status(404).send({ message:"Order Not Found"});
        }

        return reply.send(order);

    }
    catch(error){
        return reply.status(500).send({message:"Failed To Retrieve Orders", error});
    }

}

