import React, { useState} from 'react'
import { useNavigate ,useParams} from 'react-router-dom'
import M from 'materialize-css'
import './Signup.css'
import './login.css'

function Newpassword() {
    const navigate = useNavigate()
    const [password, setpassword] = useState("");
    const {token} = useParams()

    const newpassword = ()=>{
        M.toast({ html: "please wait :) ", classes: "#c62828 blue darken-3",id:"toast-container" });
        fetch("https://instabackend22.herokuapp.com/new-password",{
            method: "post",
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                token,
            })
        })
        .then(response => response.json())
        .then(function(data){
            console.log(data)
            if(data.error)   {
            M.toast({html: data.error ,classes: "#62229 red darken-2"})
            }
            else{
                M.toast({html: data.message ,classes: "#62229 green darken-2",id:"toast-container"})
                navigate('/Login');
            }
        
        });
    }
    return (
        <div className='login-container'>
            <div className='card login-card input-field'>

                <h2>Instaclone</h2>

                <input type="password"
                placeholder='Enter new Password 🤫!!'
                value={password}
                onChange={(event)=>setpassword(event.target.value)}/>
                <button onClick={() => newpassword()} className='btn waves-effect waves-loght btn-large #64b5f6 blue darken-4' type='submit'>Update Password</button>     
                     </div>
        </div>
    )
}

export default Newpassword
