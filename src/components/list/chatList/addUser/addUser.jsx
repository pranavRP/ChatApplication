import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Grid2, 
  Avatar, 
  Typography, 
  Box,
  
} from '@mui/material';
import { styled } from '@mui/system';
import { db } from "../../../../lib/firebase";
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useUserStore } from "../../../../lib/userStore";


const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(17, 25, 40, 0.9)',
    borderRadius: '10px',
    padding: theme.spacing(2),
  },
}));

const AddUser = ({ open, onClose }) => {
  const [user, setUser] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;

    try {
      const userRef = collection(db, "user");
      const q = query(userRef, where("username", "==", searchUsername.trim()));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      } else {
        console.log("No user found with username:", searchUsername);
        setUser(null);
      }
    } catch (err) {
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
        messages: [],
      });

      const userChatsDocRef = doc(userChatsRef, user.id);
      const userChatsDocSnap = await getDoc(userChatsDocRef);

      if (!userChatsDocSnap.exists()) {
        await setDoc(userChatsDocRef, {
          chats: [],
        });
      }

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
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

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
          username: user.username,
        }),
      });

      console.log("Chat added successfully");
      onClose();
    } catch (err) {
      console.log("Error adding chat:", err);
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ color: 'white' }}>Add User</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSearch} noValidate sx={{ mt: 1 }}>
          <Grid2 container spacing={2} alignItems="center">
            <Grid2 item xs={8}>
              <TextField
                fullWidth
                label="Username"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                variant="filled"
                margin="normal"
                sx={{
                    input: { color: 'white' },
                    label: { color: 'white' },
                    '& .MuiInputBase-root': {
                      color: 'white',
                      '&:before': {
                        borderBottomColor: 'white',
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: 'white',
                      },
                      '&.Mui-focused:after': {
                        borderBottomColor: 'white',
                      },
                    },
                  }}
              />
            </Grid2>
            <Grid2 item xs={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Search
              </Button>
            </Grid2>
          </Grid2>
        </Box>
        {user && (
          <Box sx={{ mt: 2 }}>
            <Grid2 container spacing={2} alignItems="center">
              <Grid2 item>
                <Avatar src={user.avatar || "/avatar.png"} alt={user.username} />
              </Grid2>
              <Grid2 item xs>
                <Typography variant="subtitle1">{user.username}</Typography>
              </Grid2>
              <Grid2 item>
                <Button onClick={handleAdd} variant="contained" color="primary">
                  Add User
                </Button>
              </Grid2>
            </Grid2>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}  variant="outlined">
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default AddUser;