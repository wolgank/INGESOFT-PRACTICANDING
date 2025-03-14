import {createKindeServerClient, GrantType, type UserType} from "@kinde-oss/kinde-typescript-sdk";
import { type SessionManager } from "@kinde-oss/kinde-typescript-sdk";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createFactory, createMiddleware } from 'hono/factory'
// Client for authorization code flow
export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
});
let store: Record<string, unknown> = {};

export const sessionManager=(c:Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result=getCookie(c,key);
    if (!result) return undefined;
    
    try {
      return JSON.parse(result); // Intenta parsear JSON
    } catch {
      return result; // Si no es JSON, devuelve el valor como string
    }
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions={
        httpsOnly:true,
        secure:true,
        sameSite:"Lax",
    } as const;
    store[key] = value;
    if(typeof value==="string"){
        setCookie(c,key,value,cookieOptions);
    }else{
        setCookie(c,key,JSON.stringify(value),cookieOptions)
    }
  },
  async removeSessionItem(key: string) {
    delete store[key];
    deleteCookie(c,key);
  },
  async destroySession() {
    ["id_token","access_token","user","refresh_token"].forEach((key)=>{
        delete store[key];
        deleteCookie(c,key);
    })
  }
});
type Env = {
  Variables: {
    user: UserType;
  }
}

export const getUser = createMiddleware(async (c, next) => {
  try{
    const manager=sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(manager); // Boolean: true or false
    //return c.json({isAuthenticated})
    if (!isAuthenticated) {
      return c.json({error:"Unauthoraized"},401);
    } else {
      const user=await kindeClient.getUserProfile(manager)
      c.set("user",user);
      await next();
    }
  }catch(e){
    console.error(e);
    return c.json({error:"Unauthoraized"},401);
  }
})