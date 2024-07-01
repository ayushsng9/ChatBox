import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { PiUserCircle } from "react-icons/pi";
import Button from '@mui/material/Button';
import { Link,useNavigate } from 'react-router-dom';
import upload from "../helpers/upload";
import axios from 'axios';
import {toast} from 'react-toastify';


function VerifyEmail() {
    const [data,setData] = useState({
        email:"",
      })
    
      const navigate = useNavigate(); 
    
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
    
        const URL = `${process.env.BACKEND_URL}/email`
    
        try{
          const res = await axios.post(URL,data)
          toast.success(res.data.message,{
          position: "top-center"
          });
    
          if(res.data.success){
            setData({
              email:"",
            })
          }
    
          navigate('/password',{
            state:res.data
          });
    
    
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
              <div className='w-fit mx-auto mb-2'>
                <PiUserCircle size={100}/>
              </div>
                <h1 className="text-center">Welcome to ChatBox</h1>
                <form action="" className="grid gap-3 mt-2" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="Enter your Email" className="bg-slate-200 px-2 py-1 focus:outline-offset-1" onChange={handleOnChange} value={data.email}
                     required
                    />
                  </div>
                  <div className="flex justify-center">
                <Button className="w-full" variant="contained" color="success" type="submit">Let's Go</Button> 
                </div>
                </form>
    
                <p className="mt-3">Don't have an account?  <Link to={"/register"} className="hover:underline hover:text-green-800">Sign-Up</Link> </p>
    
              </div>
          </div>
    );
  }
  
  export default VerifyEmail;