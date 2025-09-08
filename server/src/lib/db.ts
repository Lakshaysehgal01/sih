import mongoose from "mongoose";
export const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDb connected ${conn.connection.host} `);
  } catch (e) {
    console.log(`MongoDb connection error : ${e}`);
    process.exit(1);
  }
};
