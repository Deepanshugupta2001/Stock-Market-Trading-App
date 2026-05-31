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
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
        <p className="page-subtitle">Continue to your trading dashboard.</p>
      <form onSubmit={formSubmitHandler}>
        <input onChange={(e)=>setMobno(e.target.value)} value={mobno} type="text" placeholder='Enter Your Mobile Number' ></input>
        <input onChange={e=> setPassword(e.target.value)} value={password} type="password" placeholder='Enter Your Password' ></input>
  
        <button type='submit'>Login</button>
      </form>
      <p className="auth-switch">Not a user? <button onClick={()=>navigate('/signup')}>Signup</button></p>
      </section>
    </main>
    );
}

export default Login
