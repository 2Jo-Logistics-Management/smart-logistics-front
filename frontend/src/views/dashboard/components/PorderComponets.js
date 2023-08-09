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
  Pagination
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import swal from 'sweetalert2';

import PorderComponets2 from './PorderComponents2';
import { ADD_SELECTED_PRODUCT, REMOVE_SELECTED_PRODUCT, REMOVE_ALL_SELECTED_PRODUCTS } from '../../../redux/slices/selectedProductsReducer';
import { useDispatch, useSelector } from 'react-redux';
import porderAxios from './../../../axios/porderAxios';
import { Delete } from '@mui/icons-material';
import pOrderDeleteAxios from '../../../axios/pOrderDeleteAxios'
import { fetchProducts } from '../../../redux/thunks/fetchProduct'
import Loading from '../../../loading';


const PorderComponets = () => {


  const dispatch = useDispatch();
  useEffect(() => {
    // 컴포넌트가 마운트되면 fetchProducts 액션 디스패치
    dispatch(fetchProducts());
  }, [dispatch]);
  const productsData = useSelector((state) => state.pOrderList.products);
  //console.log("++++++++++++++++++++" + productsData);

  const products = JSON.parse(JSON.stringify(productsData));
  const realProducts = products.data;


  const ITEMS_PER_PAGE = 5;  // 한 페이지당 표시할 아이템 개수

  const [currentPage, setCurrentPage] = useState(0);  // 현재 페이지 상태


  const [currentItems, setCurrentItems] = useState([]);
  const offset = currentPage * ITEMS_PER_PAGE;
  useEffect(() => {
    // Update currentItems when realProducts data changes
    setCurrentItems(Array.isArray(realProducts)
      ? realProducts.slice(offset, offset + ITEMS_PER_PAGE)
      : []);
  }, [realProducts, offset]);




  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1);  // 페이지 변경 시 현재 페이지 상태 업데이트
  };

  // 현재 페이지에 따른 아이템들 계산


  const selectedProducts = useSelector((state) => state.selectedProduct.selectedProduct);
  console.log("chekcbox에 들어있는거" + selectedProducts);
  useEffect(() => {
    // 페이지가 변경될 때마다 체크박스 상태를 초기화한다.
    dispatch(REMOVE_ALL_SELECTED_PRODUCTS());
    setSelectAll(false);
  }, [currentPage]);
  useEffect(() => {
    // 선택된 아이템의 수가 현재 페이지의 아이템 수와 동일하다면, 전체 선택 체크박스를 선택 상태로 설정한다.
    const allSelectedOnCurrentPage = currentItems.every(item => selectedProducts.includes(item.porderCode));
    setSelectAll(allSelectedOnCurrentPage);
  }, [selectedProducts, currentItems]);

  useEffect(() => {
    if (selectedProducts.length === 1) {
      porderAxios(selectedProducts, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts]);

  const handleClick = () => {
    let timerInterval;
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
        pOrderDeleteAxios(selectedProducts);
      });
  };
  //**********************selectbox */
  useEffect(() => {
    // 컴포넌트가 마운트되었을 때 모든 상품 선택을 해제한다.
    dispatch(REMOVE_ALL_SELECTED_PRODUCTS());
  }, []);

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = () => {
    if (selectAll) {
      currentItems.forEach(item => {
        dispatch(REMOVE_SELECTED_PRODUCT(item.porderCode));
      });
    } else {
      currentItems.forEach(item => {
        dispatch(ADD_SELECTED_PRODUCT(item.porderCode));
      });
    }
    setSelectAll(!selectAll);
  };




  return (

    <Box>
      <DashboardCard title="발주 list" variant="poster">
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            {/* Your first box content here */}
            <Button
              variant="outlined"
              size="big"
              startIcon={<Delete />}
              color="error"
              onClick={handleDelete}
            >
              삭제
            </Button>
          </Box>


          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {/* Your second box content here */}
            <span style={{ marginRight: '1rem' }}>
              <Typography variant="subtitle2">
                발주번호:
              </Typography>
            </span>
            <TextField label="거래처번호" variant="outlined" size="small" sx={{ marginRight: 2 }} />
            <span style={{ marginRight: '1rem' }}>
              <Typography variant="subtitle2">
                품목번호:
              </Typography>
            </span>
            <TextField label="거래처명" variant="outlined" size="small" sx={{ marginRight: 2 }} />
            <span style={{ marginRight: '1rem' }}>
              <Typography variant="subtitle2">
                거래품목:
              </Typography>
            </span>
            <TextField label="거래 품목" variant="outlined" size="small" sx={{ marginRight: 2 }} />
            <Button onClick={handleClick} variant="contained">
              Search
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
          <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap', mt: 2 }}>
            <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAllChange} />
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
              </TableRow>
            </TableHead>
            <TableBody>

              {currentItems.map((realProduct) => (
                <TableRow key={realProduct.porderCode}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(realProduct.porderCode)}
                      onChange={(event) => handleCheckboxChange(event, realProduct.porderCode)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>{realProduct.porderCode}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {realProduct.accountNo}
                        </Typography>
                        <Typography color="textSecondary" sx={{ fontSize: '13px' }}>
                          물류관리자
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                      {realProduct.createDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{
                        px: '4px',
                        color: '#fff'
                      }}
                      size="small"
                      label={realProduct.state}
                    ></Chip>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">${realProduct.budget}</Typography>
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
              <Loading/>
            )}
          </Box>
        </Box>
      </DashboardCard >
      <PorderComponets2 />
    </Box>
  );
};

export default PorderComponets;
