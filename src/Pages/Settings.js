import React,{useEffect,useState,useContext} from 'react'
import './setting.css'
import {UserContext} from '../App';
import {MdLogout} from 'react-icons/md'
import { useNavigate } from 'react-router-dom';
import {Watch } from  'react-loader-spinner';
import M from 'materialize-css'
import {FaUserCircle}  from 'react-icons/fa';
import {MdEmail} from 'react-icons/md';
import {BiReset} from 'react-icons/bi';
import {AiOutlineUnlock,AiOutlineLock} from 'react-icons/ai';
import { confirmAlert } from 'react-confirm-alert';

function Settings() {

  const {state,dispatch} = useContext(UserContext);
  const [loader,setLoader] = useState(false);
  const [image,setImage] = useState("");
  const [isprivate,setprivate] = useState(Boolean);
  const [request,setRequest] = useState([])

  const  navigate = useNavigate();

  const updatePhoto = (file)=>{
		setLoader(true)
    setImage(file)

    }
    const reset = () => {
        navigate('/Updatepass');
      }

    const getall = () => {
        fetch('https://instabackend22.herokuapp.com/getallrequest', {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(function (data) {
                setRequest(data.posts);
            }).catch(error => {
                console.log(error);
            });
    }

    const submit = () => {
        confirmAlert({
          title: 'Confirm to logout',
          message: 'Are you sure to do this.',
          buttons: [
            {
              label: 'Yes',
              onClick: () => logout()
            },
            {
              label: 'No',
              onClick: () => ""
            }
          ]
        });
      };

    const logout = ()=>{
      localStorage.clear();
      dispatch({type: "LOGOUT"})
      navigate('/login')
      }

      useEffect(()=>{
          if(image){
           const data = new FormData()
           data.append("file",image)
           data.append("upload_preset","instaclone-app")
           data.append("cloud_name","instaclone2022")
           fetch("https://api.cloudinary.com/v1_1/instaclone2022/image/upload",{
               method:"post",
               body:data
            })
          .then(res=> res.json())
           .then(data=>{
              fetch('https://instabackend22.herokuapp.com/updatepic',{
                  method:"put",
                  headers:{
                      "Content-Type":"application/json",
                      "Authorization":"Bearer "+localStorage.getItem("token")
                  },
                  body:JSON.stringify({
                      url:data.url
                  })
              })
           .then(res=>res.json())
              .then(result=>{
                  console.log("result-->" + result)
          setLoader(false)
                  localStorage.setItem("userinfo",JSON.stringify({...state,profilePicUrl:result.profilePicUrl}))
                  dispatch({type:"UPDATEPIC",payload:result.profilePicUrl})
              })
           })
           .catch(err=>{
               console.log(err)
           })
          }
       },[image])


       const removeAll = ()=> {
           fetch("https://instabackend22.herokuapp.com/removerequest",{
               method:'put',
               headers:{
                "Content-Type": "application/json",
                "Authorization":"Bearer "+localStorage.getItem("token")
               },
              body: JSON.stringify({ my : state._id , ids : request})
           })
           .then(data => {
           })
       }
       const setAccount = (status)=>{
        fetch("https://instabackend22.herokuapp.com/setaccount",{
            method: "put",
            headers:
            {
                "Content-Type": "application/json",
                "Authorization":"Bearer "+localStorage.getItem("token")

            },
            body: JSON.stringify({
                _id: state._id,
                private: status
            })
        })
        .then(response => response.json())
        .then(function(data){
            if(data.error)   {
            M.toast({html: data.error ,classes: "#62229 red darken-2"})
            }
            else{
                setprivate(data)
                if(data)
                {
                        dispatch({type:"UPDATETRUE"})
                        console.log("data    "+ data)
                        localStorage.setItem("userinfo",JSON.stringify({...state,isPrivate: data}))
            }
            else{
                dispatch({type:"UPDATEFALSE"})
                        console.log("data    "+ data)
                        localStorage.setItem("userinfo",JSON.stringify({...state,isPrivate: data}))
            }
                M.toast({html: "Update Successfull" ,classes: "#62229 green darken-2",id:"toast-container"})
            }
        
        });
    }
       const setPrivate = ()=>{
         setAccount(true)

       }
       const setPublic = ()=>{  
        setAccount(false)
      }

  return (
//                 <div className='full'>  
//                       <div className='setting-page '>
// <ul>
//               <li>Account type : </li>
//                 {
                   
//                    !isprivate      ? <li style={{ margin: "10px" }} onClick={() => setPrivate()} className="btn waves-effect waves-light #0d47a1 green darken-4">Public</li>
//                                         : <li style={{ margin: "10px" }} onClick={() => setPublic() } className="btn waves-effect waves-light #0d47a1 red darken-4">private</li>
//                                 }
//                                 </ul>
    
    
//     <ul>
//     <li>update Image : </li>
//     <span>
//        <li style={{fontSize:"30px",margin:'1px'}} class="btn1 profile-edit-btn btn waves-effect waves-light #0d47a1 blue darken-4"> <span style={{color:"white"}}>  <RiUserSettingsLine/> </span>
       
//                 <input type="file"  onChange={(e)=>updatePhoto(e.target.files[0])} /></li>
//                 </span>
//                 </ul>
//     <ul>
//     <li>Logout : </li>
//     <span>
//              <li style={{fontSize:"30px"}} onClick={()=> logout()}  class="btn1 profile-edit-btn logout btn waves-effect waves-light #0d47a1 blue darken-4"> <span style={{color:"white"}}> <MdLogout/></span></li>
//                 </span> 
//                 </ul>
// </div>
// { loader ? <div> <span> <Watch color="black" height={50} width={50} /><h5>Uploading...</h5></span> </div>  : ""}

// </div>
<div className='setting'>
      <div className='style'>
    <div className='card style1'>
        <h6 style={{marginTop:'auto'}}> <FaUserCircle style={{marginRight:'1px'}}/> User Name: <span style={{fontWeight:500,marginLeft:'5px',color:'ButtonText'}} className='uname'> {state ? state.username : "loading"} </span> </h6>
        <h6 style={{marginTop:'auto'}}> <MdEmail style={{marginRight:'3px'}}/>  email: <span style={{fontWeight:300,marginLeft:'5px',fontSize:'12px'}}> {state ? state.email : "loading"} </span> </h6>
    </div>
    </div>
    <div className='style'>
    <div className='card style1'>
    <span style={{marginLeft:'7px',fontWeight:'600'}}> Update Profile pic </span> <span>
        <li style={{margin:'1px',display:'flex',flexWrap:'wrap',width:'100px',borderRadius:'10px'}} class="btn1 profile-edit-btn btn waves-effect waves-light #0d47a1 blue darken-4"> <span style={{color:"white",fontSize:'14px',marginLeft:'-14px'}}>  upload </span>
                 <input type="file"  onChange={(e)=>updatePhoto(e.target.files[0])} accept="image/png, image/gif, image/jpeg" /></li>
                </span>
    </div>
</div>
{ loader ? <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',alignContent:'center',justifyItems:'center'}}> <span> <Watch color="black" height={50} width={50} /><h5>Uploading...</h5></span> </div>  : ""}

<div className='style'>
    <div className='card style1'>
    <span style={{marginLeft:'7px',fontWeight:'600'}}>  Account Type   </span> 
    {
                   
                                    state ? !state.isPrivate       ? <li style={{ margin: "10px",borderRadius:'10px' }} onClick={() => setPrivate()} className="btn waves-effect waves-light #0d47a1 green darken-4">Public <AiOutlineUnlock/> </li>
                                                           : <li style={{ margin: "10px" ,borderRadius:'10px'}} onClick={() => setPublic() } className="btn waves-effect waves-light #0d47a1 red darken-4">Private <AiOutlineLock/></li>
                                         : 'Loading'     }
    </div>
</div>

<div className='style'>
    <div className='card style1'>
        <h6 style={{marginTop:'auto',cursor:'pointer',fontWeight:'600'}} onClick={()=> reset()}> <BiReset style={{marginRight:'3px'}}  /> Reset Your Password</h6>
        <h6 style={{marginTop:'auto',cursor:'pointer',fontWeight:'600'}} onClick={()=> logout()} > <MdLogout style={{marginRight:'3px'}} />  Logout</h6>
    </div>
    </div>

<footer class="copyright" style={{display:'flex',flexWrap:'wrap',alignContent:'center',justifyContent:'center',justifyItems:'center',letterSpacing:'1px'}}>
       <p> &copy;  Made with  <img src='https://emojipedia-us.s3.amazonaws.com/source/microsoft-teams/337/black-heart_1f5a4.png' width='25px' height={'25px'}  /> and <img src='https://emojipedia-us.s3.amazonaws.com/source/microsoft-teams/337/hot-beverage_2615.png' width='25px' height={'25px'}  /> by Ishaque</p>
    </footer>
</div>
  )
}

export default Settings