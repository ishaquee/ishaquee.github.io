import React, { useState , useEffect} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import M from 'materialize-css'
import './Signup.css'
import {Watch } from  'react-loader-spinner'

function Signup() {
    const navigate = useNavigate()
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [UserName, setUserName] = useState("");
    const [password, setpassword] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [color1,setcolor] = useState("");
    const [url, setUrl] = useState(undefined);
    const [show,setshow] = useState("show")
    const [loader,setLoader] = useState(false);

    useEffect(() => {
        if (url) {
            submitData()
        }
    }, [url])

    const check=(name)=> {
        if(! /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/.test(name))
        {
         setcolor('red')
         setUserName(name)
        }
        else{
            setcolor("green")
            setUserName(name)

        }
    }

    const uploadProfilePicture = () => {
        const formData = new FormData();
        formData.append("file", profilePic);
        formData.append("upload_preset", "instaclone-app");
        formData.append("cloud_name", "instaclone2022");

        fetch("https://api.cloudinary.com/v1_1/instaclone2022/image/upload", {
            method: "post",
            body: formData
        }).then(response => response.json())
            .then(data => {
                setUrl(data.url);
            })
            .catch(error => console.log(error));
    }
    const submitData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            setshow("show")
            setLoader(false)
            M.toast({ html: "Enter valid email!", classes: "#c62828 red darken-3" });
            return
        }
        if(! /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/.test(UserName))
        {
            setshow("show")
            setLoader(false)
            M.toast({ html: "Enter valid UserName!", classes: "#c62828 red darken-3" });
            return
        }
        M.toast({ html: "please wait :) ", classes: "#c62828 blue darken-3 toast-container" });
        fetch("https://instabackend22.herokuapp.com/register", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: fullName,
                email: email,
                password: password,
                profilePicUrl: url,
                username: UserName
            })
        })
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                if (data.error) {
                    setshow("show")
                    setLoader(false)
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" });
                }
                else {
                    setLoader(false)
                    setshow("show")
                    M.toast({ html: data.result, classes: "#388e3c green darken-2" });
                    navigate('/login');
                }
            }).catch(error => {
                console.log(error);
            })
    }

    const register = () => {
        setshow("hide")
        setLoader(true)
        if (profilePic) {
            uploadProfilePicture()
        } else {
            submitData()
        }
    }
    return (
        <div className='login-container'>
            <div className='card login-card input-field'>
                <h2>socail soup</h2>

                <input type={"text"}
                placeholder='FullName'
                value={fullName}
                onChange={(event)=>setFullName(event.target.value)}/>

                <input type={"email"}
                placeholder='Email'
                value={email}
                onChange={(event)=>setEmail(event.target.value)}/>

                <input type={"text"}
                placeholder='Username'
                value={UserName}
                style={{color: color1,background:'none'}}
                onChange={(event)=> check(event.target.value)  } />

                <input type={"password"}
                placeholder='password'
                value={password}
                onChange={(event)=>setpassword(event.target.value)}/>

<div className="file-field input-field" style={{display:'flex',alignContent:'center',alignItems:'center',justifyItems:'center',justifyContent:'center'}}>
      
        <li style={{width:'200px',borderRadius:'10px'}} class="btn1 profile-edit-btn btn waves-effect waves-light #0d47a1 blue darken-4 signup"> <span style={{color:"white",fontWeight:'700'}} className='pl2'>  profile pic</span>
                 <input type="file"  onChange={(e)=>setProfilePic(e.target.files[0])} accept="image/png, image/gif, image/jpeg" /></li>   
                 
             <button onClick={()=> register()} className={`btn waves-effect waves-loght btn-medium #64b5f6 darken-4 cusbtn signup ${show}`} type='submit' style={{fontWeight:'bolder',width:'250px'}}>Create Account</button>
             </div>

                <h6>
                    <Link to='/login'>Have an account? Log in </Link>
                </h6>
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

export default Signup;
