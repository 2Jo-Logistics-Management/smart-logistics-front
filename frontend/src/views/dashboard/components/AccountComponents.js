import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TextField,
    TableRow,
    Button,
    Modal,
    Paper,
    Checkbox,
} from '@mui/material';
import swal from "sweetalert2";
import DashboardCard from '../../../components/shared/DashboardCard';
import { IconCopy } from '@tabler/icons';
axios.defaults.withCredentials = true;

const Account = () => {

    const [currentAccount, setCurrentAccount] = useState([]);

    // 거래처 이름, 거래처 코드 검색
    const [searchName, setSearchName] = useState('');
    const [searchCode, setSearchCode] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 체크박스 관련 state
    const [selectedAccount, setSelectedAccount] = useState([]);

    // 전체 선택 체크박스 관련 state
    const [selectAll, setSelectAll] = useState(false);
    
    // 수정 관련 state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    // 글자수 초과 에러
    const [accountNameError, setAccountNameError] = useState(false);        // 거래처명
    const [representativeError, setRepresentativeError] = useState(false);  // 대표자
    const [contactNumberError, setContactNumberError] = useState(false);    // 전화번호
    const [businessNumberError, setBusinessNumberError] = useState(false);  // 사업자번호


    const handleInputValidation = (value, maxLength) => {
      if (value.length > maxLength) {
          return true; // 길이 초과 시 true 반환
      } else {
          return false; // 길이 초과하지 않을 시 false 반환
      }
    };
  
    // 공통 전화번호 유효성 검사 함수
    const handlePhoneNumberValidation = (input, setFunction) => {
        const formattedInput = input.replace(/[^0-9-]/g, ''); // 숫자와 "-" 이외의 문자 제거
        if (formattedInput.length === 11) {
            const formattedNumber = `${formattedInput.slice(0, 3)}-${formattedInput.slice(3, 7)}-${formattedInput.slice(7)}`;
            setFunction(formattedNumber);
            return false; // 형식이 맞을 경우 false 반환
        } else {
            setFunction(formattedInput);
            return true; // 형식이 맞지 않을 경우 true 반환
        }
    };

    const [newAccount, setNewAccount] = useState({
        accountCode: '',
        accountName: '',
        representative: '',
        contactNumber: '',
        businessNumber: '',
    });

    // INSERT 취소버튼시 함수
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedAccount([]); // 선택된 거래처들을 모두 해제
      window.location.reload();
      };
  
      // MODIFY 취소버튼시 함수
      const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedAccount([]); // 선택된 멤버들을 모두 해제
    };
      

    // Enter시 검색
    const handleEnterKeyPress = (event) => {
      if (event.key === 'Enter') {
          handleSearch();
      }
    };

    // LIST axios
    useEffect(() => {
    axios.get('http://localhost:8888/api/account/list')
      .then(response => {
        setCurrentAccount(response.data.data);
      })
      .catch();
    }, []);

    const updateAccountList = response => {
        setCurrentAccount(response.data.data);
      };

    // INSERT axios
    const handleSaveNewAccount = () => {
      let timerInterval = null;
      // 필수 입력 값 확인
      if (
        !newAccount.accountName ||
        !newAccount.representative ||
        !newAccount.contactNumber ||
        !newAccount.businessNumber
      ) {
        // 필수 입력 값이 하나라도 누락된 경우
        console.log("모든 필수 항목을 입력하세요.");
        return;
      }
    
      if (newAccount.accountName.length > 20) {
        setAccountNameError(true);
        return;
      } else {
        setAccountNameError(false); // 에러 상태 초기화
      }
    
      axios
        .post('http://localhost:8888/api/account/insert', newAccount)
        .then((response) => {
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

          axios.get('http://localhost:8888/api/account/list').then(updateAccountList);
          setIsModalOpen(false);
          
        })
        .catch((error) => {
          console.error(error);
        });
    };

    // DELETE axios
    const confirmDeleteAccount = async () => {
      try {
        // Get the account numbers of selected accounts
        const accountNoArr = selectedAccount.map(item => item.accountNo);
    
        // Send a DELETE request to delete the selected accounts
        await axios.delete('http://localhost:8888/api/account/delete', {
          data: accountNoArr
        });
    
        // Show a success message
        await swal.fire({
          title: "삭제 완료",
          text: "계정이 삭제되었습니다.",
          icon: "success",
        }); 
    
        // Reload the page after a delay (if needed)
        setTimeout(() => {
          window.location.reload();
        }, 300);
    
      } catch (error) {
        // Handle errors and show an error message
        swal.fire({
          title: "삭제 실패",
          text: `${error.message}`,
          icon: "error",
        });
      }
    };

    const handleDeleteAccount = () => {
      if (selectedAccount.length === 0) {
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
          title: `정말로 ${selectedAccount.length}개의 거래처를 삭제하시겠습니까?`,
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
            confirmDeleteAccount();
          }
        });
    };

    // MODIFY axios
    const handleUpdateAccount = async() => {
      let timerInterval = null;
      try {
        if (editingAccount.accountName && editingAccount.representative && editingAccount.contactNumber && editingAccount.businessNumber) {
          axios.patch(`http://localhost:8888/api/account/modify?accountNo=${editingAccount.accountNo}`, editingAccount)
            .then(response => {
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
              
              axios.get('http://localhost:8888/api/account/list').then(updateAccountList);
                setIsModalOpen(false)
            })
        }
        } catch (error) {
          swal.fire({
            title: "수정 실패",
            text: `${error}`,
            icon: "error",
          });
        }
    };


    // 조회조건 axios
    const handleSearch = () => {

      let timerInterval = null;
      const queryParams = [];
  
      if (searchCode) {
          queryParams.push(`accountNo=${searchCode}`);
      }
      if (searchName) {
          queryParams.push(`accountName=${searchName}`);
      }
  
      const queryString = queryParams.join('&');
  
      axios.get(`http://localhost:8888/api/account/list?${queryString}`)
          .then(response => {
              swal.fire({
                title: "입고물품 조회중",
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
              setCurrentAccount(response.data.data);
          })
          .catch(error => {
              // 처리할 에러 핸들링 코드 추가
          });
  };

    const openAddNewAccountForm = () => {
        setNewAccount({
        accountName: '',
        representative: '',
        contactNumber: '',
        businessNumber: '',
        });
        setIsModalOpen(true);
    };
    

    // 체크박스 전체 선택 또는 해제
    const handleSelectAll = () => {
        if (selectAll) {
          setSelectedAccount([]);
        } else {
          setSelectedAccount([...currentAccount]);
        }
        setSelectAll(!selectAll);
    };

    // 단일 선택 체크박스 선택 또는 해제
    const handleSingleSelect = (account) => {
        if (selectedAccount.includes(account)) {
          setSelectedAccount(selectedAccount.filter((m) => m !== account));
        } else {
          setSelectedAccount((prevSelectedAccount) => [...prevSelectedAccount, account]);
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
              거래처 정보 수정
            </Typography>
            <TextField
                label="거래처명"
                variant="outlined"
                type='text'
                value={editingAccount?.accountName || ''}
                onChange={(e) => setEditingAccount({ ...editingAccount, accountName: e.target.value })}
                fullWidth
                margin="normal"
                required
            />
            <TextField
              label="대표자"
              variant="outlined"
              type='text'
              value={editingAccount?.representative || ''}
              onChange={(e) => setEditingAccount({ ...editingAccount, representative: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="전화번호"
              variant="outlined"
              type='text'
              value={editingAccount?.contactNumber || ''}
              onChange={(e) => setEditingAccount({ ...editingAccount, contactNumber: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
                label="사업자번호"
                variant="outlined"
                type='text'
                value={editingAccount?.businessNumber || ''}
                onChange={(e) => setEditingAccount({ ...editingAccount, businessNumber: e.target.value })}
                fullWidth
                margin="normal"
                required
              >
            </TextField>
              
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={handleUpdateAccount}>
                수정
              </Button>
              <Button variant="contained" color="error" onClick ={handleCloseEditModal}>
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
            <Typography variant="h6" style={{ fontSize: '18px', marginBottom: '20px' }}>신규 거래처 추가</Typography>
            <TextField
                label="거래처명"
                variant="outlined"
                type='text'
                onChange={(e) => {
                    const value = e.target.value;
                    setNewAccount((prevAccount) => ({
                        ...prevAccount,
                        accountName: value
                    }));
                    setAccountNameError(handleInputValidation(value, 20));
                }}
                fullWidth
                margin="normal"
                required
                error={accountNameError}
                helperText={accountNameError ? "20글자를 넘길 수 없습니다." : ""}
            />

            <TextField
                label="대표자"
                variant="outlined"
                type='text'
                onChange={(e) => {
                    const value = e.target.value;
                    setNewAccount((prevAccount) => ({
                        ...prevAccount,
                        representative: value
                    }));
                    setRepresentativeError(handleInputValidation(value, 10));
                }}
                fullWidth
                margin="normal"
                required
                error={representativeError}
                helperText={representativeError ? "10글자를 넘길 수 없습니다." : ""}
            />

            <TextField
                label="전화번호"
                variant="outlined"
                type="text"
                onChange={(e) => {
                    const value = e.target.value;
                    const isError = handlePhoneNumberValidation(value, (formattedNumber) => {
                        setNewAccount((prevAccount) => ({
                            ...prevAccount,
                            contactNumber: formattedNumber
                        }));
                        setContactNumberError(false);
                    });
                    setContactNumberError(isError);
                }}
                fullWidth
                margin="normal"
                required
                error={contactNumberError}
                helperText={contactNumberError ? "전화번호를 다시 확인해주세요." : ""}
            />
            <TextField
                label="사업자번호"
                variant="outlined"
                type="text"
                onChange={(e) => {
                  const value = e.target.value;
                  setNewAccount((prevAccount) => ({
                      ...prevAccount,
                      businessNumber: value
                  }));
                  setBusinessNumberError(handleInputValidation(value, 20));
              }}
                fullWidth
                margin="normal"
                required
                error={businessNumberError}
                helperText={businessNumberError ? "15글자를 넘길 수 없습니다." : ""}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={handleSaveNewAccount}>
                추가
              </Button>
              <Button variant="contained" color="error" onClick={handleCloseModal}>
                취소
              </Button>
            </Box>
          </div>
        </Paper>
    </Modal>

        {/* 화면단 코드 start */}
        <DashboardCard>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 5}}>
              
              <Typography variant="h4" component="div" style={{ display: 'flex', alignItems: 'center' }}>
                  <IconCopy style={{ marginRight: '8px' }} />
                  거래처관리
              </Typography>
                <Box>
                    <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mr: 2 }}>
                        조회
                    </Button>
                    <Button variant="contained" color="primary" onClick={openAddNewAccountForm} sx={{ mr: 2 }}>
                        신규등록
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDeleteAccount}>
                        삭제
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    거래처코드
                </Typography>
                <TextField label="거래처코드" variant="outlined" type='number' size="small" sx={{ mr: 2 }} value={searchCode} onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={handleEnterKeyPress} />
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    거래처명
                </Typography>
                <TextField label="거래처명" variant="outlined" size="small" sx={{ mr: 2 }} value={searchName} onChange={(e) => setSearchName(e.target.value)} 
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
                                    거래처코드
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6" fontWeight={600}>
                                    거래처명
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6" fontWeight={600}>
                                    대표자
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6" fontWeight={600}>
                                    전화번호
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6" fontWeight={600}>
                                    사업자번호
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {currentAccount.map((realAccount) => (
                            <TableRow key={realAccount.accountNo}
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                    cursor: 'pointer'
                                }
                            }}
                            onClick={() => {
                              setEditingAccount({ ...realAccount }); // 선택한 거래처 데이터를 설정합니다.
                              setIsEditModalOpen(true); // 수정 모달을 엽니다.
                          }}>
                                <TableCell>
                                  <Checkbox
                                      checked={selectedAccount.includes(realAccount)}
                                      onClick={(event) => {
                                          event.stopPropagation();
                                          handleSingleSelect(realAccount);
                                      }}
                                  />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={400}>
                                        {realAccount.accountNo}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={400}>
                                                {realAccount.accountName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={400}>
                                        {realAccount.representative}
                                    </Typography>
                                </TableCell>
                
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={400}>
                                        {realAccount.contactNumber}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={400}>
                                        {realAccount.businessNumber}
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

export default Account;
