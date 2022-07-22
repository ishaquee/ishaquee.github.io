import React,{useState,useEffect,useContext} from 'react';
import './Home.css';
import {UserContext} from '../App';
import {Link} from 'react-router-dom'
import {BsBookmarkHeart,BsBookmarkHeartFill  } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import {CgSmileSad } from 'react-icons/cg';
import {AiOutlineLoading3Quarters } from 'react-icons/ai';
import {IoPaperPlane } from 'react-icons/io5';
import {FaRegHeart,FaHeart,FaRegComment  } from 'react-icons/fa';
import Moment from 'react-moment';
function Post() {

    const [post,setPosts] = useState([]);
    const [comment,setcomment] = useState('');
    const {state,dispatch} = useContext(UserContext);
    const { pId } = useParams();

   
    useEffect(() => {
            fetch(`https://instabackend22.herokuapp.com/p/${pId}`,{
                method: "get",
                headers:
                {
                    "Authorization": "Bearer "+ localStorage.getItem("token")
                }
            })
            .then(response => response.json())
            .then(function(data){
                setPosts(data.post)
            }).catch(error => {
                console.log(error);
            })
    },[]);

    const timeconverter= (timestamp)=>
    {
        const d = new Date( timestamp );
        const date = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
        return date
    }
    const likeunlike = (postId,url) => {
        fetch(url,{
            method: "put",
            headers:
            {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ localStorage.getItem("token")
            },
            body:
           JSON.stringify({postId: postId})
            
        })
        .then(response => response.json())
        .then(function(updatedpost){
            setPosts(updatedpost)
        }).catch(error => {
            console.log(error);
        })
    }
    const save = (postId) => {
        fetch("https://instabackend22.herokuapp.com/save",{
            method: "put",
            headers:
            {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ localStorage.getItem("token")
            },
            body:
           JSON.stringify({postId: postId,my: state._id }
            )
            
        })
        .then(response => response.json(),
        console.log('crossed'))
        .then(function(data){
            if(data.error)   {
                console.log(data.error)
            }
            else{
                localStorage.setItem("userinfo",JSON.stringify({...state,savedPost:data}))
                dispatch({type:"UPDATESAVEDPOST",payload:data})
            }
        
        });        
    }

    const unsave = (postId) => {
        fetch("https://instabackend22.herokuapp.com/unsave",{
            method: "put",
            headers:
            {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ localStorage.getItem("token")
            },
            body:
           JSON.stringify({postId: postId,my: state._id }
            )
        })
        .then(response => response.json(),
        console.log('crossed'))
        .then(function(data){
            if(data.error)   {
                console.log(data.error)
            }
            else{
                localStorage.setItem("userinfo",JSON.stringify({...state,savedPost:data}))
                dispatch({type:"UPDATESAVEDPOST",payload:data})
            }
        
        });        
    }
    const share= (id,title) => {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: `https://instaclone022.herokuapp.com/p/${id}`
            }).then(() => {
                console.log('Thanks for sharing!');
            }).catch(err => {
                console.log(
                "Error while using Web share API:");
                console.log(err);
            });
        } else {
            navigator.clipboard.writeText(`https://instaclone022.herokuapp.com/p/${id}`)
        }
    }
    const deletePost = (postId) => {
        fetch( `https://instabackend22.herokuapp.com/delete/${postId}`,{
            method: "delete",
            headers:
            {
                "Authorization": "Bearer "+ localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(function(deletedpost){
            const newPostarr = post.filter((oldpost)=>{
                return (oldpost._id != deletedpost.result._id)
                
            });
            setPosts(newPostarr)
        }).catch(error => {
            console.log(error);
        })
    }


    const submitcomment = (event,postId) => {
        event.preventDefault();
        var cmtip = document.getElementById('cmt');
        const commentText = event.target[0].value;
        cmtip.value=''
        fetch('https://instabackend22.herokuapp.com/comment',{
            method: "put",
            headers:
            {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ localStorage.getItem("token")
            },
            body:
           JSON.stringify({commentText: commentText , postId : postId})
            
        })
        .then(response => response.json())
        .then(function(updatedpost){
            const newPostarr = post.map((oldpost)=>{
                if(oldpost._id == updatedpost._id)
                {
                    return updatedpost;
                }
                else
                {
                    return oldpost;
                }
            });
            setPosts(newPostarr)
        }).catch(error => {
            console.log(error);
        })
    }    

    

  return (
      
    <div className='home-container'>
        {
            post ?  post.author ? post.author._id.includes(state._id) ?  
            <div className='card1 home-card' key={post._id} >
                             {/* <h6 onClick={()=> <Link to={"/post/" + pId} style={{ width: '20px', cursor: 'pointer' }} /> {post._id}  </h6> */}
                    <h5 style={{ padding: "1px", display: 'inline', marginLeft: '1px' }}>
                                   <img className='image-icon' style={{ width: "25px", height: "25px", borderRadius: "35px", marginRight: "10px", marginTop: '2px' }} src={post.author ? post.author.profilePicUrl : "Loading"} />
                                   <span className='fullname1' style={{ textDecoration: 'none', fontSize: '20px', marginTop: '0px' }}>
                                       <Link to={ post.author._id !== state._id ? "/profile/" + (post.author._id) : "/profile" } style={{ textDecoration: 'none' }}>
                                           {post.author.fullName}  </Link></span>
            
                                   {post.author._id == state._id && <i onClick={() => deletePost(post._id)} className="material-icons" style={{ color: "darkred", float: "right", cursor: "pointer", width: "35px" }}> delete_forever </i>}
                               </h5><div className='card-image'>
                                       <img className='post-image' style={{ cursor: "pointer" }} onDoubleClick={() => post.likes.includes(state._id) ? likeunlike(post._id, 'https://instabackend22.herokuapp.com/unlike') : likeunlike(post._id, 'https://instabackend22.herokuapp.com/like')} src={post.image} alt='alt' />
                                   </div>
                                   <div className='card-content'>
                                      
                                        <div className='save'>
                                        <div className='slc'> 
                                           <div className='likes'>

                                               {/* {
        post.likes.includes(state._id)  ?  <i onClick={()=> likeunlike(post._id,'https://instabackend22.herokuapp.com/unlike')} className="material-icons" style={{color: "green",marginRight: "1px" , cursor: "pointer" , width: "15px"}} ><Favorite/></i>
        : <i onClick={()=> likeunlike(post._id,'https://instabackend22.herokuapp.com/like')}className="material-icons" style={{color: "black",marginRight: "1px",cursor:"pointer"}} ><FavoriteBorder /></i>
    } */}
                                               {post.likes.includes(state._id) ? <i onClick={() => likeunlike(post._id, 'https://instabackend22.herokuapp.com/unlike')} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: "15px", fontSize: '25px' }}><FaHeart /></i>
                                                   : <i onClick={() => likeunlike(post._id, 'https://instabackend22.herokuapp.com/like')} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: '15px', fontSize: '25px' }}><FaRegHeart /></i>}

                                               {/* <h6 style={{ marginTop: '0px' }}> {post.likes.length > 0 ? post.likes.length : "0"}  likes </h6> */}
                                           </div>
                                           <div className="cmtbtn">
                            <i style={{ marginRight: "10px", cursor: "pointer", width: '15px', fontSize: '25px' }}>  <Link to={ post._id ? "/c/"+post._id : ''} style={{ textDecoration: 'none',color: "royalblue", cursor: "pointer",fontSize: '25px' }}>
                              <FaRegComment  style={{color:'darkblue'}}/> </Link>  </i>
                            </div>
                            <div className="share">
                             
                                <i style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: '15px', fontSize: '25px' }}>  <IoPaperPlane onClick={() => {share(post._id,post.title)}}/> </i>

                            </div>
                                           </div>

                                           <div>
                                               {state.savedPost ? state.savedPost.includes(post._id) ? <i onClick={() => unsave(post._id)} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: "13px", fontSize: '25px' }}> <BsBookmarkHeartFill /></i>
                                                   : <i onClick={() => save(post._id)} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: '13px', fontSize: '25px' }}><BsBookmarkHeart /></i> : ''}
                                           </div>
                                          

                                       </div>
                        

                                       <h5 style={{ marginTop: '-5px' }} className='post-title'> {post.title} </h5>
                                       <p className='post-body-text'> {post.body} </p>

                
                                       <h6 style={{ color: "gray", cursor: "pointer", fontSize: '10px', float: 'right', margin: "-10px" }} className=''>  <Moment fromNow> 
                                            {post.createdAt}   
                                             </Moment>   </h6>
                                   </div>
                            
           </div> 
           
           
           :  post.author.isPrivate ? post.author.following.includes(state._id) ? 
           
           <div className='card1 home-card' key={post._id} >
           {/* <h6 onClick={()=> <Link to={"/post/" + pId} style={{ width: '20px', cursor: 'pointer' }} /> {post._id}  </h6> */}
  <h5 style={{ padding: "1px", display: 'inline', marginLeft: '1px' }}>
                 <img className='image-icon' style={{ width: "25px", height: "25px", borderRadius: "35px", marginRight: "10px", marginTop: '2px' }} src={post.author ? post.author.profilePicUrl : "Loading"} />
                 <span className='fullname1' style={{ textDecoration: 'none', fontSize: '20px', marginTop: '0px' }}>
                     <Link to={ post.author._id !== state._id ? "/profile/" + (post.author._id) : "/profile" } style={{ textDecoration: 'none' }}>
                         {post.author.fullName}  </Link></span>

                 {post.author._id == state._id && <i onClick={() => deletePost(post._id)} className="material-icons" style={{ color: "gray", float: "right", cursor: "pointer", width: "35px" }}> delete_forever </i>}
             </h5><div className='card-image'>
                     <img className='post-image' style={{ cursor: "pointer" }} onDoubleClick={() => post.likes.includes(state._id) ? likeunlike(post._id, 'https://instabackend22.herokuapp.com/unlike') : likeunlike(post._id, 'https://instabackend22.herokuapp.com/like')} src={post.image} alt='alt' />
                 </div>
                 <div className='card-content'>
                    
                      <div className='save'>
                      <div className='slc'> 
                         <div className='likes'>

                             {/* {
post.likes.includes(state._id)  ?  <i onClick={()=> likeunlike(post._id,'https://instabackend22.herokuapp.com/unlike')} className="material-icons" style={{color: "green",marginRight: "1px" , cursor: "pointer" , width: "15px"}} ><Favorite/></i>
: <i onClick={()=> likeunlike(post._id,'https://instabackend22.herokuapp.com/like')}className="material-icons" style={{color: "black",marginRight: "1px",cursor:"pointer"}} ><FavoriteBorder /></i>
} */}
                             {post.likes.includes(state._id) ? <i onClick={() => likeunlike(post._id, 'https://instabackend22.herokuapp.com/unlike')} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: "15px", fontSize: '25px' }}><FaHeart /></i>
                                 : <i onClick={() => likeunlike(post._id, 'https://instabackend22.herokuapp.com/like')} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: '15px', fontSize: '25px' }}><FaRegHeart /></i>}

                             {/* <h6 style={{ marginTop: '0px' }}> {post.likes.length > 0 ? post.likes.length : "0"}  likes </h6> */}
                         </div>
                         <div className="cmtbtn">
                            <i style={{ marginRight: "10px", cursor: "pointer", width: '15px', fontSize: '25px' }}>  <Link to={ post._id ? "/c/"+post._id : ''} style={{ textDecoration: 'none',color: "darkblue", cursor: "pointer",fontSize: '25px' }}>
                              <FaRegComment  style={{color:'darkblue'}}/> </Link>  </i>
                            </div>
                            <div className="share">
                             
                                <i style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: '15px', fontSize: '25px' }}>  <IoPaperPlane onClick={() => {share(post._id,post.title)}}/> </i>

                            </div>
                         </div>

                         <div>
                             {state.savedPost ? state.savedPost.includes(post._id) ? <i onClick={() => unsave(post._id)} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: "13px", fontSize: '25px' }}> <BsBookmarkHeartFill /></i>
                                 : <i onClick={() => save(post._id)} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: '13px', fontSize: '25px' }}><BsBookmarkHeart /></i> : ''}
                         </div>
                        

                     </div>
                   
                     <h5 style={{ marginTop: '-5px' }} className='post-title'> {post.title} </h5>
                     <p className='post-body-text'> {post.body} </p>

                     
                     <h6 style={{ color: "gray", cursor: "pointer", fontSize: '10px', float: 'right', margin: "-10px" }} className=''>  <Moment fromNow> 
                                            {post.createdAt}   
                                             </Moment>   </h6>
                 </div>
          
