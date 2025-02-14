import React from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import {
  Box,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Grid2,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const Detail = () => {
  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    resetChat,
  } = useChatStore();
  const { currentUser } = useUserStore();
  const [openPhotos, setOpenPhotos] = React.useState(false);

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "user", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleTogglePhotos = () => {
    setOpenPhotos(!openPhotos);
  };

  return (
    <Box sx={{ maxWidth: 400, overflow: "auto", margin: "0 auto" }}>
      <StyledPaper elevation={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Avatar
            src={user?.avatar || "./avatar.png"}
            sx={{ width: 100, height: 100 }}
          />
          <Typography variant="h5">{user?.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Typography>
        </Box>
      </StyledPaper>

      <StyledPaper elevation={3}>
        <List>
          <ListItem>
            <ListItemText primary="Chat Settings" />
            <ExpandLess />
          </ListItem>
          <ListItem>
            <ListItemText primary="Privacy & help" />
            <ExpandLess />
          </ListItem>
          <ListItem button onClick={handleTogglePhotos}>
            <ListItemText primary="Shared Photos" />
            {openPhotos ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openPhotos} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem sx={{ pl: 4 }}>
                <Grid2
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid2 item xs={10}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        variant="rounded"
                        src="https://cdn.britannica.com/61/93061-050-99147DCE/Statue-of-Liberty-Island-New-York-Bay.jpg"
                      />
                      <Typography variant="body2" color="text.secondary">
                        photo_2024_2.png
                      </Typography>
                    </Box>
                  </Grid2>
                  <Grid2 item xs={2}>
                    <ListItemIcon>
                      <DownloadIcon />
                    </ListItemIcon>
                  </Grid2>
                </Grid2>
              </ListItem>
            </List>
          </Collapse>
          <ListItem>
            <ListItemText primary="Shared Files" />
            <ExpandLess />
          </ListItem>
        </List>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Button variant="contained" color="error" onClick={handleBlock}>
            {isCurrentUserBlocked
              ? "You are Blocked!"
              : isReceiverBlocked
              ? "User blocked"
              : "Block User"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => auth.signOut()}
          >
            Logout
          </Button>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default Detail;
