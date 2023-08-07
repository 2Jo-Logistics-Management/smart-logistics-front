import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import swal from 'sweetalert2';
import { Delete } from '@mui/icons-material';
import products from '../../data/memberData';
import Member2 from './member2';

const Member = () => {
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [visibleCount, setVisibleCount] = useState(10);
  const [visibleProducts, setVisibleProducts] = useState([]);

  useEffect(() => {
    setVisibleProducts(products.slice(0, visibleCount)); // visibleCount를 초기설정([]) 하여 의존성 배열 생성
  }, []); 

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target; 

    if (scrollTop + clientHeight >= scrollHeight - 10) { //젤 위에 위치 지점과 table 폭 더한게 (scroll 높이 -10) 보다 작으면
      const newVisibleCount = visibleCount + 10;  // 10개 추가
      //newVisibleCount를 넘겨서 10개씩 디비에서 가져온다

      setVisibleCount(newVisibleCount); //10개 추가된거를 useState 변동해서 쓱
    }
    e.target = clientHeight;
  };

  useEffect(() => {
    setVisibleProducts(products.slice(0, visibleCount)); //scorll이 되어 카운트가 10추가 되었을 때 해당 data를 visibleCount에 업데이트
  }, [visibleCount]);

  const handleClick = () => {
    let timerInterval;  // 로딩시간을 설정을 위한 변수 선언
    swal.fire({         //sweet alert를 임포트하여 해당 모달창 생성
      title: '입고물품 조회중',  
      html: '잠시만 기다려주세요',
      timer: 1000, 
      timerProgressBar: true,
      didOpen: () => {  //모달이 열릴 때 사용되는 함수
        swal.showLoading();
        const b = swal.getHtmlContainer().querySelector('b');
        timerInterval = setInterval(() => {
          b.textContent = swal.getTimerLeft();
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    })
  };

  const handleEdit = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);  //갖고온 번호로 해당 데이터 찾기
    setEditedProduct({ ...productToEdit }); //set에다가 복사
    setOpenModal(true); // 모달창 오픈
  };

  const handleSave = () => {
    swal.fire({
      title: '수정 완료.',
      text: '발주 상품이 수정되었습니다.',
      icon: 'success',
    });
    console.log('Save button clicked:', editedProduct);
    // 여기서 수정한 데이터 슥 하면 됨

    setEditingProductId(null); //초기화
    setEditedProduct({});
    setOpenModal(false);
    setSelectedProducts([]);
  };

  const handleCancel = () => {
    console.log('모달창 닫기');
    setEditingProductId(null); //초기화
    setEditedProduct({});
    setOpenModal(false);
  };

   const handleInputChange = (e) => {
   setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
   };

  const handleDelete = () => {
    swal.fire({
      title: '정말로 삭제하시겠습니까?',
      text: '삭제된 데이터는 복구할 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        
        swal.fire({
          title: '삭제 완료',
          text: '발주 상품이 삭제되었습니다.',
          icon: 'success',
        });
        console.log('삭제할 재고:', selectedProducts);

        //여기서 삭제할 데이터 스삭하면 됨
        setSelectedProducts([]);
        setOpenModal(false);
      }
    });
  };

  const handleCheckboxChange = (productId) => {
    const selectedIndex = selectedProducts.indexOf(productId);// check한 productId의 인덱스를 저장
    let updatedSelectedProducts = [...selectedProducts];
    if (selectedIndex === -1) {
      updatedSelectedProducts.push(productId);
    } else {
      updatedSelectedProducts.splice(selectedIndex, 1);
    }
    setSelectedProducts(updatedSelectedProducts);
  };

  return (
    <>
    <DashboardCard title="Member list" variant="poster">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Typography variant="subtitle2" sx={{ mr: 1 }}>
          거래처번호:
        </Typography>
        <TextField label="거래처번호" variant="outlined" size="small" sx={{ mr: 2 }} />
        <Typography variant="subtitle2" sx={{ mr: 1 }}>
          거래처명:
        </Typography>
        <TextField label="거래처명" variant="outlined" size="small" sx={{ mr: 2 }} />
        <Typography variant="subtitle2" sx={{ mr: 1 }}>
          거래품목:
        </Typography>
        <TextField label="거래 품목" variant="outlined" size="small" sx={{ mr: 2 }} />
        <Button onClick={handleClick} variant="contained">
          Search
        </Button>
      </Box>
      <br></br>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {selectedProducts.length >  0 &&(
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleEdit(selectedProducts[0])}
            >
              Edit
            </Button>
            &nbsp;&nbsp;
            <Button
              variant="outlined"
              size="small"
              onClick={handleDelete}
              startIcon={<Delete />}
              color="error"
            >
              Delete
            </Button>
          </>
        )}
      </Box>
      <Box sx={{ overflow: 'auto', maxHeight: '400px' }} onScroll={handleScroll}>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: 'nowrap',
            mt: 2,
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
                <Checkbox
                  checked={selectedProducts.length === visibleProducts.length}
                  onChange={() =>
                    setSelectedProducts(
                      selectedProducts.length === visibleProducts.length
                        ? []
                        : visibleProducts.map((product) => product.id)
                    )
                  }
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
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>
                    {product.id}
                  </Typography>
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
                      color: '#fff',
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
      <Dialog open={openModal} onClose={handleCancel}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            label="ID"
            name="id"
            value={editedProduct.id}
            onChange={(e) => setEditedProduct({...editedProduct, id: e.target.value})}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            name="name"
            value={editedProduct.name}
           onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Post"
            name="post"
            value={editedProduct.post}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Pname"
            name="pname"
            value={editedProduct.pname}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Priority"
            name="priority"
            value={editedProduct.priority}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Budget"
            name="budget"
            value={editedProduct.budget}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardCard>
      <Member2/>
      <style>
        {`
          /* TableCell 높이 조정 */
          .custom-table-cell {
            padding: 8px 16px; /* 셀의 패딩을 조정하여 높이 감소 */
          }
        `}
      </style>
    </>
  );
};

export default Member;
