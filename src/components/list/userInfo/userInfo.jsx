// UserInfo.jsx
import React from 'react';
import { Box, Typography, Avatar, IconButton, Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VideocamIcon from '@mui/icons-material/Videocam';
import EditIcon from '@mui/icons-material/Edit';
import { useUserStore } from "../../../lib/userStore";

const UserInfo = () => {
    const { currentUser } = useUserStore();

    return (
        <Box sx={{
            padding: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
        }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                    src={currentUser.avatar || "./avatar.png"}
                    alt={currentUser.username}
                    sx={{ width: 50, height: 50 }}
                />
                <Typography variant="h6" component="h2">
                    {currentUser.username}
                </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <IconButton aria-label="more" sx={{ color: 'white' }}>
                    <MoreVertIcon />
                </IconButton>
                <IconButton aria-label="video call" sx={{ color: 'white' }}>
                    <VideocamIcon />
                </IconButton>
                <IconButton aria-label="edit" sx={{ color: 'white' }}>
                    <EditIcon />
                </IconButton>
            </Stack>
        </Box>
    );
};

export default UserInfo;