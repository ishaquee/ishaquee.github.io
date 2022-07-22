import React, {useContext,useRef,useEffect,useState} from 'react'
import { Link ,useNavigate } from 'react-router-dom';
import './navbar.css'
import {UserContext} from '../App'
import {RiHomeHeartFill,RiHomeHeartLine,RiUserFollowLine,RiUserFollowFill,RiUserSmileFill,RiUserSmileLine} from 'react-icons/ri';
import {AiOutlineSearch} from 'react-icons/ai';
import {IoAddCircleSharp,IoAddCircleOutline} from 'react-icons/io5';
import {BiSearch} from 'react-icons/bi'
import M from 'materialize-css'

const Footer = () =>  {
  const  searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
  const {state,dispatch} = useContext(UserContext);
  const  navigate = useNavigate();
  const [currentLink, setCurrentLink] = useState('/');
  const [currentIcon, setCurrentIcon] = useState('');
  useEffect(()=>{
    M.Modal.init(searchModal.current)
},[])

  const navList = () => {
    if(state)
    {
      return[
        <li key="222"><Link to="/home" onClick={() => setCurrentLink('/home')}>  {currentLink.includes('/home')  ?  <RiHomeHeartFill style={{
          marginTop:'15px',
          fontSize:'30px',
          borderBottom:'3px solid black'
         }}/>  :     <RiHomeHeartLine style={{
          marginTop:'15px',
          fontSize:'30px',
         }}/>     } </Link></li>,

         <li key="2292"><Link to="/search" onClick={() => setCurrentLink('/search')}>  { currentLink.includes('/search') ?   <BiSearch style={{
          marginTop:'15px',
          fontSize:'30px',
          borderBottom:'3px solid black'
         }}/> : <AiOutlineSearch style={{
          marginTop:'15px',
          fontSize:'30px',
         }}/>  }      </Link></li>,
         <li key="11111" > <Link to='/create-post' onClick={() => setCurrentLink('/create-post')}> {currentLink.includes('/create-post')  ?      <IoAddCircleSharp 
         style={{
          marginTop:'15px',
          fontSize:'30px',
          borderBottom:'3px solid black'
         }} />  :   <IoAddCircleOutline 
         style={{
          marginTop:'15px',
          fontSize:'30px',
         }} /> }      </Link> </li>,

        <li key="2212"><Link to="/Postsfromfollowing" onClick={() => setCurrentLink('/Postsfromfollowing')}>   { currentLink.includes('/Postsfromfollowing') ?   <RiUserFollowFill style={{
          marginTop:'15px',
          fontSize:'30px',
          borderBottom:'3px solid black'
         }}/>  : <RiUserFollowLine 
         style={{
          marginTop:'15px',
          fontSize:'30px',
         }} /> }   </Link></li>,
        <li  key="2212122"><Link to="/Profile" onClick={() => setCurrentLink('/Profile')}>    { currentLink.includes('/Profile')  ?  <RiUserSmileFill style={{
          marginTop:'15px',
          fontSize:'30px',
          borderBottom:'3px solid black'
         }}/> : <RiUserSmileLine 
         style={{
          marginTop:'15px',
          fontSize:'30px',
         }} /> }   </Link></li>
        
      ]
    }
  }
  const fetchUsers = (query)=>{
    setSearch(query)
    fetch('https://instabackend22.herokuapp.com/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results=>{
      setUserDetails(results.user)
    })
 }
    return (    
  <nav className='navbar-bottom'>
    <div className="white bottom" >
      <ul id="nav-mobile" className="right">
    {navList()}
      </ul>
      <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />
             <ul className="collection">
               {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li className="collection-item"style={{margin:"1%",alignItems:'flex-start',display:'flex'}}>{item.email}</li></Link> 
               })}
               
              </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
          </div>
          </div>
    </div>
  </nav>
    )
}

export default Footer;
