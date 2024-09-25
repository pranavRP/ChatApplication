import "./addUser.css"
import {db} from "../../../../lib/firebase";
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
    const [user, setUser ] = useState(null);
    const {currentUser} = useUserStore();
   
    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username").trim()

        try{
            const userRef = collection(db, "user");
            const q = query(userRef, where("username", "==", username));

            const querySnapShot = await getDocs(q);
            
            /*console.log("Query executed, docs found:", querySnapShot.size); // Debug log*/

            //await logAllUsers();


            if(!querySnapShot.empty){
                setUser(querySnapShot.docs[0].data());
            }else {
                console.log("No user found with username:", username); // Debug log
              }
        }catch(err){
            console.log(err);
        }
    };

    const handleAdd = async () => {
        if (!user?.id || !currentUser?.id) {
            console.error("User ID or currentUser ID is missing");
            return;
        }

        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");

        try {
            const newChatRef = doc(chatRef); 

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages : [],
            });

            const userChatsDocRef = doc(userChatsRef, user.id);
            const userChatsDocSnap = await getDoc(userChatsDocRef);

                if (!userChatsDocSnap.exists()) {
                    await setDoc(userChatsDocRef, {
                    chats: [],
                });
                }

            await updateDoc(doc(userChatsRef, user.id),{
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage:"",
                    receiverId: currentUser.id,
                    updatedAt: Date.now(),
                    username: user.username,
                }),
            });

            const currentUserChatsDocRef = doc(userChatsRef, currentUser.id);
            const currentUserChatsDocSnap = await getDoc(currentUserChatsDocRef);

                if (!currentUserChatsDocSnap.exists()) {
                    await setDoc(currentUserChatsDocRef, {
                    chats: [],
                });
            }

            await updateDoc(doc(userChatsRef, currentUser.id),{
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage:"",
                    receiverId: user.id,
                    updatedAt: Date.now(),
                    username: user.username,
                }),
            });
            console.log("Chat added successfully");
            
        } catch (err) {
            console.log("Error adding chat:",err);
        }
    };

    return(
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username" />
                <button>Search</button>
            </form>
            {user && (
                <div className="user">
                <div className="detail">
                    <img src={user.avatar || "./avatar.png"} alt="" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handleAdd}>Add User</button>
            </div>
        )}
        </div>
    );
};

export default AddUser;
