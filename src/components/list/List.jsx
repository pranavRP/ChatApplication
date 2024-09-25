import ChatList from "./chatList/chatList";
import "./List.css";
import UserInfo from "./userInfo/userInfo";

const List = () => {
    return (
        <div className="list">
            <UserInfo/>
            <ChatList/>
        </div>
    )
}

export default List;