import React, { useEffect, useState, useContext } from 'react'
import { Link ,useNavigate } from 'react-router-dom';
import './navbar.css'
import {UserContext} from '../App'
import {BsBroadcast} from 'react-icons/bs'
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import M from 'materialize-css'

const Navbar = () =>  {
  
  const {state,dispatch} = useContext(UserContext);
  const  navigate = useNavigate();
  const [request,setRequest] = useState([])

  useEffect(()=>{
    if(state){
    fetch('https://instabackend22.herokuapp.com/getallrequest', {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(function (data) {
              if(data.error == "User not logged In error2")
                {
                    M.toast({html: "you will logout soon due to token expiries" ,classes: "#62229 red darken-2"})   
                    localStorage.clear();
                     dispatch({type: "LOGOUT"})
                     navigate('/login')   
                     window.location.reload(false);           
                }
                else{
                setRequest(data.posts[0].Requested)
                }
            }).catch(error => {
                console.log(error);
            });
          }
  },[state])


  const navList = () => {
    if(state)
    {
      return[
        <li key="121" style={{float:'left'}} >
        <Link to='/Notifications' > {request ? request.length > 0  ? <Badge badgeContent={request.length} color='primary'>
      <MailIcon color='success' />
    </Badge>   : <Badge badgeContent={0} color='primary'>
      <MailIcon color='action' />
    </Badge>  : ''}  </Link>
        </li> 
            ]
    }
  }
  
    return (    
  <nav>
    <div className="navbar-top navbar-custom" style={{position:"fixed",width:"100%",zIndex:"999",height:"7%"}}>
      <Link to={state ? "/home" : "/login"} className="brand-logo center" style={{textDecoration:"none",display:"inline"}} > <li style={{textDecoration:"none",listStyle:"none" }} > <span className='instax'> socialsoup </span>  <span  style={{fontSize:'20px',color:'darkred'}}><BsBroadcast /></span> </li></Link>
      <ul className='someone'>
        {navList()}
      </ul>
    </div>
    
  </nav>
    )
}

export default Navbar;
