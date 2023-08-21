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
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import swal from 'sweetalert2';
import { Delete } from '@mui/icons-material';
import PorderComponets2 from './PorderComponents2';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_SELECTED_PRODUCT, REMOVE_SELECTED_PRODUCT, REMOVE_ALL_SELECTED_PRODUCTS } from '../../../redux/slices/selectedProductsReducer';
import pOrderDeleteAxios from '../../../axios/pOrderDeleteAxios';
import { open_Modal } from '../../../redux/slices/porderModalDuck';
import { seletedPOrderList } from '../../../redux/thunks/SelectedPOrderList';
import { fetchProducts } from '../../../redux/thunks/fetchProduct'; // fetchProducts 함수 임포트
import PorderModal from './modal/PorderModal';
const PorderComponets = () => {
  const dispatch = useDispatch();
  const [selectAll, setSelectAll] = useState(false);
  
  useEffect(() => {
    dispatch(fetchProducts()); // fetchProducts 액션 디스패치
  }, [dispatch]);

  const selectedProducts = useSelector((state) => state.selectedProduct.selectedProduct);
  const productsData = useSelector((state) => state.pOrderList.products);
  const products = JSON.parse(JSON.stringify(productsData));
  const realProducts = products?.data || [];;
  console.log(realProducts);

  const handleInsert = () => {
    dispatch(open_Modal());
  };

  const handleCheckboxChange = (event, productId) => {
    if (event.target.checked) {
      dispatch(ADD_SELECTED_PRODUCT(productId));
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
      },
    });
  };

  useEffect(() => {
    if (selectedProducts.length === 1) {
      dispatch(seletedPOrderList(selectedProducts));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts]);

  const handleSelectAllChange = () => {
    if (selectAll) {
      realProducts.forEach(item => {
        dispatch(REMOVE_SELECTED_PRODUCT(item.porderCode));
      });
    } else {
      realProducts.forEach(item => {
        dispatch(ADD_SELECTED_PRODUCT(item.porderCode));
      });
    }
    setSelectAll(!selectAll);
  };
  

  return (
    <Box style={{ width: '100%' }}>
      <DashboardCard title="발주 list" variant="poster" sx={{ Width: '100%' }}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ marginRight: '1rem' }}>
              <Typography variant="subtitle2">발주번호:</Typography>
            </span>
            <TextField label="거래처번호" variant="outlined" size="small" sx={{ marginRight: 2 }} />
            <span style={{ marginRight: '1rem' }}>
              <Typography variant="subtitle2">품목번호:</Typography>
            </span>
            <TextField label="거래처명" variant="outlined" size="small" sx={{ marginRight: 2 }} />
            <span style={{ marginRight: '1rem' }}>
              <Typography variant="subtitle2">거래품목:</Typography>
            </span>
            <TextField label="거래 품목" variant="outlined" size="small" sx={{ marginRight: 2 }} />
            <Button onClick={handleClick} variant="contained">
              Search
            </Button>
            <Button onClick={handleInsert} variant="contained">
              발주등록
            </Button>
            <Button
              variant="outlined"
              size="big"
              startIcon={<Delete />}
              color="error"
              onClick={handleDelete}
              disabled={selectedProducts.length === 0} // 선택된 상품이 없을 때 버튼 비활성화
            >
              삭제
            </Button>
          </Box>
        </Box>
        <Box>
          {selectedProducts.length >= 2 && (
            <Typography variant="h6" style={{ color: 'red', fontWeight: 'bold' }}>
              선택된 상품 개수: {selectedProducts.length} 입니다
            </Typography>
          )}
        </Box>
        <br />
        <Box sx={{ overflow: 'auto', maxHeight: '400px' }}>
          <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap', mt: 2 }}>
            <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}>
              <TableRow style={{ height: '10px' }}>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {realProducts.map((realProduct) => (
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
                        color: '#fff',
                      }}
                      size="small"
                      label={realProduct.state}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">{realProduct.createId}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DashboardCard>
      <PorderModal></PorderModal>
      <PorderComponets2 />
    </Box>
  );
};

export default PorderComponets;
