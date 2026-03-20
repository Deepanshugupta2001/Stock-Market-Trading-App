import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { createContext } from 'react'
import { authApi } from '../api/authApi';
import auth from '../lib/auth';


const context = createContext();

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(auth.user || null);
    const [loading, setLoading] = useState(false);
    
    async function login({mobno,password}){
        const {user,token} = await authApi.login({ mobno , password});
        // console.log(user, token);
        setUser(user);
        return {user,token};
    }

    async function signup({mobno,password, name}){
        const {user,token} =await authApi.signup({name, mobno , password});
        // console.log(user,token);
        setUser(user);
        return {user,token};
    }

    function logout(){
      auth.logout();
      setUser(null);
    }
    async function updatename({name}){
      // console.log("Ma auth context ma aa gaya hu ");
      const {user,token} = await authApi.updatename({name});
      // console.log("user yeh aaya hai :",user);
      setUser(user);
      return {user,token};
    }

    async function updatepassword({password,passwordold}) {
      const {user, token} = await authApi.updatepassword({password,passwordold});
      setUser(user);
      return {user,token};
    }

    async function deleteuser(password){
      const {user,token } = await authApi.deleteuser({password});
      logout();
    }
   
  return (
    <context.Provider value={{
        user,
        // token,
        login,
        signup,
        isLoggedIn : user ? true : false ,
        logout,
        updatename,
        updatepassword,
        deleteuser
    }
    }>
      {children}
    </context.Provider>
  )
}

export default function useAuth(){
    return useContext(context);
}