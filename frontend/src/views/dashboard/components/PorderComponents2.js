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
  Dialog, DialogContent, DialogTitle,
  TableFooter
} from '@mui/material';
import { Edit, Done } from '@mui/icons-material';
import DashboardCard from '../../../components/shared/DashboardCard';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { Pagination } from '@mui/material';
import { LocalizationProvider, DesktopDateTimePicker,DatePicker } from '@mui/x-date-pickers';
import swal from 'sweetalert2'
import { toggleCheckbox } from 'src/redux/slices/pOrderInfoCheckboxReducer';
import { REMOVE_ALL_SELECTED_PRODUCTS } from 'src/redux/slices/selectedProductsReducer';


const PorderComponets2 = () => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [tempProducts, setTempProducts] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const products = useSelector((state) => state.selectedPOrderList.selectedPOrderList)
  const [selectedItemName, setSeletedItemName] = useState("");
  const [pOrderCode, setPOrderCode] = useState("");
  const [lastPorderItemNo, setLastPorderItemNo] = useState(null);
  const [isDataUpdated, setDataUpdated] = useState(false);
  const [pOrderCount, setPOrderCount] = useState("");
  const [pOrderItemState, setPOrderItemState] = useState("");
  useEffect(() => {
    if (products.data) {
      const newVisibleProducts = products.data.slice(0, visibleCount);
      if (JSON.stringify(newVisibleProducts) !== JSON.stringify(visibleProducts)) {
        setVisibleProducts(newVisibleProducts);
      }
      setDataUpdated(false);
    }

  }, [products.data, visibleCount, visibleProducts, isDataUpdated]);

  useEffect(() => {

    if (visibleProducts && visibleProducts.length > 0) {
      const realPOrderCode = visibleProducts[0].porderCode;
      setPOrderCode(realPOrderCode);
    }

  }, [visibleProducts,])


  const dispatch = useDispatch();
  const selectedProducts = useSelector((state) => state.pOrderInfoCheckbox.selectedCheckBox);
  const removeCheckboxPOrder = useSelector((state) => state.selectedProduct.selectedProduct);

  const handleCheckboxChange = (selectedPOrder) => {
    if (removeCheckboxPOrder) {
      dispatch(REMOVE_ALL_SELECTED_PRODUCTS());
      dispatch(toggleCheckbox(selectedPOrder))
    }

  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const newVisibleCount = visibleCount + 10;
      setVisibleCount(newVisibleCount);
    }
    e.target = clientHeight;
  };

  // const porderModalState = useSelector((state) => state.porderModal);


  function formatDate(receiveDeadline) {
    const { format } = require('date-fns');
    const formattedDate = format(receiveDeadline, 'yyyy-MM-dd');
    return formattedDate
  }
  const pOrderitemInsert = () => {
    if (noAddState == true) {
      swal.fire({
        title: '발주추가 실패',
        text: '발주가 완료되어 추가할 수 없습니다',
        icon: 'error',
        showConfirmButton: false,
      });
      return;
    }
    try {
      const data = {
        itemCode: itemCode,
        receiveDeadline: formatDate(selectedDateTime),
        pOrderPrice: pOrderPrice,
        pOrderItemPrice: pOrderItemPrice,
        pOrderCode: pOrderCode,
        pOrderCount: pOrderCount,

      }
      axios.post('http://localhost:8888/api/porder-item/insert', data)
        .then((response) => {
          setDataUpdated(true);
          window.location.reload();
          // localStorage.clear(); 
        })
        .catch((error) => {
          console.error(error);
        });

    } catch (error) {
      swal.fire({
        title: '발주추가 실패',
        text: '데이터를 모두 입력해주시기 바랍니다',
        icon: 'error',
        showConfirmButton: false,
      });
    }

  };


  // 모달창으로 품목 가져오기

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const [itemCode, setItemCode] = useState("");
  const [pOrderPrice, setPOrderPrice] = useState("");
  const [pOrderItemPrice, setPOrderItemPrice] = useState("");
  const handleTextFieldClick = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

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
  const handleItemSearchClick = (searchData) => {
    axios.get(`http://localhost:8888/api/item/list?itemName=${searchData}`)
      .then(response => {
        const itemSearchData = response.data.data
        setItems(itemSearchData);
      })
  }


  // visibleProducts 배열의 마지막 항목의 product.porderItemNo 값을 갱신
  useEffect(() => {
    if (visibleProducts.length > 0) {
      setLastPorderItemNo((visibleProducts[visibleProducts.length - 1].porderItemNo) + 1);
    }
  }, [visibleProducts]);

  const [editItemCode, setEditItemCode] = useState('');
  const [editReceiveDeadLine, setEditReceiveDeadLine] = useState('');
  const [editPOrderCount, setEditPOrderCount] = useState('');
  const [editPOrderItemPrice, setEditPOrderItemPrice] = useState('');

  const [pOrderItemNo, setPOrderItemNo] = useState('');

  const handleRowClick = (item) => {
    setPOrderPrice(item.itemPrice);
    setPOrderItemPrice(item.itemPrice);
    setItemCode(item.itemCode);

    setEditItemCode(item.itemCode);
    setEditPOrderItemPrice(item.itemPrice);
  }


  const handleEdit = (productId) => {
    setEditMode((prevState) => ({ ...prevState, [productId]: !prevState[productId] }));
    if (editMode[productId]) { // 이 부분을 수정하여 "Save" 버튼을 눌렀을 때만 axios 통신이 일어나도록 함
      const index = tempProducts.findIndex((product) => product.id === productId);
      const updatedProducts = [...tempProducts];

      setTempProducts(updatedProducts);

    }
  };


  const handleChange = (productId, property, value) => {
    const index = tempProducts.findIndex((product) => product.porderItemNo === productId);

    if (index !== -1) {
      const updatedProducts = [...tempProducts];
      updatedProducts[index] = {
        ...updatedProducts[index], // 복사해서 기존 데이터 유지
        [property]: value, // property에 해당하는 필드를 value로 업데이트
      };
      setTempProducts(updatedProducts);
    }
  };
  const pOrderItemEdit = () => {
    try {
      const pOrderItemStateModifyDto = {
        itemCode: editItemCode,
        pOrderCount: editPOrderCount,
        pOrderItemPrice: editPOrderItemPrice,
        pOrderCode: pOrderCode,
        receiveDeadline: formatDate(editReceiveDeadLine),
        pOrderPrice: editPOrderItemPrice
      }

      axios.patch(`http://localhost:8888/api/porder-item/modify?pOrderItemNo=${pOrderItemNo}`, pOrderItemStateModifyDto)
        .then(() => {
          window.location.reload();

        })
    } catch (error) {
      swal.fire({
        title: '발주추가 실패',
        text: '데이터를 모두 입력해주시기 바랍니다',
        icon: 'error',
        showConfirmButton: false,
      });
    }


  }
  const [noAddState, setNoAddState] = useState("");

  const areAllCompleted = () => {
    return visibleProducts.every(product => product.porderState === '완료');
  }
  useEffect(() => {
    const allCompleted = areAllCompleted();
    // '완료' 상태인 경우 noAddState를 true로 설정
    if (allCompleted) {
      setNoAddState(true);
    } else {
      setNoAddState(false);
    }

    // 다른 코드
  }, [visibleProducts]);

  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
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
              <TableCell>발주상태</TableCell>
              <TableCell>품목번호</TableCell>
              <TableCell>가격</TableCell>
              <TableCell>수량</TableCell>
              <TableCell>금액</TableCell>
              <TableCell>납기일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>

              <TableCell></TableCell>
              <TableCell sx={{ display: "none" }}><TextField value={lastPorderItemNo} /></TableCell>
              <TableCell><TextField value={"WAIT"} disabled></TextField></TableCell>
              <TableCell><TextField value={itemCode} onClick={handleTextFieldClick} /></TableCell>
              <TableCell><TextField value={pOrderPrice} onChange={(e) => setPOrderPrice(e.target.value)} /></TableCell>
              <TableCell><TextField onChange={(e) => setPOrderCount(e.target.value)} /></TableCell>
              <TableCell>{pOrderPrice * pOrderCount}</TableCell>
              <TableCell>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label= {`금일 (${formattedToday})`}
                    value={selectedDateTime}
                    onChange={(newDate) => setSelectedDateTime(newDate)}
                    views={['year', 'month', 'day']}
                    format='yyyy-MM-dd'
                    slotProps={{ textField: { variant: 'outlined', size: "small" } }}
                    minDate={new Date()}
                    maxDate={new Date('2100-12-31')} // Optional: Restrict selection up to the end date
                  />

                </LocalizationProvider>

              </TableCell>
              <TableCell><Button variant="contained"
                size="small" ><Done onClick={() => pOrderitemInsert()} /></Button></TableCell>
            </TableRow>
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
                      onChange={() => {
                        handleCheckboxChange(product.porderItemNo)
                        setPOrderItemState(product.porderState)

                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '15px', fontWeight: '500' }} >{product.porderState}</Typography>
                  </TableCell>
                  <TableCell>
                    {editMode[product.porderItemNo] ? (
                      <TextField
                        value={editItemCode}
                        onClick={() => { setIsModalOpen(true) }}
                        onChange={(e) => {
                          handleChange(product.porderItemNo, 'itemCode', e.target.value);
                          setEditItemCode(e.target.value)
                          setPOrderCode(product.porderCode)
                        }}
                      />
                    ) : (
                      <Typography variant="subtitle2" fontWeight={600}>
                        {product.itemCode}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[product.porderItemNo] ? (
                      <TextField
                        value={editPOrderItemPrice}
                        onChange={(e) => {
                          handleChange(product.porderItemNo, 'porderPrice', e.target.value)
                          setEditPOrderItemPrice(e.target.value)

                        }}
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
                        defaultvalue={product.porderCount}
                        onChange={(e) => {
                          handleChange(product.porderItemNo, 'porderCount', e.target.value)
                          setEditPOrderCount(e.target.value)
                        }}
                      />
                    ) : (
                      <Typography variant="subtitle2" fontWeight={600}>
                        {product.porderCount}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[product.porderItemNo] ? (
                      <Typography variant="subtitle2" fontWeight={600}>
                        {editPOrderItemPrice * editPOrderCount}</Typography>
                    ) : (
                      <Typography variant="subtitle2" fontWeight={600}>
                        {(+product.porderCount) * (+product.porderPrice)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[product.porderItemNo] ? (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDateTimePicker
                          value={selectedDateTime}
                          onChange={(newDate) => setEditReceiveDeadLine(newDate)}
                          renderInput={(props) => <TextField {...props} />}
                          views={["year", "month", "day", "hours", "minutes"]}
                        />
                      </LocalizationProvider>)
                      : (
                        <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>{product.receiveDeadline}</Typography>
                      )
                    }
                  </TableCell>
                  <TableCell>
                    {product.porderState !== "준비" ?
                      (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Done />}
                        />
                      )
                      : (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={
                            editMode[product.porderItemNo] ? (
                              <Done />
                            ) : (
                              <Edit />
                            )
                          }
                          onClick={() => {
                            if (editMode[product.porderItemNo]) {
                              pOrderItemEdit();  // Save 버튼을 누를 때만 수정이 되어야 하므로 이벤트 호출 위치를 조정
                            }
                            handleEdit(product.porderItemNo);
                            setPOrderItemNo(product.porderItemNo)
                          }}
                        >
                          {editMode[product.porderItemNo] ? 'Save' : 'Edit'}
                        </Button>
                      )
                    }
                  </TableCell>

                  <TableCell sx={{ display: "none" }} >
                    <Typography
                      value={product.porderCode}
                      onChange={(e) => setPOrderCode(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>

      </Box>
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>품목추가</DialogTitle>
        <DialogContent>
          <h2>품목선택리스트</h2>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '16px', justifyContent: 'flex-end' }}>
            <p style={{ marginRight: '8px' }}>품목명:</p>
            <TextField sx={{ width: '150px', marginRight: '16px' }} variant="outlined" size="small"
              value={selectedItemName} onChange={(e) => setSeletedItemName(e.target.value)} />
            <Button onClick={() => handleItemSearchClick(selectedItemName)}>품목명 조회</Button>
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
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
};

export default PorderComponets2;
