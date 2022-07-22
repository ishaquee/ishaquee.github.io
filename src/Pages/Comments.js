import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom';
import {FaRegSmileWink} from 'react-icons/fa'
import {TiDelete} from 'react-icons/ti'
import {FiClock} from 'react-icons/fi'
import {UserContext} from '../App'
import Moment from 'react-moment';


function Comments() {
const [posts,setPosts] = useState([]);
const { postId } = useParams();
const {state} = useContext(UserContext);



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
        setPosts(updatedpost)
    }).catch(error => {
        console.log(error);
    })
 
}

const deletecomment = (commentId) => {
    fetch('https://instabackend22.herokuapp.com/cdelete',{
        method: "put",
        headers:
        {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+ localStorage.getItem("token")
        },
        body:
       JSON.stringify({commentId: commentId , postId : postId})
        
    })
    .then(response => response.json())
    .then(function(updatedpost){
        setPosts(updatedpost)
    }).catch(error => {
        console.log(error);
    })
 
}
    




useEffect(() => {
    fetch(`https://instabackend22.herokuapp.com/c/${postId}`,{
        method: "get",
        headers:
        {    "Content-Type": "application/json",
            "Authorization": "Bearer "+ localStorage.getItem("token")
        }
    })
    .then(response => response.json())
    .then(function(data){
        setPosts(data[0])
        console.log(data)
    }).catch(error => {
        console.log(error);
        // if(error)
        //         {
        //             localStorage.clear();
        //             dispatch({type: "LOGOUT"})
        //             navigate('/login') 
        //             M.toast({html: "you will logout soon due to token expiries" ,classes: "#62229 red darken-2"})                
        //         }
    })
},[]);


  return (
    
    <div style={{marginTop:'50px'}} className='center'>   
        { 
   posts ?  posts.comments ? <h3 style={{ fontWeight: "500"}}> All Comments </h3> : ""   : ''}
                        <div id='columnBox'>
                            {posts ? posts.comments ? posts.comments.length > 0 ? posts.comments.map((comment) => {
                                return (
                                    <div className='comment center card2'>
                                                                                {comment.CommentedBy._id === state._id ?  <TiDelete onClick={()=> deletecomment(comment._id)} style={{cursor:'pointer',fontSize:'20px',float:'right'}}/>  : '' } 

                                        <h6 key={comment._id}>

                                            <span style={{fontWeight: "bold" }}> {comment.CommentedBy.fullName} </span>
                                            <div className='pp12'> {comment.CommentText} </div>                                      
                                        </h6>
                                        <p style={{fontSize:'12px',display:'flex',alignContent:'flex-start'}}> 
              <FiClock style={{paddingLeft:'1px',marginTop:'3px'}}/> <span style={{fontWeight:'900',marginLeft:'10px',color:'gray'}}> <Moment fromNow>
                                                  { comment.time}    
                                                   </Moment> 
                                              </span>  </p> 
                                    </div>
                                    
                                );
                            } 
                            ) : <span> <h6 style={{fontWeight:'900',fontSize:'25px',color:'royalblue'}}> So for no comments , be a fitst <FaRegSmileWink/> </h6> </span> : 'Loading please wait'   : ''} 
                        </div>

                        <div className='cmtip' >
                        <form onSubmit={(event) => { submitcomment(event, posts._id)}} className=''>
                            <input type="text" placeholder='Write Your thoughts here ....'  maxLength={50} id='cmt' style={{width:'300px',position:'sticky'}}/>
                        </form> 
</div>

                       

                        </div>
  )


}


export default Comments