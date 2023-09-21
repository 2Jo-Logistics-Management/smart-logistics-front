import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Alert, 
  Checkbox, 
  MenuItem, 
  Snackbar,
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
  Pagination,
  TableContainer,
  InputAdornment,
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import { useSelector } from 'react-redux';
import swal from "sweetalert2";
import DashboardCard from '../../../components/shared/DashboardCard';
import { IconCopy, IconUsers, IconSearch } from '@tabler/icons';
import styled from 'styled-components';
import DeleteIcon from "@mui/icons-material/Delete";
import PageviewOutlinedIcon from "@mui/icons-material/PageviewOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { close } from '../../../redux/slices/loginResponseReducer';
axios.defaults.withCredentials = true;

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#505e82",
    color: 'white',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 40,
    minWidth: 100,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Member = () => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [changedItemCode] = useState(-1);

  const [currentMember, setCurrentMember] = useState([]);

  const [searchCode, setSearchCode] = useState('');
  const [searchId, setSearchId] = useState('');

  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Alert 창을 표시할지 여부

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 체크박스 관련 state
  const [selectedMembers, setSelectedMembers] = useState([]);

  // 수정 관련 state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // 글자수 초과 에러
  const [memberIdError, setMemberIdError] = useState(false);  // 사원 아이디
  const [memberPasswordError, setMemberPasswordError] = useState(false);    // 전화번호
  const [memberNameError, setMemberNameError] = useState(false);    // 사원 이름

  // 수정 중복선택 경고 alert창
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  // 데이터 슬라이싱
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentMember.slice(indexOfFirstItem, indexOfLastItem);

  const memberData = useSelector((state) => state.memberData.memberData);

  // 페이지 변경 핸들러 추가
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const [newMember, setNewMember] = useState({
    memberName: '',
    memberId: '',
    password: '',
    memberRole: '',
    createDate: '',
  });

  const handleInputValidation = (value, maxLength) => {
    if (value.length > maxLength) {
        return true; // 길이 초과 시 true 반환
    } else {
        return false; // 길이 초과하지 않을 시 false 반환
    }
  };

  // INSERT 취소버튼시 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMembers([]); // 선택된 멤버들을 모두 해제
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
      const errorStatus = error.response.status;
      console.log(errorStatus);
      if (errorStatus === 401) {
        setAlertMessage('로그인이 필요합니다. 5초 뒤에 로그인 페이지로 이동 합니다.');
        setIsAlertOpen(true);
        localStorage.clear();
        setTimeout(() => {
          window.location.reload();
        }, 5000)
      } else if (errorStatus === 403) {
        setAlertMessage('허가되지 않는 이용자입니다.');
        setIsAlertOpen(true);
        close();
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
  
    if (!newMember.memberName || !newMember.memberId || !newMember.password || !newMember.memberRole) {
      setIsModalOpen(false);
      swal.fire({
        title: "입력 오류",
        text: "모든 항목을 입력하세요.",
        icon: "error",
      });
  
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    }
    
    if (newMember.memberId.length > 15) {
      setMemberNameError(true); // Set the error state for memberName
      setIsModalOpen(false);
      swal.fire({
        title: "입력 오류",
        text: "아이디는 10글자 이하여야 합니다.",
        icon: "error",
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    } else {
      setMemberNameError(false); // Clear the error state for memberName
    }

    if (newMember.memberName.length > 15) {
      setMemberNameError(true); // Set the error state for memberName
      setIsModalOpen(false);
      swal.fire({
        title: "입력 오류",
        text: "멤버 이름은 15글자 이하여야 합니다.",
        icon: "error",
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    } else {
      setMemberNameError(false); // Clear the error state for memberName
    }

    if (newMember.password.length > 15) {
      setMemberNameError(true); // Set the error state for memberName
      setIsModalOpen(false);
      swal.fire({
        title: "입력 오류",
        text: "비밀번호는 15글자 이하여야 합니다.",
        icon: "error",
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    } else {
      setMemberNameError(false); // Clear the error state for memberName
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
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.error(error)
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
    if (!newMember.memberId || newMember.memberId.trim() === '') {
      // memberId가 null 또는 빈 문자열인 경우
      setAlertMessage('아이디를 입력해주세요.');
      return;
    }

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

  
  // SEARCH axios
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
    setCurrentPage(1);

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
            error={memberNameError}
            helperText={memberNameError ? "회원 이름은 15글자를 넘길 수 없습니다." : ""}
          />
          <TextField
            label="아이디"
            variant="outlined"
            type='text'
            value={editingMember?.memberId || ''}
            onChange={(e) => setEditingMember({ ...editingMember, memberId: e.target.value })}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="비밀번호"
            variant="outlined"
            value={editingMember?.password || ''}
            onChange={(e) => setEditingMember({ ...editingMember, password: e.target.value })}
            fullWidth
            margin="normal"
            type="password"
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
            disabled={memberData.data.memberId === editingMember?.memberId} // 수정된 부분
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
                  onChange={(e) => {
                    const value = e.target.value;
                    handlerSetInputData('memberId', value);

                    if (value.length > 10) {
                      setMemberIdError(true);
                    } else {
                      setMemberIdError(false);
                    }
                  }}
                  fullWidth
                  margin="normal"
                  required
                  error={memberIdError || alertMessage.includes('이미 존재하는 아이디')}
                  helperText={
                    memberIdError
                      ? '아이디는 10글자 이하로 입력하세요.'
                      : alertMessage.includes('이미 존재하는 아이디')
                      ? '이미 존재하는 아이디입니다.'
                      : alertMessage  // 추가: 중복체크 결과 메시지 표시
                  }
                />
                    <Button variant="outlined" color="primary" onClick={handleCheckDuplicateId} style={{ marginLeft: '10px', flex: 1 }} >
                        중복 체크
                    </Button>
                </div>
                <TextField
                  label="비밀번호"
                  variant="outlined"
                  type="password"
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewMember((prevMember) => ({
                        ...prevMember,
                        password: value
                    }));
                    setMemberPasswordError(handleInputValidation(value, 15));
                  }}
                  fullWidth
                  margin="normal"
                  required
                  error={memberPasswordError}
                  helperText={memberPasswordError ? "비밀번호는 15글자를 넘길 수 없습니다." : ""}
                />
                <TextField
                  label="이름"
                  variant="outlined"
                  type="text"
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewMember((prevMember) => ({
                        ...prevMember,
                        memberName: value
                    }));
                    setMemberNameError(handleInputValidation(value, 15));
                  }}
                  fullWidth
                  margin="normal"
                  required
                  error={memberNameError}
                  helperText={memberNameError ? "이름은 15글자를 넘길 수 없습니다." : ""}
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
      <>
        <DashboardCard>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, padding: "10px",}}>
                <IconUsers />
                <Typography variant="h4" component="div" sx={{ ml: 1 }}>
                    사원 관리
                </Typography>
              </Box>
              <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                    padding: "10px",
                  }}
                >
                    
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <Typography variant="h6" sx={{ mr: 1 }}>
                    사원 코드
                  </Typography>
                  <TextField label="사원 코드" 
                  variant="outlined" 
                  type='number' 
                  size="small" 
                  sx={{ mr: 2 }} 
                  value={searchCode} 
                  onChange={(e) => setSearchCode(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch />
                      </InputAdornment>
                    ),
                  }}
                  style={{
                    borderRadius: 100,
                    borderColor: "#808080",
                    boxShadow: "0 2px 5px #cccccc",
                  }}
                  onKeyDown={handleEnterKeyPress} />
                  <Typography variant="h6" sx={{ mr: 1 }}>
                    아이디
                  </Typography>
                  <TextField 
                  abel="아이디" 
                  variant="outlined" 
                  type='text' 
                  size="small" 
                  sx={{ mr: 2 }} 
                  value={searchId} 
                  onChange={(e) => setSearchId(e.target.value)} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch />
                      </InputAdornment>
                    ),
                  }}
                  style={{
                    borderRadius: 100,
                    borderColor: "#808080",
                    boxShadow: "0 2px 5px #cccccc",
                  }}
                  onKeyDown={handleEnterKeyPress} />
              </Box>
              <Box>
                <Button variant="contained" color="success" size='large' startIcon={<PageviewOutlinedIcon />} onClick={handleSearch} sx={{ mr: 2 }}>
                    검색
                </Button>
                <Button variant="contained" color="primary" size='large' startIcon={<AddCircleOutlineOutlinedIcon />} onClick={openAddNewMemberForm} sx={{ mr: 2 }}>
                    추가
                </Button>
                <Button variant="contained" color="error" size='large' startIcon={<DeleteIcon />} onClick={handleDeleteMembers}>
                    삭제
                </Button>
              </Box>
            </Box>
            <Box sx={{ overflow: 'auto', height:"calc(40vh)", maxHeight: '650px'}}>
              <TableContainer component={Paper}>
                <Table
                aria-label="customized table"
                sx={{
                    minWidth: 700,
                }}
                >
                    <TableHead
                        sx={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                        }}
                    >
                        <StyledTableRow>
                            <StyledTableCell style={{ width: "6%" }}>
                                <Typography variant="h6" fontWeight={600}>
                                </Typography>
                            </StyledTableCell>
                            <StyledTableCell style={{ width: "8%" }}>
                                <Typography variant="h6" fontWeight={600}>
                                    사원코드
                                </Typography>
                            </StyledTableCell>
                            <StyledTableCell style={{ width: "20%" }}>
                                <Typography variant="h6" fontWeight={600}>
                                    이름
                                </Typography>
                            </StyledTableCell>
                            <StyledTableCell  style={{ width: "20%" }}>
                                <Typography variant="h6" fontWeight={600}>
                                    아이디
                                </Typography>
                            </StyledTableCell>
                            <StyledTableCell  style={{ width: "20%" }}>
                                <Typography variant="h6" fontWeight={600}>
                                    역할
                                </Typography>
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>

                    <TableBody
                      sx={{
                        mt: 0.5,
                        mb: 0.5,
                        padding: '10px',  
                      }}
                    >
                        {currentItems.map((realMember, index) => (
                            <StyledTableRow key={realMember.memberNo}
                            sx={{
                              backgroundColor:
                              currentMember.memberNo === changedItemCode
                                  ? "#e7edd1"
                                  : index % 2 !== 0
                                  ? "#f3f3f3"
                                  : "white",
                                '&:hover': {
                                    backgroundColor: '#c7d4e8',
                                    cursor: 'pointer'
                                }
                            }}
                            onClick={() => {
                              setEditingMember({ ...realMember }); // 선택한 거래처 데이터를 설정합니다.
                              setIsEditModalOpen(true); // 수정 모달을 엽니다.
                          }}>
                                <StyledTableCell>
                                  <Checkbox
                                      checked={selectedMembers.includes(realMember)}
                                      onClick={(event) => {
                                          event.stopPropagation();
                                          handleSingleCheckboxSelect(realMember);
                                      }}
                                  />
                                </StyledTableCell>
                                <StyledTableCell align='right'>
                                    <Typography variant="subtitle2" fontWeight={400}>
                                        {realMember.memberNo}
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={400}>
                                                {realMember.memberName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    <Typography variant="subtitle2" fontWeight={400}>
                                        {realMember.memberId}
                                    </Typography>
                                </StyledTableCell>
                
                                <StyledTableCell align='left'>
                                    <Typography variant="subtitle2" fontWeight={400}>
                                        {realMember.memberRole}
                                    </Typography>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
              </TableContainer>
            </Box>
            {/* 페이지 네이션 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              my: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                my: 2,
              }}
            >
                <Pagination
                count={Math.ceil(currentMember.length / itemsPerPage)}
                page={currentPage}
                variant="outlined"
                color="primary"
                onChange={handlePageChange}
                />
            </Box>
          </Box>
          {/* 페이지 네이션 */}
        </DashboardCard>
      </>
    </>
  );
};

export default Member;
