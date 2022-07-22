import React,{useEffect,useState,useContext} from 'react'
import './profile.css'
import {UserContext} from '../App';
import M from 'materialize-css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {FiSettings} from 'react-icons/fi'
import {RiBookmark3Fill} from 'react-icons/ri'
import { Link ,useNavigate } from 'react-router-dom';
import {Watch } from  'react-loader-spinner'



function Profile() {
    const {state,dispatch} = useContext(UserContext);
    const [myposts,setMyposts] = useState([]);
    const [mysavedposts,setMySavedposts] = useState([]);
    const [image,setImage] = useState("")
    const [loader,setLoader] = useState(false);
    const [myprofile, setmyProfile] = useState();

    const  navigate = useNavigate();

    useEffect(() => {
        if(state) {
        fetch(`https://instabackend22.herokuapp.com/user/${state._id}`, {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })  
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                setmyProfile(data);
            }).catch(error => {
                console.log(error);  
                
         } );  } } , []);  
 
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
                setLoader(false)
                console.log("result-->" + result)
                localStorage.setItem("userinfo",JSON.stringify({...state,profilePicUrl:result.profilePicUrl}))
                dispatch({type:"UPDATEPIC",payload:result.profilePicUrl})
                //window.location.reload()
            })
         })
         .catch(err=>{
             console.log(err)
         })
        }
     },[image])

    useEffect(() => {      
            fetch("https://instabackend22.herokuapp.com/myposts",{
                method: "get",
                headers:
                {
                    "Authorization": "Bearer "+ localStorage.getItem("token")
                }
            })
            .then(response => response.json())
            .then(function(data){
                setMyposts(data.posts)
                console.log(data.posts)
            }).catch(error => {
                console.log('error i am printinfn'+error)
                if(error)
                {
                    M.toast({html: "you will logout soon due to token expiries" ,classes: "#62229 red darken-2"})
                    localStorage.clear();
                    dispatch({type: "LOGOUT"})
                    navigate('/login') 
                    
                }            })
        }
    ,[]);


    useEffect(() => {      
        fetch("https://instabackend22.herokuapp.com/mysavedpost",{
            method: "get",
            headers:
            {
                "Authorization": "Bearer "+ localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(function(data){
            setMySavedposts(data.posts)
            console.log(data.posts)
        }).catch(error => {
            console.log(error);
        })
    }
,[]);


    const updatePhoto = (file)=>{
        setLoader(true)
        setImage(file)
    }

    return (
        <div style={{maxWidth:"550px",margin:"30px auto"}}>
        <div style={{
           margin:"18px 0px",
            borderBottom:"2px solid grey"
        }}>

      
        <div style={{
            display:"flex",
            justifyContent:"space-around",
           
        }}>
            <div>
                <img style={{width:"120px",height:"120px",borderRadius:"80px",marginTop:'10px'}}
                src={state?state.profilePicUrl:"loading"} className='pp'
                />
              
            </div>
            <div >
            <i style={{ fontSize:'30px',display:'inline',color:'darkblue',cursor:'pointer',float:'right'}} onClick={() =>navigate('/setting')} ><FiSettings/> </i>

                <h4> <span style={{fontSize:'20px'}}>{state?state.fullName:"loading"}</span>  
</h4>
<h5 className='username'>{state?state.username:"loading"} 
</h5>

                {/* <h5>{state?state.email:"loading"}</h5> */}
                <div class="profile-stats"> {}

<ul style={{display:"flex",justifyContent:'space-around'}}>
    <li style={{marginRight:'5px',fontWeight:'600',fontSize:'15px'}}><span class="profile-stat-count">{myposts ? myposts.length : ''} </span> <span style={{fontWeight:'500',fontSize:'15px',borderRight:'1px solid black',padding:'3px'}}>posts </span></li>
    <li style={{marginRight:'5px',fontWeight:'600',fontSize:'15px'}}><span class="profile-stat-count">{myprofile  ? myprofile.user.followers.length : 0}</span> <span style={{fontWeight:'500',fontSize:'15px',borderRight:'1px solid black',padding:'3px'}}> followers  </span> </li>
    <li style={{marginRight:'5px',fontWeight:'600',fontSize:'15px'}}><span class="profile-stat-count">{myprofile  ? myprofile.user.following.length : 0}</span> <span style={{fontWeight:'500',fontSize:'15px',padding:'3px'}} > following </span> </li>
</ul>

</div>

            </div>
        </div>
         </div>     
         <h6 className='center' style={{fontWeight:'900'}}>My Post</h6>
 
         <div className='Posts' style={{borderBottom:'1px solid black',paddingBottom:'50px'}}>
                {
                   myposts ?  myposts.length > 0 ? 
                    myposts.map((mypost)=>{
                        return(  
<div className='center post-test'>

<Link to={`/p/${mypost._id}`}>      <img className='post' src= {mypost.image} alt= {mypost.title} key={mypost._id} title={ mypost.likes.length+ " likes ❤️ "} />       </Link> </div>
                        )   })
                        : <div>  
                        <h6 style={{
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center"
                        }} >  you didn't posted anything  </h6>     
              </div>  :  <div id='center'>
                        { <Watch 
               heigth="100"
               width="100"
               color='Black'
               ariaLabel='loading'
               value="uploading !"
              /> } 
                        </div> 
                } 
        </div>
        <h6 className='center' style={{fontWeight:'900'}}>My saved Post <RiBookmark3Fill/></h6>
 
 <div className='Posts' style={{borderBottom:'1px solid black',paddingBottom:'50px',marginBottom:'100px'}}>
        {
   mysavedposts ? mysavedposts.length > 0 ? 
            mysavedposts.map((mypost)=>{
                return( 
                    <div className='center post-test'>
                        <Link to={`/p/${mypost._id}`}>   <img className='post' src= {mypost.image} alt= {mypost.title} key={mypost._id} title={ mypost.likes.length+ " likes ❤️ "} />       </Link> </div>
                )   })
              : <div>  
                <h6 style={{
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center"
                }} >  No you don't have any saved post  </h6> 
                </div>  :  <div id='center'>
                { <Watch 
       heigth="100"
       width="100"
       color='Black'
       ariaLabel='loading'
       value="uploading !"
      /> } 
      </div>
        }
</div>
    </div>
)
}


export default Profile