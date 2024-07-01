import { Outlet, useNavigate } from "react-router-dom";
import wrapAsync from '../helpers/wrapAsync';
import axios from 'axios'
import {useEffect} from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout, setUser , setOnlineUser , setSocketConnection } from "../redux/userSlice";
import Panel from "../components/Panel";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo-bg.png"
import io from "socket.io-client"

function HomePage() {

  const user = useSelector(state=> state.user)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('user',user);


  const fetchUserDetails = async()=>{
    try {
        const URL = "/api/userDetails"
        const response = await axios({
          url : URL,
          withCredentials:true
        })

        dispatch(setUser(response.data.data));

        if(response.data.data.logout)
          {
            dispatch(logout());
            navigate("/email");
          }

    } catch (error) {
        console.log("error",error)
    }
  }

    useEffect(()=>{
      fetchUserDetails()
    },[])

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        return;
      }
  
      const backendUrl = process.env.BACKEND_URL;
      if (!backendUrl) {
        console.error('Backend URL not set in environment variables');
        return;
      }
  
      const socketConnection = io(backendUrl, {
        auth: {
          token: token,
        },
      });
  
      socketConnection.on('connect', () => {
        console.log('Socket connected:', socketConnection.id);
      });
  
      socketConnection.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
      });
  
      socketConnection.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      socketConnection.on('onlineUser',(data)=>{
        console.log(data);
        dispatch(setOnlineUser(data))
      })

      dispatch(setSocketConnection(socketConnection))
  
      return () => {
        socketConnection.disconnect();
        console.log('Socket connection disconnected');
      };
    }, []);



    const path = location.pathname === '/'

    return (
      <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
          <section className={ `bg-white ${!path && "hidden" } lg:block`}>
            <Panel/>
          </section>

          <section className={`${path && "hidden"}`}>
            <Outlet/>
          </section>

          <div className={`justify-center items-center  flex-col gap-2 hidden ${!path ? "hidden" : "lg:flex"}`}> 
              <div>
                <img src={logo} alt="logo" width={250} />
              </div>
              <p  className="text-lg text-slate-800 mt-2">Select user to send message</p>
          </div>

      </div>
    );
  }
  
  export default HomePage;