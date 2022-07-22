import React,{useState,useEffect,useContext} from 'react';
import './Home.css';
import {UserContext} from '../App';
import { Link ,useNavigate } from 'react-router-dom';
import {IoPaperPlane } from 'react-icons/io5';
import {FaRegHeart,FaHeart,FaRegComment  } from 'react-icons/fa';
import {AiFillEye } from 'react-icons/ai';
import {BsBookmarkHeart,BsBookmarkHeartFill  } from 'react-icons/bs';
import {TailSpin} from  'react-loader-spinner'
import Moment from 'react-moment';

function Home() {

    const [posts,setPosts] = useState([]);
    const [comment,setcomment] = useState('');
    const {state,dispatch} = useContext(UserContext);
    const  navigate = useNavigate();




    useEffect(() => {
        if(posts){
            fetch("https://instabackend22.herokuapp.com/posts",{
                method: "get",
                headers:
                {
                    "Authorization": "Bearer "+ localStorage.getItem("token")
                }
            })
            .then(response => response.json())
            .then(function(data){
                console.log('data.error -->     '+ data.error)
                if(data.error == "User not logged In error2")
                {
                    localStorage.clear();
                     dispatch({type: "LOGOUT"})
                     navigate('/login')   
                     window.location.reload(false);           
                }
                else
                {
                setPosts(data.posts)
                }
            }).catch(error => {
                console.log(error);
                // if(error)
                // {
                //     // localStorage.clear();
                //     // dispatch({type: "LOGOUT"})
                //     // navigate('/login') 
                //     M.toast({html: "you will logout soon due to token expiries" ,classes: "#62229 red darken-2"})                
                // }
            })
        }
    },[]);

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
            const newPostarr = posts.map((oldpost)=>{
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
            const newPostarr = posts.filter((oldpost)=>{
                return (oldpost._id != deletedpost.result._id)
                
            });
            setPosts(newPostarr)
        }).catch(error => {
            console.log(error);
        })
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
    


    return (
        <div className='home-container'>
            {        
            posts.length >0 ?   
               posts.map((post)=>{
                   return( 

              post ? post.author._id.includes(state._id) ?    
            
              <div className='card1 home-card' key={post._id} >
              {/* <h6 onClick={()=> <Link to={"/post/" + pId} style={{ width: '20px', cursor: 'pointer' }} /> {post._id}  </h6> */}
     <h5 style={{ padding: "1px", display: 'inline', marginLeft: '1px' }}>
                    <img className='image-icon' style={{ width: "25px", height: "25px", borderRadius: "35px", marginRight: "10px", marginTop: '2px' }} src={post ? post.author.profilePicUrl : "Loading"} />
                    <span className='fullname1' style={{ textDecoration: 'none', fontSize: '20px', marginTop: '0px' }}>
                        <Link to={post.author._id !== state._id ? "/profile/" + (post.author._id) : "/profile"} style={{ textDecoration: 'none' }}>
                            {post.author.fullName}  </Link> <Link to={ post._id ? "/p/"+post._id : ''} style={{ textDecoration: 'none',marginBottom:'10px' }}>
                            <AiFillEye/> </Link></span>
                           
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
                                {post.likes.includes(state._id) ? <i onClick={() => likeunlike(post._id, 'https://instabackend22.herokuapp.com/unlike')} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: "15px", fontSize: '25px' }}><FaHeart className='heart is-active'/></i>
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

                        {/* {post.comments.length > 0 ? <h6 style={{ fontWeight: "500", marginTop: '-15px' }}> All Comments </h6> : " "}
                        <div id='columnBox'>
                            {post.comments.map((comment) => {
                                return (
                                    <div className='comment'>
                                        <h6 key={post._id}>
                                            <span style={{ marginRight: "10px", fontWeight: "bold" }}> {comment.CommentedBy.fullName} </span>
                                            <span> {comment.CommentText} </span>
                                        </h6>
                                    </div>
                                );
                            })}
                        </div>

                        <form onSubmit={(event) => { submitcomment(event, post._id); } }>
                            <input type="text" placeholder='comments' id='cmt' />
                        </form> */}
                        <h6 style={{ color: "darkblue", cursor: "pointer", fontSize: '10px', float: 'right', margin: "-10px" }} className=''>  <Moment fromNow> 
                                            {post.createdAt}   
                                             </Moment>    </h6>
                    </div>
             
</div> :
           post.author.isPrivate ? post.author.followers.includes(state._id) ?    
           <div className='card1 home-card' key={post._id} >
           {/* <h6 onClick={()=> <Link to={"/post/" + pId} style={{ width: '20px', cursor: 'pointer' }} /> {post._id}  </h6> */}
  <h5 style={{ padding: "1px", display: 'inline', marginLeft: '1px' }}>
                 <img className='image-icon' style={{ width: "25px", height: "25px", borderRadius: "35px", marginRight: "10px", marginTop: '2px' }} src={post ? post.author.profilePicUrl : "Loading"} />
                 <span className='fullname1' style={{ textDecoration: 'none', fontSize: '20px', marginTop: '0px' }}>
                        <Link to={post.author._id !== state._id ? "/profile/" + (post.author._id) : "/profile"} style={{ textDecoration: 'none' }}>
                            {post.author.fullName}  </Link> <Link to={ post._id ? "/p/"+post._id : ''} style={{ textDecoration: 'none',marginBottom:'10px' }}>
                            <AiFillEye/> </Link></span>

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
                          
                             <i style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: '15px', fontSize: '25px' }}>  <IoPaperPlane onClick={() => {share(post._id,post.title)}} /> </i>

                         </div>
                         </div>

                         <div>
                             {state.savedPost ? state.savedPost.includes(post._id) ? <i onClick={() => unsave(post._id)} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: "13px", fontSize: '25px' }}> <BsBookmarkHeartFill /></i>
                                 : <i onClick={() => save(post._id)} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: '13px', fontSize: '25px' }}><BsBookmarkHeart /></i> : ''}
                         </div>
                        

                     </div>
                    

                     <h5 style={{ marginTop: '-5px' }} className='post-title'> {post.title} </h5>
                     <p className='post-body-text'> {post.body} </p>

                     {/* {post.comments.length > 0 ? <h6 style={{ fontWeight: "500", marginTop: '-15px' }}> All Comments </h6> : " "}
                     <div id='columnBox'>
                         {post.comments.map((comment) => {
                             return (
                                 <div className='comment'>
                                     <h6 key={post._id}>
                                         <span style={{ marginRight: "10px", fontWeight: "bold" }}> {comment.CommentedBy.fullName} </span>
                                         <span> {comment.CommentText} </span>
                                     </h6>
                                 </div>
                             );
                         })}
                     </div>

                     <form onSubmit={(event) => { submitcomment(event, post._id); } }>
                         <input type="text" placeholder='comments' id='cmt' />
                     </form> */}
                     <h6 style={{ color: "darkblue", cursor: "pointer", fontSize: '10px', float: 'right', margin: "-10px" }} className=''>  <Moment fromNow> 
                                            {post.createdAt}   
                                             </Moment>   </h6>
                 </div>
          
