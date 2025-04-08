import  jwt from "jsonwebtoken";

export const verifyToken = async(req, reply)=>{
    try{
        const authHeader = req.headers['authorization']
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return reply.status(401).send({message:"Access token require"})
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
          //Log decoded token
        req.user = decoded;
        return true;
        

    }
    catch(err){
        console.error("Token Verification Error:", err.message);  // Log error
        return reply.status(403).send({message:"Invalid or expired token"})
    }
}