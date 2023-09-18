import React from 'react';
import { Box, Button } from '@mui/material';

//고객센터
export const Upgrade = () => {
    return (
        <>
            <Box style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                padding: '20px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                borderRadius: '10px',
                backgroundColor: 'rgba(200,230,255, 0.2)', // 유리 느낌의 파란빛 투명 배경
                width: '200px',
                margin: '0 auto'
            }}>
                <img
                    alt="Remy Sharp"
                    src={"https://www.douzone.com/html/images/lg-douzone-color.svg"}
                    style={{ width: '120px', marginBottom: '20px', borderRadius: '5px' }}
                />

                <Button
                    color="primary"
                    target="_blank"
                    href="https://douzone.com/"
                    variant="contained"
                    aria-label="logout"
                    size="small"
                    style={{
                        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                        border: 0,
                        borderRadius: '20px',
                        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                        color: 'white',
                        padding: '0 20px',
                        fontSize: '14px'
                    }}
                >
                    고객센터문의
                </Button>
            </Box>


        </>

    );
};
