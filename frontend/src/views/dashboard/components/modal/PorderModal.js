import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import swal from 'sweetalert2';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { close_Modal } from '../../../../redux/slices/porderModalDuck';
import {Delete} from '@mui/icons-material';
import itemAddAxios from '../../../../axios/ItemAddAxios'

const PorderModal = () => {
  const dispatch = useDispatch();
  const porderModalState = useSelector((state) => state.porderModal.openModal);

  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]); 

  const handleSelectNumber = (selectedOption) => {
    setSelectedNumber(selectedOption);
  };

  const handleSelectName = (selectedOption) => {
    setSelectedName(selectedOption);
  };

  const handleSelectSize = (selectedOption) => {
    setSelectedSize(selectedOption);
  };

  const handleFilterData = () => {
    // Add the selected data to the selectedItems array
    const selectedData = {
      number: selectedNumber?.value || null,
      name: selectedName?.value || null,
      size: selectedSize?.value || null,
      quantity: '0', // 초기에는 수량을 0으로 설정합니다.
    };
    setSelectedItems([...selectedItems, selectedData]);
  };

  const handleCancel = () => {
    dispatch(close_Modal());
  };

  const handleSave = () => {
    try {
      //여기서 insert
      //await axios.post('/api/saveData', selectedItems);
      //dispatch(SAVE_MODAL_DATA(selectedItems)); ->selectItems를 사용하지 않을꺼면 지워도 됨
      dispatch(close_Modal());//위에 dispatch를 사용하면 지워야함
      itemAddAxios(selectedItems);
      swal.fire({
        title: '수정 완료.',
        text: '창고가 수정되었습니다.',
        icon: 'success',
        showConfirmButton: false,
      });
    } catch (error) {
 
      swal.fire({
        title: '오류 발생',
        text: '데이터 저장 중 오류가 발생했습니다.',
        icon: 'error',
        showConfirmButton: false,
      });
    }
  };

  const handleConfirmEdit = () => {
    // editedData에 저장된 변경된 행을 selectedItems에 반영
    setSelectedItems((prevData) => {
      const newData = prevData.map((item) =>
        item.number === editedData.number ? { ...item, quantity: editedData.quantity } : item
      );
      return newData;
    });
    // editedData 초기화
    setEditedData({});
  };
  const handleDelete = (itemNumber) => {
    setSelectedItems((prevData) => prevData.filter((item) => item.number !== itemNumber));
  };

  const options = [
    { value: 'all', label: 'All' }, // Option for "All" selection
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    // Add more options here
  ];

  const productOptions = [
    { value: 'all', label: 'All' }, // Option for "All" selection
    { value: 'Product 1', label: 'Product 1' },
    { value: 'Product 2', label: 'Product 2' },
    { value: 'Product 3', label: 'Product 3' },
    { value: 'Product 4', label: 'Product 4' },
    { value: 'Product 5', label: 'Product 5' },
    // Add more options here for product names
  ];

  const sizeOptions = [
    { value: 'all', label: 'All' }, // Option for "All" selection
    { value: 'Size A', label: 'Size A' },
    { value: 'Size B', label: 'Size B' },
    { value: 'Size C', label: 'Size C' },
    { value: 'Size D', label: 'Size D' },
    // Add more options here for sizes
  ];

  return (
    <Dialog
      open={porderModalState}
      PaperProps={{
        sx: {
          width: '80%',
          maxWidth: 'md',
        },
      }}
    >

      <DialogTitle>발주품목 등록</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          품목명
          <Select options={options} value={selectedNumber} onChange={handleSelectNumber} styles={{ width: '130px' }} />
          
          <Select options={productOptions} value={selectedName} onChange={handleSelectName} styles={{ width: '130px' }} />
          규격
          <Select options={sizeOptions} value={selectedSize} onChange={handleSelectSize} styles={{ width: '130px' }} />
          <Button variant="contained" onClick={handleFilterData}>조회</Button>
        </Box>

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>품번</TableCell>
              <TableCell>품명</TableCell>
              <TableCell>size</TableCell>
              <TableCell>quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render the selected items */}
            {selectedItems.map((item, index) => (
              <TableRow key={`selected-${index}`}>
                <TableCell>{item.number}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>
                  {editedData.number === item.number ? ( // 현재 행이 수정 중인 행이라면
                    <input
                      type="number"
                      value={editedData.quantity}
                      onChange={(e) =>
                        setEditedData((prevData) => ({ ...prevData, quantity: e.target.value }))
                      }
                    />
                  ) : (
                    item.quantity
                  )}
                </TableCell>
                <TableCell>
                  {editedData.number === item.number ? ( // 현재 행이 수정 중인 행이라면
                    <>
                      <Button variant="outlined" color="primary" onClick={handleConfirmEdit}>
                        확인
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setEditedData({})} // 수정 취소 시 editedData 초기화
                      >
                        취소
                      </Button>
                    </>
                  ) : (
                    <>
                    <Button
                      variant="outlined"
                      onClick={() => setEditedData({ ...item })} // 행을 수정하기 위해 editedData에 복사
                    >
                      수정
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() => handleDelete(item.number)}
                      startIcon={<Delete />}
                    >
                      삭제
                      </Button>
                      </>
                  )}
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PorderModal;
