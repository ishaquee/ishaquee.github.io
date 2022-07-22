import React, { useState} from 'react'
import M from 'materialize-css'
import './updatepass.css'
import { useNavigate } from 'react-router-dom'
import {TailSpin } from  'react-loader-spinner'
function Updatepass() {
    const [oldpass,setoldpass] = useState('');
    const [newpass,setnewpass] = useState('');
    const [loader,setLoader] = useState(false);
    const navigate = useNavigate()

    const update =() => {
        setLoader(true)
        fetch("https://instabackend22.herokuapp.com/updatepass",{
          method:"post",
          headers:{
              "Content-Type":"application/json",
              "Authorization": "Bearer "+ localStorage.getItem("token")
          },
          body:JSON.stringify({
            email: JSON.parse(localStorage.getItem('userinfo')).email,
            oldpass: oldpass,
            newpass:newpass
          })
      }).then(res=>res.json())
      .then(function(data){
        console.log(data)
        if(data.error)   {
          setLoader(false)
        M.toast({html: data.error ,classes: "#62229 red darken-2"})
        }
        else{
          setLoader(false)
            M.toast({html: "Password Updated Successfully" ,classes: "#62229 green darken-2",id:"toast-container"})
            navigate('/Profile');
        }
      }).catch(err=>{
          console.log(err)
      })
      }

  return (
    <div className='style'>
    <div className='password updatepassword'>
      <h5 className='center'> Update password !!</h5>
    <input type='password'  placeholder='Old Password' onChange={(event)=>setoldpass(event.target.value)}/> 
    <input type='password'  placeholder='New Password' onChange={(event)=>setnewpass(event.target.value)}/> 
      <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',alignContent:'center'}}>
      <button style={{margin:'10px',color:'white'}} onClick={()=> update()} className={`btn waves-effect waves-loght btn-medium red darken-4 ${loader ? 'disabled' : ''} `} type='submit'>Update</button>     </div>
 </div>
 <div id='center'>
     { loader ? <TailSpin 
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

export default Updatepass