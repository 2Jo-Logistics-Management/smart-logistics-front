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
    Modal,
    Paper,
    Snackbar,
    Alert,
    Checkbox,
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';

const Account = () => {

    const [currentAccount, setCurrentAccount] = useState([]);
    const [accountList, setAccountList] = useState([]);

    const [searchName, setSearchName] = useState('');
    const [searchNo, setSearchNo] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    // 체크박스 관련 state
    const [selectedAccount, setSelectedAccount] = useState([]);

    // 전체 선택 체크박스 관련 state
    const [selectAll, setSelectAll] = useState(false);

    // 삭제 알림창 
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    
    // 수정 관련 state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    // 수정 중복선택 경고 alert창
    const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);


    const [newAccount, setNewAccount] = useState({
        accountName: '',
        representative: '',
        contactNumber: '',
        businessNumber: '',
    });

    // 거래처번호, 거래처명 검색기능
    const handleSearch = () => {
        const filteredAccount = accountList.filter((account) => {
          const nameMatches = account.accountName.includes(searchName);
          const noMatches = account.accountNo.includes(searchNo);
          return nameMatches && noMatches;
        });
      
        setCurrentAccount(filteredAccount);
      };

    const handleCloseEditModal = () => {
        setSelectedAccount([]); // 선택된 멤버들을 모두 해제
        setIsEditModalOpen(false);
    };
 

    // 수정 중복선택 경고 alert창    
    const handleEditAccount = () => {
        if (selectedAccount.length !== 1) {
          setIsSnackbarVisible(true); // Show the snackbar
          return;
        }
    
        setEditingAccount({ ...selectedAccount[0] });
        setIsEditModalOpen(true);
    };

    // LIST axios
    useEffect(() => {
    axios.get('http://localhost:8888/api/account/list')
      .then(response => {
        setAccountList(response.data.data);
        setCurrentAccount(response.data.data);
      })
      .catch();
    }, []);

    const updateAccountList = response => {
        setAccountList(response.data.data);
        setCurrentAccount(response.data.data);
      };

    // INSERT axios
    const handleSaveNewAccount = () => {
        if (newAccount.accountName && newAccount.representative && newAccount.contactNumber && newAccount.businessNumber) {
          axios.post('http://localhost:8888/api/account/insert', newAccount)
            .then(response => {
              axios.get('http://localhost:8888/api/account/list')
                .then(updateAccountList)
              setIsModalOpen(false);
            })
            .catch();
        } else {
          console.log("모든 필드를 입력하세요.");
        }
    };

    // DELETE axios
    const confirmDeleteAccount = () => {
        let accountNoArr = selectedAccount.map(item => item.accountNo);
        axios.delete('http://localhost:8888/api/account/delete', {
          data: accountNoArr
        })
          .then(() => {
            console.log(accountNoArr);
            axios.get('http://localhost:8888/api/account/list')
              .then(updateAccountList)
              .catch();
            setDeleteConfirmationOpen(false);
            window.location.reload(); // 삭제가 완료되면 페이지 새로고침
          })
          .catch();
      };

      // MODIFY axios
    const handleUpdateAccount = () => {
        if (editingAccount.accountName && editingAccount.representative && editingAccount.contactNumber && editingAccount.businessNumber) {
          axios.patch(`http://localhost:8888/api/account/modify?accountNo=${editingAccount.accountNo}`, editingAccount)
            .then(response => {
              setIsEditModalOpen(false);
              axios.get('http://localhost:8888/api/account/list')
                .then(updateAccountList)
                .catch();
              window.location.reload(); // 수정이 완료되면 페이지 새로고침
            })
            .catch();
        } else {
          console.log("모든 필드를 입력하세요.");
        }
    };

    const handleDeleteAccount = () => {
        if (selectedAccount.length === 0) {
          console.log("선택된 거래처가 없습니다.");
          return;
        }
      
        setDeleteConfirmationOpen(true);
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
    
    const handlerSetInputData = (state, data) => {
        setNewAccount(prevAccount => ({
          ...prevAccount,
          [state]: data
        }));
    };

    const cancelDeleteAccount = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleCloseModal = () => {
    setIsModalOpen(false);
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
              label="거래처번호"
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
        onClose={cancelDeleteAccount}
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
            선택한 거래처 삭제
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '20px' }}>
            선택한 거래처를 삭제하시겠습니까?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={confirmDeleteAccount}>
                삭제
            </Button>
            <Button variant="contained" color="error" onClick={cancelDeleteAccount}>
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
              onChange={(e) => handlerSetInputData('accountName',e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="대표자"
              variant="outlined"
              type='text'
              onChange={(e) => handlerSetInputData('representative',e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="거래처번호"
              variant="outlined"
              type="text"
              onChange={(e) => handlerSetInputData('contactNumber',e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="사업자번호"
              variant="outlined"
              type="text"
              onChange={(e) => handlerSetInputData('businessNumber',e.target.value)}
              fullWidth
              margin="normal"
              required
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
                하나의 거래처만 선택해주세요.
            </Typography>
        </Alert>
    </Snackbar>

        <DashboardCard>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" component="div">
                    거래처관리
                </Typography>
                <Box>
                    <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mr: 2 }}>
                        조회
                    </Button>
                    <Button variant="contained" color="info" onClick={handleEditAccount} sx={{ mr: 2 }}>
                        수정
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDeleteAccount} sx={{ mr: 2 }}>
                        삭제
                    </Button>
                    <Button variant="contained" color="primary" onClick={openAddNewAccountForm}>
                        신규
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    거래처번호
                </Typography>
                <TextField label="거래처번호" variant="outlined" size="small" sx={{ mr: 2 }} value={searchNo} onChange={(e) => setSearchNo(e.target.value)} />
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    거래처명
                </Typography>
                <TextField label="거래처명" variant="outlined" size="small" sx={{ mr: 2 }} value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            </Box>
        </DashboardCard>

        <DashboardCard>
            <Box sx={{ overflow: 'auto', maxHeight: '650px' }}>
                <Table
                aria-label="simple table"
                sx={{
                    whiteSpace: 'nowrap',
                    mt: 2
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
                                    거래처번호
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
                                    거래처번호
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6" fontWeight={600}>
                                    사업자번호
                                </Typography>
                            </TableCell>
                            <TableCell></TableCell>
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
                            onClick={() => handleSingleSelect(realAccount)}>
                                <TableCell>
                                    <Checkbox
                                    checked={selectedAccount.includes(realAccount)}
                                    onChange={() => handleSingleSelect(realAccount)}
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
