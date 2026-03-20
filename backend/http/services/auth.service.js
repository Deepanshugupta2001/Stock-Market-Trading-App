import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import env from '../../env.js'
import jwt from 'jsonwebtoken'
import Stock from '../../model/Stock.js';

export async function signup({mobno , password , name }) {
    console.log("Service input types:", { 
    mobno: typeof mobno, 
    password: typeof password 
  });
    console.log("We have entered service signup file");
    let existing = await Stock.findOne({ mobno }) 
    console.log("Mera aaya hai yeh data :", existing);
    if(existing){
        console.log("Ma existing ka andar aa gaya hu ");
        let err = new Error ("Mobile Number already exists");
        err.status = 401 ;
        throw err ;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password,salt);
        let user = new Stock({
            mobno,
            password: passwordHash,
            name
        })
        console.log(user)
        await user.save();
        console.log("This is my user : ", user.toObject());
        let token = jwt.sign({mobno , name , id : user._id }, env.JWT_SECRET);
        return {
            user :{
                id : user._id,
                name : user.name ,
                mobno : user.mobno,
            },
            token
        }
        } catch (error) {
            console.log("Ma service signup ka catch ma aa gaya hu ");
            return error;   
        }
} 

export async function login({mobno , password }) {
    let user = await Stock.findOne({mobno}) 
    if(!user){
        let err = new Error ("Invalid login mobile number ");
        err.status = 401 ;
        throw err ;
    }
    try {
        const ok = await bcrypt.compare(password, user.password);
        if(!ok){
        let err = new Error ("Invalid login password ");
        err.status = 401 ;
        throw err ;
    }
    let token = jwt.sign({mobno , name : user.name , id : user._id }, env.JWT_SECRET);
    return {
        user :{
            id : user._id,
            name : user.name ,
            mobno : user.mobno,
        },
        token
    }
    } catch (error) {
        return error;   
    }
} 

export async function updateName({userId,name}) {
    console.log("Maine Service file ma enter kiya hai ");
    try {
        // mobno = String(mobno);
        // console.log("mobno in update:", mobno);
        // let user = await Stock.findOne({ mobno });
        let user = await Stock.findOneAndUpdate(
        userId,          
        { $set: { name} },  
        { returnDocument: 'after' }             
    );
    if (!user) {
        throw new Error("User not found");
    }
    console.log("I have got this user data here :",user);
    let token = jwt.sign({mobno: user.mobno , name: user.name , id :user._id }, env.JWT_SECRET);
    return {
        user:{
           id : user._id,
            name : user.name ,
            mobno : user.mobno, 
        },
        token
    }    
    } catch (error) {
        throw error;
    }
}

export async function updatePassword({userId,password,passwordold}) {
    console.log("Maine Service file ma enter kiya hai ");
    try {
        console.log("Ma service ka try block ma enter kar chuka hu");
        // mobno = String(mobno);
        // console.log("mobno in update:", mobno);
        // let user = await Stock.findOne({ mobno });
        let user = await Stock.findById( userId );
        console.log("Mereko user mil gaya hai",user);
        if (!user) {
            throw new Error("User not found");
        }
        console.log("1");
        const ok = await bcrypt.compare(passwordold, user.password);
        console.log("2");
        console.log("COMPARE RESULT:", ok);
        if(!ok){
            let err = new Error ("Password did not match");
            err.status = 401 ;
            throw err ;
        }
        console.log("I have got this user data here :",user);
        const salt = await bcrypt.genSalt(10);
        console.log("3");
        const passwordHash = await bcrypt.hash(password,salt);
        console.log("4");
        user.password = passwordHash;
        console.log("5");
        await user.save();
        console.log("6");
        let token = jwt.sign({mobno: user.mobno , name: user.name , id :user._id }, env.JWT_SECRET);
        console.log("7");
        return {
            user:{
                id : user._id,
                name : user.name ,
                mobno : user.mobno, 
            },
            token
        }    
    } catch (error) {
            throw error;
    }
}

export async function deleteuser({userId , password}) {
    let user = await Stock.findById( userId );
        console.log("Mereko user mil gaya hai",user);
        if (!user) {
            throw new Error("User not found");
        }
        console.log("1");
        const ok = await bcrypt.compare(password, user.password);
        console.log("2");
        console.log("COMPARE RESULT:", ok);
        if(!ok){
            let err = new Error ("Password did not match . So , Deletion failed");
            err.status = 401 ;
            throw err ;
        }

        await Stock.deleteOne({_id : userId});

        return {success : true};
}