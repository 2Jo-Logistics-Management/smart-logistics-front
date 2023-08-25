import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import swal from 'sweetalert2';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TableFooter, TextField } from '@mui/material';
import { close_Modal } from '../../../../redux/slices/porderModalDuck';
import { Delete } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import itemAddAxios from '../../../../axios/ItemAddAxios'
import axios from 'axios';
import { Pagination } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

axios.defaults.withCredentials = true;

const PorderModal = () => {
  const dispatch = useDispatch();
  const porderModalState = useSelector((state) => state.porderModal.openModal);



  // 디비에서 selectbox 데이터 가져오기

  const [editedData, setEditedData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [manageName, setManageName] = useState("");
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const [accountList, setAccountList] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("")
  //거래처 페이징처리
  const [currentAccountPage, setCurrentAccountPage] = useState(1);
  const [accountsPerPage] = useState(6);
  const indexOfLastAccount = currentAccountPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccountList = accountList.slice(indexOfFirstAccount, indexOfLastAccount);
  const [selectedAccountContactNumber, setSelectedAccountContactNumber] = useState("");
  const [selectedItemName, setSeletedItemName] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState("");



  useEffect(() => {
    axios.get('http://localhost:8888/api/item/list')
      .then(response => {
        const fetchedItems = response.data.data;
        setItems(fetchedItems);
       
      })
      .catch(error => {
        console.error('첫번째 options에서 에러 발생', error);
      });
  }, []);

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
  const handleAccountRowClick = (clickedItem) => {

    setSelectedAccountContactNumber(clickedItem.accountNo);

  };


  const handleCancel = () => {
    dispatch(close_Modal());
  };
  function formatDate(pOrderDate) {
    const { format } = require('date-fns');
    const formattedDate = format(pOrderDate, 'yyyy-MM-dd HH:mm:ss')
    return formattedDate
  }
  const handleSave = () => {
    try {
      const itemsWithManageName = selectedItems.map(item => {
        const { spec, ...rest } = item; // spec 키와 값을 제외한 나머지 속성들
        return { ...rest };
      });
      const saveData = {
        pOrderItems: itemsWithManageName,
        accountNo: selectedAccountContactNumber,
        pOrderCode: null,
        pOrderDate: formatDate(new Date()),
        manager: manageName,
      }
      itemAddAxios(saveData);
      dispatch(close_Modal());//위에 dispatch를 사용하면 지워야함
      setSelectedItems([]);

      swal.fire({
        title: '발주상품 등록 완료.',
        text: '상품이 등록 되었습니다.',
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
  const handleRowClick = (clickedItem) => {
    // 이미 선택된 로우는 중복 추가하지 않습니다.
    if (!selectedItems.some(item => item.itemCode === clickedItem.itemCode)) {
      const newItem = {
        itemCode: clickedItem.itemCode,
        pOrderCount: '0', // 초기에는 수량을 0으로 설정합니다.
        pOrderPrice: clickedItem.itemPrice,
        pOrderItemPrice: clickedItem.itemPrice,
        pOrderCode: null,
        spec: clickedItem.spec,
        itemName: clickedItem.itemName

      };
      setSelectedItems(prevItems => [...prevItems, newItem]);
    }
  };



  const handleConfirmEdit = () => {
    // editedData에 저장된 변경된 행을 selectedItems에 반영
    setSelectedItems((prevData) => {
      const newData = prevData.map((item) =>
        item.itemCode === editedData.itemCode ? { ...item, pOrderCount: editedData.pOrderCount, pOrderPrice: editedData.pOrderPrice } : item
      );
    

      return newData;
    });
    // editedData 초기화
    setEditedData({});
  };

  const handleDelete = (itemCode) => {
    setSelectedItems((prevData) => prevData.filter((item) => item.itemCode !== itemCode));
  };



  const handleAccountSearchClick = (searchData) => {
    console.log(searchData);
    axios.get(`http://localhost:8888/api/account/list?accountName=${searchData}`)
      .then(response => {
        const AccountSearchData = response.data.data;
        setAccountList(AccountSearchData);
      })
  }
  const handleItemSearchClick = (searchData) => {
    axios.get(`http://localhost:8888/api/item/list?itemName=${searchData}`)
      .then(response => {
        const itemSearchData = response.data.data
        setItems(itemSearchData);
      })
  }




  const handleDateChange = (index, receiveDeadline) => {
    const { format } = require('date-fns');
    const formattedDate = format(receiveDeadline, 'yyyy-MM-dd HH:mm:ss'); // "yyyy-MM-dd HH:mm:ss" 형식으로 변환
    setSelectedItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index].receiveDeadline = formattedDate;
      return updatedItems;
    });
  };


  return (
    <Dialog
      open={porderModalState}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 'xl',
          display: 'flex',
        },
      }}
    >

      <DialogTitle>발주 작성</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flex: 1, padding: '16px' }}>
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
                    onClick={() => handleAccountRowClick(accountList)}
                  >
                    <TableCell sx={{ height: '10px' }}>{accountList.accountName}</TableCell>
                    <TableCell sx={{ height: '10px' }}>{accountList.accountNo}</TableCell>
                    <TableCell sx={{ height: '10px' }}>{accountList.representative}</TableCell>
                    <TableCell sx={{ height: '10px' }}>{accountList.contactNumber}</TableCell>
                    <TableCell sx={{ height: '10px' }}>{accountList.businessNumber}</TableCell>
                  </TableRow>
                ))}

              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Pagination
                      count={Math.ceil(accountList.length / accountsPerPage)}
                      variant="outlined"
                      color="primary" dxcxz
                      page={currentAccountPage}
                      onChange={(event, value) => setCurrentAccountPage(value)}
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <hr />
            <h2>품목선택리스트</h2>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '16px', justifyContent: 'flex-end' }}>
              <p style={{ marginRight: '8px' }}>품목명:</p>
              <TextField sx={{ width: '150px', marginRight: '16px' }} variant="outlined" size="small"
                value={selectedItemName} onChange={(e) => setSeletedItemName(e.target.value)} />
              <Button Icon={<SearchIcon />} onClick={() => handleItemSearchClick(selectedItemName)}>품목명 조회</Button>
            </Box>
            <Table style={{ textAlign: 'center' }}>
              <TableHead>
                <TableRow>
                  <TableCell>품목코드</TableCell>
                  <TableCell>명칭</TableCell>
                  <TableCell>규격</TableCell>
                  <TableCell>단위</TableCell>
                  <TableCell>금액</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((item, index) => (
                  <TableRow key={index} onClick={() => handleRowClick(item)} sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}>
                    <TableCell sx={{ height: '10px !important' }}>{item.itemCode}</TableCell>
                    <TableCell sx={{ height: '10px !important' }}>{item.itemName}</TableCell>
                    <TableCell sx={{ height: '10px !important' }}>{item.spec}</TableCell>
                    <TableCell sx={{ height: '10px !important' }}>{item.unit}</TableCell>
                    <TableCell sx={{ height: '10px !important' }}>{item.itemPrice}</TableCell>
                  </TableRow>
                ))}

              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Pagination
                      count={Math.ceil(items.length / itemsPerPage)}
                      variant="outlined"
                      color="primary"
                      page={currentPage}
                      onChange={(event, value) => setCurrentPage(value)}
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>

            </Table>
          </Box>
          <Box sx={{ flex: 1, padding: '16px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '16px', justifyContent: 'flex-end' }}>
              <p style={{ marginRight: '8px' }}>거래처코드:</p>
              <TextField
                sx={{ width: '150px', marginRight: '16px' }}
                variant="outlined"
                size="small"
                value={selectedAccountContactNumber}
                onChange={(e) => setSelectedAccountContactNumber(e.target.value)}
              />
              <p style={{ marginRight: '8px' }}>담당자:</p>
              <TextField sx={{ width: '150px' }} variant="outlined" size="small"
                onChange={(e) => setManageName(e.target.value)}
              />
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: '80px' }}>품번</TableCell>
                  <TableCell style={{ minWidth: '80px' }}>품명</TableCell>
                  <TableCell style={{ minWidth: '120px' }}>규격</TableCell>
                  <TableCell style={{ minWidth: '100px' }}>단가</TableCell>
                  <TableCell style={{ minWidth: '100px' }}>금액</TableCell>
                  <TableCell style={{ minWidth: '100px' }}>count</TableCell>
                  <TableCell style={{ minWidth: '200px' }}>납기일</TableCell>
                  <TableCell style={{ minWidth: '150px' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItems.map((item, index) => (
                  <TableRow key={`selected-${index}`}>
                    <TableCell>{item.itemCode}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.spec}</TableCell>
                    <TableCell>
                      {editedData.itemCode === item.itemCode ? (
                        <input
                          type="itemCode"
                          value={editedData.pOrderPrice}
                          onChange={(e) =>
                            setEditedData((prevData) => ({ ...prevData, pOrderPrice: e.target.value }))
                          }
                        />
                      ) : (
                        item.pOrderPrice
                      )}
                    </TableCell>

                    <TableCell>{item.pOrderPrice}</TableCell>
                    <TableCell>
                      {editedData.itemCode === item.itemCode ? ( // 현재 행이 수정 중인 행이라면
                        <input
                          type="itemCode"
                          value={editedData.pOrderCount}
                          onChange={(e) =>
                            setEditedData((prevData) => ({ ...prevData, pOrderCount: e.target.value }))
                          }
                        />
                      ) : (
                        item.pOrderCount
                      )}
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>

                        <DatePicker
                          label="조회 기간"
                          value={selectedDateTime}
                          onChange={(newDate) => handleDateChange(index, newDate)}
                          views={['year', 'month', 'day']}
                          format='yyyy-MM-dd'
                          slotProps={{ textField: { variant: 'outlined', size: "small" } }}
                          minDate={new Date()}
                          maxDate={new Date('2100-12-31')} // Optional: Restrict selection up to the end date
                        />

                      </LocalizationProvider>


                    </TableCell>
                    <TableCell>
                      {editedData.itemCode === item.itemCode ? ( // 현재 행이 수정 중인 행이라면
                        <>
                          <Button variant="outlined" color="primary" onClick={handleConfirmEdit}>
                            확인
                          </Button>
                          &nbsp;&nbsp;&nbsp;&nbsp;
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
                            Edit
                          </Button>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <Button
                            variant='outlined'
                            onClick={() => handleDelete(item.itemCode)}
                            startIcon={<Delete />}
                          >
                          </Button>
                        </>
                      )}

                    </TableCell>
                  </TableRow>

                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
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
