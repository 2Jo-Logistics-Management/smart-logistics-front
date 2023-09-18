  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import CloseIcon from '@mui/icons-material/Close';
  import PropTypes from 'prop-types';
  import FormControlLabel from '@mui/material/FormControlLabel';
  import Switch from '@mui/material/Switch';
  import DeleteIcon from '@mui/icons-material/Delete';
  import FilterListIcon from '@mui/icons-material/FilterList';
  import { visuallyHidden } from '@mui/utils';
  import { Avatar, Grid, MenuItem } from '@mui/material'; // Select와 MenuItem 추가
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
    TableRow,
    TableSortLabel,
    Toolbar,
    alpha,
    Button,
    TextField,
  } from '@mui/material';
  import { IconCopy, IconList, IconListDetails, IconRefresh } from '@tabler/icons';
  axios.defaults.withCredentials = true;


  const Member = () => {

    // 정렬 변수선언
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('memberNo');
    const [selected, setSelected] = React.useState([]);
    const [dense, setDense] = React.useState(false);

    const [currentMember, setCurrentMember] = useState([]);
    const [memberList, setMemberList] = useState([]);

    const [searchName, setSearchName] = useState('');
    const [searchId, setSearchId] = useState('');

    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertOpen, setIsAlertOpen] = useState(false); // Alert 창을 표시할지 여부

    const [isModalOpen, setIsModalOpen] = useState(false);

    // 체크박스 관련 state
    const [selectedMembers, setSelectedMembers] = useState([]);

    // 삭제 알림창 
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    
    // 수정 관련 state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    // 관리자 삭제 금지 기능
    const [deletionInProgress, setDeletionInProgress] = useState(false);

    const [selectedMemberDetail, setSelectedMemberDetail] = useState(null);

    const [originalData, setOriginalData] = useState(null);

    const [newMember, setNewMember] = useState({
      memberName: '',
      memberId: '',
      password: '',
      memberRole: '',
      createDate: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
      memberName: '',
      memberId: '',
      memberRole: '',
      createDate: '',
    });

    // 수정 버튼 클릭 시 편집 모드로 전환
    const handleEditClick = () => {
      setIsEditing(true);
      setOriginalData({ ...selectedMemberDetail });
      setEditedData({
        memberName: selectedMemberDetail.memberName,
        memberId: selectedMemberDetail.memberId,
        memberRole: selectedMemberDetail.memberRole,
        createDate: selectedMemberDetail.createDate,
      });
    };

    // 되돌리기 버튼 클릭 시 원래 데이터로 복원
    const handleCancelClick = () => {
      setIsEditing(false);
      setEditedData({ ...originalData });
    };

    
    // 입력 필드 변경 시 상태 업데이트
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedData({
        ...editedData,
        [name]: value,
      });
    };

    // Enter시 검색
    const handleEnterKeyPress = (event) => {
      if (event.key === 'Enter') {
          handleSearch();
      }
    };

    // INSERT 취소버튼시 함수
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedMembers([]); // 선택된 멤버들을 모두 해제
      window.location.reload();
    };

    // DELETE 취소버튼시 함수
    const cancelDeleteMembers = () => {
      setDeleteConfirmationOpen(false);
      setSelectedMembers([]); // 선택된 멤버들을 모두 해제
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
        id: 'memberNo',
        numeric: false,
        disablePadding: false,
        label: '사원번호',
      },
      {
        id: 'memberName',
        numeric: false,
        disablePadding: true,
        label: '사원이름',
      },
      {
        id: 'memberId',
        numeric: false,
        disablePadding: true,
        label: '아이디',
      },
    ];

 

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
      if (selected.includes(1)) {
        setAlertMessage('관리자 계정은 삭제할 수 없습니다.');
        return;
      }
      setDeletionInProgress(true); // Mark deletion process as initiated
      axios.delete('http://localhost:8888/api/member/delete', {  
        data: selected,    
      })
        .then(() => {
          
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

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const getSortedData = () => {
      const comparator = getComparator(order, orderBy);
      return stableSort(currentMember, comparator);
    };

    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelected = currentMember.map((n) => n.memberNo);
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

    const handleChangeDense = (event) => {
      setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // 정렬
    const visibleRows = React.useMemo(
      () => getSortedData(),
      [order, orderBy, currentMember],
    );

    const tableBodyStyle = {
      overflowY: 'auto', // 세로 스크롤 추가
    };

    const leftGridStyle = {
      overflow: 'auto',
      maxHeight: '550px',

    };

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

    // Enhance 함수
    EnhancedTableHead.propTypes = {
      numSelected: PropTypes.number.isRequired,
      onRequestSort: PropTypes.func.isRequired,
      onSelectAllClick: PropTypes.func.isRequired,
      order: PropTypes.oneOf(['asc', 'desc']).isRequired,
      orderBy: PropTypes.string.isRequired,
      rowCount: PropTypes.number.isRequired,
    };
  

    return (
      <>
      
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
                  ) : selected.includes(1) ? (
                      <Typography variant="body1" style={{ marginBottom: '20px', color: 'red', fontWeight: 'bold' }}>
                          관리자 계정은 삭제할 수 없습니다.
                      </Typography>
                  ) : (
                      <>
                          <Typography variant="body1" style={{ marginBottom: '20px' }}>
                              선택한 회원을 삭제하시겠습니까?
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                              {!selected.includes(1) && (
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

      <Box sx={{ width: '100%', padding:'10px' }}>
        <Paper sx={{ width: '100%', mb: 1, padding: '16px 5px 40px 16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 5}}>
            <Typography variant="h4" component="div" style={{ display: 'flex', alignItems: 'center' }}>
                <IconCopy style={{ marginRight: '8px' }} />
                사원관리
            </Typography>
            <Box>
              <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mr: 2 }}>
                조회
              </Button>
              <Button variant="outlined" color="primary" onClick={openAddNewMemberForm} sx={{ mr: 2 }}>
                신규등록
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
            <Typography variant="subtitle2" sx={{ mr: 1 }}>
              사원 이름
            </Typography>
            <TextField label="사원 이름" variant="outlined" size="small" sx={{ mr: 2 }} value={searchName} onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={handleEnterKeyPress} />
            <Typography variant="subtitle2" sx={{ mr: 1 }}>
              아이디
            </Typography>
            <TextField label="아이디" variant="outlined" size="small" sx={{ mr: 2 }} value={searchId} onChange={(e) => setSearchId(e.target.value)} 
            onKeyDown={handleEnterKeyPress} />
          </Box>
      </Paper>
      </Box>
      <Box>
        {/* 왼쪽그리드 */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
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
                  marginRight: '8px',
                }}
              >
                <IconRefresh />
              </Button>
              
            </div>

            <Box sx={{ width: '100%', padding:'10px' }}>
              <Paper sx={ leftGridStyle }>
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
                      rowCount={currentMember.length}

                    />
                    <TableBody sx={tableBodyStyle}>
                      {visibleRows.map((realMember, index) => {
                        const isItemSelected = isSelected(realMember.memberNo);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={() => handleSingleSelect(realMember)}
                            tabIndex={-1}
                            key={realMember.memberNo}
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleClick(event, realMember.memberNo)}}
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
                              {realMember.memberNo}
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
                              {realMember.memberName}
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
                              {realMember.memberId}
                            </TableCell>
                          </TableRow>
                        );
                      })}     
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
              />
            </Box>
          </Grid>
          {/* 오른쪽 그리드 */}
          <Grid item xs={12} md={6}>
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
            </Typography>
            <Box sx={{ width: '100%', padding:'10px' }}>
              <Paper sx={{ width: '100%', mb: 2 }}>
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
                    height: '417px',
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
                  {isEditing ? (
                    // 수정 모드에서 편집할 데이터 표시
                    <div>
                      <TextField
                        label="이름"
                        name="memberName"
                        value={editedData.memberName}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      <TextField
                        label="아이디"
                        name="memberId"
                        value={editedData.memberId}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      <TextField
                        label="사용자 권한"
                        name="memberRole"
                        value={editedData.memberRole}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      <TextField
                        label="생성 일자"
                        name="createDate"
                        value={editedData.createDate}
                        onChange={handleInputChange}
                        fullWidth
                      />
                    </div>
                  ) : (
                    
                    // 읽기 모드에서 데이터 표시
                    <div>
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
                    </div>
                  )}
                  {isEditing ? (
                    // 수정 모드에서 적용과 되돌리기 버튼 표시
                    <div>
                      <Button variant="contained" onClick={handleUpdateMember}>적용</Button>
                      <Button variant="outlined" onClick={handleCancelClick}>되돌리기</Button>
                    </div>
                  ) : (
                    // 읽기 모드에서 수정 버튼 표시
                    <Button variant="outlined" onClick={handleEditClick}>수정</Button>
                  )}
                </Paper>
              )}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>

      </>
    );
};

  export default Member;
