import { Issuer, generators, Client } from "openid-client";
import dotenv from "dotenv";

dotenv.config();

let client: Client;

// Initialize OpenID Client
export async function initializeClient() {
  try {
    const issuer = await Issuer.discover(
      `https://cognito-idp.us-east-1.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`
    );

    client = new issuer.Client({
      client_id: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID as string,
      client_secret: process.env.SECRET_HASH as string, 
      redirect_uris: ["https://prod.d33bfnbhhikuex.amplifyapp.com/"],
      response_types: ["code"],
    });

    console.log("OpenID Client initialized successfully.");
  } catch (error) {
    console.error("Error initializing OpenID Client:", error);
  }
}

export function getClient() {
  if (!client) {
    throw new Error("Client is not initialized. Call initializeClient first.");
  }
  return client;
}