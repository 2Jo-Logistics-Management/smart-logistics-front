import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
} from '@mui/material';
import { Delete, Edit, Done} from '@mui/icons-material';
import DashboardCard from '../../../components/shared/DashboardCard';
import swal from 'sweetalert2';
import products from '../../data/memberData';
import PorderModal from '../components/modal/PorderModal';
import { open_Modal } from '../../../redux/slices/porderModalDuck';
import pOrderItemUpdateAxios from '../../../axios/POrderItemUpdateAxios'
import pOrderItemUpdateThunk from "../../../redux/slices/selectedPOrderReducer";
const PorderComponets2 = () => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [tempProducts, setTempProducts] = useState(products);

  useEffect(() => {
    setVisibleProducts(tempProducts.slice(0, visibleCount));
  }, [visibleCount, tempProducts]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const newVisibleCount = visibleCount + 10;
      setVisibleCount(newVisibleCount);
    }
    e.target = clientHeight;
  };

  const dispatch = useDispatch();
  const porderModalState = useSelector((state) => state.porderModal);
  const porderData = useSelector((state) => state.selectedPOrder.seletedPOrder);
  console.log("밑에 컴포넌트(위에서 선택한 data):"+ porderData);

  if (!porderModalState) {
    return null;
  }

  const handleEdit = (productId) => {
    setEditMode((prevState) => ({ ...prevState, [productId]: !prevState[productId] }));
    if (editMode[productId]) { // 이 부분을 수정하여 "Save" 버튼을 눌렀을 때만 axios 통신이 일어나도록 함
      const index = tempProducts.findIndex((product) => product.id === productId);
      const updatedProducts = [...tempProducts];
      updatedProducts[index] = tempProducts[index];
      setTempProducts(updatedProducts);
      pOrderItemUpdateAxios(updatedProducts[index])
    
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
      .then((result) => {
        if (result.isConfirmed) {
          swal.fire({
            title: '삭제 완료',
            text: '재고가 삭제되었습니다.',
            icon: 'success',
          });
          console.log("삭제할 data:"+selectedProducts)
        }
      });
  };

  const handleInsert = () => {
    dispatch(open_Modal());
  };

  const handleClick = () => {
    let timerInterval;
    swal.fire({
      title: '품목을 조회중',
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

  const handleCheckboxChange = (productId) => {
    const selectedIndex = selectedProducts.indexOf(productId);
    let updatedSelectedProducts = [...selectedProducts];
    if (selectedIndex === -1) {
      updatedSelectedProducts.push(productId);
    } else {
      updatedSelectedProducts.splice(selectedIndex, 1);
    }
    setSelectedProducts(updatedSelectedProducts);
  };

  const handleChange = (productId, property, value) => {
    const index = tempProducts.findIndex((product) => product.id === productId);
    const updatedProducts = [...tempProducts];
    updatedProducts[index][property] = value;
    setTempProducts(updatedProducts);
  };

  return (
    <DashboardCard>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Button onClick={handleInsert} variant="contained">
            발주등록
          </Button>
          &nbsp;&nbsp;
          <Button
          variant="outlined"
          size="big"
          onClick={handleDelete}
          startIcon={<Delete />}
          color="error"
        >
          삭제
        </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            품목번호:
          </Typography>
          <TextField label="품목번호" variant="outlined" size="small" sx={{ mr: 2 }} />
          <Button onClick={handleClick} variant="contained">
            Search
          </Button>
        </Box>
      </Box>
      <br />
      <Box sx={{ overflow: 'auto', maxHeight: '400px' }} onScroll={handleScroll}>
        <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap', mt: 2 }}>
          <TableHead
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: '#fff',
            }}
          >
            <TableRow>
              <TableCell>선택</TableCell>
              <TableCell>창고번호</TableCell>
              <TableCell>창고명</TableCell>
              <TableCell>예산</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                </TableCell>
                <TableCell>
                  {editMode[product.id] ? (
                    <TextField
                      value={product.id}
                      onChange={(e) => handleChange(product.id, 'id', e.target.value)}
                    />
                  ) : (
                    <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>{product.id}</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {editMode[product.id] ? (
                    <TextField
                      value={product.name}
                      onChange={(e) => handleChange(product.id, 'name', e.target.value)}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {product.name}
                        </Typography>
                        <Typography color="textSecondary" sx={{ fontSize: '12px' }}>
                          {product.description}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={editMode[product.id] ? <Done /> : <Edit />}
                    onClick={() => handleEdit(product.id)}
                  >
                    {editMode[product.id] ? 'Save' : 'Edit'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {porderModalState && <PorderModal />}
    </DashboardCard>
  );
};

export default PorderComponets2;
