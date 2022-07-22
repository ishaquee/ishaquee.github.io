import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';
import {TailSpin } from  'react-loader-spinner'
import { Link } from 'react-router-dom';

function OtherUserProfile() {

    const [userProfile, setUserProfile] = useState();
    const [myprofile, setmyProfile] = useState();
    const { state, dispatch } = useContext(UserContext);
    const { userId } = useParams()
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userId) : true);

    useEffect(() => {
        fetch(`https://instabackend22.herokuapp.com/user/${userId}`, {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                setUserProfile(data);
            }).catch(error => {
                console.log(error);
            });
    }, []);

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
            });
    }}, []);
        
  //we want to lad only once when component is mounting/loading thats why an empty array as dependency
    const follow = () => {
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

    const request = () => {
        fetch('https://instabackend22.herokuapp.com/request', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ request: userId ,my : state._id, Uname: state.username })
        })
            .then(response => response.json())
            .then(function (updatedUser) {
                const id = userId;
                console.log('request'+JSON.stringify(updatedUser))
                window.location.reload(false);

                        })
            .catch(error => {
                console.log(error);
            });
    }

    const requestid = () => {
        fetch('https://instabackend22.herokuapp.com/requestid', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ request: userId ,my : state._id})
        })
            .then(response => response.json())
            .then(function (updatedUser) {
                const id = userId;

                console.log('requestid'+JSON.stringify(updatedUser))
                window.location.reload(false);

            })
            .catch(error => {
                console.log(error);
            });
    }
    const unrequest = () => {
        fetch('https://instabackend22.herokuapp.com/unrequest', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ request: userId ,my : state._id,Uname: state.username })
        })
        .then(response => response.json())
        .then(function (updatedUser) {
            const id = userId;
            console.log('unrequest'+JSON.stringify(updatedUser))
            window.location.reload(false);

        })
            .catch(error => {
                console.log(error);
            });
    }

    const unrequestid = () => {
        fetch('https://instabackend22.herokuapp.com/unrequestid', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ request: userId ,my : state._id })
        })
        .then(response => response.json())
        .then(function (updatedUser) {
            const id = userId;
            console.log('unrequestid'+JSON.stringify(updatedUser))
            window.location.reload(false);

        })
            .catch(error => {
                console.log(error);
            });
    }

    const unfollow = () => {
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
                dispatch({ type: "UPDATE", payload: { following: updatedUser.following, followers: updatedUser.followers} })
                localStorage.setItem("userinfo", JSON.stringify(updatedUser))

                setUserProfile((prevState) => {
                    const updatedFollowers = prevState.user.followers.filter(uid => uid != updatedUser._id)
                 //   const updatedApprovedIds = prevState.user.ApprovedIds.filter(uid => uid != updatedUser._id)
                    return {
                        ...prevState, //expand current state i.e it has user and post info
                        user: {
                            ...prevState.user,
                            //update the followers count by removing the loggedin user id into the followers list of Other user
                            followers: updatedFollowers,
                           // ApprovedIds: updatedApprovedIds
                        }
                    }
                })
                setShowFollow(true);
                window.location.reload(false);

            }).catch(error => {
                console.log(error);
            });
    }


    const unfollowfromprivate = () => {
        fetch('https://instabackend22.herokuapp.com/removeApproved', {
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
            }).catch(error => {
                console.log(error);
            });
    }



    const Request = () => {
        request()
        requestid()
    }

    const unRequestfromPrivate = () => {
        unfollowfromprivate()
        unfollow()
    }
    const Unrequest = () => {
        unrequest()
        unrequestid()
    }
    return (
    //     <>
        
    //         {
    //             userProfile
    //                 ? 
    //   <div className="container">
	// 	<div class="profile">
	// 		<div class="profile-image">
	// 			<img style={{ width: "100px", height: "100px", borderRadius: "83px" }} src={ userProfile.posts.profilePicUrl != "undefined" ? 'https://i.pinimg.com/236x/55/7a/99/557a99898f8537dffd56c892d0ebafde.jpg' : 'loading'  } alt=""/>	
	// 		</div>

	// 		<div class="profile-user-settings">
    //             <span>
	// 			<h1 class="profile-user-name">{userProfile ? userProfile.user.fullName : "Loading"}</h1>
	// 			{/* <button class="btn btn1 profile-settings-btn" aria-label="profile settings"><i class="fas fa-cog" aria-hidden="true"></i></button> */}
    //             </span>
	// 		</div>

	// 		<div class="profile-stats">

	// 			<ul>
	// 				<li><span class="profile-stat-count">{userProfile.posts.length} </span> posts</li>
	// 				<li><span class="profile-stat-count">{(userProfile.user.followers).length}</span> followers</li>
	// 				<li><span class="profile-stat-count">{(userProfile.user.following).length}</span> following</li>
	// 			</ul>
	// 		</div>
    //         {
    //         showFollow
    //                                     ? <button style={{ margin: "10px" }} onClick={() => follow()} className="btn waves-effect waves-light #0d47a1 blue darken-4">Follow</button>
    //                                     : <button style={{ margin: "10px" }} onClick={() => unfollow()} className="btn waves-effect waves-light #0d47a1 blue darken-4">UnFollow</button>
    //                             }

	// 		<div class="profile-bio">

	// 			<p><span class="profile-real-name">Jane Doe</span> Lorem ipsum dolor sit, amet consectetur adipisicing elit 📷✈️🏕️</p>

	// 		</div>

	// 	</div>
    //        { userProfile.posts.length >   0  ?  
    //                    ( <div className="posts">
    //                         {
    //                             userProfile.posts.map((post) => {
    //                                 return (
    //                                     <img src={post.image} className="post" alt={post.title} key={post._id} />
    //                                 )
    //                             })
    //                         }
    //                     </div>)
    //                     : <div>  
    //                     <h1 style={{
    //                         display:"flex",
    //                         alignItems:"center",
    //                         justifyContent:"center"
    //                     }} > User don't have Any Post </h1> 
    //                     </div>   }
    //                     </div>
    //                 : <div>  
    //                 <h1 style={{
    //                     display:"flex",
    //                     alignItems:"center",
    //                     justifyContent:"center"
    //                 }} > Loading... </h1> 
    //                 </div> 
                                       
                   
    //         }
            
    //     </>

   
    <div style={{maxWidth:"550px",margin:"0px auto"}}>
{ userProfile ? 
       <>  <div style={{
           margin:"20px 0px",
            borderBottom:"2px solid grey"
        }}>

      
        <div style={{
            display:"flex",
            justifyContent:"space-evenly",
           
        }}> 
           <div>
                            <img style={{ width: "120px", height: "120px", borderRadius: "80px", marginTop: '20px' }}
                                src={userProfile ? userProfile.user.profilePicUrl : ''} />

                        </div><div>
                                <h4 style={{ fontSize: '20px' }}>{userProfile ? userProfile.user.fullName : ""}
                                </h4>
                                <h5 className='username'>{userProfile ? userProfile.user.username : "loading"}
                                </h5>
                                <div class="profile-stats">

                                    <ul style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'space-between' }}>

                                        <li style={{ marginRight: '5px', fontWeight: '600', fontSize: '15px' }}><span>{userProfile ? userProfile.posts.length : ""} </span>  <span style={{ fontWeight: '500', fontSize: '15px', borderRight: '1px solid black', padding: '3px' }}> posts </span></li>
                                        <li style={{ marginRight: '5px', fontWeight: '100', fontSize: '15px' }}><span>{userProfile ? (userProfile.user.followers).length : ""}</span>  <span style={{ fontWeight: '500', fontSize: '15px', borderRight: '1px solid black', padding: '3px' }}> followers </span></li>
                                        <li style={{ marginRight: '5px', fontWeight: '100', fontSize: '15px' }}> <span>{userProfile ? (userProfile.user.following).length : ""}</span> <span style={{ fontWeight: '500', fontSize: '15px', borderRight: '1px solid black', padding: '3px' }}>following </span></li>

                                    </ul>
                                    {/* {
                showFollow
                                            ? <button style={{ margin: "10px" }} onClick={() => follow()} className="btn waves-effect waves-light #0d47a1 blue darken-4">Follow</button>
                                            : <button style={{ margin: "10px" }} onClick={() => unfollow()} className="btn waves-effect waves-light #0d47a1 blue darken-4">UnFollow</button>
                                    } */}


                                    {userProfile ? userProfile.user.isPrivate ? state.following.includes(userId) ? <button style={{ margin: "10px" }} onClick={() => unRequestfromPrivate()} className="btn waves-effect waves-light #0d47a1 blue darken-4">unfollow</button> : userProfile.user.RequestIds.length > 0 ? userProfile.user.RequestIds.includes(state._id) ? <button style={{ margin: "10px" }} onClick={() => Unrequest()} className="btn waves-effect waves-light #0d47a1 black darken-4">unrequest</button> : <button style={{ margin: "10px" }} onClick={() => Request()} className="btn waves-effect waves-light #0d47a1 red darken-4">request</button> : userProfile.user.ApprovedIds.includes(state._id) ? <button style={{ margin: "10px" }} onClick={() => follow()} className="btn waves-effect waves-light #0d47a1 yellow darken-4">follow</button> : <button style={{ margin: "10px" }} onClick={() => Request()} className="btn waves-effect waves-light #0d47a1 orange darken-4">request</button> : state.following.includes(userId) ? <button style={{ margin: "10px" }} onClick={() => unfollow()} className="btn waves-effect waves-light #0d47a1 green darken-4">unfollow</button> : <button style={{ margin: "10px" }} onClick={() => follow()} className="btn waves-effect waves-light #0d47a1 brown darken-4">follow</button> : ''}
                                </div>
                            </div>
 
        </div>
         </div>      
    <div className='Posts'>
                {   userProfile ? 
                    userProfile.posts.length > 0 ? 
                    userProfile.user.isPrivate ? userProfile.user.followers.includes(state._id) ? 
                    userProfile.posts.map((mypost)=>{
                        return(             
<div className='center post-test'>

<Link to={`/p/${mypost._id}`}>      <img className='post' src= {mypost.image} alt= {mypost.title} key={mypost._id} title={ mypost.likes.length+ " likes ❤️ "} />       </Link> </div>                           
                        )   })
                        : 
                        <div>  
                        <h3 style={{
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center",
                            padding:'10px',
                            fontSize:'20px'
                        }} > Private Post - follow the user to see the content  </h3> 
                        </div> : 
                       userProfile.posts.map((mypost)=>{
                        return(             
<div className='center post-test'>

<Link to={`/p/${mypost._id}`}>      <img className='post' src= {mypost.image} alt= {mypost.title} key={mypost._id} title={ mypost.likes.length+ " likes ❤️ "} />       </Link> </div>                                                      
                        )   })
                        :
                        <div>  
                        <h3 style={{
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center",
                            padding:'10px',
                            fontSize:'20px'
                        }} > User don't have Any Post </h3> 
                        </div> 
                        : ""
                }
        </div> </> : <div id='center' style={{marginTop:'10px'}}>
 { <TailSpin 
heigth="200"
width="200"
color='royalblue'
ariaLabel='loading'
value="uploading !"
/> } </div> }
    </div>

    )
}

export default OtherUserProfile
