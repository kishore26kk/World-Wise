import { useNavigate } from "react-router-dom";
import Button from "./Button";

const BackButton = () => {
    const navigate = useNavigate();
  return (
    <Button type="back" onClick={(e)=>{
        e.preventDefault();
        navigate("/app/cities")
      }
        }>&larr; Back</Button>
  )
}

export default BackButton