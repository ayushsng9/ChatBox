import Avatar  from "./Avatar"
import { useEffect, useState, memo, useRef } from "react"
import Button from '@mui/material/Button'
import upload from "../helpers/upload"
import axios from "axios"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { setUser } from "../redux/userSlice"

const EditUserDetails = ({onClose,user}) =>{
    const [data,setData] = useState({
        name:user?.user,
        image:user?.image
    })

    const openPhotoRef = useRef();
    const dispatch = useDispatch();

    const handleOnChange = (e)=>{
        const {name,value} = e.target
        
        setData((prev)=>{
            return{
                ...prev,
                [name]:value
            }
        })
    }

    useEffect(()=>{
        setData((prev)=>{
            return{
                ...prev,
                ...user
            }
        })
    },[user])

    

    const handleOpenPhoto = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        openPhotoRef.current.click()
    }

    const handlePhoto = async(e)=>{
        const file = e.target.files[0];
        const photo = await upload(file);
        setData((prev)=>{
          return{
            ...prev,
            image : photo?.url
          }
        })
      }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        e.stopPropagation();
        try{
            const URL = '/api/update'
            const response = await axios({
                method:"post",
                url:URL,
                data:data,
                withCredentials:true
            })
            toast.success(response.data.message,{
                position: "top-center"
              })

            if(response.data.success)
                {
                    dispatch(setUser(response?.data?.data))
                    onClose();
                }

        }catch(err)
        {
            toast.error(err?.response?.data.message,{
                position: "top-center"
              })
        }
    }
    



    return(

    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
        <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
            <h2 className="font-semibold">Profile</h2>
            <p className="text-sm">Edit details</p>

        <form action="" className="grid-gap-4 mt-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <label htmlFor="name">Name:
                    <input type="text" name="name" id="name" value={data.name} onChange={handleOnChange}
                    className="w-full py-1 px-2 focus:outline-black border-0.5 bg-slate-200 my-1 rounded"  />
                </label>
            </div>
            
            <div className="mt-3">
                <div>Photo:</div>
                <div className="my-1 flex items-center gap-4">
                <Avatar width={40} height={40} image={data?.image} name={data?.name}/>
                <button className="font-semibold" onClick={handleOpenPhoto}>Change Photo</button>
                <label htmlFor="image">
                <input type="file"
                id="image"
                className="hidden"
                onChange={handlePhoto}
                ref={openPhotoRef}/>
                </label>
                </div>
            </div>

            

            <div className="flex justify-center mt-3 gap-3">
            <Button onClick={onClose} size="small" variant="contained" color="error" type="submit">Cancel</Button>
            <Button onClick={handleSubmit} size="small" variant="contained" color="success" type="submit">Save</Button> 
            </div>
        </form>
        </div>
    </div>

    
    );
}

export default memo(EditUserDetails);