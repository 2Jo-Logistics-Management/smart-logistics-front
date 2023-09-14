import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { 
  Typography,
  Checkbox,
  IconButton,
  Tooltip,
  Modal, 
  Paper, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  alpha,
  Button,
  TextField,
} from '@mui/material';
import { IconCopy, IconList, IconRefresh } from '@tabler/icons';

const Account = () => {

    const [alertMessage, setAlertMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('accountCode');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [currentAccount, setCurrentAccount] = useState([]);
    const [accountList, setAccountList] = useState([]);

    // 거래처 이름, 거래처 코드 검색
    const [searchName, setSearchName] = useState('');
    const [searchCode, setSearchCode] = useState('');

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

     // Enter시 검색
    const handleEnterKeyPress = (event) => {
      if (event.key === 'Enter') {
          handleSearch();
      }
    };

    // INSERT 취소버튼시 함수
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelected([]); // 선택된 거래처들을 모두 해제
      window.location.reload();
      };

    // DELETE 취소버튼시 함수
    const cancelDeleteAccount = () => {
      setDeleteConfirmationOpen(false);
      setSelected([]); // 선택된 항목 초기화
    };

    // MODIFY 취소버튼시 함수
    const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      setSelected([]); // 선택된 멤버들을 모두 해제
    };
    
    // 삭제 모달창
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    // 신규등록 모달변수
    const openAddNewAccountForm = () => {
      setNewAccount({
      accountName: '',
      representative: '',
      contactNumber: '',
      businessNumber: '',
      });
      setIsModalOpen(true);
    };

    const updateAccountList = response => {
      setAccountList(response.data.data);
      setCurrentAccount(response.data.data);
    };


    function descendingComparator(a, b, orderBy) {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }

    function getComparator(order, orderBy) {
      return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
          return order;
        }
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    }



    const headCells = [
      {
        id: 'accountCode',
        numeric: false,
        disablePadding: false,
        label: '거래처코드',
      },
      {
        id: 'accountName',
        numeric: false,
        disablePadding: true,
        label: '거래처명',
      },
      {
        id: 'representative',
        numeric: false,
        disablePadding: true,
        label: '대표자',
      },
      {
        id: 'contactNumber',
        numeric: true,
        disablePadding: false,
        label: '전화번호',
      },
      {
        id: 'businessNumber',
        numeric: true,
        disablePadding: false,
        label: '사업자번호',
      },
    ];

    function EnhancedTableHead(props) {
      const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
      const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
      };

      return (
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                inputProps={{
                  'aria-label': 'select all desserts',
                }}
              />
            </TableCell>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === headCell.id ? order : false}
                sx={{
                  fontSize: 'h6.fontSize', // 글자 크기를 h6로 설정
                  fontWeight: 600, // 글꼴 두께를 600으로 설정
                }}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      );
    }

    EnhancedTableHead.propTypes = {
      numSelected: PropTypes.number.isRequired,
      onRequestSort: PropTypes.func.isRequired,
      onSelectAllClick: PropTypes.func.isRequired,
      order: PropTypes.oneOf(['asc', 'desc']).isRequired,
      orderBy: PropTypes.string.isRequired,
      rowCount: PropTypes.number.isRequired,
    };

    function EnhancedTableToolbar(props) {
      const { numSelected } = props;

      return (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
          }}
        >
          {numSelected > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
          ) : 
            null}

          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton onClick={setDeleteConfirmationOpen}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
              <IconButton sx={{ marginLeft: 'auto' }}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      );
    }

    EnhancedTableToolbar.propTypes = {
      numSelected: PropTypes.number.isRequired,
    };

    // 데이터 새로고침 함수
    const handleRefresh = () => {
      axios.get('http://localhost:8888/api/account/list')
        .then(updateAccountList)
        setSelected([]); // 선택된 거래처들을 모두 해제
    };

    // 조회조건 axios
    const handleSearch = () => {
      const queryParams = [];
  
      if (searchCode) {
          queryParams.push(`accountCode=${searchCode}`);
      }
      if (searchName) {
          queryParams.push(`accountName=${searchName}`);
      }
  
      const queryString = queryParams.join('&');
  
      axios.get(`http://localhost:8888/api/account/list?${queryString}`)
          .then(response => {
              setAccountList(response.data.data);
              setCurrentAccount(response.data.data);
          })
          .catch(error => {
              // 처리할 에러 핸들링 코드 추가
          });
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
      // 중복체크 axios
      const handleCheckDuplicateId = () => {
        const accountCode = newAccount.accountCode || null; // 값이 없으면 null 할당
        
        if (!accountCode) {
          setAlertMessage('거래처코드를 입력하세요.');
          return;
        }
        axios.get(`http://localhost:8888/api/account/checkAccountCode/${accountCode}`)
          .then(response => {
            const isDuplicate = response.data.data;
            if (isDuplicate) {
              // 중복된 거래처코드가 존재하는 경우
              setAlertMessage('이미 존재하는 거래처코드 입니다.');
            } else {
              // 중복된 거래처코드가 존재하지 않는 경우
              setAlertMessage('사용 가능한 거래처코드 입니다.');
            }
          })
          .catch();
      };

      // DELETE axios
      const handleDeleteConfirmed  = () => {
        axios
          .delete('http://localhost:8888/api/account/delete', {
            data: selected,
          })
          .then(() => {
            // 삭제 성공한 경우

            // 서버에서 다시 데이터를 가져온 후 업데이트
            axios.get('http://localhost:8888/api/account/list').then((response) => {
              setAccountList(response.data.data);
              setCurrentAccount(response.data.data);
            });

            setDeleteConfirmationOpen(false);
            window.location.reload();
            setSelected([]); // 선택된 항목 초기화
          })
          .catch((error) => {
            console.error('삭제 중 오류 발생:', error);
          });
      };

      // INSERT axios
      const handleSaveNewAccount = () => {
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
            axios.get('http://localhost:8888/api/account/list').then(updateAccountList);
            setIsModalOpen(false);
          })
          .catch((error) => {
            console.error(error);
          });
      };

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

  

      const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };

      const getSortedData = () => {
        const comparator = getComparator(order, orderBy);
        return stableSort(currentAccount, comparator);
      };

      const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelected = currentAccount.map((n) => n.accountNo);
          setSelected(newSelected);
        } else {
          setSelected([]);
        }
      };

      const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
      
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
      
        setSelected(newSelected);
      };

      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };

      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

      const handleChangeDense = (event) => {
        setDense(event.target.checked);
      };

      const isSelected = (name) => selected.indexOf(name) !== -1;

      const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - currentAccount.length) : 0;

        const visibleRows = React.useMemo(
          () => getSortedData().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
          [order, orderBy, page, rowsPerPage, currentAccount],
        );
        const tableBodyStyle = {
          overflowY: 'auto', // 세로 스크롤 추가
        };
        

  return (
    <>

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
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <TextField
                label="거래처코드"
                variant="outlined"
                type='text'
                onChange={(e) => {
                    const value = e.target.value;
                    setNewAccount((prevAccount) => ({
                        ...prevAccount,
                        accountCode: value
                    }));
                    setAccountNameError(handleInputValidation(value, 20));
                }}
                fullWidth
                margin="normal"
                required
                error={alertMessage.includes('이미 존재하는 거래처코드')}
                helperText={alertMessage}
            />
                <Button variant="outlined" color="primary" onClick={handleCheckDuplicateId} style={{ marginLeft: '10px', flex: 1 }} >
                          중복 체크
                </Button>
            </div>
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
      <Paper className="modal-paper" style={{ padding: '20px', width: '400px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <Typography variant="h6" style={{ fontSize: '18px', marginBottom: '20px' }}>
              거래처 삭제
            </Typography>
            <IconButton aria-label="닫기" onClick={cancelDeleteAccount}>
              <CloseIcon />
            </IconButton>
          </div>
          <Typography variant="body1" style={{ marginBottom: '20px' }}>
            선택한 거래처를 삭제하시겠습니까?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleDeleteConfirmed}>
              삭제
            </Button>
          </Box>
        </div>
      </Paper>
    </Modal>

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
                label="거래처코드"
                variant="outlined"
                type='text'
                value={editingAccount?.accountCode || ''}
                onChange={(e) => setEditingAccount({ ...editingAccount, accountCode: e.target.value })}
                fullWidth
                margin="normal"
                required
            />
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


    {/* 화면단 START */}      
    <Box sx={{ width: '100%', padding:'10px' }}>
      <Paper elevation={1} sx={{ width: '100%', mb: 1, padding: '16px 5px 40px 16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 5}}>
          
          <Typography variant="h4" component="div" style={{ display: 'flex', alignItems: 'center' }}>
              <IconCopy style={{ marginRight: '8px' }} />
              거래처관리
          </Typography>
            <Box>
                <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                    조회
                </Button>
                <Button variant="outlined" color="primary" onClick={openAddNewAccountForm} sx={{ mr: 2 }}>
                    신규등록
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
      </Paper>
    </Box>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
      }}>
      <Typography
          variant="h6"
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 0px 0px 10px', // 위쪽 패딩 추가
          }}
        >             
        <IconList style={{ fontSize: '1rem', marginRight: '8px' }} /> {/* 아이콘 크기 조절 */}
        거래처 목록
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRefresh}
        sx={{
          ml: 2,
          width: '12px', // 버튼의 너비를 조절
          height: '30px', // 버튼의 높이를 조절
          marginRight: '12px',
        }}
      >
        <IconRefresh />
      </Button> 
    </div>
    <Box sx={{ width: '100%', padding:'10px' }}>
      <Paper elevation={3} sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            style={{ tableLayout: 'fixed' }} // 테이블 너비 고정
            
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={currentAccount.length}
            />
            <TableBody sx={tableBodyStyle}>
              {visibleRows.map((realAccount, index) => {
                const isItemSelected = isSelected(realAccount.accountNo);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={() => {
                      setEditingAccount({ ...realAccount }); // 선택한 거래처 데이터를 설정합니다.
                      setIsEditModalOpen(true); // 수정 모달을 엽니다.
                    }}
                    tabIndex={-1}
                    key={realAccount.accountNo}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        onClick={(event) => {
                          event.stopPropagation();
                          handleClick(event, realAccount.accountNo)}}
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        fontSize: 'subtitle2.fontSize', // 글자 크기를 subtitle2로 설정
                        fontWeight: 400, // 글꼴 두께를 400으로 설정
                      }}
                    >
                      {realAccount.accountCode}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      sx={{
                        fontSize: 'subtitle2.fontSize', // 글자 크기를 subtitle2로 설정
                        fontWeight: 400, // 글꼴 두께를 400으로 설정
                      }}
                    >
                      {realAccount.accountName}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      sx={{
                        fontSize: 'subtitle2.fontSize', // 글자 크기를 subtitle2로 설정
                        fontWeight: 400, // 글꼴 두께를 400으로 설정
                      }}
                    >
                      {realAccount.representative}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: 'subtitle2.fontSize', // 글자 크기를 subtitle2로 설정
                        fontWeight: 400, // 글꼴 두께를 400으로 설정
                      }}
                    >
                      {realAccount.contactNumber}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: 'subtitle2.fontSize', // 글자 크기를 subtitle2로 설정
                        fontWeight: 400, // 글꼴 두께를 400으로 설정
                      }}
                    >
                      {realAccount.businessNumber}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={currentAccount.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
    </>
  );
};

export default Account;