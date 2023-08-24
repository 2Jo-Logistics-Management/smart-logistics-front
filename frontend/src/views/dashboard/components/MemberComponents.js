  import axios from 'axios';
  import React, { useState, useEffect } from 'react';
  import { Alert, Checkbox, MenuItem, Snackbar } from '@mui/material'; // Select와 MenuItem 추가
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

    const [isModalOpen, setIsModalOpen] = useState(false);

    // 체크박스 관련 state
    const [selectedMembers, setSelectedMembers] = useState([]);

    // 전체 선택 체크박스 관련 state
    const [selectAll, setSelectAll] = useState(false);

    // 삭제 알림창 
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    
    // 수정 관련 state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    // 수정 중복선택 경고 alert창
    const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

    const [newMember, setNewMember] = useState({
      memberName: '',
      memberId: '',
      password: '',
      memberRole: '',
    });

    const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      setSelectedMembers([]); // 선택된 멤버들을 모두 해제
    };

    // 수정 중복선택 경고 alert창    
    const handleEditMembers = () => {
      if (selectedMembers.length !== 1) {
        setIsSnackbarVisible(true); // Show the snackbar
        return;
      }
  
      setEditingMember({ ...selectedMembers[0] });
      setIsEditModalOpen(true);
    };

    // LIST axios
    useEffect(() => {
      axios.get('http://localhost:8888/api/member/list',{ data: {memberNo : 1}})
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
    
    // DELETE axios
    const confirmDeleteMembers = () => {
      let memberNoArr = selectedMembers.map(item => item.memberNo);
      axios.delete('http://localhost:8888/api/member/delete', {
        data: memberNoArr
      })
        .then(() => {
          console.log(memberNoArr);
          axios.get('http://localhost:8888/api/member/list')
            .then(updateMemberList)
            .catch(handleError);
          setDeleteConfirmationOpen(false);
          window.location.reload(); // 삭제가 완료되면 페이지 새로고침
        })
        .catch(handleError);
    };

    // MODIFY axios
    const handleUpdateMember = () => {
      if (editingMember.memberName && editingMember.memberId && editingMember.memberRole) {
        axios.patch(`http://localhost:8888/api/member/modify?memberNo=${editingMember.memberNo}`, editingMember)
          .then(response => {
            setIsEditModalOpen(false);
            axios.get('http://localhost:8888/api/member/list')
              .then(updateMemberList)
              .catch(handleError);
            window.location.reload(); // 수정이 완료되면 페이지 새로고침
          })
          .catch(handleError);
      } else {
        console.log("모든 필드를 입력하세요.");
      }
    };


    const handleDeleteMembers = () => {
      if (selectedMembers.length === 0) {
        console.log("선택된 멤버가 없습니다.");
        return;
      }
    
      setDeleteConfirmationOpen(true);
    };
    
    
    const cancelDeleteMembers = () => {
      setDeleteConfirmationOpen(false);
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

    // 체크박스 전체 선택 또는 해제
    const handleSelectAll = () => {
      if (selectAll) {
        setSelectedMembers([]);
      } else {
        setSelectedMembers([...currentMember]);
      }
      setSelectAll(!selectAll);
    };

    // 단일 선택 체크박스 선택 또는 해제
    const handleSingleSelect = (member) => {
      if (selectedMembers.includes(member)) {
        setSelectedMembers(selectedMembers.filter((m) => m !== member));
      } else {
        setSelectedMembers((prevSelectedMembers) => [...prevSelectedMembers, member]);
      }
    };
    

    return (
      <>
      
      {/* MODIFY 모달 */}
      <Modal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper className="modal-paper" style={{ padding: '30px', margin: '20px' }}>
          <div style={{ width: '400px' }}>
            <Typography variant="h6" style={{ fontSize: '18px', marginBottom: '20px' }}>
              회원 정보 수정
            </Typography>
            <TextField
              label="이름"
              variant="outlined"
              type='text'
              value={editingMember?.memberName || ''}
              onChange={(e) => setEditingMember({ ...editingMember, memberName: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="아이디"
              variant="outlined"
              type='text'
              value={editingMember?.memberId || ''}
              onChange={(e) => setEditingMember({ ...editingMember, memberId: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="비밀번호"
              variant="outlined"
              type='text'
              value={editingMember?.password || ''}
              onChange={(e) => setEditingMember({ ...editingMember, password: e.target.value })}
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
                value={editingMember?.memberRole || ''}
                onChange={(e) => setEditingMember({ ...editingMember, memberRole: e.target.value })}
                required
              >
                <MenuItem value="ADMIN">관리자</MenuItem>
                <MenuItem value="MEMBER">회원</MenuItem>
            </TextField>
              
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={handleUpdateMember}>
                수정
              </Button>
              <Button variant="contained" color="error" onClick={() => setIsEditModalOpen(false)}>
                취소
              </Button>
            </Box>
          </div>
        </Paper>
      </Modal>

      {/* DELETE 모달 */}
      <Modal
        open={deleteConfirmationOpen}
        onClose={cancelDeleteMembers}
        aria-labelledby="delete-confirmation-modal-title"
        aria-describedby="delete-confirmation-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper className="modal-paper" style={{ padding: '30px', margin: '20px' }}>
          <div style={{ width: '400px' }}>
            <Typography variant="h6" style={{ fontSize: '18px', marginBottom: '20px' }}>
              선택한 회원 삭제
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '20px' }}>
              선택한 회원을 삭제하시겠습니까?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={confirmDeleteMembers}>
                삭제
              </Button>
              <Button variant="contained" color="error" onClick={cancelDeleteMembers}>
                취소
              </Button>
            </Box>
          </div>
        </Paper>
      </Modal>
      
      
      {/* INSERT 모달 */}
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
                <Button variant="contained" color="error" onClick={handleCloseEditModal}>
                  취소
                </Button>
              </Box>
            </div>
          </Paper>
        </Modal>

      {/* 비로그인/회원 경고 Alert 창 */}
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

      {/* 수정시 다중 선택 alert창 */}
      <Snackbar
        open={isSnackbarVisible}
        autoHideDuration={4000}
        onClose={() => setIsSnackbarVisible(false)}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        >
        <Alert
            severity="warning"
            variant="filled"
            onClose={() => setIsSnackbarVisible(false)}
            sx={{
            width: '400px', // 너비 조정
            padding: '15px', // 패딩 조정
            }}
        >
            <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                중복으로 선택할 수 없습니다.
            </Typography>
            <Typography variant="body1">
                하나의 멤버만 선택해주세요.
            </Typography>
        </Alert>
    </Snackbar>

      <DashboardCard >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h4" component="div">
              회원관리
            </Typography>
            <Box>
              <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mr: 2 }}>
                조회
              </Button>
              <Button variant="contained" color="info" onClick={handleEditMembers} sx={{ mr: 2 }}>
                수정
              </Button>
              <Button variant="contained" color="error" onClick={handleDeleteMembers} sx={{ mr: 2 }}>
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

      <DashboardCard>
        <Box sx={{ overflow: 'auto', maxHeight: '650px' }}>
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
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight={600}>
                    No
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight={600}>
                    사원이름
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight={600}>
                    아이디
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight={600}>
                    역할
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight={600}>
                    생성일자
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight={600}>
                    IP주소
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {currentMember.map((realMember) => (
                <TableRow key={realMember.memberNo}
                sx={{
                  '&:hover': {
                      backgroundColor: '#f5f5f5',
                      cursor: 'pointer'
                  }
              }}
              onClick={() => handleSingleSelect(realMember)}>
                  <TableCell>
                    <Checkbox
                      checked={selectedMembers.includes(realMember)}
                      onChange={() => handleSingleSelect(realMember)}
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

      </>
    );
};

  export default Member;
