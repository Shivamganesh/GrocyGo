import 'dotenv/config';
import fastifySession from '@fastify/session' ;// session maintain hoga jb koi bnda login karega
import ConnectMongoDBSession from "connect-mongodb-session";
import { admin } from '../models/index.js';

const MongoDBStore = ConnectMongoDBSession(fastifySession)
export const sessionStore = new MongoDBStore({
    uri:process.env.MONGO_URI,
    collection:'session'
})

sessionStore.on("error", (err)=>{
    console.log("session store error", err);
});


export const authenticate = async (email,password)=>{
    if(email&& password) {
       const user = await admin.findOne({email})
       if(!user){
        return null
       }
       if(user.password === password){
        return Promise.resolve({ email: email, password:password});

       }else{
        return null;
       }
    }
       
    
};


export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD =process.env.COOKIE_PASSWORD;