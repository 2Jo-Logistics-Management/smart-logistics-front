import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
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
  styled,
} from "@mui/material";
import { close_Modal } from "../../../../redux/slices/receiveModalDuck";
import pOrderWaitIngAxios from "src/axios/pOrderWaitIngAxios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider, DesktopDateTimePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import axios from "axios";
import PageviewOutlinedIcon from "@mui/icons-material/PageviewOutlined";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#505e82",
    color: theme.palette.common.white,
    width: "200px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 40,
    minWidth: 100,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme, receiveCode }) => ({
  backgroundColor: receiveCode ? "lightyellow" : "white",
  "&:nth-of-type(odd)": {
    backgroundColor: receiveCode ? "lightyellow" : theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
          width: "80%",
          maxWidth: "80%",
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
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<PageviewOutlinedIcon />}
                onClick={handleClick}
                sx={{ mr: 2 }}
              >
                조회
              </Button>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    <Typography variant="h6" fontWeight={600}>
                      발주번호
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="h6" fontWeight={600}>
                      거래처번호
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="h6" fontWeight={600}>
                      담당자
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="h6" fontWeight={600}>
                      진행상태
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="h6" fontWeight={600}>
                      발주일
                    </Typography>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((porders, index) => {
                  const { porderCode, accountNo, manager, state, porderDate } = porders;
                  return (
                    <StyledTableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                        backgroundColor:
                          selectedRow === porderCode ? "rgba(0, 0, 0, 0.04)" : "transparent",
                      }}
                      onClick={() => handleProductClick(porderCode)}
                    >
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={400}>
                          {porderCode}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={400}>
                          {accountNo}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={400}>
                          {manager}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={400}>
                          {state}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={400}>
                          {porderDate.split(" ")[0]}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
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
                  <StyledTableRow sx={{ backgroundColor: "#" }}>
                    <StyledTableCell>
                      <Typography variant="h6" fontWeight={600}>
                        선택
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="h6" fontWeight={600}>
                        발주순번
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="h6" fontWeight={600}>
                        품목코드
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="h6" fontWeight={600}>
                        수량
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="h6" fontWeight={600}>
                        단가
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="h6" fontWeight={600}>
                        총금액
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="h6" fontWeight={600}>
                        진행상태
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="h6" fontWeight={600}>
                        납기일
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {porderItemData.map((product, index) => (
                    <StyledTableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <StyledTableCell sx={{ padding: "3px" }}>
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
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={400}>
                          {product.porderItemNo}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={400}>
                          {product.itemCode}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={400}>
                          {product.porderCount}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={400}>
                          {product.porderPrice}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={400}>
                          {product.porderItemPrice}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={400}>
                          {product.porderState}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight={400}>
                          {product.receiveDeadline.split(" ")[0]}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
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
