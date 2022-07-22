import React, { useContext, useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import M from 'materialize-css'
import './Signup.css'
import {UserContext} from '../App';
import './login.css'
import {Watch } from  'react-loader-spinner'
import {TbSoup} from 'react-icons/tb';

function Login() {
    const {state,dispatch} = useContext(UserContext);
    const navigate = useNavigate()
    const [emailorpass, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [show,setshow] = useState("show")
    const [loader,setLoader] = useState(false);

    const login = ()=>{
        setLoader(true)
        setshow("hide")
        if(emailorpass.includes('@'))
        {
            if(!  
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(emailorpass))
            {
             setshow("show")
             M.toast({html: "enter valid email" ,classes: "#62229 red darken-2"})
             return
            }
        }   
        M.toast({ html: "please wait :) ", classes: "#c62828 blue darken-3",id:"toast-container" });
        fetch("https://instabackend22.herokuapp.com/login",{
            method: "post",
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailorpass: emailorpass,
                password: password
            })
        })
        .then(response => response.json())
        .then(function(data){
            if(data.error)   {
            setLoader(false)
            setshow("show")
            M.toast({html: data.error ,classes: "#62229 red darken-2"})
            }
            else{
                setLoader(false)
                setshow("show")
                localStorage.setItem("token",data.token);
                localStorage.setItem("userinfo",JSON.stringify(data.userinfo));
                dispatch({type: "USER" , payload: data.userinfo})
                M.toast({html: "Login Successfull" ,classes: "#62229 green darken-2",id:"toast-container"})
                navigate('/home');
            }
        }).catch((error)=>{
            console.log(error);
            setLoader(false)
            setshow("show")
            M.toast({html: "Something went wrong" ,classes: "#62229 yellow darken-2",id:"toast-container"})

    });
    }    
    return (
        <div className='login-container'>
            <div className='card login-card input-field'>
                <h2>Social soup <TbSoup/></h2>
                <input type="text"
                placeholder='Email Or UserName'
                value={emailorpass}
                onChange={(event)=>setEmail(event.target.value)} className='ip' />
                <input type="password"
                placeholder='shh 🤫!!'
                value={password}
                onChange={(event)=>setpassword(event.target.value)} className='ip'/>
                {/* <AiOutlineEyeInvisible/> */}
                <div className={`${show}`}>
                <button onClick={() => login()} className='btn waves-effect waves-loght btn-large #64b5f6 blue darken-4' type='submit'>Login</button>
                </div>
                <h6>
                    <Link to='/Signup'>Don't have an account? Sign up</Link>
                </h6>
                <span style={{display:"flex",justifyContent:"center",alignItems:'center'}}>
                    <Link to='/reset-password'>Forgot password  </Link>
                    </span>           
                     </div>
                     <div id='center'>
             { loader ? <Watch 
    heigth="100"
    width="100"
    color='Black'
    ariaLabel='loading'
    value="uploading !"
   /> : "" }
   </div>
        </div>
    )
}

export default Login
