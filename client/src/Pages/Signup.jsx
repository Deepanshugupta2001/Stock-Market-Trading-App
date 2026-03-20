import React from 'react'
import { useState } from 'react'
import useAuth from '../context/authContext';
import auth from '../lib/auth';
import {useNavigate} from 'react-router';

const Signup = () => {
  const [name , setName] = useState("");
  const [password , setPassword] = useState("");
  const [mobno , setMobno] = useState("");
  const {signup} = useAuth();
  const navigate = useNavigate();

  const formSubmitHandler = async(e) =>{
    e.preventDefault();
    const {user, token} = await signup({name,mobno,password});
    // console.log(data);
    auth.token = token;
    auth.user = user;
    navigate("/dashboard");
  }

  return(
  <>
    <form onSubmit={formSubmitHandler}>
      <input onChange={(e)=>setMobno(e.target.value)} value={mobno} type="text" placeholder='Enter Your Mobile Number' autoComplete='true'></input>
      <input onChange={e=> setName(e.target.value)} value={name} type="text" placeholder='Enter Your Name' autoComplete='true'></input>
      <input onChange={e=> setPassword(e.target.value)} value={password} type="password" placeholder='Enter Your Password'autoComplete='true' ></input>

      <button type='submit'>Signup</button>
    </form>
    Already a User ? <button onClick={()=>navigate('/login')}>Login</button>
  </>
  );
}

export default Signup