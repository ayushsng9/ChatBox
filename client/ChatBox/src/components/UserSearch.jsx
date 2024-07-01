import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const UserSearch = ({user,onClose})=>{
    return(
        <Link to={`${user._id}`} onClick={onClose} className="flex items-center gap-3 p-2 lg:p-4  border-transparent hover:bg-slate-200">
            <div>
                <Avatar
                width={50}
                height={50}
                image={user?.image}
                name={user?.name}
                userId={user?._id}/>
            </div>
            

            <div>
            <div className="font-semibold">
                {user?.name}
            </div>

            <p className="text-sm line-clamp-1">{user?.email}</p>
            </div>
            
        </Link>
    );
}

export default UserSearch;