</div>  : 

 <div style={{marginTop:'100px',padding:'1px'}} className='center'> 
 <h6 style={{fontWeight:'900',fontSize:'25px'}}> 
 The Post Account holder is private account, you must need to follow the user to see the post  
 </h6> 
  { <Link to={`/profile/${post.author._id}`}> click here see the profile </Link>  }
  </div>

:  <div className='card1 home-card' key={post._id} >
                             {/* <h6 onClick={()=> <Link to={"/post/" + pId} style={{ width: '20px', cursor: 'pointer' }} /> {post._id}  </h6> */}
                    <h5 style={{ padding: "1px", display: 'inline', marginLeft: '1px' }}>
                                   <img className='image-icon' style={{ width: "25px", height: "25px", borderRadius: "35px", marginRight: "10px", marginTop: '2px' }} src={post.author ? post.author.profilePicUrl : "Loading"} />
                                   <span className='fullname1' style={{ textDecoration: 'none', fontSize: '20px', marginTop: '0px' }}>
                                       <Link to={ post.author._id !== state._id ? "/profile/" + (post.author._id) : "/profile" } style={{ textDecoration: 'none' }}>
                                           {post.author.fullName}  </Link></span>
            
                                   {post.author._id == state._id && <i onClick={() => deletePost(post._id)} className="material-icons" style={{ color: "gray", float: "right", cursor: "pointer", width: "35px" }}> delete_forever </i>}
                               </h5><div className='card-image'>
                                       <img className='post-image' style={{ cursor: "pointer" }} onDoubleClick={() => post.likes.includes(state._id) ? likeunlike(post._id, 'https://instabackend22.herokuapp.com/unlike') : likeunlike(post._id, 'https://instabackend22.herokuapp.com/like')} src={post.image} alt='alt' />
                                   </div>
                                   <div className='card-content'>
                                      
                                        <div className='save'>
                                        <div className='slc'> 
                                           <div className='likes'>

                                               {/* {
        post.likes.includes(state._id)  ?  <i onClick={()=> likeunlike(post._id,'https://instabackend22.herokuapp.com/unlike')} className="material-icons" style={{color: "green",marginRight: "1px" , cursor: "pointer" , width: "15px"}} ><Favorite/></i>
        : <i onClick={()=> likeunlike(post._id,'https://instabackend22.herokuapp.com/like')}className="material-icons" style={{color: "black",marginRight: "1px",cursor:"pointer"}} ><FavoriteBorder /></i>
    } */}
                                               {post.likes.includes(state._id) ? <i onClick={() => likeunlike(post._id, 'https://instabackend22.herokuapp.com/unlike')} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: "15px", fontSize: '25px' }}><FaHeart /></i>
                                                   : <i onClick={() => likeunlike(post._id, 'https://instabackend22.herokuapp.com/like')} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: '15px', fontSize: '25px' }}><FaRegHeart /></i>}

                                               {/* <h6 style={{ marginTop: '0px' }}> {post.likes.length > 0 ? post.likes.length : "0"}  likes </h6> */}
                                           </div>
                                           <div className="cmtbtn">
                            <i style={{ marginRight: "10px", cursor: "pointer", width: '15px', fontSize: '25px' }}>  <Link to={ post._id ? "/c/"+post._id : ''} style={{ textDecoration: 'none',color: "darklblue", cursor: "pointer",fontSize: '25px' }}>
                              <FaRegComment  style={{color:'darkblue'}}/> </Link>  </i>
                            </div>
                            <div className="share">
                             
                                <i style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: '15px', fontSize: '25px' }}>  <IoPaperPlane onClick={() => {share(post._id,post.title)}}/> </i>

                            </div>
                                           </div>

                                           <div>
                                               {state.savedPost ? state.savedPost.includes(post._id) ? <i onClick={() => unsave(post._id)} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: "13px", fontSize: '25px' }}> <BsBookmarkHeartFill /></i>
                                                   : <i onClick={() => save(post._id)} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: '13px', fontSize: '25px' }}><BsBookmarkHeart /></i> : ''}
                                           </div>
                                          

                                       </div>
                                       

                                       <h5 style={{ marginTop: '-5px' }} className='post-title'> {post.title} </h5>
                                       <p className='post-body-text'> {post.body} </p>

                                       
                                       <h6 style={{ color: "gray", cursor: "pointer", fontSize: '10px', float: 'right', margin: "-10px" }} className=''>  <Moment fromNow> 
                                            {post.createdAt}   
                                             </Moment>   </h6>
                                   </div>
                            
           </div> : 
           
           <div style={{margin:'100px',padding:'1px'}} className='center'> <h6 style={{fontWeight:'900',fontSize:'25px'}}> Loading <AiOutlineLoading3Quarters/>   </h6> </div>  : <div style={{margin:'100px',padding:'10px'}} className='center'> <h6 style={{fontWeight:'900',fontSize:'25px'}}> Post you are looking that no longer available <CgSmileSad/> </h6> </div>
          } 
            </div>
           
           )
}

export default Post