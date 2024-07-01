import ChatIcon from '@mui/icons-material/Chat';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import { LuArrowUpLeft } from "react-icons/lu";
import { NavLink, useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { useEffect, useState } from 'react';
import Search from './Search';
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import {logout} from "../redux/userSlice"


function Panel(){
    const user = useSelector(state=>state.user)
    const [editUserOpen,setEditUserOpen] = useState(false)
    const [chats,setChats] = useState([]);
    const [openSearch,setOpenSearch] = useState(false);
    const socketConnection = useSelector(state=>state?.user?.socketConnection)
    
    useEffect(()=>{
        if(socketConnection){
            socketConnection.emit('panel',user._id);
            socketConnection.on('conversation',(data)=>{
                console.log('conversation',data);
                const conversationUserData = data.map((conversationUser,index)=>{
                    if(conversationUser?.sender?._id  === conversationUser?.receiver?._id)
                    {
                        return{
                            ...conversationUser,
                            userDetails: conversationUser?.sender
    
                        }
                    }

                    else if(conversationUser?.receiver._id !== user?._id){
                      return{
                        ...conversationUser,
                        userDetails: conversationUser.receiver
                      }  
                    }else{
                        return{
                            ...conversationUser,
                            userDetails: conversationUser.sender
                        }
                    }


                    
                })
                setChats(conversationUserData);
            })
        }
    },[socketConnection,user])

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = ()=>{
        dispatch(logout())
        navigate("/email")
        localStorage.clear()
    }

    return (
        <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
            <div className="bg-slate-300 w-12 h-full py-5 text-black flex flex-col justify-between">
                  
                  <div className='mt-9'>
  
                  <NavLink title='chat' className={({isActive})=>`flex justify-center items-center w-12 h-12 hover:bg-slate-200 ${isActive && "bg-slate-400"} `} >
                      <ChatIcon/>
                  </NavLink>
  
                  <div title='add friend' onClick={()=>setOpenSearch(true)} className='flex justify-center items-center w-12 h-12 hover:bg-slate-400' >
                      <GroupAddIcon/>
                  </div>
  
                  </div>
  
                  <div className='flex flex-col items-center'>
  
                  <button  title={user?.name} className='flex justify-center items-center w-full h-full' onClick={()=>setEditUserOpen(true)}>
                      <Avatar width={40} height={40} name={user?.name} image={user?.image} userId={user?._id}/>
                  </button>
  
                  <button title='logout' className='flex justify-center cursor-pointer items-center w-12 h-12 hover:bg-slate-400' onClick={handleLogout}>
                      <LogoutIcon/>
                  </button>
  
                  </div>
              </div>
  
              <div className='w-full'>
                  <div className='h-16 flex items-center'>
                  <h2 className='text-xl font-bold p-4 tex-slate-800'>Chats</h2>
                  </div> 
                  <div className='bg-slate-200 p-[0.5px] '></div>
  
                  <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto overflow-scroll'>
                      {
                          chats.length === 0 && (
                              <div className='mt-5'>
                                  <div className='flex justify-center items-center my-4 text-slate-500'>
                                  <LuArrowUpLeft size={50}/>
                                  </div>
                                  <p className='text-lg text-center text-slate-500'>
                                      Explore users to start a conversation
                                  </p>
                              </div>
                          )
                      }
  
                      {
                          chats.map((conv,index)=>{
  
                              return(
                                  <NavLink to={"/"+conv?.userDetails?._id} key={conv?._id} className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'>
                                      <div>
                                          <Avatar
                                              image={conv?.userDetails?.image}
                                              name={conv?.userDetails?.name}
                                              width={40}
                                              height={40}
                                          />    
                                      </div>
                                      <div className='flex'>
                                          <div>
                                          <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h3>
                                          <div className='text-slate-500 text-xs flex items-center gap-1'>
                                              <div className='flex items-center gap-1'>
                                                  {
                                                      conv?.lastMsg?.image && (
                                                          <div className='flex items-center gap-1'>
                                                              <span><FaImage/></span>
                                                              {!conv?.lastMsg?.text && <span>Image</span>  } 
                                                          </div>
                                                      )
                                                  }
                                                  {
                                                      conv?.lastMsg?.video && (
                                                          <div className='flex items-center gap-1'>
                                                              <span><FaVideo/></span>
                                                              {!conv?.lastMsg?.text && <span>Video</span>}
                                                          </div>
                                                      )
                                                  }
                                              </div>
                                              <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                                          </div>
                                          </div>
                                         
                                      </div>
                                      {
                                          Boolean(conv?.unseenMsg) && (
                                              <p className='text-xs ml-auto w-6 h-6 flex justify-center items-center p-1 bg-sky-400 text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                                          )
                                      }
  
                                  </NavLink>
                              )
                          })
                      }
                  </div>   
              </div>
  
                  {
                      editUserOpen && (
                          <EditUserDetails onClose={()=>setEditUserOpen(false)} user={user}/>
                      )
                  }
  
                  {
                      openSearch && (
                          <Search onClose={()=>setOpenSearch(false)}/>
                      )
                  }
  
  
                 
            </div>
      );
   
  }
  
  export default Panel;