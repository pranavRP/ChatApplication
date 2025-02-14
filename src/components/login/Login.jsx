import { useState } from "react";
import "./login.css"
import { toast } from "react-toastify";
import { auth, db } from "/src/lib/firebase.js"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
const [avatar, setAvatar] = useState({
    file:null,
    url:""
});

const [loading, setLoading] = useState(false);

const handleAvatar = e =>{
    if(e.target.files[0]){
        setAvatar({
            file:e.target.files[0],
            url: URL.createObjectURL(e.target.files[0])
        });
    }
};


const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true);
    const formData = new FormData(e.target);

    const {username,email, password } = Object.fromEntries(formData);

    try{
        const res = await createUserWithEmailAndPassword(auth,email,password)

        const imgUrl = await upload(avatar.file)

        await setDoc (doc(db,"user", res.user.uid),{
            username,
            email,
            avatar: imgUrl,
            id: res.user.uid,
            blocked : []
        });

        await setDoc (doc(db,"userchats", res.user.uid),{
            chats:[],
        });

        toast.success("Account Created! You can login now!")

    }catch(err){
        console.log(err);
        toast.error(err.message)
    }finally{
        setLoading(false);
    }
    
}

const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true);

    const formData = new FormData(e.target);
    const {email, password } = Object.fromEntries(formData);

    try{

        await signInWithEmailAndPassword(auth, email, password);

    }catch(err){
        console.log(err);
        toast.error(err.message);
    }finally{
        setLoading(false);
    }
    
};
    return (
        <div className="login">
        <div className="background-design"></div>
        <div className="login-container">
          <div className="item">
            <h2>Welcome Back,</h2>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" name="email" />
              <input type="password" placeholder="Password" name="password" />
              <button type="submit">Sign In</button>
            </form>
          </div>
          <div className="separator"></div>
          <div className="item">
            <h2>Create An Account</h2>
            <form onSubmit={handleRegister}>
              <label htmlFor="file">
                <img src={avatar.url || "./avatar.png"} alt="Avatar" />
                Upload an Image
              </label>
              <input 
                type="file" 
                id="file" 
                style={{display: "none"}} 
                onChange={handleAvatar}
              />
              <input type="text" placeholder="Username" name="username" />
              <input type="email" placeholder="Email" name="email" />
              <input type="password" placeholder="Password" name="password" />
              <button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    );
};

export default Login;