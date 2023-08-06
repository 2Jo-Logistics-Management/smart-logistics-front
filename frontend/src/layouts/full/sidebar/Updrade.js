import React from 'react';
import { Box, Typography, Button } from '@mui/material';

//고객센터
export const Upgrade = () => {
    return (
        <Box
            display={'flex'}
            alignItems="center"
            gap={2}
            sx={{ m: 3, p: 3, bgcolor: `${'primary.light'}`, borderRadius: '8px' }}
        >
            <>
                <Box>
                <img alt="Remy Sharp" src={	"https://www.douzone.com/html/images/lg-douzone-color.svg"} width={160} />
                <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button color="primary" target="_blank" href="https://douzone.com/" variant="contained" aria-label="logout" size="100">
                        고객센터문의
                    </Button>
                </Box>
               
            </>
        </Box>
    );
};
