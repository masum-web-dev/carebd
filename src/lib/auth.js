import { betterAuth} from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("carebd");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: { 
    enabled: true, 
  }, 
  plugins:[jwt()],
  session:{
    cookieCache:{
      enabled: true,
      strategy: 'jwt',
      maxAge: 3 * 24 * 60 * 60
    }
  }
});