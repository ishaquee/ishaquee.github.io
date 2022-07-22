import React, {useContext,useEffect,useState} from 'react'
import {FcSearch} from 'react-icons/fc'
import {MdClear} from 'react-icons/md'
import { UserContext } from '../App';
import {Link} from 'react-router-dom'
import {Watch } from  'react-loader-spinner'
import './Search.css';

function SearchUser() {
    const [userDetails,setUserDetails] = useState([])
    const [search,setSearch] = useState('')
    const [userProfile, setUserProfile] = useState();
    const { state, dispatch } = useContext(UserContext);
    const [showFollow, setShowFollow] = useState(true);
    const [show,setshow]  = useState("hide")
    const [loader,setLoader] = useState(false);

    // const redirect= (id)=> {
    //     <Link to= {id !== state._id ? "/profile/" + (id) : "/profile"} style={{textDecoration:'none'}}/>         
    // }
    
    const reset=()=>{
        setSearch('');
        setUserDetails('')
        setUserProfile('')
    }
    useEffect(()=>{
        if(search.length > 0)
        {
        setshow("show")
        }
        else
        {
            setshow("hide")
        }
    },[search])
    const fetchUsers = (query)=>{
        setLoader(true)
        setSearch(query)
        fetch('https://instabackend22.herokuapp.com/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{
            setLoader(false)
          setUserDetails(results.user)
          
        })
     }

     const follow = (userId) => {
        fetch('https://instabackend22.herokuapp.com/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ followId: userId })

        })
            .then(response => response.json())
            .then(function (updatedUser) {
                console.log(updatedUser);
                dispatch({ type: "UPDATE", payload: { following: updatedUser.following, followers: updatedUser.followers } })
                localStorage.setItem("userinfo", JSON.stringify(updatedUser))

                setUserProfile((prevState) => {
                    return {
                        ...prevState, //expand current state i.e it has user and post info
                        user: {
                            ...prevState.user,
                            //update the followers count by adding the loggedin user id into the followers list of Other user
                            followers: [...prevState.user.followers, updatedUser._id]
                        }
                    }
                })
                setShowFollow(false);
            }).catch(error => {
                console.log(error);
            });
    }

    const unfollow = (userId) => {
        fetch('https://instabackend22.herokuapp.com/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ unfollowId: userId })

        })
            .then(response => response.json())
            .then(function (updatedUser) {
                console.log(updatedUser);
                dispatch({ type: "UPDATE", payload: { following: updatedUser.following, followers: updatedUser.followers } })
                localStorage.setItem("userinfo", JSON.stringify(updatedUser))

                setUserProfile((prevState) => {
                    const updatedFollowers = prevState.followers.filter(uid => uid != updatedUser._id)
                    return {
                        ...prevState, //expand current state i.e it has user and post info
                        user: {
                            ...prevState.user,
                            //update the followers count by removing the loggedin user id into the followers list of Other user
                            followers: updatedFollowers
                        }
                    }
                })
                setShowFollow(true);
            }).catch(error => {
                console.log(error);
            });
    }
  return (
    <div className='search'>
        <div className='search-box'>       
         <input
            type="text"
            placeholder="Username ...."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            />
<i style={{textDecoration:'none',cursor:'pointer'}} className={`${show}`} key="2292"><FcSearch onClick={()=> fetchUsers(search)} style={{
          marginTop:'15px',
          fontSize:'35px',
          textDecoration:'none'
         }}/></i>
         <i style={{textDecoration:'none',cursor:'pointer'}} key="292"><MdClear onClick={()=> reset()} style={{
          marginTop:'15px',
          fontSize:'35px',
          textDecoration:'none'
         }}/></i>
        </div>
        <div className='main details'>
            {
                userDetails ? userDetails.length > 0 ?  userDetails.map(item=> {
                    return(
                        <div id={item._id} className='card display' onClick={() => console.log("hellox")} >
                            <h6 style={{fontSize:'20px'}}><span className='user1'  style={{fontSize:'20px'}}> {item.username} </span></h6>
                            <img className='profile-pic blur' src={item.profilePicUrl} />
                            <div class="profile-stats">

<ul style={{display:'flex',justifyContent:'space-between',alignContent:'space-between'}}>
	 				<li style={{marginRight:'5px',fontWeight:'100',fontSize:'15px'}}><span >{ userDetails ? item.followers.length : "Loading"}</span>  <span style={{fontWeight:'lighter',fontSize:'10px'}}> followers </span></li>
	 				<li style={{marginRight:'5px',fontWeight:'100',fontSize:'15px'}}> <span >{userDetails ? item.following.length : "loading"}</span> <span style={{fontWeight:'lighter',fontSize:'10px'}}>following </span></li>
</ul>
</div>     
 <Link to= {item._id !== state._id ? "/profile/" + (item._id) : "/profile"} style={{textDecoration:'none'}} className='btn viewmore1' > <span className='blur' style={{color:'wheat'}}>View </span> </Link>        
                            </div>
                    )
                }) : <h4 style={{display:'flex',alignContent:'center',justifyItems:'center',justifyContent:'center',alignItems:'center',margin:'100px auto'}}> It's so empty here !!  </h4>   : ''
            }
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

export default SearchUser