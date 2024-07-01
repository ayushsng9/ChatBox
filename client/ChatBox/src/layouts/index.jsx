import logo from "../assets/logo.png"

function AuthLayouts({children}) {

    return (
      <>
        <header className="flex justify-center items-center py-3 shadow-md bg-white">
            <img src={logo} alt="logo" width="180" height="40"/>
        </header>
        {children}
      </>
    );
  }
  
  export default AuthLayouts;