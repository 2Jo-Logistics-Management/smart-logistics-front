import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  Dialog,
  DialogContent,
  DialogTitle,
  TableFooter,
  styled,
  Chip,
} from "@mui/material";
import { Edit, Done } from "@mui/icons-material";
import DashboardCard from "../../../components/shared/DashboardCard";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { Pagination } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import swal from "sweetalert2";
import { toggleCheckbox } from "src/redux/slices/pOrderInfoCheckboxReducer";
import { REMOVE_ALL_SELECTED_PRODUCTS } from "src/redux/slices/selectedProductsReducer";
import { tableCellClasses } from "@mui/material/TableCell";
import { reload } from "src/redux/slices/pOrderListReducer";
import { seletedPOrderList } from "../../../redux/thunks/SelectedPOrderList";
const PorderComponets2 = () => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [tempProducts, setTempProducts] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const products = useSelector(
    (state) => state.selectedPOrderList.selectedPOrderList
  );
  const [selectedItemName, setSeletedItemName] = useState("");
  const [pOrderCode, setPOrderCode] = useState("");
  const [lastPorderItemNo, setLastPorderItemNo] = useState(null);
  const [isDataUpdated, setDataUpdated] = useState(false);
  const [pOrderCount, setPOrderCount] = useState("");
  const [pOrderItemState, setPOrderItemState] = useState("");
  const reloadFlag = useSelector((state) => state.pOrderList.reload);
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();

  useEffect(() => {
    if (products.data) {
      const newVisibleProducts = products.data.slice(0, visibleCount);
      if (
        JSON.stringify(newVisibleProducts) !== JSON.stringify(visibleProducts)
      ) {
        setVisibleProducts(newVisibleProducts);
        setDataUpdated(true);
      }
    } else {
      setVisibleProducts([]);
    }
  }, [
    products.data,
    visibleCount,
    visibleProducts,
    dispatch,
    visibleProducts,
    isDataUpdated,
  ]);

  useEffect(() => {
    if (visibleProducts && visibleProducts.length > 0) {
      const realPOrderCode = visibleProducts[0].porderCode;
      setPOrderCode(realPOrderCode);
    }
  }, [visibleProducts, dispatch]);

  useEffect(() => {
    if (reloadFlag === true) {
      dispatch(reload(false));
      dispatch(seletedPOrderList(pOrderCode));
    }
  }, [reloadFlag]);

  const selectedProducts = useSelector(
    (state) => state.pOrderInfoCheckbox.selectedCheckBox
  );
  const removeCheckboxPOrder = useSelector(
    (state) => state.selectedProduct.selectedProduct
  );

  const handleCheckboxChange = (selectedPOrder) => {
    if (removeCheckboxPOrder) {
      dispatch(REMOVE_ALL_SELECTED_PRODUCTS());
      dispatch(toggleCheckbox(selectedPOrder));
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
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#505e82",
      color: theme.palette.common.white,
      textAlign: "center",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 10,
      minWidth: 10,
      textAlign: "center",
    },
  }));

  const StyledTableRow = styled(TableRow)(() => ({
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  function formatDate(receiveDeadline) {
    const { format } = require("date-fns");
    const formattedDate = format(receiveDeadline, "yyyy-MM-dd");
    return formattedDate;
  }
  const pOrderitemInsert = () => {
    if (noAddState === true) {
      swal.fire({
        title: "발주추가 실패",
        text: "발주가 완료되어 추가할 수 없습니다",
        icon: "error",
        showConfirmButton: false,
      });
      return;
    }

    const newProduct = {
      itemCode: itemCode,
      receiveDeadline: formatDate(selectedDateTime),
      pOrderPrice: pOrderPrice,
      pOrderItemPrice: pOrderItemPrice,
      pOrderCode: pOrderCode,
      pOrderCount: pOrderCount,
    };

    axios
      .post("http://localhost:8888/api/porder-item/insert", newProduct)
      .then((response) => {
        // 서버 응답에서 할당된 porderItemNo를 가져옵니다.

        const newPorderItemNo = response.data.data;

        // 새 제품 데이터에 porderItemNo를 할당
        newProduct.porderItemNo = newPorderItemNo;
        const updatedVisibleProducts = [...visibleProducts, newProduct];
        setVisibleProducts(updatedVisibleProducts);
        // 나머지 초기화 및 알림 처리
        setDataUpdated(true);
        swal.fire({
          title: "발주추가 성공",
          text: "데이터를 모두 입력해주시기 바랍니다",
          icon: "success",
          showConfirmButton: false,
        });
        setItemCode("");
        setSelectedDateTime("");
        setPOrderItemPrice("");
        setPOrderPrice("");
        setPOrderCount("");
        setItemName("");
        setPOrderCode(pOrderCode);
        dispatch(seletedPOrderList(pOrderCode));
      })
      .catch((error) => {
        console.error(error);
      });
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
  const [itemName, setItemName] = useState("");
  const handleTextFieldClick = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  useEffect(() => {
    axios
      .get("http://localhost:8888/api/item/list")
      .then((response) => {
        const fetchedItems = response.data.data;
        setItems(fetchedItems);
      })
      .catch((error) => {
        console.error("첫번째 options에서 에러 발생", error);
      });
  }, []);
  const handleItemSearchClick = (searchData) => {
    axios
      .get(`http://localhost:8888/api/item/list?itemName=${searchData}`)
      .then((response) => {
        const itemSearchData = response.data.data;
        setItems(itemSearchData);
      });
  };

  // visibleProducts 배열의 마지막 항목의 product.porderItemNo 값을 갱신
  useEffect(() => {
    if (visibleProducts.length > 0) {
      setLastPorderItemNo(
        visibleProducts[visibleProducts.length - 1].porderItemNo + 1
      );
    }
  }, [visibleProducts]);

  const [editItemCode, setEditItemCode] = useState("");
  const [editReceiveDeadLine, setEditReceiveDeadLine] = useState("");
  const [editPOrderCount, setEditPOrderCount] = useState("");
  const [editPOrderItemPrice, setEditPOrderItemPrice] = useState("");
  const [editItemName, setEditItemName] = useState("");
  const [pOrderItemNo, setPOrderItemNo] = useState("");

  const handleRowClick = (item) => {
    setPOrderPrice(item.itemPrice);
    setPOrderItemPrice(item.itemPrice);
    setItemName(item.itemName);
    setItemCode(item.itemCode);
    setEditItemName(item.itemName);
    setEditItemCode(item.itemCode);
    setEditPOrderItemPrice(item.itemPrice);
    setIsModalOpen(false);
  };

  const handleEdit = (productId) => {
    setEditMode((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
    if (editMode[productId]) {
      const index = tempProducts.findIndex(
        (product) => product.id === productId
      );
      const updatedProducts = [...tempProducts];

      setTempProducts(updatedProducts);
    }
  };

  const handleChange = (productId, property, value) => {
    const index = tempProducts.findIndex(
      (product) => product.porderItemNo === productId
    );

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
        pOrderPrice: editPOrderItemPrice,
      };

      axios
        .patch(
          `http://localhost:8888/api/porder-item/modify?pOrderItemNo=${pOrderItemNo}`,
          pOrderItemStateModifyDto
        )
        .then(() => {
          dispatch(seletedPOrderList(pOrderCode));
          setItemCode("");
          setSelectedDateTime("");
          setPOrderItemPrice("");
          setPOrderCount("");
          setPOrderPrice("");
          setItemName("");
          setPOrderCode(pOrderCode);
        });
    } catch (error) {
      swal.fire({
        title: "발주수정 실패",
        text: "데이터를 모두 입력해주시기 바랍니다",
        icon: "error",
        showConfirmButton: false,
      });
    }
  };
  const [noAddState, setNoAddState] = useState("");

  const areAllCompleted = () => {
    return visibleProducts.every((product) => product.porderState === "완료");
  };
  useEffect(() => {
    const allCompleted = areAllCompleted();
    if (allCompleted) {
      setNoAddState(true);
    } else {
      setNoAddState(false);
    }

    // 다른 코드
  }, [visibleProducts]);

  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];
  return (
    <DashboardCard title="발주내역">
      <Box
        sx={{ overflow: "auto", maxHeight: "400px" }}
        onScroll={handleScroll}
      >
        <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
          <TableHead
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#fff",
            }}
          >
            <StyledTableRow>
              <StyledTableCell>선택</StyledTableCell>
              <StyledTableCell>발주상태</StyledTableCell>
              <StyledTableCell>품목번호</StyledTableCell>
              <StyledTableCell>품목명</StyledTableCell>
              <StyledTableCell>가격</StyledTableCell>
              <StyledTableCell>수량</StyledTableCell>
              <StyledTableCell>금액</StyledTableCell>
              <StyledTableCell>납기일</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell sx={{ display: "none", textAlign: "center" }}>
                <TextField value={lastPorderItemNo} />
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label="준비"
                  sx={{
                    px: "4px",
                    color: "white", // 텍스트 색상
                    backgroundColor: (theme) => {
                      return theme.palette.primary.main;
                    } 
                  }}
                />
              </TableCell>
              <TableCell style={{ textAlign: "right" }}>
                <TextField
                  value={itemCode}
                  onClick={handleTextFieldClick}
                  size="small"
                />
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <div
                  sx={{
                    fontSize: "15px",
                    fontWeight: "500",
                    borderBottom: "1px solid #ccc",
                    padding: "4px 8px",
                    border: "none",
                    textAlign: "center",
                  }}
                  contentEditable={true}
                  value={itemName}
                  onInput={(e) => setItemName(e.target.textContent)}
                >
                  {itemName}
                </div>
              </TableCell>
              <TableCell style={{ textAlign: "right" }}>
                <TextField
                  size="small"
                  type="number"
                  value={pOrderPrice}
                  onChange={(e) => setPOrderPrice(e.target.value)}
                />
              </TableCell>
              <TableCell style={{ textAlign: "right" }}>
                <TextField
                  size="small"
                  type="number"
                  value={pOrderCount}
                  onChange={(e) => setPOrderCount(e.target.value)}
                />
              </TableCell>
              <TableCell style={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                  {pOrderPrice * pOrderCount}
                </Typography>
              </TableCell>
              <TableCell style={{ textAlign: "right" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={`금일 (${formattedToday})`}
                    value={selectedDateTime}
                    onChange={(newDate) => setSelectedDateTime(newDate)}
                    views={["year", "month", "day"]}
                    format="yyyy-MM-dd"
                    slotProps={{
                      textField: { variant: "outlined", size: "small" },
                    }}
                    minDate={new Date()}
                    maxDate={new Date("2100-12-31")} // Optional: Restrict selection up to the end date
                  />
                </LocalizationProvider>
              </TableCell>
              <TableCell style={{ textAlign: "left" }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => pOrderitemInsert()}
                >
                  <Done />
                </Button>
              </TableCell>
            </TableRow>
            {visibleProducts.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={4} align="center">
                  데이터가 없습니다.
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              visibleProducts.map((product, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 !== 0 ? "#f3f3f3" : "white",
                    "&:hover": {
                      backgroundColor: "#c7d4e8",
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell sx={{ padding: 2 }}>
                    <Checkbox
                      checked={selectedProducts.includes(product.porderItemNo)}
                      onChange={() => {
                        handleCheckboxChange(product.porderItemNo);
                        setPOrderItemState(product.porderState);
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: 2 }}>
                    <Chip
                      size="small"
                      label={product.porderState}
                      sx={{
                        px: "4px",
                        color: "white", // 텍스트 색상
                        backgroundColor: (theme) => {
                          switch (product.porderState) {
                            case "준비":
                              return theme.palette.primary.main;
                            case "진행 중":
                              return theme.palette.warning.main;
                            case "완료":
                              return theme.palette.error.main;
                            default:
                              return "defaultColor"; // 기본 색상
                          }
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: 2, textAlign: "right" }}>
                    {editMode[product.porderItemNo] ? (
                      <TextField
                        value={editItemCode}
                        onClick={() => {
                          setIsModalOpen(true);
                        }}
                        onChange={(e) => {
                          handleChange(
                            product.porderItemNo,
                            "itemCode",
                            e.target.value
                          );
                          setEditItemCode(e.target.value);
                          setPOrderCode(product.porderCode);
                        }}
                        size="small"
                      />
                    ) : (
                      <Typography variant="subtitle2" fontWeight={600}>
                        {product.itemCode}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ padding: 2, textAlign: "right" }}>
                    {editMode[product.porderItemNo] ? (
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        component="div"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          handleChange(
                            product.itemName,
                            "itemName",
                            e.currentTarget.textContent
                          );
                          setEditItemName(e.currentTarget.textContent);
                          setItemName(product.itemName);
                        }}
                      >
                        {editItemName}
                      </Typography>
                    ) : (
                      <Typography variant="subtitle2" fontWeight={600}>
                        {product.itemName}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell style={{ textAlign: "right", padding: 2 }}>
                    {editMode[product.porderItemNo] ? (
                      <TextField
                        type="number"
                        value={editPOrderItemPrice}
                        onChange={(e) => {
                          handleChange(
                            product.porderItemNo,
                            "porderPrice",
                            e.target.value
                          );
                          setEditPOrderItemPrice(e.target.value);
                        }}
                        size="small"
                      />
                    ) : (
                      <Typography variant="subtitle2" fontWeight={600}>
                        {product.porderPrice}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: "right", padding: 2 }}>
                    {editMode[product.porderItemNo] ? (
                      <TextField
                        type="number"
                        value={editPOrderCount}
                        onChange={(e) => {
                          handleChange(
                            product.porderItemNo,
                            "porderCount",
                            e.target.value
                          );
                          setEditPOrderCount(e.target.value);
                        }}
                        size="small"
                      />
                    ) : (
                      <Typography variant="subtitle2" fontWeight={600}>
                        {product.porderCount}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    {editMode[product.porderItemNo] ? (
                      <Typography variant="subtitle2" fontWeight={600}>
                        {editPOrderItemPrice * editPOrderCount}
                      </Typography>
                    ) : (
                      <Typography variant="subtitle2" fontWeight={600}>
                        {+product.porderCount * +product.porderPrice}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    {editMode[product.porderItemNo] ? (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label={`금일 (${formattedToday})`}
                          value={selectedDateTime}
                          onChange={(newDate) =>
                            setEditReceiveDeadLine(newDate)
                          }
                          views={["year", "month", "day"]}
                          format="yyyy-MM-dd"
                          slotProps={{
                            textField: { variant: "outlined", size: "small" },
                          }}
                          renderInput={(props) => <TextField {...props} />}
                          minDate={new Date()}
                          maxDate={new Date("2100-12-31")} // Optional: Restrict selection up to the end date
                        />
                      </LocalizationProvider>
                    ) : (
                      <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                        {product.receiveDeadline}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ padding: 2 }}>
                    {product.porderState !== "준비" ? (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Done />}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={
                          editMode[product.porderItemNo] ? <Done /> : <Edit />
                        }
                        onClick={() => {
                          if (editMode[product.porderItemNo]) {
                            pOrderItemEdit(); // Save 버튼을 누를 때만 수정이 되어야 하므로 이벤트 호출 위치를 조정
                          }
                          handleEdit(product.porderItemNo);
                          setPOrderItemNo(product.porderItemNo);
                        }}
                      >
                        {editMode[product.porderItemNo] ? "Save" : "수정"}
                      </Button>
                    )}
                  </TableCell>

                  <TableCell sx={{ display: "none", padding: 2 }}>
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
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        PaperProps={{
          style: {
            width: "70%",
            height: "52%",
            overflowY: "auto", // 필요한 경우 스크롤을 허용
          },
        }}
      >
        <DialogContent>
          <h2>품목선택리스트</h2>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "16px",
              justifyContent: "flex-end",
            }}
          >
            <p style={{ marginRight: "8px" }}>품목명:</p>
            <TextField
              sx={{ width: "150px", marginRight: "16px" }}
              variant="outlined"
              size="small"
              value={selectedItemName}
              onChange={(e) => setSeletedItemName(e.target.value)}
            />
            <Button onClick={() => handleItemSearchClick(selectedItemName)}>
              품목명 조회
            </Button>
          </Box>
          <Table style={{ textAlign: "center" }}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>품목코드</StyledTableCell>
                <StyledTableCell>명칭</StyledTableCell>
                <StyledTableCell>규격</StyledTableCell>
                <StyledTableCell>단위</StyledTableCell>
                <StyledTableCell>금액</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((item, index) => (
                <StyledTableRow
                  key={index}
                  onClick={() => handleRowClick(item)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <StyledTableCell sx={{ height: "10px !important" }}>
                    {item.itemCode}
                  </StyledTableCell>
                  <StyledTableCell sx={{ height: "10px !important" }}>
                    {item.itemName}
                  </StyledTableCell>
                  <StyledTableCell sx={{ height: "10px !important" }}>
                    {item.spec}
                  </StyledTableCell>
                  <StyledTableCell sx={{ height: "10px !important" }}>
                    {item.unit}
                  </StyledTableCell>
                  <StyledTableCell sx={{ height: "10px !important" }}>
                    {item.itemPrice}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>

            <TableFooter>
              <StyledTableRow>
                <StyledTableCell> </StyledTableCell>
                <StyledTableCell colSpan={5}>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Pagination
                    count={Math.ceil(items.length / itemsPerPage)}
                    variant="outlined"
                    color="primary"
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                  />
                </StyledTableCell>
              </StyledTableRow>
            </TableFooter>
          </Table>
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
};

export default PorderComponets2;
