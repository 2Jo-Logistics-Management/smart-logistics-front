import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Checkbox,
} from "@mui/material";
import { close_Modal } from "../../../../redux/slices/receiveModalDuck";
import pOrderWaitIngAxios from "src/axios/pOrderWaitIngAxios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider, DesktopDateTimePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import axios from "axios";
axios.defaults.withCredentials = true;
const ReceiveModal = ({ onSave, modalUpdateSelectedProducts }) => {
  const dispatch = useDispatch();
  const receiveModalState = useSelector((state) => state.receiveModal.openModal);
  const [checkedRows, setCheckedRows] = useState([]);

  const [visibleItems, setVisibleItems] = useState([]);
  const [visibleItemCount, setVisibleItemCount] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [updatedModalState, setUpdatedModalState] = useState(receiveModalState);
  const [modalSelectedProducts, setModalSelectedProducts] = useState([]);
  const [searchManager, setSearchManager] = useState("");
  const [searchPOrders, setSearchPOrder] = useState([]);
  const [searchPOrderCode, setSearchPOrderCode] = useState("");
  const [searchItemCode, setSearchItemCode] = useState("");
  const [searchAccountNo, setSearchAccountNo] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [porderItemData, setPorderItemData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedWarehouses, setSelectedWarehouses] = useState(
    Array(modalSelectedProducts.length).fill("")
  );
  const [warehouseOptions, setWarehouseOptions] = useState([]);

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [receiveManager, setReceiveManager] = useState(null);
  const [receiveItemCounts, setReceiveItemCounts] = useState(
    Array(modalSelectedProducts.length).fill("")
  );

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1);
  };

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = Array.isArray(searchPOrders)
    ? searchPOrders.slice(offset, offset + ITEMS_PER_PAGE)
    : [];
  useEffect(() => {
    if (selectedStartDate === null) {
      setSelectedStartDate(new Date());
    }
    if (selectedEndDate === null) {
      setSelectedEndDate(new Date());
    }
  }, []);
  useEffect(() => {
    setVisibleItems(searchPOrders.slice(0, visibleItemCount));
  }, [visibleItemCount, searchPOrders]);

  useEffect(() => {
    pOrderWaitIngAxios()
      .then((data) => {
        const initialVisibleItemCount = Math.min(data.data.length, visibleItemCount);
        setVisibleItemCount(initialVisibleItemCount);
        setSearchPOrder(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedItems]);

  useEffect(() => {
    axios
      .get("http://localhost:8888/api/warehouse/list")
      .then((response) => {
        setWarehouseOptions(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching warehouse data:", error);
      });
  }, []);

  const handleCancel = () => {
    dispatch(close_Modal());
  };
  const handleDone = async () => {
    modalUpdateSelectedProducts(modalSelectedProducts);

    dispatch(close_Modal());
    onSave();
    setModalSelectedProducts([]);
    setPorderItemData([]);
    setCheckedRows([]);
    setReceiveManager(null);
    setSelectedDateTime(null);
    setSelectedRow(null);
  };

  const handleSelectePOrderCode = (e) => {
    setSearchPOrderCode(e.target.value);
  };

  const handleSelectedAccountNo = (e) => {
    setSearchAccountNo(e.target.value);
  };
  const handleSelectedManger = (e) => {
    setSearchManager(e.target.value);
  };
  const handleClick = () => {
    let timerInterval;
    const findDateStart = new Date(selectedStartDate);
    const findDateEnd = new Date(selectedEndDate);
    const startYear = findDateStart.getFullYear();
    const startMonth = (findDateStart.getMonth() + 1).toString().padStart(2, "0");
    const startDay = findDateStart.getDate().toString().padStart(2, "0");
    const searchStartDate = `${startYear}-${startMonth}-${startDay}`;

    const endYear = findDateEnd.getFullYear();
    const endMonth = (findDateEnd.getMonth() + 1).toString().padStart(2, "0");
    const endDay = findDateEnd.getDate().toString().padStart(2, "0");

    const searchEndDate = `${endYear}-${endMonth}-${endDay}`;

    pOrderWaitIngAxios(
      searchPOrderCode,
      searchManager,
      searchAccountNo,
      searchStartDate,
      searchEndDate
    )
      .then((data) => {
        const initialVisibleItemCount = Math.min(data.data.length, visibleItemCount);
        setVisibleItemCount(initialVisibleItemCount);
        setSearchPOrder(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
    setPorderItemData([]);
    setCheckedRows([]);
  };

  const handleProductClick = async (selectPorderCode) => {
    setSelectedRow(selectPorderCode);
    try {
      const response = await axios.get("http://localhost:8888/api/porder-item/list?type=receive", {
        params: {
          pOrderCode: selectPorderCode,
        },
      });
      setPorderItemData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleCheckboxChange = (porderCode, porderItemNo, itemCode) => {
    const isChecked = checkedRows.includes(`${porderCode}-${porderItemNo}`);

    if (isChecked) {
      setCheckedRows(checkedRows.filter((row) => row !== `${porderCode}-${porderItemNo}`));
    } else {
      setCheckedRows([...checkedRows, `${porderCode}-${porderItemNo}`]);
    }

    const selectedProduct = searchPOrders.find((product) => product.porderCode === porderCode);

    if (selectedProduct) {
      axios
        .get("http://localhost:8888/api/porder-item/list/remainder", {
          params: {
            porderCode: porderCode,
            porderItemNo: porderItemNo,
          },
        })
        .then((response) => {
          const availableCount = response.data.data;
          const { manager, accountNo } = selectedProduct;

          const newProduct = {
            porderCode,
            porderItemNo,
            itemCode,
            manager,
            accountNo,
            availableCount,
          };

          const existingProductIndex = modalSelectedProducts.findIndex(
            (product) => product.porderCode === porderCode && product.porderItemNo === porderItemNo
          );

          if (existingProductIndex !== -1) {
            const updatedProducts = [...modalSelectedProducts];
            updatedProducts[existingProductIndex] = newProduct;
            setModalSelectedProducts(updatedProducts);
          } else {
            setModalSelectedProducts((prevProducts) => [...prevProducts, newProduct]);
          }
        })
        .catch((error) => {
          console.error("Error fetching availableCount data:", error);
        });
    }
  };

  return (
    <Dialog
      open={receiveModalState}
      PaperProps={{
        sx: {
          width: "70%",
          maxWidth: "70%",
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
                marginLeft: "0px",
              }}
            >
              발주번호
              <TextField size="small" value={searchPOrderCode} onChange={handleSelectePOrderCode} />
              거래처번호
              <TextField size="small" value={searchAccountNo} onChange={handleSelectedAccountNo} />
              담당자
              <TextField size="small" value={searchManager} onChange={handleSelectedManger} />
              발주일
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="조회 시작일"
                  value={selectedStartDate}
                  onChange={(newDate) => setSelectedStartDate(newDate)}
                  renderInput={(props) => <TextField {...props} />}
                  format="yyyy.MM.dd"
                  slotProps={{ textField: { size: "small" } }}
                />
                <DatePicker
                  label="조회 종료일"
                  value={selectedEndDate}
                  onChange={(newDate) => setSelectedEndDate(newDate)}
                  renderInput={(props) => <TextField {...props} />}
                  format="yyyy.MM.dd"
                  slotProps={{ textField: { size: "small" } }}
                />
              </LocalizationProvider>
              <Button variant="contained" onClick={handleClick}>
                조회
              </Button>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 300 }}>발주번호</TableCell>
                  <TableCell sx={{ width: 250 }}>거래처번호</TableCell>
                  <TableCell sx={{ width: 250 }}>담당자</TableCell>
                  <TableCell sx={{ width: 250 }}>진행상태</TableCell>
                  <TableCell>발주일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((porders, index) => {
                  const { porderCode, accountNo, manager, state, porderDate } = porders;
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                        backgroundColor:
                          selectedRow === porderCode ? "rgba(0, 0, 0, 0.04)" : "transparent",
                      }}
                      onClick={() => handleProductClick(porderCode)}
                    >
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
              <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 0 }}>
                <TableHead
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    backgroundColor: "#fff",
                  }}
                >
                  <TableRow sx={{ backgroundColor: "#" }}>
                    <TableCell sx={{ width: 150 }}>선택</TableCell>
                    <TableCell sx={{ width: 150 }}>발주순번</TableCell>
                    <TableCell sx={{ width: 150 }}>품목코드</TableCell>
                    <TableCell sx={{ width: 150 }}>수량</TableCell>
                    <TableCell sx={{ width: 150 }}>단가</TableCell>
                    <TableCell sx={{ width: 150 }}>총금액</TableCell>
                    <TableCell sx={{ width: 150 }}>진행상태</TableCell>
                    <TableCell>납기일</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {porderItemData.map((product, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <TableCell sx={{ padding: "3px" }}>
                        <Checkbox
                          checked={checkedRows.includes(
                            `${product.porderCode}-${product.porderItemNo}`
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              product.porderCode,
                              product.porderItemNo,
                              product.itemCode
                            )
                          }
                        />
                      </TableCell>
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} variant="outlined" color="error">
          돌아가기
        </Button>
        <Button
          onClick={() => {
            handleDone();
          }}
          color="primary"
          variant="contained"
        >
          완료
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReceiveModal;
