  import axios from 'axios';
  import React, { useState, useEffect } from 'react';
  import CloseIcon from '@mui/icons-material/Close';
  import { Alert, Avatar, Checkbox, Grid, IconButton, MenuItem, Snackbar } from '@mui/material'; // Select와 MenuItem 추가
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
  import { IconCopy, IconDetails, IconList, IconListDetails, IconRefresh } from '@tabler/icons';
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

    // 관리자 삭제 금지 기능
    const [deletionInProgress, setDeletionInProgress] = useState(false);

    const [selectedMemberDetail, setSelectedMemberDetail] = useState(null);

    const [newMember, setNewMember] = useState({
      memberName: '',
      memberId: '',
      password: '',
      memberRole: '',
      createDate: '',
    });

    // INSERT 취소버튼시 함수
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedMembers([]); // 선택된 멤버들을 모두 해제
      window.location.reload();
    };
    // MODIFY 취소버튼시 함수
    const handleCloseEditModal = () => {
      setIsEditModalOpen(false); // 수정 모달을 닫습니다.
      setSelectedMembers([]); // 선택된 멤버들을 모두 해제
    };

    // DELETE 취소버튼시 함수
    const cancelDeleteMembers = () => {
      setDeleteConfirmationOpen(false);
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
        console.log("에러 +++++++++++++ : " + errorMessage)
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
        axios.get(`http://localhost:8888/api/member/checkId/${newMember.memberId}`)
          .then(response => {
            const isDuplicate = response.data.data;
            if (isDuplicate) {
              setAlertMessage('이미 존재하는 아이디입니다.');
            } else {
              axios.post('http://localhost:8888/api/member/insert', newMember)
                .then(response => {
                  axios.get('http://localhost:8888/api/member/list')
                    .then(updateMemberList)
                    .catch(handleError);
                  setIsModalOpen(false);
                  window.location.reload(); // 회원 추가 후 페이지 새로고침
                })
                .catch(handleError);
            }
          })
          .catch(handleError);
      } else {
        console.log("모든 필드를 입력하세요.");
      }
    };
    
    // DELETE axios
    const confirmDeleteMembers = () => {
      // Check if the admin member is selected for deletion
      if (selectedMembers.some(member => member.memberId === 'admin')) {
        setAlertMessage('관리자 계정은 삭제할 수 없습니다.');
        return;
      }
    
      setDeletionInProgress(true); // Mark deletion process as initiated
        
      let memberNoArr = selectedMembers.map(item => item.memberNo);
      axios.delete('http://localhost:8888/api/member/delete', {
        data: memberNoArr
      })
        .then(() => {
          console.log(memberNoArr);
          axios.get('http://localhost:8888/api/member/list')
            .then(updateMemberList)
            .catch(handleError);
          setDeletionInProgress(false); // Mark deletion process as completed
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
    
    // 중복체크 axios
    const handleCheckDuplicateId = () => {
      axios.get(`http://localhost:8888/api/member/checkId/${newMember.memberId}`)
        .then(response => {
          const isDuplicate = response.data.data;
          if (isDuplicate) {
            // 중복된 아이디가 존재하는 경우
            setAlertMessage('이미 존재하는 아이디입니다.');
          } else {
            // 중복된 아이디가 존재하지 않는 경우
            setAlertMessage('사용 가능한 아이디입니다.');
          }
        })
        .catch();
    };
    
    // 데이터 새로고침 함수
    const handleRefresh = () => {
      axios.get('http://localhost:8888/api/member/list')
        .then(updateMemberList)
        .catch(handleError);
    };

    useEffect(() => {
      // 초기 로드 시에 memberNo가 1인 항목의 데이터를 가져오는 axios 요청
      axios.get(`http://localhost:8888/api/member/detail/1`)
        .then((response) => {
          setSelectedMemberDetail(response.data.data);
        })
        .catch(handleError);
    }, []);

    const handleSingleSelect = (member) => {
      if (selectedMembers.includes(member)) {
        setSelectedMembers(selectedMembers.filter((m) => m !== member));
      } else {
        
        // 여기서 멤버의 상세 정보를 로드하고, setSelectedMemberDetail로 설정합니다.
        // 예를 들어, axios를 사용하여 API에서 상세 정보를 가져올 수 있습니다.
        axios.get(`http://localhost:8888/api/member/detail/${member.memberNo}`)
          .then((response) => {
            setSelectedMemberDetail(response.data.data); // 상세 정보 설정
          })
          .catch(handleError);
      }
    };

    const handleDeleteMembers = () => {
      if (selectedMembers.length === 0) {
        console.log("선택된 멤버가 없습니다.");
        return;
      }
    
      setDeleteConfirmationOpen(true);
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
      window.location.href = '/auth/login';
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
    const handleSingleCheckboxSelect = (member) => {
      if (selectedMembers.includes(member)) {
        setSelectedMembers(selectedMembers.filter((m) => m !== member));
      } else {
        setSelectedMembers((prevSelectedMembers) => [...prevSelectedMembers, member]);
      }
  };

    // 왼쪽 그리드 스타일
    const leftGridStyle = {
      overflow: 'auto',
      maxHeight: '650px',
      borderRadius: '6px', // 모서리를 둥글게 만듭니다.
      border: '1px solid #e0e0e0', // 테두리를 추가합니다.
      margin: '12px 0px 8px 8px', // 위쪽에 16px, 나머지 방향은 8px의 공백
    };

    // 오른쪽 그리드 스타일
    const rightGridStyle = {
      overflow: 'auto',
      maxHeight: '650px',
      padding: '8px', // 상자 내부 공백
      borderRadius: '6px', // 모서리를 둥글게 만듭니다.
      border: '1px solid #e0e0e0', // 테두리를 추가합니다.
      margin: '8px 8px 8px 8px', // 위쪽에 16px, 나머지 방향은 8px의 공백
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
              <Button variant="contained" color="error" onClick={handleCloseEditModal}>
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
          aria-labelledby="delete-confirmation-modal-titlfe"
          aria-describedby="delete-confirmation-modal-description"
          style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
          }}
      >
          <Paper className="modal-paper" style={{ padding: '20px', width: '400px' }}>
              <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <Typography variant="h6" style={{ fontSize: '18px' }}>
                          회원 삭제
                      </Typography>
                      <IconButton aria-label="닫기" onClick={cancelDeleteMembers}>
                          <CloseIcon />
                      </IconButton>
                  </div>
                  {deletionInProgress ? (
                      <Typography variant="body1" style={{ marginBottom: '20px' }}>
                          삭제 진행 중...
                      </Typography>
                  ) : selectedMembers.some(member => member.memberId === 'admin') ? (
                      <Typography variant="body1" style={{ marginBottom: '20px', color: 'red', fontWeight: 'bold' }}>
                          관리자 계정은 삭제할 수 없습니다.
                      </Typography>
                  ) : (
                      <>
                          <Typography variant="body1" style={{ marginBottom: '20px' }}>
                              선택한 회원을 삭제하시겠습니까?
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                              {!selectedMembers.some(member => member.memberId === 'admin') && (
                                  <Button variant="contained" color="primary" onClick={confirmDeleteMembers} disabled={deletionInProgress}>
                                      삭제
                                  </Button>
                              )}
                          </Box>
                      </>
                  )}
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
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <TextField
                      label="아이디"
                      variant="outlined"
                      type="text"
                      onChange={(e) => handlerSetInputData('memberId', e.target.value)}
                      fullWidth
                      margin="normal"
                      required
                      error={alertMessage.includes('이미 존재하는 아이디')}
                      helperText={alertMessage}
                  />
                      <Button variant="outlined" color="primary" onClick={handleCheckDuplicateId} style={{ marginLeft: '10px', flex: 1 }} >
                          중복 체크
                      </Button>
                  </div>
                  <TextField
                      label="비밀번호"
                      variant="outlined"
                      type="password"
                      onChange={(e) => handlerSetInputData('password', e.target.value)}
                      fullWidth
                      margin="normal"
                      required
                      
                  />
                  <TextField
                      label="이름"
                      variant="outlined"
                      type='text'
                      onChange={(e) => handlerSetInputData('memberName', e.target.value)}
                      fullWidth
                      margin="normal"
                      required
                  />
                  <TextField
                      label="역할"
                      variant="outlined"
                      select
                      fullWidth
                      margin="normal"
                      value={newMember.memberRole}
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
                하나의 회원을(만) 선택해주세요.
              </Typography>
          </Alert>
      </Snackbar>

      <DashboardCard >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 5}}>
            <Typography variant="h4" component="div" style={{ display: 'flex', alignItems: 'center' }}>
                <IconCopy style={{ marginRight: '8px' }} />
                사원관리
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
              사원 이름
            </Typography>
            <TextField label="사원 이름" variant="outlined" size="small" sx={{ mr: 2 }} value={searchName} onChange={(e) => setSearchName(e.target.value)}/>
            <Typography variant="subtitle2" sx={{ mr: 1 }}>
              아이디
            </Typography>
            <TextField label="아이디" variant="outlined" size="small" sx={{ mr: 2 }} value={searchId} onChange={(e) => setSearchId(e.target.value)} />
          </Box>
      </DashboardCard>
      <Box>
        {/* 왼쪽그리드 */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                paddingLeft: '10px',
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: '12px', // 위쪽 패딩 추가
                }}
              >             
              <IconList style={{ fontSize: '1rem', marginRight: '8px' }} /> {/* 아이콘 크기 조절 */}
              사원 목록
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRefresh}
                sx={{
                  ml: 2,
                  width: '12px', // 버튼의 너비를 조절
                  height: '30px', // 버튼의 높이를 조절
                }}
              >
                <IconRefresh />
              </Button>
              
            </div>

            <Box sx={ leftGridStyle }>
              <Table
                aria-label="simple table"
                sx={{
                  whiteSpace: 'nowrap',
                  '& th' : {
                    padding: '8px',

                  },
                  '& td': {
                    padding: '2px 8px', // 전체 td의 padding 값을 변경
                  },
                  
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
                  </TableRow>
                </TableHead>
                
                <TableBody>
                  {currentMember.map((realMember) => (
                    <TableRow
                      key={realMember.memberNo}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => handleSingleSelect(realMember)}
                    >
                       <TableCell>
                        <Checkbox
                          checked={selectedMembers.includes(realMember)}
                          onChange={(event) => {
                            event.stopPropagation()
                            handleSingleCheckboxSelect(realMember);
                          }}
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Grid>
          {/* 오른쪽 그리드 */}
          <Grid item xs={12} md={8}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                display: 'flex',
                alignItems: 'center',
                paddingTop: '23px', // 위쪽 패딩 추가
                paddingBottom: '3px',
                paddingLeft: '10px', // 왼쪽 패딩 추가
              }}
            >
            <IconListDetails style={{ fontSize: '1rem', marginRight: '8px' }} /> {/* 아이콘 크기 조절 */}
              사원 상세정보
            </Typography>
            <Box sx={rightGridStyle}>
            {selectedMemberDetail && (
              <Paper
                elevation={3}
                sx={{
                  padding: '16px',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: 'none',
                }}
              >
                <Avatar
                  alt="User Avatar"
                  src={selectedMemberDetail.avatarUrl}
                  sx={{
                    width: '120px',
                    height: '120px',
                  }}
                />
                <Typography variant="h5" gutterBottom>
                  사원 상세 정보
                </Typography>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>이름:</strong></TableCell>
                      <TableCell>{selectedMemberDetail.memberName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>아이디:</strong></TableCell>
                      <TableCell>{selectedMemberDetail.memberId}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>사용자 권한:</strong></TableCell>
                      <TableCell>{selectedMemberDetail.memberRole}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>생성 일자:</strong></TableCell>
                      <TableCell>{selectedMemberDetail.createDate}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            )}
          </Box>
          </Grid>
        </Grid>
      </Box>

      </>
    );
};

  export default Member;
