import React from 'react';
import { Box, Grid2, useTheme, useMediaQuery } from '@mui/material';
import ChatList from "./chatList/chatList";
import UserInfo from "./userInfo/userInfo";

const List = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <Grid2 container direction={isMobile ? 'column' : 'row'} sx={{ height: '100%' }}>
                <Grid2 item xs={12} sm={9} md={10} sx={{ height: isMobile ? 'calc(100% - 64px)' : '100%', overflow: 'auto' }}>
                    <UserInfo />
                    <ChatList />
                </Grid2>
            </Grid2>
        </Box>
    );
}

export default List;