import React, { useEffect,useState } from 'react';
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
import products from '../../data/memberData';
import PorderComponets2 from './PorderComponents2';
import { ADD_SELECTED_PRODUCT, REMOVE_SELECTED_PRODUCT ,REMOVE_ALL_SELECTED_PRODUCTS} from '../../../redux/slices/selectedProductsReducer';
import { useDispatch, useSelector } from 'react-redux';
import porderAxios from './../../../axios/porderAxios';
import { Delete } from '@mui/icons-material';
import pOrderDeleteAxios from '../../../axios/pOrderDeleteAxios'


const PorderComponets = () => {
  const ITEMS_PER_PAGE = 5;  // 한 페이지당 표시할 아이템 개수

  const [currentPage, setCurrentPage] = useState(0);  // 현재 페이지 상태

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1) ;  // 페이지 변경 시 현재 페이지 상태 업데이트
  };

  // 현재 페이지에 따른 아이템들 계산
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = products.slice(offset, offset + ITEMS_PER_PAGE);
//*************************페이징 ***************************/
  const selectedProducts = useSelector((state) => state.selectedProduct.selectedProduct);
  console.log("chekcbox에 들어있는거" + selectedProducts);

  const dispatch = useDispatch();
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
        cancelButtonColor: '#3085d6',
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
      // 이미 선택된 상태라면, 모든 상품을 선택 취소한다.
      dispatch(REMOVE_ALL_SELECTED_PRODUCTS());
    } else {
      // 선택되지 않은 상태라면, 모든 상품을 선택한다.
      products.forEach(product => {
        dispatch(ADD_SELECTED_PRODUCT(product.id));
      });
    }
    // 전체 선택 체크박스 상태를 토글한다.
    setSelectAll(!selectAll);
  };
  

  useEffect(() => {
    // 선택된 상품의 수가 전체 상품의 수와 동일하다면, 전체 선택 체크박스를 선택 상태로 설정한다.
    if (selectedProducts.length === products.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedProducts, products]);

  
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


        <br />

        <Box sx={{ overflow: 'auto', maxHeight: '400px' }}>
          <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap', mt: 2 }}>
            <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}>
              <TableRow>
                <TableCell>
                <Checkbox
                checked={selectAll}
                onChange={handleSelectAllChange}
              />

                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    NO
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Product
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Account
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    State
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Price
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectAll || selectedProducts.includes(product.id)}
                      onChange={(event) => handleCheckboxChange(event, product.id)}
                  
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>{product.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {product.name}
                        </Typography>
                        <Typography color="textSecondary" sx={{ fontSize: '13px' }}>
                          {product.post}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                      {product.pname}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{
                        px: '4px',
                        backgroundColor: product.pbg,
                        color: '#fff'
                      }}
                      size="small"
                      label={product.priority}
                    ></Chip>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">${product.budget}k</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
            <Pagination
              count={Math.ceil(products.length / ITEMS_PER_PAGE)}
              page={currentPage + 1}
              variant="outlined"
              color="primary"
              onChange={handlePageChange} 
            />
          </Box>
        </Box>
      </DashboardCard>
      <PorderComponets2 />
    </Box>
  );
};

export default PorderComponets;
