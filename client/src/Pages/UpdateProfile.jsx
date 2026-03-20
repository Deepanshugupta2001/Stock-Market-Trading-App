import React from 'react'
import useAuth from '../context/authContext'
import { useState } from 'react'
import { useNavigate } from 'react-router';
import auth from '../lib/auth'

const UpdateProfile = () => {
    const [name,setName] = useState("");
    // const {user} = useAuth();
    const {updatename}= useAuth();
    const {deleteuser} = useAuth();
    const {logout} = useAuth();
    const {updatepassword} = useAuth();
    const [user,setUser] = useState(auth.user || null);
    const [mobno , setMobno] = useState("");
    const [password,setPassword] = useState("");
    const [passwordnew,setPasswordNew] = useState("");
    const [passwordold,setPasswordOld] = useState("");
    const [deletepassword, setDeletePassword] = useState("");
    
    const navigate = useNavigate();

    // const passwordSubmitHandler = async(e)=>{
    //     e.preventDefault();
    //     if(passwordnew == password) {
    //         const {user,token} = await updatepassword({password,passwordold});}
    //     else {
    //         return res.status(400).json({
    //             error : "The Password did not match"
    //         })
    //     }
        
    //     setUser(user);
    //     navigate('/login');
    // }
    const passwordSubmitHandler = async (e) => {
        e.preventDefault();
        if (passwordnew !== password) {
            alert("Passwords do not match");
            return;
        }
        await updatepassword({
            password: passwordnew,
            passwordold
        });
        // force logout after password change
        logout();
        navigate("/login");
    };
    const deleteSubmitHandler = async (e)=>{
        e.preventDefault();
        const confirm = window.confirm("Are you sure you want to delete this account?");

        if(!confirm) return ;

        try {
            await deleteuser(deletepassword);
            navigate('/signup');
        } catch (error) {
            alert(error.response?.data?.message || "Delete failed");
        }

    }
    const formSubmitHandler = async(e)=>{
        e.preventDefault();
        const {user,token} = await updatename({mobno,name});
        setUser(user);
        navigate('/profile');
    }

  return (
    <div>
      Welcome to Update Profile Page <br/>

      Change Name : 
      <form onSubmit={formSubmitHandler}>

        <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Enter Your New Name' ></input>


      <button type='submit'>Click Here</button>
      </form>

      Change Password : 

      <form onSubmit={passwordSubmitHandler}>
        <input onChange={(e)=>setPasswordOld(e.target.value)} value={passwordold} type='password' placeholder='Enter Your Old Password'></input>
        <input onChange={(e)=>setPassword(e.target.value)} value={password} type='password' placeholder='Enter Your New Password'></input>
        <input onChange={(e)=>setPasswordNew(e.target.value)} value={passwordnew} type='password' placeholder='Enter Your New Password'></input>

      <button type='submit'>Click Here</button>
      </form>

      Delete Account ? Think Once Before Deleting .   
      <form onSubmit={deleteSubmitHandler}>
        <input onChange={(e)=>setDeletePassword(e.target.value)} value={deletepassword} type='password' placeholder='Enter Your Password'></input>
        
       <button type='submit'>Delete</button>

      </form>
      
      <button onClick={()=>navigate('/dashboard')}>Dashboard</button>
      <button onClick={()=>navigate('/profile')}>Profile</button>

    </div>
  )
}

export default UpdateProfile