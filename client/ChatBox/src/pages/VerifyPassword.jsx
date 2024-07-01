import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import upload from "../helpers/upload";
import axios from 'axios';
import {toast} from 'react-toastify';
import  Avatar from "../components/Avatar"
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice";


function VerifyPassword() {
    const [data,setData] = useState({
        password:"",
        userId:""
      })
    
      const navigate = useNavigate(); 
      const location = useLocation();
      const dispatch = useDispatch();

      useEffect(()=>{
        if(!location.state)
          {
            toast.info("Enter email first",{
              position: "top-center"
              });
            navigate('/email');
          }
      },[])
    
      const handleOnChange = (e)=>{
        const changedField = e.target.name;
        const newValue = e.target.value;
        setData((previous)=>{
          return{...previous,[changedField]:newValue
          } 
        });
      }
    
      const handleSubmit = async(e)=>{
        e.preventDefault();
        e.stopPropagation();
    
        const URL = '/api/password'
    
        try{
          const response = await axios({
            method:'post',
            url:URL,
            data:{
            userId: location?.state?.data?._id,
            password: data.password
            },
            withCredentials:true
          })
          console.log("response",response);
          toast.success(response.data.message,{
          position: "top-center"
          })
    
          if(response.data.success){
            dispatch(setToken(response?.data?.token))
            localStorage.setItem('token',response?.data?.token)
            setData({
              password:"",
            })
          }
    
          navigate('/');
    
    
        }catch(error){
          console.log(error);
          toast.error(error?.response?.data?.message,{
            position: "top-center"
          });
        }
    
      }

      
        return (
          <div className="mt-5">
              <div className="bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto">
                <div className="w-fit m-auto mb-2 text-2xl flex flex-col justify-center items-center">
                 <Avatar width={100} height={100} name={location?.state?.data.name} image={location?.state?.data.image}/>
                 <h2 className="font-semibold text-lg mt-2">{location?.state?.data.name}</h2>
                </div>
                <form action="" className="grid gap-3 mt-2" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Enter your Password" className="bg-slate-200 px-2 py-1 focus:outline-offset-1" onChange={handleOnChange} value={data.password}
                     required
                    />
                  </div>
                  <div className="flex justify-center">
                <Button className="w-full" variant="contained" color="success" type="submit">Login</Button> 
                </div>
                </form>
                <p className="mt-3 flex justify-center"><Link to={"/forgotPassword"} className="hover:underline hover:text-green-800">Forgot Password?</Link> </p>
              </div>
          </div>
    );
  }
  
  export default VerifyPassword;