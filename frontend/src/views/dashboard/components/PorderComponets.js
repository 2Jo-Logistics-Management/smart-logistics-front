import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Button,
  Checkbox,
  Pagination,
  TableFooter,
  Dialog,
  DialogTitle,
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import swal from 'sweetalert2';
import { Edit, Delete, Save } from '@mui/icons-material';
import PorderComponets2 from './PorderComponents2';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_SELECTED_PRODUCT, REMOVE_SELECTED_PRODUCT, REMOVE_ALL_SELECTED_PRODUCTS } from '../../../redux/slices/selectedProductsReducer';
import pOrderDeleteAxios from '../../../axios/pOrderDeleteAxios';
import { open_Modal } from '../../../redux/slices/porderModalDuck';
import { seletedPOrderList } from '../../../redux/thunks/SelectedPOrderList';
import { fetchProducts } from '../../../redux/thunks/fetchProduct'; // fetchProducts 함수 임포트
import PorderModal from './modal/PorderModal';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ko from 'date-fns/locale/ko';
import { searchPOrderList } from '../../../redux/thunks/searchPOrderList';
import Loading from '../../../loading';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { removePOrderInfo } from '../../../redux/slices/pOrderInfoCheckboxReducer';
import pOrderItemsDeleteAxios from 'src/axios/pOrderItemsDeleteAxios';
import { useLocation } from 'react-router';
import { resetRecentPOrderNumber } from '../../../redux/slices/searchRecentPOrderNumber';


