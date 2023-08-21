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
import { Edit, Done } from '@mui/icons-material';
import DashboardCard from '../../../components/shared/DashboardCard';

import pOrderItemUpdateAxios from '../../../axios/POrderItemUpdateAxios'

const PorderComponets2 = () => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [tempProducts, setTempProducts] = useState([]);

  const productsData = useSelector((state) => state.selectedPOrderList.selectedPOrderList)
  const products = JSON.parse(JSON.stringify(productsData));

  useEffect(() => {
    if (products.data) {
      const newVisibleProducts = products.data.slice(0, visibleCount);
      if (JSON.stringify(newVisibleProducts) !== JSON.stringify(visibleProducts)) {
        setVisibleProducts(newVisibleProducts);
      }
    }
  }, [products.data, visibleCount, visibleProducts]);




  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const newVisibleCount = visibleCount + 10;
      setVisibleCount(newVisibleCount);
    }
    e.target = clientHeight;
  };

  // const porderModalState = useSelector((state) => state.porderModal);

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
    <DashboardCard title="발주내역">
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
              <TableCell>품목번호</TableCell>
              <TableCell>담당자</TableCell>
              <TableCell>가격</TableCell>
              <TableCell>수량</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">데이터가 없습니다.</TableCell>
              </TableRow>
            ) : (
              visibleProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.porderItemNo)}
                      onChange={() => handleCheckboxChange(product.porderItemNo)}
                    />
                  </TableCell>
                  <TableCell>
                      <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>{product.porderItemNo}</Typography>
                  </TableCell>
                  <TableCell>
                    {editMode[product.porderItemNo] ? (
                      <TextField
                        value={product.manager}
                        onChange={(e) => handleChange(product.porderItemNo, 'name', e.target.value)}
                      />
                    ) : (
                          <Typography variant="subtitle2" fontWeight={600}>
                            {product.manager}
                          </Typography>
             
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[product.porderItemNo] ? (
                      <TextField
                        value={product.porderPrice}
                        onChange={(e) => handleChange(product.porderItemNo, 'name', e.target.value)}
                      />
                    ) : (
                          <Typography variant="subtitle2" fontWeight={600}>
                            {product.porderPrice}
                          </Typography>
             
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[product.porderItemNo] ? (
                      <TextField
                        value={product.porderCount}
                        onChange={(e) => handleChange(product.porderItemNo, 'name', e.target.value)}
                      />
                    ) : (
                          <Typography variant="subtitle2" fontWeight={600}>
                            {product.porderCount}
                          </Typography>
             
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={editMode[product.porderItemNo] ? <Done /> : <Edit />}
                      onClick={() => handleEdit(product.porderItemNo)}
                    >
                      {editMode[product.porderItemNo] ? 'Save' : 'Edit'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </Box>
      {/* {porderModalState && <PorderModal />} */}
    </DashboardCard>
  );
};

export default PorderComponets2;
