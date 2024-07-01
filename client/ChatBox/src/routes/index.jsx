import {createBrowserRouter} from "react-router-dom";
import App from '../App';
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import VerifyPassword from "../pages/VerifyPassword";
import HomePage from "../pages/HomePage";
import ForgotPassword from "../pages/ForgotPassword";
import Message from "../components/Message";
import AuthLayouts from "../layouts";



const router = createBrowserRouter([
    {
        path:"/",
        element:<App />,
        children:[
        {
            path:"register",
            element:<AuthLayouts><Register /></AuthLayouts>
        },
        {
            path:"email",
            element:<AuthLayouts><VerifyEmail /></AuthLayouts>
        },
        {
            path:"password",
            element:<AuthLayouts><VerifyPassword/></AuthLayouts>
        },
        {
            path:"forgotPassword",
            element:<AuthLayouts><ForgotPassword/></AuthLayouts>
        },
        {
            path:"",
            element:<HomePage />,
            children:[
                {
                    path:':userId',
                    element:<Message />
                }
            ]
        }
    ]
}
])

export default router