</div> : '' :   <div className='card1 home-card' key={post._id} >
                             {/* <h6 onClick={()=> <Link to={"/post/" + pId} style={{ width: '20px', cursor: 'pointer' }} /> {post._id}  </h6> */}
                    <h5 style={{ padding: "1px", display: 'inline', marginLeft: '1px' }}>
                                   <img className='image-icon' style={{ width: "25px", height: "25px", borderRadius: "35px", marginRight: "10px", marginTop: '2px' }} src={post ? post.author.profilePicUrl : "Loading"} />
                                   <span className='fullname1' style={{ textDecoration: 'none', fontSize: '20px', marginTop: '0px' }}>
                        <Link to={post.author._id !== state._id ? "/profile/" + (post.author._id) : "/profile"} style={{ textDecoration: 'none' }}>
                            {post.author.fullName}  </Link> <Link to={ post._id ? "/p/"+post._id : ''} style={{ textDecoration: 'none',marginBottom:'10px' }}>
                            <AiFillEye/> </Link></span>
                                   {post.author._id == state._id && <i onClick={() => deletePost(post._id)} className="material-icons" style={{ color: "red", float: "right", cursor: "pointer", width: "35px" }}> delete_forever </i>}
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
                                            
                                               <i style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: '15px', fontSize: '25px' }}>  <IoPaperPlane  onClick={() => {share(post._id,post.title)}}/> </i>

                                           </div>
                                           </div>

                                           <div>
                                               {state.savedPost ? state.savedPost.includes(post._id) ? <i onClick={() => unsave(post._id)} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: "13px", fontSize: '25px' }}> <BsBookmarkHeartFill /></i>
                                                   : <i onClick={() => save(post._id)} style={{ color: "darkblue", marginRight: "10px", cursor: "pointer", width: '13px', fontSize: '25px' }}><BsBookmarkHeart /></i> : ''}
                                           </div>
                                          

                                       </div>
                                       

                                       <h5 style={{ marginTop: '-5px' }} className='post-title'> {post.title} </h5>
                                       <p className='post-body-text'> {post.body} </p>
{/* 
                                       {post.comments.length > 0 ? <h6 style={{ fontWeight: "500", marginTop: '-15px' }}> All Comments </h6> : " "}
                                       <div id='columnBox'>
                                           {post.comments.map((comment) => {
                                               return (
                                                   <div className='comment'>
                                                       <h6 key={post._id}>
                                                           <span style={{ marginRight: "10px", fontWeight: "bold" }}> {comment.CommentedBy.fullName} </span>
                                                           <span> {comment.CommentText} </span>
                                                       </h6>
                                                   </div>
                                               );
                                           })}
                                       </div>

                                       <form onSubmit={(event) => { submitcomment(event, post._id); } }>
                                           <input type="text" placeholder='comments' id='cmt' />
                                       </form> */}
                                       <h6 style={{ color: "darkblue", cursor: "pointer", fontSize: '10px', float: 'right', margin: "-10px" }} className=''>  <Moment fromNow> 
                                            {post.createdAt}   
                                             </Moment>   </h6>
                                   </div>
                            
           </div>   : ''
                
             ) 
            }) : 
             <div id='center' style={{marginTop:'10px'}}>
            { <TailSpin 
   heigth="200"
   width="200"
   color='royalblue'
   ariaLabel='loading'
   value="uploading !"
  /> } 
            </div> 
            }
            </div>
               
    )
}

export default Home