import axios from "./axios"

async function signup({name,mobno,password}){
    const {data: {data}} = await axios({
        method : "post",
        url : "/api/auth/signup",
        data : {
            name,
            mobno,
            password,
        },
    });

    return data;
}

async function login({mobno,password}){
    const {data: {data}} = await axios({
        method : "post",
        url : "/api/auth/login",
        data : {
            mobno,
            password,
        },
    });

    // const response = await axios.post('/api/auth/login',{
    //     mobno,
    //     password,
    // })

    // const data = response.data.data;
    // console.log(data)
    return data;
}

async function  updatename({name}) {
    const token = localStorage.getItem("token");
    // console.log("I have entered here");
    const {data: {data}} = await axios({
        method : "patch",
        url : "/api/auth/updatename",
        data : {
            name,
        },   
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    // console.log("Ab data return hona vala hai ");
    return data;
}

async function updatepassword({password,passwordold}) {
    const token = localStorage.getItem("token");
    // console.log("I have entered here");
    const {data: {data}} = await axios({
        method : "patch",
        url : "/api/auth/updatepassword",
        data : {
            password,
            passwordold
        },   
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    // console.log("Ab data return hona vala hai ");
    return data;
}

async function deleteuser({password}) {
    const token = localStorage.getItem("token");
    // console.log("I have entered here");
    const {data: {data}} = await axios({
        method : "delete",
        url : "/api/auth/deleteuser",
        data:{
            password
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    },
);
    return data;
}

export const authApi = {
    signup,
    login,
    updatename,
    updatepassword,
    deleteuser
}