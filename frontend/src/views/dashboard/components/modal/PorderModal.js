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
import ko from 'date-fns/locale/ko';


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
    // 클릭한 거래처의 contactNumber를 선택한 거래처번호 상태 변수에 저장
    setSelectedAccountContactNumber(clickedItem.contactNumber);

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
      console.log(selectedItems);
      itemAddAxios(selectedItems);
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
    if (!selectedItems.some(item => item.number === clickedItem.itemCode)) {
      console.log(clickedItem)
      const newItem = {
        number: clickedItem.itemCode,
        name: clickedItem.itemName,
        size: clickedItem.spec, // 이 필드의 이름이 맞는지 확인해주세요
        quantity: '0', // 초기에는 수량을 0으로 설정합니다.
        price: clickedItem.itemPrice,
        date: new Date(),

      };
      setSelectedItems(prevItems => [...prevItems, newItem]);
    }
  };



  const handleConfirmEdit = () => {
    // editedData에 저장된 변경된 행을 selectedItems에 반영
    setSelectedItems((prevData) => {
      const newData = prevData.map((item) =>
        item.number === editedData.number ? { ...item, quantity: editedData.quantity, price: editedData.price } : item
      );
      console.log(newData);
      return newData;
    });
    // editedData 초기화
    setEditedData({});
  };

  const handleDelete = (itemNumber) => {
    setSelectedItems((prevData) => prevData.filter((item) => item.number !== itemNumber));
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
 


  const handleDateChange = (index, date) => {
    console.log("순서" + index + "날짜" + date)
    setSelectedItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index].date = date;
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
        <Box sx ={{display: 'flex'}}>
        <Box sx = {{flex: 1, padding: '16px'}}> 
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '16px', justifyContent: 'flex-end' }}>
          <p style={{ marginRight: '8px' }}>거래처명:</p>
          <TextField sx={{ width: '150px', marginRight: '16px' }} variant="outlined" size="small"
            value={selectedCompanyName} onChange={(e) => setSelectedCompanyName(e.target.value)} />
          <Button Icon={<SearchIcon />} onClick={() => handleAccountSearchClick(selectedCompanyName)}>거래처 조회</Button>
        </Box>

        <Table title="거래처선택" style={{ textAlign: 'center' }}>
          <TableHead>
            <TableRow>
              <TableCell>거래처번호</TableCell>
              <TableCell>거래처명</TableCell>
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
                  color="primary"
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
          <p style={{ marginRight: '8px' }}>거래처번호:</p>
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
              <TableCell>품번</TableCell>
              <TableCell>품명</TableCell>
              <TableCell>규격</TableCell>
              <TableCell>단가</TableCell>
              <TableCell>금액</TableCell>
              <TableCell>quantity</TableCell>
              <TableCell>납기일</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedItems.map((item, index) => (
              <TableRow key={`selected-${index}`}>
                <TableCell>{item.number}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>
                  {editedData.number === item.number ? (
                    <input
                      type="number"
                      value={editedData.price}
                      onChange={(e) =>
                        setEditedData((prevData) => ({ ...prevData, price: e.target.value }))
                      }
                    />
                  ) : (
                    item.price
                  )}
                </TableCell>

                <TableCell>{item.price}</TableCell>
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
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <DatePicker
                        renderInput={(props) => <TextField {...props} />}
                        label="마감 일자"
                        value={item.date} // Use the date from the item
                        onChange={(date) => {
                          console.log("날짜" + date)
                          handleDateChange(index, date)
                        }} // Add this handler
                        views={['year', 'month', 'day']}
                        format='yyyy-MM'
                        slotProps={{ textField: { variant: 'outlined', size: "small" } }}
                        minDate={new Date('2022-07-01')}
                        maxDate={new Date("2100-01-01")}
                      />
                    </Box>
                  </LocalizationProvider>

                </TableCell>
                <TableCell>
                  {editedData.number === item.number ? ( // 현재 행이 수정 중인 행이라면
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
                        onClick={() => handleDelete(item.number)}
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
