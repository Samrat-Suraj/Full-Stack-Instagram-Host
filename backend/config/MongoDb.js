import mongoose from "mongoose";
import { EnvVars } from "./EnvVars.js";

async function MongoDb(){
    try {
        const conn = await mongoose.connect(EnvVars.MONGO_URL);
        console.log("MongoDb connected on" , conn.connection.host);
    } catch (error) {
        console.log("error in Mongob connections", error.message)
        process.exit(1)
    }
}

export default MongoDb;