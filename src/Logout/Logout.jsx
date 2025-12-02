import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
const Logout = () => {
    const navigate=useNavigate()
    useEffect(() => {
      localStorage.removeItem("user"); 
       navigate("/login");
    }, [])    
  return (
    <div>
      Logout
    </div>
  )
}

export default Logout