const PorderComponets = () => {
  const dispatch = useDispatch();
  const [selectAll, setSelectAll] = useState(false);
  const porderModalState = useSelector((state) => state.porderModal.openModal);
  const location = useLocation();

  useEffect(() => {
    if (!porderModalState) {
      dispatch(fetchProducts());
    }
    dispatch(resetRecentPOrderNumber());
  }, [porderModalState, dispatch]);

  useEffect(() => {
    dispatch(resetRecentPOrderNumber());
  }, [location])

  const selectedProducts = useSelector((state) => state.selectedProduct.selectedProduct);
  const productsData = useSelector((state) => state.pOrderList.products);
  const products = JSON.parse(JSON.stringify(productsData));
  const realProducts = products?.data || [];;
  const recentPOrderNumber = useSelector((state) =>
    state.recentPOrderNumber && state.recentPOrderNumber.recentPOrderNumber
      ? state.recentPOrderNumber.recentPOrderNumber
      : []
  );
  const [porderCodeState, setPorderCodeState] = useState("");
  useEffect(() => {
    if (recentPOrderNumber.data) {
      // console.log("Setting porderCodeState with", recentPOrderNumber.data[0].porderCode); // for debugging
      setPorderCodeState(recentPOrderNumber.data[0].porderCode);
      const totalPages = Math.ceil(realProducts.length / ITEMS_PER_PAGE);
      setCurrentPage(totalPages - 1);
    }
  }, [recentPOrderNumber]);





  const handleInsert = () => {
    dispatch(open_Modal());
  };
  const underSelectedPOrder = useSelector((state) => state.pOrderInfoCheckbox.selectedCheckBox);// 밑에 selectbox값
  const selectedPOrderNumbers = useSelector((state) => state.selectedPOrderList.selectedPOrderList)
  // const selectedPOrderNumber = selectedPOrderNumbers.data[0].porderCode

  const selectedPOrderNumber = selectedPOrderNumbers.data ? selectedPOrderNumbers.data[0]?.porderCode || [] : [];

  const handleCheckboxChange = (event, productId) => {
    if (event.target.checked) {
      if (selectedPOrderNumber) {
        dispatch(removePOrderInfo(selectedPOrderNumber));
        dispatch(dispatch(ADD_SELECTED_PRODUCT(productId)));
      } else {
        dispatch(dispatch(ADD_SELECTED_PRODUCT(productId)));
      }
    } else {
      dispatch(REMOVE_SELECTED_PRODUCT(productId));
    }
  };

  const handleDelete = () => {
    swal
      .fire({
        title: '정말로 삭제하시겠습니까?',
        text: '삭제된 데이터는 복구할 수 없습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085',
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
      })
      .then(() => {
        // console.log(selectedPOrderNumber)
        try {
          if (selectedProducts.length >= 0 && underSelectedPOrder.length === 0) {
            pOrderDeleteAxios(selectedProducts);
            dispatch(REMOVE_ALL_SELECTED_PRODUCTS());
            window.location.reload();
          } else if (selectedProducts.length === 0 && underSelectedPOrder.length >= 0) {
            pOrderItemsDeleteAxios(selectedPOrderNumber, underSelectedPOrder)
            window.location.reload();
          }
        } catch (error) {
          swal.fire({
            title: "삭제 실패",
            text: `Error: ${error.message}`,
            icon: "error",
          });
        }


      });
  };

  // const hadldEidt = () =>{
  //   swal.fire
  // }

  const [tableRowClickValue, setTableRowClickValue] = useState("");
  // 여기에 수정
  useEffect(() => {
    if (tableRowClickValue) {
      dispatch(seletedPOrderList(tableRowClickValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRowClickValue]);

  const handleSelectAllChange = () => {

    if (selectAll) {
      realProducts.forEach(item => {
        dispatch(REMOVE_SELECTED_PRODUCT(item.porderCode));
        if (selectedPOrderNumber) {
          dispatch(removePOrderInfo(selectedPOrderNumber));
        }
      });
    } else {
      realProducts.forEach(item => {
        dispatch(ADD_SELECTED_PRODUCT(item.porderCode));
        if (selectedPOrderNumber) {
          dispatch(removePOrderInfo(selectedPOrderNumber));
        }
      });
    }
    setSelectAll(!selectAll);
  };

  const [pOrderCode, setPOrderCode] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1);
  };
  function formatDate(receiveDeadline) {
    const { format } = require('date-fns');
    const formattedDate = format(receiveDeadline, 'yyyy-MM-dd');
    return formattedDate
  }
  const handleClick = () => {
    const formatedStartDate = formatDate(startDate);
    const formatedEndDate = formatDate(endDate);
    let timerInterval;
    dispatch(searchPOrderList(accountNo, pOrderCode, formatedStartDate, formatedEndDate))
    swal.fire({
      title: '입고물품 조회중',
      html: '잠시만 기다려주세요',
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        swal.showLoading();
        const b = swal.getHtmlContainer().querySelector('b');
        timerInterval = setInterval(() => {
          b.textContent = swal.getTimerLeft();
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }

    });
  };

  const [editingProduct, setEditingProduct] = useState(null);

  const handleEditStart = (product) => {
    setEditingProduct(product);
  };

  const handleFieldChange = (field, value) => {
    setEditingProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditEnd = () => {
    try {
      const pOrderCode = editingProduct.porderCode
      const pOrderModifyDto =
      {
        manager: editingProduct.manager,
        accountNo: editingProduct.accountNo,
      }
      axios.patch(`http://localhost:8888/api/porder/modify?pOrderCode=${pOrderCode}`, pOrderModifyDto)
        .then(() => {
          window.location.reload();
        })
      setEditingProduct(null);
    } catch (error) {
      swal.fire({
        title: "수정 실패",
        text: "값을 수정해주세요",
        icon: "error",
      });
    }

  };

  // 거래처모달
  const [accountList, setAccountList] = useState([]);
  const [currentAccountPage, setCurrentAccountPage] = useState(1);
  const [accountsPerPage] = useState(6);
  const indexOfLastAccount = currentAccountPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccountList = accountList.slice(indexOfFirstAccount, indexOfLastAccount);
  const [accountModal, setAccountModal] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("")
  useEffect(() => {
    axios.get('http://localhost:8888/api/account/list')
      .then(response => {
        const accountList = response.data.data;
        setAccountList(accountList);
      })
      .catch(error => {
        console.error('에러발생', error);
      });
  }, []);
  const handleAccountRowClick = (accountNo) => {
    setEditingProduct(prev => ({
      ...prev,
      accountNo,
    }));
    setAccountModal(false);

  };
  const handleAccountSearchClick = (searchData) => {

    axios.get(`http://localhost:8888/api/account/list?accountName=${searchData}`)
      .then(response => {
        const AccountSearchData = response.data.data;
        setAccountList(AccountSearchData);
      })
  }

  return (
    <Box style={{ width: '100%' }}>
      <DashboardCard variant="poster" sx={{ Width: '100%' }}>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, padding: '10px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography variant="h4" component="div"> 발주관리시스템</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button onClick={handleClick} variant="contained" size="small" sx={{ marginRight: 1 }}>
              조회
            </Button>
            <Button onClick={handleInsert} variant="contained" size="small" sx={{ marginRight: 1 }}>
              발주생성
            </Button>
            <Button
              variant="outlined"
              size="big"
              startIcon={<Delete />}
              color="error"
              onClick={() => { handleDelete() }}
              disabled={selectedProducts.length === 0 && selectedPOrderNumber.length === 0} // 선택된 상품이 없을 때 버튼 비활성화
            />
          </Box>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ marginRight: '0.5rem' }}>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>발주번호:</Typography>
          </span>
          <TextField label="발주번호" variant="outlined" size="small" value={pOrderCode} onChange={(e) => setPOrderCode(e.target.value)} sx={{ width: '10rem', marginRight: 1 }} />
          <span style={{ marginRight: '0.5rem' }}>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>거래처번호:</Typography>
          </span>
          <TextField label="거래품목 품목" variant="outlined" size="small" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} sx={{ width: '10rem', marginRight: 1 }} />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box display="flex" alignItems="center">
              <Typography sx={{ fontSize: '0.7rem', marginRight: '1rem' }}>기간 설정:</Typography>

              <DatePicker
                label={`시작일`}
                value={startDate}
                onChange={(newDate) => setStartDate(newDate)}
                views={['year', 'month', 'day']}
                format='yyyy-MM-dd'
                slotProps={{ textField: { variant: 'outlined', size: "small" } }}
                minDate={new Date('2000-01-01')}
                maxDate={new Date('2100-12-31')} // Optional: Restrict selection up to the end date
              />
              &nbsp;
                <Typography sx={{ fontSize: '1rem', marginRight: '1rem' }}>~</Typography>
              <DatePicker
                label={`시작일`}
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)}
                views={['year', 'month', 'day']}
                format='yyyy-MM-dd'
                slotProps={{ textField: { variant: 'outlined', size: "small" } }}
                minDate={startDate}
                maxDate={new Date('2100-12-31')} // Optional: Restrict selection up to the end date
              />
            </Box>
          </LocalizationProvider>

        </Box>
        <br />
        <Box sx={{ overflow: 'auto', maxHeight: '400px' }}>
          <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap', mt: 2 }}>
            <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}>
              <TableRow sx={{
                height: '10px'
                , '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }} >
                <TableCell>
                  <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    발주번호
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    거래처번호
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    생성일
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    state
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    담당자
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    수정
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {realProducts.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE).map((realProduct) => (
                <TableRow key={realProduct.porderCode} sx={{
                  backgroundColor: realProduct.porderCode === porderCodeState ? 'lightyellow' : 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
                  onClick={() => { setTableRowClickValue(realProduct.porderCode) }}
                >
                  <TableCell sx={{ padding: 0 }}>
                    <Checkbox
                      checked={selectedProducts.includes(realProduct.porderCode)}
                      onChange={(event) => handleCheckboxChange(event, realProduct.porderCode)}

                    />
                  </TableCell>
                  <TableCell sx={{ padding: 0 }}>
                    <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>{realProduct.porderCode}</Typography>
                  </TableCell>
                  <TableCell sx={{ padding: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box>
                        {editingProduct && editingProduct.porderCode === realProduct.porderCode ? (
                          <TextField
                            value={editingProduct.accountNo}
                            onClick={() => setAccountModal(true)}
                            onChange={(e) => handleFieldChange('accountNo', e.target.value)}
                          />
                        ) : (
                          <Typography variant="subtitle2" fontWeight={600}>
                            {realProduct.accountNo}
                          </Typography>
                        )}
                        <Typography color="textSecondary" sx={{ fontSize: '13px' }}>
                          물류관리자
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ padding: 0 }}>
                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                      {realProduct.createDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={realProduct.state}
                      sx={{
                        px: '4px',
                        color: 'white', // 텍스트 색상
                        backgroundColor: (theme) => {
                          switch (realProduct.state) {
                            case '준비':
                              return theme.palette.primary.main;
                            case '진행 중':
                              return theme.palette.info.main;
                            case '완료':
                              return theme.palette.error.main;
                            default:
                              return 'defaultColor'; // 기본 색상
                          }
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ padding: 0 }}>
                    {editingProduct && editingProduct.porderCode === realProduct.porderCode ? (
                      <TextField
                        value={editingProduct.manager}
                        onChange={(e) => handleFieldChange('manager', e.target.value)}
                      />
                    ) : (
                      <Typography variant="h6">{realProduct.manager}</Typography>
                    )}
                  </TableCell>

                  <TableCell align="right" sx={{ padding: 0 }}>
                    {realProduct.state === "준비" ? (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={editingProduct && editingProduct.porderCode === realProduct.porderCode ? <Save /> : <Edit />}
                        color="success"
                        onClick={() => {
                          if (editingProduct && editingProduct.porderCode === realProduct.porderCode) {
                            handleEditEnd();
                          } else {
                            handleEditStart(realProduct);
                          }
                        }}
                      >
                        {editingProduct && editingProduct.porderCode === realProduct.porderCode ? '저장' : '수정'}
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        color="error"
                        disabled
                      >
                        수정
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
          {realProducts.length ? (
            <Pagination
              count={Math.ceil(realProducts.length / ITEMS_PER_PAGE)}
              page={currentPage + 1}
              variant="outlined"
              color="primary"
              onChange={handlePageChange}
            />
          ) : (
            <div>해당 데이터가 없습니다</div>
          )}
        </Box>
      </DashboardCard>
      <PorderModal></PorderModal>
      <Dialog open={accountModal}>
        <DialogTitle>거래처 찾기</DialogTitle>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '16px', justifyContent: 'flex-end' }}>
          <p style={{ marginRight: '8px' }}>거래처명:</p>
          <TextField sx={{ width: '150px', marginRight: '16px' }} variant="outlined" size="small"
            value={selectedCompanyName} onChange={(e) => setSelectedCompanyName(e.target.value)} />
          <Button Icon={<SearchIcon />} onClick={() => handleAccountSearchClick(selectedCompanyName)}>거래처 조회</Button>
        </Box>

        <Table title="거래처선택" style={{ textAlign: 'center' }}>
          <TableHead>
            <TableRow>
              <TableCell>거래처명</TableCell>
              <TableCell>거래처코드</TableCell>
              <TableCell>대표자</TableCell>
              <TableCell>거래처번호</TableCell>
              <TableCell>사업자번호</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentAccountList.map((accountList, index) => (
              <TableRow key={index} sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
                onClick={() => {
                  handleAccountRowClick(accountList.accountNo);
                  setAccountModal(false);
                }}
              >
                <TableCell>{accountList.accountName}</TableCell>
                <TableCell>{accountList.axcountNo}</TableCell>
                <TableCell >{accountList.representative}</TableCell>
                <TableCell >{accountList.contactNumber}</TableCell>
                <TableCell >{accountList.businessNumber}</TableCell>
              </TableRow>
            ))}

          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <Pagination
                  count={Math.ceil(accountList.length / accountsPerPage)}
                  variant="outlined"
                  color="primary"
                  page={currentAccountPage}
                  onChange={(event, value) => setCurrentAccountPage(value)}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Dialog>
      <PorderComponets2 />
    </Box>
  );
};

export default PorderComponets;
