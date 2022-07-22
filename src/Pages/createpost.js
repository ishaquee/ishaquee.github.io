import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import './create-post.css'
import M from 'materialize-css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {Watch } from  'react-loader-spinner'


function Createpost() {
    const navigate = useNavigate()
    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const [image,setImage] = useState("") 
    const [loader,setLoader] = useState(false);
    const [show,setshow] = useState("show")
    
    useEffect(() => {    
        if (image) {//only call when the value of image exist
            //call to create post app
            fetch("https://instabackend22.herokuapp.com/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    title,
                    body,
                    image: image
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        setLoader(false)
                        M.toast({ html: "one or more fiels are empty", classes: "#c62828 red darken-3" });
                    }
                    else {
                        setshow("show")
                        setLoader(false)
                        M.toast({ html: "Post created successfully!", classes: "#388e3c green darken-2 center" });
                        navigate('/home');
                    }
                }).catch(error => {
                    console.log(error);
                })
        }
    }, [image]);


    const submitPost = () => {
        if(image){
        setLoader(true)
        setshow("hide")           
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "instaclone-app");
        formData.append("cloud_name", "instaclone2022");
        fetch("https://api.cloudinary.com/v1_1/instaclone2022/image/upload", {
            method: "post",
            body: formData
        }).then(response => response.json())
            .then(data => {
                setImage(data.url);
         })
            .catch(error => console.log(error));
        }
        else{
            M.toast({ html: "Image Missing....", classes: "#388e3c yellow darken-2 toast center" });
        }
    }
    
    return (
        <div className='card create-post'>
         <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            type="text" placeholder='Post Title' className='new-font'/>
            <input 
            value={body}
            onChange={(event)=> setBody(event.target.value)}
            type="text" placeholder='Content' className='new-font'/>
            
        <div className="file-field input-field" style={{display:'flex',alignContent:'center',alignItems:'center',justifyItems:'center',justifyContent:'center'}}>
      
        <li style={{margin:'10px',display:'flex',flexWrap:'wrap',width:'130px',borderRadius:'10px'}} class="btn1 profile-edit-btn btn waves-effect waves-light #0d47a1 blue darken-4"> <span style={{color:"white",fontSize:'14px',marginLeft:'-14px',fontWeight:'700'}}>  upload pic </span>
                 <input type="file"  onChange={(e)=>setImage(e.target.files[0])} accept="image/png, image/gif, image/jpeg" /></li>   
                 
             <button onClick={()=> submitPost()} className={'btn waves-effect waves-loght btn-medium #64b5f6 darken-4 cusbtn'} type='submit' style={{fontSize:'15px',fontWeight:'bolder',width:'140px'}}>Create Post</button>
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

export default Createpost
