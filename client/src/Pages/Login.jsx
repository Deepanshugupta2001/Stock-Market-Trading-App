import React from 'react'
import { useState } from 'react'
import useAuth from '../context/authContext';
import auth from '../lib/auth';
import {useNavigate} from 'react-router';

const Login = () => {

    const [password , setPassword] = useState("");
    const [mobno , setMobno] = useState("");
    const navigate = useNavigate();
    const {login} = useAuth();

    const formSubmitHandler = async(e) =>{
      e.preventDefault();
      // console.log(data);
      
      const {user,token} =await login({mobno,password});
      auth.token = token;
      auth.user = user;
      navigate("/dashboard");
    }
  
    return(
    <>
      <form onSubmit={formSubmitHandler}>
        <input onChange={(e)=>setMobno(e.target.value)} value={mobno} type="text" placeholder='Enter Your Mobile Number' ></input>
        <input onChange={e=> setPassword(e.target.value)} value={password} type="password" placeholder='Enter Your Password' ></input>
  
        <button type='submit'>Login</button>
      </form>
      Not a User ? Signup instead <button onClick={()=>navigate('/signup')}>Signup</button>
    </>
    );
}

export default Login