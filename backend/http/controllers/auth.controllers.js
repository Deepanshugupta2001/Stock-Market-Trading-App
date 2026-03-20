import { deleteuser, login, signup, updateName, updatePassword } from '../services/auth.service.js';
import { loginSchema, signupSchema } from '../schemas/auth.schemas.js';

export async function postSignup(req,res,next){
    try {
        console.log("We have entered in Controller");
        const result = signupSchema.safeParse(req.body);
        console.log("signup Schema ka baad hai yeh result :",result.data);
        if(!result.success){
            console.log("Signup ma error aa gaya hai");
            return res.status(401).json({
                error : result.error.format()
            })
        }
        const { mobno , name , password } = result.data ;
        let data = await signup({mobno , password , name });
        console.log("Yeh aaya hai mera data ma :",data);
        res.status(200).json({
            data
        })
    } catch (error) {
        console.log("Ma catch ma aa gaya hu");
        res.status(500).json({
            message : 'Error while Signup ',
            error
        })
    }
} 

export async function postLogin(req,res,next) {
    const result = loginSchema.safeParse(req.body);

        if(!result.success){
            return res.status(401).json({
                error : result.error.format()
            })
        }

        try {
            const { mobno , password } = req.body ;
            let data = await login({mobno, password });
            res.status(200).json({
                data
            })
        } catch (error) {
            res.status(500).json({
            message: 'Error While Login',
            error
        })
        }
}

export async function getMe(req,res,next) {
    return res.status(200).json({
        user : req.user
    })    
}

export async function postUpdateName(req,res,next) {
    console.log("Ma controller ma aa chuka hu");
    const {name} = req.body;
    const userId = req.user._id;
    console.log("Update req.body:", req.body);
    
    try {
        let data = await updateName({userId,name});
    console.log("Hume yeh data mila hai", data);
        res.status(200).json({
            data
        })
    } catch (error) {
         res.status(500).json({
            message: 'Error While Updating Name',
            error
         })
    }
}

export async function postUpdatePassword(req,res,next) {
    console.log("Ma controller ma aa chuka hu");
    const {password,passwordold} = req.body;
    const userId = req.user._id;
    console.log("User id is :",userId);
    console.log("Update req.body:", req.body);
    
    try {
        let data = await updatePassword({userId,password,passwordold});
    console.log("Hume yeh data mila hai", data);
        res.status(200).json({
            data
        })
    } catch (error) {
         res.status(500).json({
            message: 'Error While Updating Name',
            error
         })
    }
}

export async function postDeleteUser(req,res,next) {
    const {password} = req.body;
    const userId = req.user._id;
    try {
        let data = await deleteuser({userId,password});
        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message
        });        
    }
}

