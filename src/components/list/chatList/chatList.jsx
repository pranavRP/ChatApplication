import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import AddUser from "./addUser/addUser";

const StyledListItem = styled(ListItem)(({ theme, isSeen }) => ({
  cursor: 'pointer',
  backgroundColor: isSeen ? 'transparent' : theme.palette.primary.light,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "user", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );
    return () => {
      unSub();
    }
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userchats = chats.map(({ user, ...rest }) => rest);
    const chatIndex = userchats.findIndex(item => item.chatId === chat.chatId);
    userchats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);
    
    try {    
      await updateDoc(userChatsRef, {
        chats: userchats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredChats = chats.filter((c) => 
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  const handleAddUserOpen = () => {
    setAddUserDialogOpen(true);
  };

  const handleAddUserClose = () => {
    setAddUserDialogOpen(false);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
      <TextField
            fullWidth
            variant="outlined"
            placeholder="Search"
            size="small"
            onChange={(e) => setInput(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                style: { color: 'white' }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'white',
                opacity: 0.7,
              },
            }}
      />
        <IconButton
          color="primary"
          onClick={handleAddUserOpen}
          sx={{ ml: 1 }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <List sx={{ flex: 1, overflow: 'auto' }}>
        {Array.isArray(filteredChats) && filteredChats.map((chat) => (
          <StyledListItem
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            isSeen={chat?.isSeen}
          >
            <ListItemAvatar>
              <Avatar
                src={chat.user.blocked.includes(currentUser.id)
                  ? "/avatar.png"
                  : chat.user?.avatar || "/avatar.png"}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle1">
                  {chat.user.blocked.includes(currentUser.id)
                    ? "user"
                    : chat.user.username}
                </Typography>
              }
              secondary={
                <Typography variant="body2" noWrap>
                  {chat.lastMessage}
                </Typography>
              }
            />
          </StyledListItem>
        ))}
      </List>

      <AddUser open={addUserDialogOpen} onClose={handleAddUserClose} />
    </Box>
  );
};

export default ChatList;