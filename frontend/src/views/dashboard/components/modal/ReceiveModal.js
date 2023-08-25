import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import Select from "react-select";
import { Select } from "@mui/material";
import swal from "sweetalert2";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  MenuItem,
} from "@mui/material";
import { close_Modal } from "../../../../redux/slices/receiveModalDuck";
import { Check, Delete } from "@mui/icons-material";
import pOrderWaitIngAxios from "src/axios/pOrderWaitIngAxios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider, DesktopDateTimePicker } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import ko from "date-fns/locale/ko"; // 한국어 로케일 import
import { TextField } from "@mui/material";
import axios from "axios";
import receiveInsertAxios from "src/axios/receiveInsertAxios";
axios.defaults.withCredentials = true;
const ReceiveModal = () => {
  const dispatch = useDispatch();
  const receiveModalState = useSelector((state) => state.receiveModal.openModal);
  const [searchPOrders, setSearchPOrder] = useState([]);
  const [selectedPOrderCode, setSelectedPOrderCode] = useState([]);
  const [selectedItemCode, setSelectedItemCode] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedPOrderDate, setSelectedPOrderDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [porderItemData, setPorderItemData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [porderFind, setPorderFind] = useState([]);
  const ITEMS_PER_PAGE = 5; // 한 페이지당 표시할 아이템 개수
  const [selectedWarehouses, setSelectedWarehouses] = useState({});
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태

  const [warehouseOptions, setWarehouseOptions] = useState([]);

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [receiveManager, setReceiveManager] = useState(null);
  const [receiveItemCounts, setReceiveItemCounts] = useState(
    Array(selectedProducts.length).fill("")
  );

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1); // 페이지 변경 시 현재 페이지 상태 업데이트
  };
  // const isReceiveManagerValid = receiveManager.trim() !== "";
  // const isDateTimeValid = selectedDateTime !== null;
  // 현재 페이지에 따른 아이템들 계산
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = Array.isArray(searchPOrders)
    ? searchPOrders.slice(offset, offset + ITEMS_PER_PAGE)
    : [];

  useEffect(() => {
    pOrderWaitIngAxios(selectedItems)
      .then((data) => {
        setSearchPOrder(data.data); // Assuming the data you want to display is stored in 'data' field
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedItems]);

  useEffect(() => {
    axios
      .get("http://localhost:8888/api/warehouse/list") // Update the URL as needed
      .then((response) => {
        console.log("warehouseList : " + JSON.stringify(response.data.data));
        setWarehouseOptions(response.data.data); // Assuming the response contains an array of warehouse options
      })
      .catch((error) => {
        console.error("Error fetching warehouse data:", error);
      });
  }, []);

  const handleCancel = () => {
    dispatch(close_Modal());
  };
  const handleReceiveItemCountChange = (value, index) => {
    const updatedItemCounts = [...receiveItemCounts];
    updatedItemCounts[index] = value;
    setReceiveItemCounts(updatedItemCounts);
  };
  const handleSave = (receiveManager, selectedDateTime) => {
    const dateTimeObj = new Date(selectedDateTime);

    // 년, 월, 일, 시간, 분, 초를 가져옴
    const year = dateTimeObj.getFullYear();
    const month = (dateTimeObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateTimeObj.getDate().toString().padStart(2, "0");
    const hours = dateTimeObj.getHours().toString().padStart(2, "0");
    const minutes = dateTimeObj.getMinutes().toString().padStart(2, "0");
    const seconds = dateTimeObj.getSeconds().toString().padStart(2, "0");

    // 년월일 시간 형식으로 조합
    const finalReceiveDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const insertData = selectedProducts.map((product, index) => ({
      porderCode: product.porderCode,
      porderItemNo: product.porderItemNo,
      itemCode: product.itemCode,
      accountNo: product.accountNo,
      receiveCount: receiveItemCounts[index],
      warehouseNo: selectedWarehouses[index],
    }));
    receiveInsertAxios([receiveManager, finalReceiveDateTime, { insertData }]);
    dispatch(close_Modal());
  };
  const handleSelectedWarehouse = (event, rowIndex) => {
    const updatedSelectedWarehouses = { ...selectedWarehouses };
    updatedSelectedWarehouses[rowIndex] = event.target.value;
    setSelectedWarehouses(updatedSelectedWarehouses);
  };

  const handleSelectePOrderCode = (selectedOption) => {
    setSelectedPOrderCode(selectedOption);
  };

  const handleSelectedItemCode = (selectedOption) => {
    handleSelectedItemCode(selectedOption);
  };

  const handleFilterData = () => {
    const selectedData = {
      porderCode: selectedPOrderCode?.value || null,
      itemCode: selectedItemCode?.value || null,
      quantity: "0", // 초기에는 수량을 0으로 설정합니다.
    };
    setSelectedItems([...selectedItems, selectedData]);
  };

  const handleProductClick = async (selectPorderCode) => {
    try {
      const response = await axios.get("http://localhost:8888/api/porder-item/list", {
        params: {
          pOrderCode: selectPorderCode,
        },
      });
      console.log(response.data);
      setPorderItemData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleCheckboxChange = (porderCode, porderItemNo, itemCode) => {
    const selectedProduct = searchPOrders.find((product) => product.porderCode === porderCode);

    if (selectedProduct) {
      axios
        .get("http://localhost:8888/api/receive/availableCount", {
          params: {
            porderCode: porderCode,
            porderItemNo: porderItemNo,
          },
        })
        .then((response) => {
          const availableCount = response.data.data;
          const { manager, accountNo } = selectedProduct;

          // Create a new product object with updated availableCount
          const newProduct = {
            porderCode,
            porderItemNo,
            itemCode,
            manager,
            accountNo,
            availableCount,
          };

          const existingProductIndex = selectedProducts.findIndex(
            (product) => product.porderCode === porderCode && product.porderItemNo === porderItemNo
          );

          if (existingProductIndex !== -1) {
            // Replace the existing product with the new product
            const updatedProducts = [...selectedProducts];
            updatedProducts[existingProductIndex] = newProduct;
            setSelectedProducts(updatedProducts);
          } else {
            setSelectedProducts((prevProducts) => [...prevProducts, newProduct]);
          }
        })
        .catch((error) => {
          console.error("Error fetching availableCount data:", error);
        });
    } else {
      console.log("Product not found for porderCode:", porderCode);
    }
  };

  return (
    <Dialog
      open={receiveModalState}
      PaperProps={{
        sx: {
          width: "200%",
          maxWidth: "200%",
          height: "100%",
          maxHeight: "md",
        },
      }}
    >
      <DialogTitle>입고 등록</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: 1, padding: "16px", minWidth: "50%", marginRight: "16px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "70px",
                marginBottom: "16px",
              }}
            >
              발주번호
              <TextField value={selectedPOrderCode} onChange={handleSelectePOrderCode} />
              거래처번호
              <TextField value={selectedItemCode} onChange={handleSelectedItemCode} />
              담당자
              <TextField></TextField>
              발주일
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="조회 시작일"
                  value={selectedStartDate}
                  onChange={(newDate) => setSelectedStartDate(newDate)}
                  renderInput={(props) => <TextField {...props} />}
                  format="yyyy.MM.dd"
                />
                <DatePicker
                  label="조회 종료일"
                  value={selectedEndDate}
                  onChange={(newDate) => setSelectedEndDate(newDate)}
                  renderInput={(props) => <TextField {...props} />}
                  format="yyyy.MM.dd"
                />
              </LocalizationProvider>
              <Button variant="contained" onClick={handleFilterData}>
                조회
              </Button>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>발주번호</TableCell>
                  <TableCell>거래처번호</TableCell>
                  <TableCell>담당자</TableCell>
                  <TableCell>진행상태</TableCell>
                  <TableCell>발주일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((porders, index) => {
                  const { porderCode, accountNo, manager, state, porderDate } = porders;
                  return (
                    <TableRow key={index} onClick={() => handleProductClick(porderCode)}>
                      <TableCell>{porderCode}</TableCell>
                      <TableCell>{accountNo}</TableCell>
                      <TableCell>{manager}</TableCell>
                      <TableCell>{state}</TableCell>
                      <TableCell>{porderDate.split(" ")[0]}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  my: 2,
                }}
              >
                {searchPOrders ? (
                  <Pagination
                    count={Math.ceil(searchPOrders.length / ITEMS_PER_PAGE)}
                    page={currentPage + 1}
                    variant="outlined"
                    color="primary"
                    onChange={handlePageChange}
                  />
                ) : (
                  <div>Loading products...</div>
                )}
              </Box>
            </Box>

            <Box sx={{ overflow: "auto", maxHeight: "400px" }}>
              <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
                <TableHead
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    backgroundColor: "#fff",
                  }}
                >
                  <TableRow sx={{ backgroundColor: "#" }}>
                    <TableCell>발주순번</TableCell>
                    <TableCell>품목코드</TableCell>
                    <TableCell>수량</TableCell>
                    <TableCell>단가</TableCell>
                    <TableCell>총금액</TableCell>
                    <TableCell>진행상태</TableCell>
                    <TableCell>납기일</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {porderItemData.map((product, index) => (
                    <TableRow
                      key={index}
                      onClick={() =>
                        handleCheckboxChange(
                          product.porderCode,
                          product.porderItemNo,
                          product.itemCode
                        )
                      }
                    >
                      <TableCell>{product.porderItemNo}</TableCell>
                      <TableCell>{product.itemCode}</TableCell>
                      <TableCell>{product.porderCount}</TableCell>
                      <TableCell>{product.porderPrice}</TableCell>
                      <TableCell>{product.porderItemPrice}</TableCell>
                      <TableCell>{product.porderState}</TableCell>
                      <TableCell>{product.receiveDeadline.split(" ")[0]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
          <Box sx={{ flex: 1, padding: "16px", minWidth: "50%" }}>
            <Table>
              <TableBody>
                담당자 :
                <TableCell>
                  <TextField
                    value={receiveManager}
                    onChange={(e) => setReceiveManager(e.target.value)}
                  />
                  {/* <TextField
                    error={!isReceiveManagerValid}
                    helperText={!isReceiveManagerValid && "필수 입력"}
                    value={receiveManager}
                    onChange={(e) => setReceiveManager(e.target.value)}
                  /> */}
                </TableCell>
                입고일시 :
                <TableCell>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDateTimePicker
                      value={selectedDateTime}
                      onChange={(newDate) => setSelectedDateTime(newDate)}
                      renderInput={(props) => <TextField {...props} />}
                      views={["year", "month", "day", "hours", "minutes"]}
                      format="yyyy.MM.dd / HH:mm"
                      defaultValue={new Date()}
                    />
                  </LocalizationProvider>
                  {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDateTimePicker
                      value={selectedDateTime}
                      onChange={(newDate) => setSelectedDateTime(newDate)}
                      renderInput={(props) => <TextField {...props} />}
                      views={["year", "month", "day", "hours", "minutes"]}
                      format="yyyy.MM.dd / HH:mm"
                      defaultValue={new Date()}
                      error={!isDateTimeValid}
                    />
                  </LocalizationProvider> */}
                </TableCell>
              </TableBody>
            </Table>
            <Box sx={{ flex: 1, padding: "16px", minWidth: "50%" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>발주번호</TableCell>
                    <TableCell>발주순번</TableCell>
                    <TableCell>품목코드</TableCell>
                    <TableCell>거래처번호</TableCell>
                    <TableCell>입고수량</TableCell>
                    <TableCell>창고선택</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.porderCode}</TableCell>
                      <TableCell>{product.porderItemNo}</TableCell>
                      <TableCell>{product.itemCode}</TableCell>
                      <TableCell>{product.accountNo}</TableCell>
                      <TableCell>
                        {/* <TextField
                          label={`잔량: ${product.availableCount}`}
                          value={receiveItemCount} // Add this line to bind the value
                          onChange={(e) => setReceiveItemCount(e.target.value)} // Update only the state
                        /> */}
                        <TextField
                          label={`잔량: ${product.availableCount}`}
                          value={receiveItemCounts[index]} // Use the specific value for this row
                          onChange={(e) => handleReceiveItemCountChange(e.target.value, index)} // Pass the index
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          label="창고선택"
                          value={selectedWarehouses[index] || ""}
                          onChange={(event) => handleSelectedWarehouse(event, index)}
                          displayEmpty
                          inputProps={{ "aria-label": "Select warehouse" }}
                        >
                          {warehouseOptions.map((warehouse) => (
                            <MenuItem key={warehouse.warehouseNo} value={warehouse.warehouseNo}>
                              {warehouse.warehouseName}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          onClick={() => {
            setReceiveManager(receiveManager);
            handleSave(receiveManager, selectedDateTime);
          }}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReceiveModal;
