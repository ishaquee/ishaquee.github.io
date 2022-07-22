import React, { useContext, useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import M from 'materialize-css'
import './Signup.css'
import './login.css'

function Reset() {
    const navigate = useNavigate()
    const [Email, setEmail] = useState("");

    const resetpassword = ()=>{
        if(!  
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(Email))
        {
            M.toast({html: "enter valid email" ,classes: "#62229 red darken-2"})
            return
        }
        M.toast({ html: "please wait :) ", classes: "#c62828 blue darken-3",id:"toast-container" });
        fetch("https://instabackend22.herokuapp.com/resetpassword",{
            method: "post",
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: Email,
            })
        })
        .then(response => response.json())
        .then(function(data){
            console.log(data)
            if(data.error)   {
            M.toast({html: data.error ,classes: "#62229 red darken-2"})
            }
            else{
                M.toast({html: "email sent Successfull" ,classes: "#62229 green darken-2",id:"toast-container"})
                navigate('/login');
            }   
        });
    }
    return (
        <div className='login-container'>
            <div className='card login-card input-field'>
                <h2>Instaclone</h2>
                <input type="text"
                placeholder='Email'
                value={Email}
                onChange={(event)=>setEmail(event.target.value)}/>
                <button onClick={() => resetpassword()} className='btn waves-effect waves-loght btn-medium #64b5f6 blue darken-4' type='submit'>Reset Password</button>
                <h6>
                    <Link to='/Login'>Do you know password ? Login</Link>
                </h6>
            </div>
        </div>
    )
}

export default Reset
