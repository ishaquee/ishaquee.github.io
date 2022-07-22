import React, { useEffect, useState, useContext } from 'react'
import './notification.css'
import { UserContext } from '../App';
import { useNavigate } from "react-router-dom";

function Notifications() {

    const [request,setRequest] = useState([])
    const [request1,setRequest1] = useState('')
    const { state } = useContext(UserContext);
    const [userProfile, setUserProfile] = useState();


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
                    setRequest(data.posts[0].Requested)
                }).catch(error => {
                    console.log(error);
                });
      }  },[])



      const unrequest = (userid,uname) => {
        fetch('https://instabackend22.herokuapp.com/unrequest', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ request: state._id ,my : userid,Uname: uname })
        })
        .then(response => response.json())
        .then(function () {
        })
            .catch(error => {
                console.log(error);
            });
    }
    const unrequestid = (userid) => {
        fetch('https://instabackend22.herokuapp.com/unrequestid', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ request: state._id ,my : userid })
        })
        .then(response => response.json())
        .then(function () {
        })
            .catch(error => {
                console.log(error);
            });
    }
    const Approve = (userid) => {
        fetch('https://instabackend22.herokuapp.com/approve', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ my: state._id ,approveid : userid})
        })
        .then(response => response.json())
        .then(function () {
            window.location.reload(false)
        })
            .catch(error => {
                console.log(error);
            });
    }

    const Accept = (id,uname) =>{
        unrequest(id,uname)
        unrequestid(id)
        Approve(id)
    }
    const Denied = (id,uname) =>{
        unrequest(id,uname)
        unrequestid(id)
    }
    
  return (
    <div className='notifications'>
        {
            request ? 
            request.length <= 0 ? <h5 style={{display:'flex',fontWeight:'800'}}> Currently You Dont have Any Notifications here  !! </h5> : 
            request.map((item)=> {
                return(
                <div className='notification' key={item._id}>
                 <h6>  user  <span style={{color:'red'}}> {item.username} </span> has Requested to follow you  </h6>
                 <button className='btn-small' style={{color:'black',borderRadius:'10px'}} onClick={()=> {Accept(item.id,item.username)}}> Accept </button>   
                 <button className='btn-small' style={{color:'black',borderRadius:'10px'}} onClick={()=> {Denied(item.id,item.username)}}> Denied </button>   
                </div>     
                )
            })
            : ''
        }
    </div>
  )
}

export default Notifications