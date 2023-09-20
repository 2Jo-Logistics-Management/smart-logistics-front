import React, { useEffect, useState } from "react";
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
  Pagination,
  styled,
  Tooltip,
  Chip,
} from "@mui/material";
import { IconReceipt } from "@tabler/icons";
import DeleteIcon from "@mui/icons-material/Delete";
import PageviewOutlinedIcon from "@mui/icons-material/PageviewOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { tableCellClasses } from "@mui/material/TableCell";
import DashboardCard from "../../../components/shared/DashboardCard";
import swal from "sweetalert2";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  ADD_SELECTED_PRODUCT,
  REMOVE_SELECTED_PRODUCT,
  REMOVE_ALL_SELECTED_PRODUCTS,
} from "../../../redux/slices/selectedProductsReducer";
import { useDispatch, useSelector } from "react-redux";
import { Delete, Edit, Done, Today } from "@mui/icons-material";
import receiveDeleteAxios from "../../../axios/receiveDeleteAxios";
import { receiveListAll } from "../../../redux/thunks/receiveList";
import ReceviveComponents2 from "./ReceiveComponents2";
import axios from "axios";
import { open_Modal } from "../../../redux/slices/receiveModalDuck";
import ReceiveModal from "./modal/ReceiveModal";
import pOrderWaitIngAxios from "src/axios/pOrderWaitIngAxios";
import receiveItemDeleteAxios from "src/axios/receiveItemDeleteAxios";
import receiveUpdateAxios from "src/axios/receiveUpdateAxios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#505e82",
    color: theme.palette.common.white,
    width: 100,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 40,
    minWidth: 100,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme, receiveCode, modifyReceive }) => ({
  backgroundColor: receiveCode === modifyReceive ? "lightyellow" : "white",
  "&:nth-of-type(odd)": {
    backgroundColor: receiveCode === modifyReceive ? "lightyellow" : theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

axios.defaults.withCredentials = true;

const ReceiveComponents = () => {
  const [isSaveCompleted, setIsSaveCompleted] = useState(false);
  const [modalSelectedProducts, setModalSelectedProducts] = useState([]);
  const [receiveCheckData, setReceiveCheckData] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modifyReceiveCode, setModifyReceiveCode] = useState("null");
  const [newReceive, setNewReceive] = useState("");
  const [modifyReceive, setModifyReceive] = useState("");
  const [modifyReceiveItem, setModifyReceiveItem] = useState("");

  const handleChildSave = () => {
    setIsSaveCompleted(true);
  };

  const handleUpdateModalSelectedProducts = (modalUpdatedProducts) => {
    setModalSelectedProducts(modalUpdatedProducts);
  };

  const dispatch = useDispatch();
  const productsData = useSelector((state) => state.receiveList.products);
  const [receiveItemData, setReceiveItemData] = useState([]);
  const [editedDates, setEditedDates] = useState("");
  const [editedManagers, setEditedManagers] = useState("");
  const [childReceiveItem, setChildReceiveItem] = useState([]);
  const products = JSON.parse(JSON.stringify(productsData));
  const realProducts = products?.data || [];
  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const receiveModalState = useSelector((state) => state.receiveModal);
  const [editMode, setEditMode] = useState({});
  const [searchManager, setSearchManager] = useState("");
  const [searchReceiveCode, setSearchReceiveCode] = useState("");
  const [receiveItemCounts, setReceiveItemCounts] = useState(
    Array(modalSelectedProducts.length).fill("")
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [findReceiveCode, setFindReceiveCode] = useState("");

  useEffect(() => {
    if (newReceive !== "" || modifyReceive !== "") {
      dispatch(receiveListAll());
      if (newReceive != "") {
        setFindReceiveCode(newReceive);
        setModifyReceive("");
      }
      if (modifyReceive != "") {
        setFindReceiveCode(modifyReceive);
        setNewReceive("");
      }
    }
    if (newReceive === "") {
      dispatch(receiveListAll());
    }
  }, [dispatch, modalSelectedProducts, newReceive, modifyReceive]);

  useEffect(() => {
    if (realProducts.length > 0) {
      const foundProduct = realProducts.findIndex(
        (product) => product.receiveCode === findReceiveCode
      );
      if (foundProduct !== -1) {
        const newPage = Math.floor(foundProduct / ITEMS_PER_PAGE);
        setCurrentPage(newPage);
        setFindReceiveCode("");
      }
    }
  }, [realProducts, findReceiveCode]);

  const ITEMS_PER_PAGE = 5;

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1);
    setNewReceive("");
  };

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = Array.isArray(realProducts)
    ? realProducts.slice(offset, offset + ITEMS_PER_PAGE)
    : [];
  const selectedProducts = useSelector((state) => state.selectedProduct.selectedProduct);
  useEffect(() => {
    setReceiveCheckData(false);
  }, [currentPage]);

  useEffect(() => {
    const allSelectedOnCurrentPage = currentItems.every((item) =>
      selectedProducts.includes(item.receiveCode)
    );
    setSelectAll(allSelectedOnCurrentPage);
  }, [selectedProducts, currentItems]);

  useEffect(() => {
    if (selectedProducts.length === 0) {
      setReceiveCheckData(false);
    } else if (selectedProducts.length !== 0) {
      setReceiveCheckData(true);
    }
  }, [selectedProducts]);

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
    swal.fire({
      title: "입고물품 조회중",
      html: "잠시만 기다려주세요",
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        swal.showLoading();
        const b = swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          b.textContent = swal.getTimerLeft();
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
    dispatch(receiveListAll(searchReceiveCode, searchManager, searchStartDate, searchEndDate));
    setReceiveItemData([]);
  };

  const handleCheckboxChange = (event, productId) => {
    setChildReceiveItem([]);
    if (event.target.checked) {
      if (!selectedProducts.includes(productId)) {
        dispatch(ADD_SELECTED_PRODUCT(productId));
      }
    } else {
      dispatch(REMOVE_SELECTED_PRODUCT(productId));
      setEditMode((prevEditModes) => ({
        ...prevEditModes,
        [`${productId}`]: false,
      }));
    }
  };

  const handleDelete = () => {
    swal
      .fire({
        title: "정말로 삭제하시겠습니까?",
        text: "삭제된 데이터는 복구할 수 없습니다.\n해당하는 입고코드를 가진 창고재고도 함께 삭제됩니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085",
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          if (selectedProducts.length > 0) {
            receiveDeleteAxios(selectedProducts);
            setReceiveItemData([]);
            // dispatch(receiveListAll());
            console.log("삭제프로세스완료");
            window.location.reload();
          }
          if (childReceiveItem.length > 0) {
            receiveItemDeleteAxios(childReceiveItem);
            setReceiveItemData([]);
          }
        }
      });
  };
  const handleEdit = async (receiveCode) => {
    setFindReceiveCode("");
    try {
      setEditMode((prevState) => ({
        ...prevState,
        [`${receiveCode}`]: !prevState[`${receiveCode}`],
      }));
      if (editMode[`${receiveCode}`]) {
        const editedManagerData = editedManagers[receiveCode] || "";
        let receiveModifyDate = "";
        if (editedDates !== "") {
          const receiveDate = new Date(editedDates);
          const modifyYear = receiveDate.getFullYear();
          const modifyMonth = (receiveDate.getMonth() + 1).toString().padStart(2, "0");
          const modifyDay = receiveDate.getDate().toString().padStart(2, "0");
          receiveModifyDate = `${modifyYear}-${modifyMonth}-${modifyDay}`;
        }
        if (editedManagerData === "" && receiveModifyDate === "") {
          swal.fire({
            title: "변경 사항 없음",
            text: "수정할 입력 사항이 없습니다",
            icon: "warning",
          });
        } else if (editedManagerData !== "" || receiveModifyDate !== "") {
          const response = await receiveUpdateAxios([
            receiveCode,
            editedManagerData,
            receiveModifyDate,
          ]);
          const receiveModifyData = response.data.data;
          setModifyReceive(receiveModifyData);
        }
        setEditedManagers("");
        setEditedDates("");
        setModifyReceiveCode("null");
      }
    } catch (error) {
      console.log("오류발생 : ", error.message);
    }
  };

  useEffect(() => {
    dispatch(REMOVE_ALL_SELECTED_PRODUCTS());
    setReceiveCheckData(false);
  }, []);

  const [selectAll, setSelectAll] = useState(false);

  const handleProductClick = async (selectReceiveCode) => {
    if (modalSelectedProducts.length === 0) {
      setSelectedRow(selectReceiveCode);
      try {
        const response = await axios.get("http://localhost:8888/api/receive-item/list", {
          params: {
            receiveCode: selectReceiveCode,
          },
        });
        setModifyReceiveItem("");
        setReceiveItemData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (modalSelectedProducts.length !== 0) {
      swal.fire({
        title: "발주적용 진행중",
        text: "먼저 진행중이던 발주적용을 완료하거나 취소하고 진행하세요",
        icon: "warning",
      });
    }
  };

  const handleInsert = () => {
    setFindReceiveCode("");
    dispatch(open_Modal());
  };

  const handleSearchManagerChange = (e) => {
    setSearchManager(e.target.value);
  };

  const handleSearchReceiveCodeChange = (e) => {
    setSearchReceiveCode(e.target.value);
  };

  const handleAddPOrdersClear = () => {
    setModalSelectedProducts([]);
  };

  const handleNewReceiveCode = (receiveNewData) => {
    setNewReceive(receiveNewData);
  };

  const handleModifyReceiveItemDetail = (param) => {
    setModifyReceiveCode("null");
  };

  const handleModifyCode = (modifyCode) => {
    setModifyReceiveItem(modifyCode);
  };

  useEffect(() => {
    if (modifyReceiveItem !== "") {
      handleProductClick(modifyReceiveItem);
    }
  }, [modifyReceiveItem]);

  const handleChildCheckboxChange = (receiveCode, receiveItemNo, isChecked) => {
    const newItem = { receiveCode, receiveItemNo };
    const itemIndex = childReceiveItem.findIndex(
      (item) => item.receiveCode === receiveCode && item.receiveItemNo === receiveItemNo
    );
    if (itemIndex !== -1) {
      const updatedItems = [...childReceiveItem];
      updatedItems.splice(itemIndex, 1);
      setChildReceiveItem(updatedItems);
    } else {
      setChildReceiveItem([...childReceiveItem, newItem]);
    }

    const isCurrentlySelected = selectedProducts.some(
      (product) => product.receiveCode === receiveCode && product.receiveItemNo === receiveItemNo
    );

    if (isChecked && !isCurrentlySelected) {
      setSelectAll(false);
      dispatch(REMOVE_ALL_SELECTED_PRODUCTS());
    } else if (!isChecked && isCurrentlySelected) {
      dispatch(REMOVE_SELECTED_PRODUCT({ receiveCode, receiveItemNo }));
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {receiveModalState && (
        <ReceiveModal
          onSave={handleChildSave}
          modalUpdateSelectedProducts={handleUpdateModalSelectedProducts}
        />
      )}
      <DashboardCard>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            padding: "10px",
          }}
        >
          <IconReceipt />
          <Typography variant="h4" component="div" sx={{ ml: 1 }}>
            입고 관리
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            padding: "10px",
            flexWrap: "nowrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ mr: 1 }}>
              입고 번호
            </Typography>
            <TextField
              label="입고번호를 입력해주세요"
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
              value={searchReceiveCode}
              onChange={handleSearchReceiveCodeChange}
            />
            <Typography variant="h6" sx={{ mr: 1 }}>
              담당자
            </Typography>
            <TextField
              label="담당자명을 입력해주세요"
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
              value={searchManager}
              onChange={handleSearchManagerChange}
            />
            <Typography variant="h6" sx={{ mr: 1 }}>
              입고일
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="조회 시작일을 입력해주세요"
                value={selectedStartDate}
                onChange={(newDate) => setSelectedStartDate(newDate)}
                renderInput={(props) => <TextField {...props} />}
                slotProps={{ textField: { size: "small" } }}
                sx={{ mr: 2 }}
                minDate={new Date("2000-01-01")}
                maxDate={new Date("2100-12-31")}
              />
              <DatePicker
                label="조회 종료일을 입력해주세요"
                value={selectedEndDate}
                onChange={(newDate) => setSelectedEndDate(newDate)}
                renderInput={(props) => <TextField {...props} />}
                slotProps={{ textField: { size: "small" } }}
                minDate={new Date("2000-01-01")}
                maxDate={new Date("2100-12-31")}
              />
            </LocalizationProvider>
          </Box>

          <Box>
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
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={handleInsert}
              sx={{ mr: 2 }}
            >
              발주적용
            </Button>
            <Button
              variant="contained"
              color="error"
              size="large"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={selectedProducts.length === 0 && childReceiveItem.length === 0}
              sx={{ mr: 2 }}
            >
              삭제
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            overflow: "auto",
            maxHeight: "550px",
            height: "calc(40vh)",
          }}
        >
          <Table
            aria-label="simple table"
            sx={{
              whiteSpace: "nowrap",
              mt: 0,
              mb: 0,
            }}
          >
            <TableHead sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fff" }}>
              <StyledTableRow
                sx={{
                  height: "10px",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <StyledTableCell style={{ width: "10%" }}></StyledTableCell>
                <StyledTableCell style={{ width: "30%" }}>
                  <Typography variant="h6" fontWeight={600}>
                    입고번호
                  </Typography>
                </StyledTableCell>
                <StyledTableCell style={{ width: "20%" }}>
                  <Typography variant="h6" fontWeight={600}>
                    담당자
                  </Typography>
                </StyledTableCell>
                <StyledTableCell style={{ width: "20%" }}>
                  <Typography variant="h6" fontWeight={600}>
                    입고일
                  </Typography>
                </StyledTableCell>
                <StyledTableCell style={{ width: "20%" }}></StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody
              sx={{
                mt: 0,
                mb: 0,
              }}
            >
              {currentItems.map((realProduct, index) => (
                <StyledTableRow
                  sx={{
                    "&:hover": {
                      backgroundColor: "#c7d4e8",
                      cursor: "pointer",
                    },
                    backgroundColor:
                      selectedRow === realProduct.receiveCode
                        ? "#c7d4e8"
                        : newReceive === realProduct.receiveCode ||
                          modifyReceive === realProduct.receiveCode
                        ? "#e7edd1"
                        : index % 2 !== 0
                        ? "#f3f3f3"
                        : "white",
                  }}
                  key={realProduct.receiveCode}
                  receiveCode={realProduct.receiveCode}
                  modifyReceive={modifyReceive}
                  onClick={() => handleProductClick(realProduct.receiveCode)}
                >
                  <StyledTableCell
                    align="center"
                    sx={{
                      padding: "0px",
                    }}
                  >
                    <div key={realProduct.receiveCode}>
                      <Tooltip
                        title={
                          realProduct.cmpCount !== 0
                            ? "발주완료된 항목이 있어 삭제가 불가합니다."
                            : ""
                        }
                      >
                        <Checkbox
                          checked={selectedProducts.includes(realProduct.receiveCode)}
                          onChange={(event) => handleCheckboxChange(event, realProduct.receiveCode)}
                          disabled={realProduct.cmpCount !== 0}
                          sx={{
                            "&.Mui-disabled": {
                              pointerEvents: "auto",
                            },
                          }}
                        />
                      </Tooltip>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                      {realProduct.receiveCode}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Typography variant="subtitle2" fontWeight={600}>
                      {editMode[`${realProduct.receiveCode}`] ? (
                        <TextField
                          size="small"
                          value={
                            editedManagers[`${realProduct.receiveCode}`] || realProduct.manager
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            setEditedManagers((prevManagers) => ({
                              ...prevManagers,
                              [`${realProduct.receiveCode}`]: value,
                            }));
                          }}
                        />
                      ) : (
                        realProduct.manager
                      )}
                    </Typography>
                  </StyledTableCell>

                  <StyledTableCell align="left">
                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                      {editMode[`${realProduct.receiveCode}`] ? (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="수정날짜"
                            value={
                              editedDates[`${realProduct.receiveCode}`] ||
                              new Date((realProduct.receiveDate?.split(" ") || [])[0])
                            }
                            slotProps={{ textField: { size: "small" } }}
                            onChange={(newDate) => {
                              setEditedDates(newDate);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            minDate={new Date("2000-01-01")}
                            maxDate={new Date("2100-12-31")}
                          />
                        </LocalizationProvider>
                      ) : (
                        (realProduct.receiveDate?.split(" ") || [])[0]
                      )}
                    </Typography>
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {realProduct.cmpCount !== 0 &&
                    realProduct.ingCount === 0 &&
                    realProduct.waitCount === 0 ? (
                      <Tooltip title="발주적용이 완료되어 수정 및 삭제가 불가합니다">
                        <Chip
                          size="small"
                          label="완료"
                          sx={{
                            px: "4px",
                            color: "white", // 텍스트 색상
                            backgroundColor: (theme) => {
                              return theme.palette.error.main;
                            },
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={editMode[`${realProduct.receiveCode}`] ? <Done /> : <Edit />}
                        onClick={() => handleEdit(realProduct.receiveCode)}
                      >
                        {editMode[`${realProduct.receiveCode}`] ? "저장" : "수정"}
                      </Button>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            my: "16px",
            padding: "3px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 2 }}>
            {realProducts ? (
              <Pagination
                count={Math.ceil(realProducts.length / ITEMS_PER_PAGE)}
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
      </DashboardCard>
      <ReceviveComponents2
        receiveItemData={receiveItemData}
        onCheckboxChange={handleChildCheckboxChange}
        receiveCheckData={receiveCheckData}
        modifyReceiveCode={modifyReceiveCode}
        modalSelectedProducts={modalSelectedProducts}
        addPOrdersClear={handleAddPOrdersClear}
        newReceiveCode={handleNewReceiveCode}
        modifyReceiveItemCode={handleModifyCode}
        modifyData={handleModifyReceiveItemDetail}
      />
    </Box>
  );
};

export default ReceiveComponents;
