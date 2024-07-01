import { useEffect, useState } from "react";
import { VscSearch } from "react-icons/vsc";
import Loading from "./Loading";
import UserSearch from "./UserSearch";
import { toast } from "react-toastify";
import axios from "axios";
import { IoClose } from "react-icons/io5";

function Search({user,onClose}) {

    const [searchUser,setSearchUser] = useState([]);    
    const [searching,setSearching] = useState(false);
    const[find,setFind] = useState("");

    const handleSearch = async()=>{

        const URL = '/api/search'
        try{
            setSearching(true)
            const res = await axios.post(URL,{
                search:find
            })

            setSearching(false)
            setSearchUser(res.data.data);
        }catch(err){
            toast.error(err?.response?.data?.message);
        }
    }

    useEffect(()=>{
        handleSearch();
    },[find])
    
    return(
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 px-2 z-10">
            <div className=" w-full max-w-md mx-auto mt-10">
                <div className="bg-white rounded h-14 overflow-hidden flex items-center">
                    <div className="h-14 w-14 flex justify-center items-center text-slate-500"><VscSearch size={20}/></div>
                    <input  type="text" placeholder="Search or start a new chat " 
                    onChange={(e)=>setFind(e.target.value)}
                    value={find}
                    className="w-full outline-none py-1 h-full px-4 text-slate-700"/>
                </div>

                <div className="bg-white mt-2 w-full p-4 rounded">
                    {
                        searchUser.length === 0 && !searching && (
                            <p className="text-center text-slate-500">No Results</p>
                        )
                    }

                    {
                        searching && (
                            <p><Loading/></p>
                        )
                    }

                    {
                        searchUser.length !==0 && !searching &&(
                            searchUser.map((user,index)=>{
                                return(
                                    <UserSearch key={user._id} user={user} onClose={onClose}/>
                                )
                            })
                        )
                    }

                </div>
            </div>
            <div className="absolute top-0 right-0 text-2-xl p-2 lg:text-4xl hover:text-white" onClick={onClose}>
                <button>
                    <IoClose/>
                </button>
                
            </div>
        </div>
    )
    
  }
  
export default Search;