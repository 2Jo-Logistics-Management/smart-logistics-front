import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Checkbox
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
axios.defaults.withCredentials = true;

const Member = () => {
  const [currentMember, setCurrentMember] = useState([]);
  const [memberList, setMemberList] = useState([]);

  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');

  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Alert 창을 표시할지 여부

  useEffect(() => {
    axios.get('http://localhost:8888/api/member/list')
      .then(response => {
        setMemberList(response.data.data);
        setCurrentMember(response.data.data);
      })
      .catch(error => {
        if (error.response && error.response.data) {
          const errorMessage = error.response.data;

          if (errorMessage.includes('not logged in')) {
            setAlertMessage('로그인이 필요합니다.');
            setIsAlertOpen(true); // Alert 창 표시
          } else if (errorMessage.includes('do not have permission')) {
            setAlertMessage('허가되지 않는 이용자입니다.');
            setIsAlertOpen(true); // Alert 창 표시
          }
        } else {
          console.error('Error fetching member list:', error);
        }
      });
  }, []);

  const handleSearch = () => {
    const filteredMembers = memberList.filter((member) => {
      const nameMatches = member.memberName.includes(searchName);
      const idMatches = member.memberId.includes(searchId);
      return nameMatches && idMatches;
    });
  
    setCurrentMember(filteredMembers);
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
    window.location.href = '/';
  };

  return (
    <>

    {/* Alert 창 */}
    {isAlertOpen && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999, // 모달을 최상위로 배치
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            zIndex: 99999, // 모달 내용을 최상위로 배치
          }}
        >
          <p>{alertMessage}</p>
          <Button variant="contained" onClick={handleAlertClose}>
            홈으로
          </Button>
        </div>
      </div>
    )}

    <DashboardCard title="검색조건" variant="poster">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            이름
          </Typography>
          <TextField label="이름" variant="outlined" size="small" sx={{ mr: 2 }} value={searchName} onChange={(e) => setSearchName(e.target.value)}/>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            아이디
          </Typography>
          <TextField label="아이디" variant="outlined" size="small" sx={{ mr: 2 }} value={searchId} onChange={(e) => setSearchId(e.target.value)} />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Box>
    </DashboardCard>

    <div style={{ marginBottom: '20px' }}></div> {/* 간격 추가 */}

    <DashboardCard title="Member list" variant="poster">
      
      <br></br>

      <Box sx={{ overflow: 'auto', maxHeight: '400px' }}>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: 'nowrap',
            mt: 2,
          }}
        >
          <TableHead
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: '#fff',
            }}
          >
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  No
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  사원이름
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  아이디
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  역할
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  생성일자
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  IP주소
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {currentMember.map((realMember) => (
              <TableRow key={realMember.memberNo}>
                <TableCell>
                  <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>
                    {realMember.memberNo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {realMember.memberName}
                      </Typography>



                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {realMember.memberId}
                  </Typography>
                </TableCell>
                <TableCell color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {realMember.memberRole}
                </TableCell>
                <TableCell color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {realMember.createDate}
                </TableCell>
                <TableCell color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {realMember.ipaddress}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
      <style>
        {`
          /* TableCell 높이 조정 */
          .custom-table-cell {
            padding: 8px 16px; /* 셀의 패딩을 조정하여 높이 감소 */
          }
        `}
      </style>
    </>
  );
};

export default Member;
