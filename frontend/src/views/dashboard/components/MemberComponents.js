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
  import swal from "sweetalert2";
  import DashboardCard from '../../../components/shared/DashboardCard';
  import { IconCopy } from '@tabler/icons';
  axios.defaults.withCredentials = true;


  const Member = () => {
    const [currentMember, setCurrentMember] = useState([]);

    const [searchCode, setSearchCode] = useState('');
    const [searchId, setSearchId] = useState('');

    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertOpen, setIsAlertOpen] = useState(false); // Alert 창을 표시할지 여부

    const [isModalOpen, setIsModalOpen] = useState(false);

    // 체크박스 관련 state
    const [selectedMembers, setSelectedMembers] = useState([]);

    // 전체 선택 체크박스 관련 state
    const [selectAll, setSelectAll] = useState(false);
    
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

    // Enter시 검색
    const handleEnterKeyPress = (event) => {
      if (event.key === 'Enter') {
          handleSearch();
      }
    };

    // LIST axios
    useEffect(() => {
      axios.get('http://localhost:8888/api/member/list',{ data: {memberNo : 1}})
        .then(response => {
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
    const handleSaveNewMember = async () => {
      let timerInterval = null; // 변수를 초기화
    
      try {
        if (!newMember.memberName || !newMember.memberId || !newMember.password || !newMember.memberRole) {
          console.log("모든 필수 항목을 입력하세요.");
          return;
        }
    
        const response = await axios.get(`http://localhost:8888/api/member/checkId/${newMember.memberId}`);
        const isDuplicate = response.data.data;
        
        if (isDuplicate) {
          setAlertMessage('이미 존재하는 아이디입니다.');
        } else {
          axios
            .post('http://localhost:8888/api/member/insert', newMember)
            .then(response => {
              swal
                .fire({
                  title: "회원 추가 완료",
                  text: "회원이 추가되었습니다.",
                  icon: "success",
                  timer: 1000,
                  timerProgressBar: true,
      
                  didOpen: () => {
                    swal.showLoading();
                    const b = swal.getHtmlContainer().querySelector("b");
                    timerInterval = setInterval(() => {
                      b.textContent = swal.getTimerLeft();
                    }, 1000);
                  },
                  willClose: () => {
                    clearInterval(timerInterval); // 타이머가 끝날 때 clearInterval 호출
                  },
                });
              
              axios.get('http://localhost:8888/api/member/list').then(updateMemberList);
              setIsModalOpen(false)
            });
          
        }

        } catch (error) {
        swal.fire({
          title: "삽입 실패",
          text: `${error}`,
          icon: "error",
        });
      }
    };

    
    // DELETE axios
    const confirmDeleteMembers = async () => {
      try {
        if (selectedMembers.some(member => member.memberId === 'admin')) {
          swal.fire({
            title: "삭제 실패",
            text: "관리자 계정은 삭제할 수 없습니다.",
            icon: "error",
          });
          return;
        }
    
        const memberNoArr = selectedMembers.map(item => item.memberNo);
        await axios.delete('http://localhost:8888/api/member/delete', {
          data: memberNoArr
        });
        await swal.fire({
          title: "삭제 완료",
          text: "회원이 삭제되었습니다.",
          icon: "success",
        });

        setTimeout(() => {
          window.location.reload();
        }, 300);
    
      } catch (error) {
        swal.fire({
          title: "삭제 실패",
          text: `${error.message}`,
          icon: "error",
        });
      }
    };
    
    const handleDeleteMembers = () => {
      if (selectedMembers.length === 0) {
        // 선택한 거래처가 없을 때
        swal.fire({
          title: "데이터 선택",
          text: "한개 이상의 데이터를 선택해주세요.",
          icon: "warning",
        });
        return;
      }
    
      // 삭제 확인 모달을 띄우기 위한 SweetAlert2 코드
      swal
        .fire({
          title: `정말로 ${selectedMembers.length}개의 회원을 삭제하시겠습니까?`,
          text: "삭제된 데이터는 복구할 수 없습니다.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "삭제",
          cancelButtonText: "취소",
        })
        .then((result) => {
          if (result.isConfirmed) {
            // 확인 버튼이 눌렸을 때, 선택한 거래처 삭제 함수 실행
            confirmDeleteMembers();
          }
        });
    };
    

    // MODIFY axios
    const handleUpdateMember = async() => {
      let timerInterval = null;
      try {
        if (editingMember.memberName && editingMember.memberId && editingMember.memberRole) {
          axios.patch(`http://localhost:8888/api/member/modify?memberNo=${editingMember.memberNo}`, editingMember)
            .then((response) => {
              setIsEditModalOpen(false);
              swal
                  .fire({
                    title: "수정 완료",
                    text: "데이터가 수정되었습니다.",
                    icon: "success",
                    timer: 1000,
                    timerProgressBar: true,
  
                    didOpen: () => {
                      swal.showLoading();
                      const b = swal.getHtmlContainer().querySelector("b");
                      timerInterval = setInterval(() => {
                        b.textContent = swal.getTimerLeft();
                      }, 1000);
                    },
                    willClose: () => {
                      clearInterval(timerInterval); // 타이머가 끝날 때 clearInterval 호출
                    },
                  })
              axios.get('http://localhost:8888/api/member/list').then(updateMemberList)
                setIsModalOpen(false)
            })
      }  
      } catch(error) {
            setIsEditModalOpen(false);
            swal.fire({
              title: "수정 실패",
              text: `${error}`,
              icon: "error",

          });
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

    const updateMemberList = response => {
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

      let timerInterval = null;
      const queryParams = [];

      if (searchCode) {
        queryParams.push(`memberNo=${searchCode}`);
      }
      if (searchId) {
          queryParams.push(`memberId=${searchId}`);
      }

      const queryString = queryParams.join('&');

      axios.get(`http://localhost:8888/api/member/list?${queryString}`)
          .then(response => {
              swal.fire({
                title: "사용자 조회중",
                html: "잠시만 기다려주세요",
                timer: 700,
                timerProgressBar: true,
                didOpen: () => {
                  swal.showLoading();
                  const b = swal.getHtmlContainer().querySelector("b");
                  timerInterval = setInterval(() => {
                    b.textContent = swal.getTimerLeft();
                  }, 1000);
                },
                willClose: () => {
                  clearInterval(timerInterval);
                },
              });
              setCurrentMember(response.data.data);
          })
          .catch(error => {
              // 처리할 에러 핸들링 코드 추가
          });

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
        {/* 화면단 코드 start */}
        <DashboardCard>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 5}}>
              
              <Typography variant="h4" component="div" style={{ display: 'flex', alignItems: 'center' }}>
                  <IconCopy style={{ marginRight: '8px' }} />
                  사원 관리
              </Typography>
                <Box>
                    <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mr: 2 }}>
                        조회
                    </Button>
                    <Button variant="contained" color="primary" onClick={openAddNewMemberForm} sx={{ mr: 2 }}>
                        신규등록
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDeleteMembers}>
                        삭제
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  사원 코드
                </Typography>
                <TextField label="사원 코드" variant="outlined" type='number' size="small" sx={{ mr: 2 }} value={searchCode} onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={handleEnterKeyPress} />
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  아이디
                </Typography>
                <TextField label="아이디" variant="outlined" type='text' size="small" sx={{ mr: 2 }} value={searchId} onChange={(e) => setSearchId(e.target.value)} 
                onKeyDown={handleEnterKeyPress} />
            </Box>
        </DashboardCard>

        <DashboardCard>
            <Box sx={{ overflow: 'auto', maxHeight: '650px'}}>
                <Table
                aria-label="simple table"
                sx={{
                    whiteSpace: 'nowrap',
                    '& th' : {
                      padding: '0px 0px 16px 0px',
                    },
                    '& td': {
                      padding: '2px 0px', // 전체 td의 padding 값을 변경
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
                                    번호
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6" fontWeight={600}>
                                    이름
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
                            onClick={() => {
                              setEditingMember({ ...realMember }); // 선택한 거래처 데이터를 설정합니다.
                              setIsEditModalOpen(true); // 수정 모달을 엽니다.
                          }}>
                                <TableCell>
                                  <Checkbox
                                      checked={selectedMembers.includes(realMember)}
                                      onClick={(event) => {
                                          event.stopPropagation();
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
                
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={400}>
                                        {realMember.memberRole}
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
