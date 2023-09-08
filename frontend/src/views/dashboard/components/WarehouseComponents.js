import React, { useEffect, useState } from 'react';
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
  Pagination,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import swal from 'sweetalert2';
import axios from 'axios';

import { ADD_SELECTED_PRODUCT, REMOVE_SELECTED_PRODUCT, REMOVE_ALL_SELECTED_PRODUCTS } from '../../../redux/slices/selectedProductsReducer';
import { useDispatch, useSelector } from 'react-redux';
import porderAxios from './../../../axios/porderAxios';
import { Delete } from '@mui/icons-material';
import { warehouseList } from '../../../redux/thunks/warehouseList';
import Loading from '../../../loading';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ko from 'date-fns/locale/ko';
import { warehouseSectionList } from '../../../redux/thunks/warehouseSectionList';
import { searchWarehouseList } from 'src/redux/thunks/searchWarehouseList';


const Warehouse = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(warehouseList());
    dispatch(warehouseSectionList())
  }, [dispatch]);
  const productsData = useSelector((state) => state.warehouseList.products);
  const products = JSON.parse(JSON.stringify(productsData));
  const realProducts = products?.data || [];
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const ITEMS_PER_PAGE = 5;  // 한 페이지당 표시할 아이템 개수

  const [currentPage, setCurrentPage] = useState(0);  // 현재 페이지 상태

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1);  // 페이지 변경 시 현재 페이지 상태 업데이트
  };

  // 현재 페이지에 따른 아이템들 계산
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = Array.isArray(realProducts)
    ? realProducts.slice(offset, offset + ITEMS_PER_PAGE)
    : [];


  const selectedProducts = useSelector((state) => state.selectedProduct.selectedProduct);


  useEffect(() => {
    dispatch(REMOVE_ALL_SELECTED_PRODUCTS());
    setSelectAll(false);
  }, [currentPage]);


  useEffect(() => {
    const allSelectedOnCurrentPage = currentItems.every(item => selectedProducts.includes(item.warehouseNo));
    setSelectAll(allSelectedOnCurrentPage);
  }, [selectedProducts, currentItems]);

  useEffect(() => {
    if (selectedProducts.length === 1) {
      porderAxios(selectedProducts, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts]);


  const [warehouseName, setWarehouseName] = useState("");
  const [itemName, setItemName] = useState("");

  const handleClick = () => {

    let timerInterval;
      dispatch(searchWarehouseList(warehouseName,itemName));
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

  const handleCheckboxChange = (event, productId) => {
    if (event.target.checked) {
      if (!selectedProducts.includes(productId)) {
        dispatch(ADD_SELECTED_PRODUCT(productId));
      }
    } else {
      dispatch(REMOVE_SELECTED_PRODUCT(productId));
    }
  };

  // const handleDelete = () => {
  //   swal
  //     .fire({
  //       title: '정말로 삭제하시겠습니까?',
  //       text: '삭제된 데이터는 복구할 수 없습니다.',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#d33',
  //       cancelButtonColor: '#3085',
  //       confirmButtonText: '삭제',
  //       cancelButtonText: '취소',
  //     })
  //     .then(() => {
  //       pOrderDeleteAxios(selectedProducts);
  //     });
  // };
  //**********************selectbox */
  useEffect(() => {
    // 컴포넌트가 마운트되었을 때 모든 상품 선택을 해제한다.
    dispatch(REMOVE_ALL_SELECTED_PRODUCTS());
  }, []);

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = () => {
    if (selectAll) {
      currentItems.forEach(item => {
        dispatch(REMOVE_SELECTED_PRODUCT(item.warehouseNo));
      });
    } else {
      currentItems.forEach(item => {
        dispatch(ADD_SELECTED_PRODUCT(item.warehouseNo));
      });
    }
    setSelectAll(!selectAll);
  };

  const [sectionAddOpen, setSectionAddOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [sectionName, setSectionName] = useState("");
  const warehouseSectionInsert = () => {

    // sectionList에서 동일한 warehouseName이 있는지 확인
    const isDuplicate = sectionList.some(section => section.warehouseName === sectionName);

    // 중복된 이름이 있다면 경고 메시지를 표시하고 함수를 종료
    if (isDuplicate) {
      swal.fire({
        title: '창고구역 추가 실패.',
        text: '이미 동일한 이름의 창고구역이 있습니다.',
        icon: 'error',
        showConfirmButton: true,
      });

      setSectionName("")
      setSectionAddOpen(false)
      setOpen(false)
      return;
    }

    const warehouseInsertDto = {
      warehouseName: sectionName,
    }


    axios.post("http://localhost:8888/api/warehouse/insert", warehouseInsertDto)
      .then(() => {
        swal.fire({
          title: '창고구역 추가완료.',
          text: '창고구역이 추가되었습니다.',
          icon: 'success',
          showConfirmButton: false,
        });
      })
    setSectionName("")
    setSectionAddOpen(false)
    setOpen(false)
  }


  const sectionListData = useSelector((state) => state.warehouseSectionList.warehouseSectionList.data);
  const sectionList = Array.isArray(sectionListData) ? sectionListData : [];


  const [selectedWarehouseSection, setSelectedWarehouseSection] = useState("");

  const warehouseDelete = () => {
    // 해당 창고명에 일치하는 첫 번째 창고 객체를 찾습니다.
    const selectedWarehouse = sectionList.find(warehouse => warehouse.warehouseName === selectedWarehouseSection);

    if (!selectedWarehouse) {
      console.error('해당 창고 구역을 찾을 수 없습니다.');
      return;
    }

    const warehouseNo = selectedWarehouse.warehouseNo;

      axios.delete(`http://localhost:8888/api/warehouse/delete/${warehouseNo}`)
        .then(() => {
          swal.fire({
            title: '창고구역 삭제완료.',
            text: '창고구역이 삭제되었습니다.',
            icon: 'success',
            showConfirmButton: false,
          });
          setSelectedWarehouseSection("");
          dispatch(warehouseSectionList()); // 추가
        })
        .catch(error => {
          console.error("창고 구역 삭제 오류:", error);
          swal.fire({
            title: '오류 발생',
            text: '창고구역 삭제 중 오류가 발생했습니다.',
            icon: 'error',
          });
        });
    }


  return (
    <>
      <Dialog open={open} sx={{ width: "100%" }}>
        <DialogTitle>창고구역</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', marginBottom: '16px' }} justifyContent={'flex-start'}>
            <p>구역명: {selectedWarehouseSection}</p>
          </Box>
          <Box sx={{ display: 'flex', marginBottom: '16px' }} justifyContent={'flex-end'}>
            <Button onClick={() => { setSectionAddOpen(true) }} variant="contained">구역 추가</Button>
            &nbsp;&nbsp;
            <Button
              variant="outlined"
              size="big"
              startIcon={<Delete />}
              color="error"
              onClick={warehouseDelete}
            >
              삭제
            </Button>
          </Box>
          <Table
            sx={{
              border: '1px solid rgba(0, 0, 0, 0.12)', // 테이블에 테두리 추가
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // 그림자 추가
              backgroundColor: '#fafafa' // 배경색 변경
            }}>
            <TableBody>
              {sectionList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>데이터가 없습니다.</TableCell>
                </TableRow>
              ) : (
                Array.from({ length: Math.ceil(sectionList.length / 5) }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: 5 }).map((_, colIndex) => {
                      const dataIndex = rowIndex * 5 + colIndex;
                      const warehouse = sectionList[dataIndex];
                      return (
                        <TableCell
                          key={colIndex}
                          sx={{
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                          }}
                          onClick={() => warehouse && setSelectedWarehouseSection(warehouse.warehouseName)}
                        >
                          {warehouse ? warehouse.warehouseName : ''}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false) }}>확인</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={sectionAddOpen}>
        <DialogTitle style={{ backgroundColor: '#f0f0f0', padding: '16px', fontWeight: 'bold' }}>창고구역 추가</DialogTitle>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding="16px">
          <TextField
            label="창고구역명"
            variant="outlined"
            placeholder="ex) A-1"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            style={{ marginBottom: '16px', width: '100%' }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => warehouseSectionInsert()}
            style={{ width: '100%' }}
          >
            추가
          </Button>

        </Box>
      </Dialog>

      <Box>
        <DashboardCard title="재고조회" variant="poster">
          <Box sx={{ display: 'flex' }}>


            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
              <span style={{ marginRight: '1rem' }}>
                <Typography variant="subtitle2">창고구역</Typography>
              </span>
              <TextField label="창고구역명" variant="outlined" size="small" sx={{ marginRight: 2 }} value={warehouseName} onChange={(e) => { setWarehouseName(e.target.value) }} />
              <span style={{ marginRight: '1rem' }}>                                                      
                <Typography variant="subtitle2">품목이름:</Typography>
              </span>
              <TextField label="품목이름" variant="outlined" size="small" sx={{ marginRight: 2 }} value={itemName} onChange={(e) => { setItemName(e.target.value) }} />

              {/* This box might also need flex display for its children */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginRight: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', marginRight: '1rem' }}>재고생성일:</Typography>
                  <DatePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="조회시작일"
                    views={['year', 'month', 'day']}
                    value={startDate}
                    format='yyyy-MM-dd'
                    slotProps={{ textField: { size: "small" } }}
                    minDate={new Date('2022-07-01')}
                    maxDate={new Date("2100-01-01")}
                    onChange={(date) => setStartDate(date)}
                    sx={{ marginRight: 1 }}
                  />
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', marginRight: '1rem' }}>~</Typography>
                  <DatePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="조회 마감일"
                    views={['year', 'month', 'day']}
                    format='yyyy-MM-dd'
                    slotProps={{ textField: { size: "small" } }}
                    value={endDate}
                    minDate={new Date('2022-07-01')}
                    maxDate={new Date("2100-01-01")}
                    onChange={(date) => setEndDate(date)}
                  />
                </LocalizationProvider>
              </Box>
              <Button onClick={handleClick} variant="contained">Search</Button>
              &nbsp;&nbsp;
              <Button onClick={() => { setOpen(true) }} variant="contained">
                창고추가
              </Button>
            </Box>

          </Box>
          <Box>
            {selectedProducts.length >= 2 && (
              <Typography
                variant="h6"
                style={{ color: 'red', fontWeight: 'bold' }}
              >
                선택된 상품 개수: {selectedProducts.length} 입니다
              </Typography>
            )}
          </Box>


          <br />

          <Box sx={{ overflow: 'auto', maxHeight: '400px' }}>
            <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap', mt: 2, textAlign: 'right' }}>
              <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAllChange} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      창고구역명
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      입고번호
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      품목이름
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      수량
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" fontWeight={600}>
                      입고일
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" fontWeight={600}>
                      담당자
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                {currentItems.map((realProduct, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(realProduct.warehouseStockNo)}
                        onChange={(event) => handleCheckboxChange(event, realProduct.warehouseStockNo)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>{realProduct.warehouseName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {realProduct.receiveCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                        {realProduct.itemName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                        {realProduct.count}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                        {realProduct.registDate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                        {realProduct.createId}
                      </Typography>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </Box><Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
              {realProducts ? (
                <Pagination
                  count={Math.ceil(realProducts.length / ITEMS_PER_PAGE)}
                  page={currentPage + 1}
                  variant="outlined"
                  color="primary"
                  onChange={handlePageChange}
                />
              ) : (
                <Loading />
              )}
            </Box>
          </Box>


        </DashboardCard>
      </Box>
    </>

  );
};

export default Warehouse;
