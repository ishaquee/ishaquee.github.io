import React, { createContext , useContext, useEffect, useReducer} from "react";
import { BrowserRouter, Route, Routes , useNavigate} from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Profile from './Pages/Profile';
import CreatePost from "./Pages/createpost";
import { reducer , initialState} from './reducers/userReducers'
import OtherUserProfile from "./Pages/OtherUserProfile";
import Post from "./Pages/Post";
import Postsfromfollowing from "./Pages/Postsfromfollowing";
import Footer from "./components/footer";
import Reset from "./Pages/Reset";
import Newpassword from "./Pages/Newpassword";
import SearchUser from "./Pages/SearchUser";
import {  useLocation } from 'react-router-dom';
import Settings from "./Pages/Settings";
import Notifications from "./Pages/Notifications";
import Updatepass from "./Pages/Updatepass";
import Comments from "./Pages/Comments";

export const UserContext = createContext();


const CustomRouting = () =>{
  const navicate = useNavigate();
  const location = useLocation();

  const {state,dispatch} = useContext(UserContext);
  useEffect(()=> {
    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    if(userinfo)
    {
      if(!location.pathname.startsWith('/p/') || !location.pathname.startsWith('/profile/'))
      {
      dispatch({type: "USER" , payload : userinfo})
      }
      else{
        dispatch({type: "USER" , payload : userinfo})
        navicate('/home')

      }
    }
    else{
      if(!location.pathname.startsWith('/reset'))
        navicate('/login')
    }

  },[]);
  return (
      <Routes>
        <Route   path="/home" exact strict element={<Home />} />
        <Route  exact strict path="/login"  element={<Login />} />
        <Route  exact strict path="/signup"  element={<Signup />} />
        <Route exact strict path="/profile"  element={<Profile />} />
        <Route exact strict path="/profile/:userId"  element={<OtherUserProfile />} />
        <Route  exact strict path="/p/:pId"  element={<Post />} />
        <Route exact strict path="/c/:postId"  element={<Comments />} />
        <Route exact strict path="/Postsfromfollowing"  element={ <Postsfromfollowing/> } />
        <Route exact strict path="/create-post"  element={<CreatePost />} />
        <Route exact strict path="/reset-password"  element={<Reset />} />
        <Route exact strict path="/reset/:token"  element={<Newpassword />} />
        <Route exact strict path="/setting"  element={<Settings />} />
        <Route  exact strict path="/Search"  element={<SearchUser />} />
        <Route  exact strict path="/Notifications"  element={<Notifications />} />
        <Route exact strict path="/Updatepass"  element={<Updatepass />} />



        {/* catch-all 404 page */}
         {/* <Route path="*" element={<Page404 />} />  */}
      </Routes>
  )
}

function App() {

  const [state,dispatch] = useReducer(reducer,initialState);
  return (
    
    <UserContext.Provider value={{state : state , dispatch : dispatch}}>
      <BrowserRouter>
      <Navbar/>
      <CustomRouting/> 
      { state ? <Footer/> : "" }
    </BrowserRouter>
    </UserContext.Provider>
   
  );
}

export default App;
