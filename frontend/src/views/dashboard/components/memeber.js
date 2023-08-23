import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { MenuItem } from '@mui/material'; // Select와 MenuItem 추가
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
  Checkbox,
  Modal,
  Paper,
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

  const [selectAll, setSelectAll] = useState(false); // 아이템 전체선택
  const [selectedItems, setSelectedItems] = useState([]); // 아이템 단일선택

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedItemsForDeletion, setSelectedItemsForDeletion] = useState([]);

  const [newMember, setNewMember] = useState({
    memberName: '',
    memberId: '',
    password: '',
    memberRole: '',
  });

  // LIST axios
  useEffect(() => {
    axios.get('http://localhost:8888/api/member/list')
      .then(response => {
        setMemberList(response.data.data);
        setCurrentMember(response.data.data);
      })
      .catch(handleError);
  }, []);

  // Error 함수
  const handleError = error => {
    if (error.response && error.response.data) {
      const errorMessage = error.response.data;
      if (errorMessage.includes('not logged in')) {
        setAlertMessage('로그인이 필요합니다.');
        setIsAlertOpen(true);
      } else if (errorMessage.includes('do not have permission')) {
        setAlertMessage('허가되지 않는 이용자입니다.');
        setIsAlertOpen(true);
      }
    } else {
      console.error('오류 발생:', error);
    }
  };

  const handlerSetInputData = (state, data) => {
    setNewMember(prevMember => ({
      ...prevMember,
      [state]: data
    }));
  };

  // INSERT axios
  const handleSaveNewMember = () => {
    if (newMember.memberName && newMember.memberId && newMember.password && newMember.memberRole) {
      axios.post('http://localhost:8888/api/member/insert', newMember)
        .then(response => {
          axios.get('http://localhost:8888/api/member/list')
            .then(updateMemberList)
            .catch(handleError);
          setIsModalOpen(false);
        })
        .catch(handleError);
    } else {
      console.log("모든 필드를 입력하세요.");
    }
  };

  const handleDeleteSelectedItems = () => {
    selectedItemsForDeletion.forEach((item) => {
      axios.delete(`http://localhost:8888/api/member/delete/${item.memberNo}`)
        .then(() => {
          // 삭제된 아이템을 멤버 목록에서 제거
          setMemberList((prevList) => prevList.filter((member) => member.memberNo !== item.memberNo));
        })
        .catch(handleError);
    });
  
    // 선택한 아이템 배열 초기화
    setSelectedItemsForDeletion([]);
  };


  const updateMemberList = response => {
    setMemberList(response.data.data);
    setCurrentMember(response.data.data);
  };

  const openAddNewMemberForm = () => {
    setNewMember({
      memberName: '',
      memberId: '',
      password: '',
      memberRole: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // 이름, 아이디 검색기능
  const handleSearch = () => {
    const filteredMembers = memberList.filter((member) => {
      const nameMatches = member.memberName.includes(searchName);
      const idMatches = member.memberId.includes(searchId);
      return nameMatches && idMatches;
    });
  
    setCurrentMember(filteredMembers);
  };

  // 권한 부여(접근제한)
  const handleAlertClose = () => {
    setIsAlertOpen(false);
    window.location.href = '/';
  };
  
  // thead - 체크박스 전체선택
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...currentMember]);
    }
    setSelectAll(!selectAll);
  };

  // tbody - 체크박스 단일선택
  // const handleSelectItem = (item) => {
  //   if (selectedItems.includes(item)) {
  //     setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
  //   } else {
  //     setSelectedItems([...selectedItems, item]);
  //   }
  // };

  const handleSelectItem = (item) => {
    if (selectedItemsForDeletion.includes(item)) {
      setSelectedItemsForDeletion(selectedItemsForDeletion.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItemsForDeletion([...selectedItemsForDeletion, item]);
    }
  };

  return (
    <>

    

    {/* 모달 */}
    <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper className="modal-paper" style={{ padding: '30px', margin: '20px' }}>
          <div style={{ width: '400px' }}>
            <Typography variant="h6" style={{ fontSize: '18px', marginBottom: '20px' }}>신규 회원 추가</Typography>
            <TextField
              label="이름"
              variant="outlined"
              type='text'
              onChange={(e) => handlerSetInputData('memberName',e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="아이디"
              variant="outlined"
              type='text'
              onChange={(e) => handlerSetInputData('memberId',e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="비밀번호"
              variant="outlined"
              type="password"
              onChange={(e) => handlerSetInputData('password',e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="역할"
              variant="outlined"
              select // Select 컴포넌트로 변경
              fullWidth
              margin="normal"
              value={newMember.memberRole} // 선택한 역할 표시
              onChange={(e) => handlerSetInputData('memberRole', e.target.value)}
              required
            >
              <MenuItem value="ADMIN">관리자</MenuItem>
              <MenuItem value="MEMBER">회원</MenuItem>
            </TextField>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={handleSaveNewMember}>
                추가
              </Button>
              <Button variant="contained" color="error" onClick={handleCloseModal}>
                취소
              </Button>
            </Box>
          </div>
        </Paper>
      </Modal>

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

    <DashboardCard >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div">
            회원관리
          </Typography>
          <Box>
            <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mr: 2 }}>
              조회
            </Button>
            <Button variant="contained" color="info" sx={{ mr: 2 }}>
              수정
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteSelectedItems} sx={{ mr: 2 }}>
              삭제
            </Button>
            <Button variant="contained" color="primary" onClick={openAddNewMemberForm} >
              신규
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            이름
          </Typography>
          <TextField label="이름" variant="outlined" size="small" sx={{ mr: 2 }} value={searchName} onChange={(e) => setSearchName(e.target.value)}/>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            아이디
          </Typography>
          <TextField label="아이디" variant="outlined" size="small" sx={{ mr: 2 }} value={searchId} onChange={(e) => setSearchId(e.target.value)} />
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
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    color="primary"
                  />
              </TableCell>
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
                    <Checkbox
                      checked={selectedItems.includes(realMember)}
                      onChange={() => handleSelectItem(realMember)}
                      color="primary"
                    />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={400}>
                      {realMember.memberNo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={400}>
                        {realMember.memberName}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={400}>
                    {realMember.memberId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={400}>
                    {realMember.memberRole}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={400}>
                    {realMember.createDate}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={400}>
                    {realMember.ipaddress}
                  </Typography>
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
