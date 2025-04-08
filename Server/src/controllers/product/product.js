import  Product  from "../../models/products.js";

export const getProductsByCategoryId = async (req, reply)=>{
    const {categoryId} = req.params;

    try{
        const products = await Product.find({category:categoryId})
         .select("-category")
         .exec();
         return reply.send(products);
    } catch(error){
        return reply.satus(500).send({message:"An Error Occurred", error});
    }


    
}