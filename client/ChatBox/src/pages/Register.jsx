import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { Link,useNavigate } from 'react-router-dom';
import upload from "../helpers/upload";
import axios from 'axios';
import {toast} from 'react-toastify';

function Register() {
  const [data,setData] = useState({
    name: "",
    email:"",
    password:"",
    image:""
  })

  const [photo,setPhoto] = useState("");
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

    const URL = `${process.env.BACKEND_URL}/register`

    try{
      const res = await axios.post(URL,data)
      console.log("response",res);
      toast.success(res.data.message,{
      position: "top-center"
      });

      if(res.data.success){
        setData({
          name:"",
          email:"",
          password:"",
          image:""
        })
      }

      navigate('/email');


    }catch(error){
      console.log(error);
      toast.error(error?.response?.data?.message,{
        position: "top-center"
      });
    }

  }

  const handlePhoto = async(e)=>{
    const file = e.target.files[0];
    const photo = await upload(file);
    console.log('upload',photo);
    setPhoto(file);

    setData((prev)=>{
      return{
        ...prev,
        image : photo?.url
      }
    })
  }

  const handleRemovePhoto = (e)=>{
    setPhoto("");
    e.preventDefault();
    e.stopPropagation();
  }

  
    return (
      <div className="mt-5">
          <div className="bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto">
            <h1 className="text-center">Welcome to ChatBox</h1>
            <form action="" className="grid gap-4 mt-2" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" placeholder="Enter your Name" className="bg-slate-200 px-2 py-1 focus:outline-offset-1" onChange={handleOnChange} value={data.name}
                 required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter your Email" className="bg-slate-200 px-2 py-1 focus:outline-offset-1" onChange={handleOnChange} value={data.email}
                 required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter your Password" className="bg-slate-200 px-2 py-1 focus:outline-offset-1" onChange={handleOnChange} value={data.password}
                 required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="profileImg">Profile Photo:
                <div className="h-10 bg-slate-200 flex justify-center items-center border rounded hover:border-black">
                  <p className="text-sm ">
                      {photo?.name? photo.name : "Upload Profile Photo"}
                  </p>

                  {photo?.name && <button className="text-lg ml-2 hover:text-red-500" onClick={handleRemovePhoto}>
                    <CloseIcon/>
                  </button>}
              
                </div>
                </label>

                <input type="file" id="profileImg" name="profileImg" className="bg-slate-100 px-2 py-1 focus:outline-black hidden"
                 onChange={handlePhoto}
                 />

                <div className="flex justify-center mt-3  ">
                <Button className="w-full" variant="contained" color="success" type="submit">Register</Button> 
                </div>
                  
              </div>
            </form>

            <p className="mt-3">Already have an account?  <Link to={"/email"} className="hover:underline hover:text-green-800">Sign-In</Link> </p>

          </div>
      </div>
    );
  }
  
  export default Register;