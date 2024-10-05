'use server';

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { extractCustomerIdFromUrl, parseStringify } from "../utils";
import { cookies } from "next/headers";

export const signIn = async ({ email, password }: signInProps) => {
    try {
      const { account } = await createAdminClient();
      const response = await account.createEmailPasswordSession(email, password);
  
    //   cookies().set("appwrite-session", session.secret, {
    //     path: "/",
    //     httpOnly: true,
    //     sameSite: "strict",
    //     secure: true,
    //   });
  
    //   const user = await getUserInfo({ userId: session.userId }) 
  
      return parseStringify(response);
    } catch (error) {
      console.error('Error', error);
    }
  }

export const signUp = async ({ password, ...userData }: SignUpParams) => {
    const { email, firstName, lastName } = userData;
    
    let newUserAccount;
  
    try {
      const { account, database } = await createAdminClient();
  
      const newUserAccount = await account.create(
        ID.unique(), 
        email, 
        password, 
        `${firstName} ${lastName}`
      );
  
   
      const session = await account.createEmailPasswordSession(email, password);
  
      cookies().set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
  
      return parseStringify(newUserAccount);
    } catch (error) {
      console.error('Error', error);
    }
  }
  export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      const result = await account.get();
  
      const user = await getUserInfo({ userId: result.$id})
  
      return parseStringify(user);
    } catch (error) {
      console.log(error)
      return null;
    }
  }



function getUserInfo(arg0: { userId: string; }) {
    throw new Error("Function not implemented.");
}
  