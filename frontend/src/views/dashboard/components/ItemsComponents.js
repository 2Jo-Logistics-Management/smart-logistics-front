import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Button,
  Checkbox,
  Pagination,
  styled,
  InputAdornment,
} from "@mui/material";
import { IconHammer } from "@tabler/icons";
import { IconSearch } from "@tabler/icons";
import DeleteIcon from "@mui/icons-material/Delete";
import PageviewOutlinedIcon from "@mui/icons-material/PageviewOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { tableCellClasses } from "@mui/material/TableCell";
import DashboardCard from "../../../components/shared/DashboardCard";
import ItemInsertModal from "../components/modal/item/ItemInsertModal";
import ItemModifyModal from "../components/modal/item/ItemModifyModal";
import swal from "sweetalert2";
import { fetchItemsFromApi } from "src/redux/thunks/fetchItemsFromApi";
import { fetchSearchItemsFromApi } from "src/redux/thunks/fetchSearchItemsFromApi";
import {
  changeCurrentPage,
  WILL_BE_CHANGE_ITEM_CODE,
} from "src/redux/slices/ItemsReducer";
import {
  ADD_SELECTED_ITEM,
  REMOVE_SELECTED_ITEM,
  REMOVE_SELECTED_ALL_ITEM,
} from "src/redux/slices/selectedItemsReducer";
import axios from "axios";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import SearchIcon from "@material-ui/icons/Search";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#505e82",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 40,
    minWidth: 100,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Item = () => {
  const ITEMS_PER_PAGE = 5; // 한 페이지당 표시할 아이템 개수
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [searchItemCode, setSearchItemCode] = useState("");
  const [searchItemName, setSearchItemName] = useState("");
  const [searchItemPrice, setSearchItemPrice] = useState("");
  const [changedItemCode, setChangedItemCode] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

  const selectedItems =
    useSelector((state) => state.selectedItems.selectedItems) || [];

  const reducerItems = useSelector((state) => state.items.items);
  const reducerItmesToJSON = reducerItems
    ? JSON.parse(JSON.stringify(reducerItems))
    : undefined;
  const initItems = reducerItmesToJSON?.data || [];

  // 현재 페이지에 따른 아이템들 계산
  const currentPage = useSelector((state) => state.items.currentPage);
  let offset = currentPage * ITEMS_PER_PAGE;
  let currentItems = Array.isArray(initItems)
    ? initItems.slice(offset, offset + ITEMS_PER_PAGE)
    : [];
  let totalPage = Math.ceil(initItems.length / ITEMS_PER_PAGE);

  const handlePageChange = (event, newPage) => {
    dispatch(changeCurrentPage(newPage - 1)); // 페이지 변경 시 현재 페이지 상태 업데이트
  };

  useEffect(() => {
    dispatch(fetchItemsFromApi());
  }, [dispatch]);

  const willBeChangeItemCode =
    useSelector((state) => state.items.willBeChangeItemCode) || -1;

  const insertSuccessCallback = async (callback) => {
    dispatch(WILL_BE_CHANGE_ITEM_CODE(callback));

    // 전체 아이템 개수를 한 페이지당 아이템 개수로 나눈 나머지 계산
    let remainder = initItems.length % ITEMS_PER_PAGE;

    if (remainder === 0) {
      dispatch(changeCurrentPage(totalPage));
      dispatch(fetchItemsFromApi());
    } else {
      dispatch(changeCurrentPage(totalPage - 1));
      dispatch(fetchItemsFromApi());
    }
  };

  useEffect(() => {
    if (willBeChangeItemCode !== -1) {
      setChangedItemCode(willBeChangeItemCode);
    }
  }, [willBeChangeItemCode]);

  const itemInsertButtonClick = () => {
    setInsertModalOpen(true);
  };

  const itemModifyButtonClick = () => {
    if (selectedItems.length === 1) {
      setModifyModalOpen(true);
    } else if (selectedItems.length >= 2) {
      swal
        .fire({
          title: "수정 불가",
          text: "하나의 데이터만 지정해주세요!",
          icon: "error",
        })
        .then(() => {
          dispatch(REMOVE_SELECTED_ALL_ITEM());
        });
    } else {
      swal.fire({
        title: "수정 불가",
        text: "수정할 데이터를 선택해주세요!",
        icon: "error",
      });
    }
  };

  const itemDeleteButtonClick = () => {
    if (selectedItems.length >= 1) {
      swal
        .fire({
          title: `${selectedItems.length}개의 물품을 삭제하시겠습니까?`,
          text: "삭제된 데이터는 복구할 수 없습니다.\n",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "삭제",
          cancelButtonText: "취소",
        })
        .then((result) => {
          if (result.isConfirmed) {
            itemDeleteAxios();
          }
        });
    } else {
      swal.fire({
        title: "데이터 선택",
        text: "한개 이상의 데이터를 선택해주세요.",
        icon: "warning",
      });
    }
  };

  const itemDeleteAxios = async () => {
    try {
      await axios.delete(
        `http://localhost:8888/api/item/delete?itemCodes=${selectedItems}`
      );
      await swal.fire({
        title: "삭제 완료",
        text: "재고가 삭제되었습니다.",
        icon: "success",
      });
      dispatch(REMOVE_SELECTED_ALL_ITEM());
      dispatch(changeCurrentPage(0));
      dispatch(fetchItemsFromApi());
    } catch (error) {
      swal.fire({
        title: "삭제 실패",
        text: `${error.message}`,
        icon: "error",
      });
    }
  };

  const handleSingleSelect = (event, itemCode) => {
    if (event.type === "click") {
      if (selectedItems.includes(itemCode)) {
        dispatch(REMOVE_SELECTED_ITEM(itemCode));
        return;
      } else {
        dispatch(ADD_SELECTED_ITEM(itemCode));
        return;
      }
    }
  };

  const handleSearch = () => {
    let timerInterval;
    dispatch(
      fetchSearchItemsFromApi(searchItemCode, searchItemName, searchItemPrice)
    );
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
  };

  const modifySuccessCallback = async (callbackValue) => {
    dispatch(WILL_BE_CHANGE_ITEM_CODE(callbackValue));
    dispatch(REMOVE_SELECTED_ALL_ITEM());
    dispatch(fetchItemsFromApi());
  };

  const handleItemPriceChange = (e) => {
    const re = /^[0-9\b]+$/; // 숫자와 백스페이스만 허용하는 정규 표현식

    if (e.target.value === "" || re.test(e.target.value)) {
      setSearchItemPrice(e.target.value);
      setErrorMessage(""); // 에러 메시지를 초기화합니다.
    } else {
      setErrorMessage("숫자만 입력해주세요."); // 에러 메시지를 설정합니다.
    }
  };

  return (
    <>
      <DashboardCard>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2, // 하단 간격 조절
            padding: "10px",
          }}
        >
          <IconHammer />
          <Typography variant="h4" component="div" sx={{ ml: 1 }}>
            품목 관리
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            padding: "10px",
          }}
        >
          <Box sx={{ height: "38px", display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ mr: 1 }}>
              품목 코드
            </Typography>
            <TextField
              label="품목 코드를 입력해주세요"
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
              value={searchItemCode}
              onChange={(e) => setSearchItemCode(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch />
                  </InputAdornment>
                ),
              }}
              style={{
                borderRadius: 100,
                borderColor: "#808080",
                boxShadow: "0 2px 5px #cccccc",
              }}
            />
            <Typography variant="h6" sx={{ mr: 1 }}>
              품목명
            </Typography>
            <TextField
              label="품목명을 입력해주세요"
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
              value={searchItemName}
              onChange={(e) => setSearchItemName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch />
                  </InputAdornment>
                ),
              }}
              style={{
                borderRadius: 100,
                borderColor: "#808080",
                boxShadow: "0 2px 5px #cccccc",
              }}
            />
            <Typography variant="h6" sx={{ mr: 1 }}>
              품목가격
            </Typography>
            <TextField
              label="품목가격을 입력해주세요"
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
              value={searchItemPrice}
              onChange={handleItemPriceChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch />
                  </InputAdornment>
                ),
              }}
              style={{
                borderRadius: 100,
                borderColor: "#808080",
                boxShadow: "0 2px 5px #cccccc",
              }}
              error={!!errorMessage} // 에러 메시지가 있으면 error 속성을 true로 설정합니다.
            />
          </Box>
          <Box>
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<PageviewOutlinedIcon />}
              sx={{ mr: 2 }}
              onClick={handleSearch}
            >
              검색
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              sx={{ mr: 2 }}
              onClick={itemInsertButtonClick}
            >
              추가
            </Button>
            <Button
              variant="contained"
              color="info"
              size="large"
              startIcon={<AutoFixHighOutlinedIcon />}
              sx={{ mr: 2 }}
              onClick={itemModifyButtonClick}
            >
              수정
            </Button>
            <Button
              variant="contained"
              color="error"
              size="large"
              startIcon={<DeleteIcon />}
              sx={{ mr: 2 }}
              onClick={itemDeleteButtonClick}
            >
              삭제
            </Button>
          </Box>
        </Box>
        <Box sx={{ overflow: "auto", maxHeight: "650px" }}>
          <TableContainer component={Paper}>
            <Table
              aria-label="customized table"
              sx={{
                minWidth: 700,
              }}
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell style={{ width: "10%" }}></StyledTableCell>
                  <StyledTableCell style={{ width: "10%" }}>
                    <Typography variant="h6" fontWeight={600}>
                      품목코드
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "20%" }}>
                    <Typography variant="h6" fontWeight={600}>
                      품목명
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "20%" }}>
                    <Typography variant="h6" fontWeight={600}>
                      규격
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "20%" }}>
                    <Typography variant="h6" fontWeight={600}>
                      단위
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "20%" }}>
                    <Typography variant="h6" fontWeight={600}>
                      단가
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>

              <TableBody
                sx={{
                  mt: 0.5, // 상단 간격 조절
                  mb: 0.5, // 하단 간격 조절
                }}
              >
                {currentItems.map((currentItem, index) => (
                  <StyledTableRow
                    key={currentItem.itemCode}
                    sx={{
                      backgroundColor:
                        currentItem.itemCode === changedItemCode
                          ? "#e7edd1"
                          : index % 2 !== 0
                          ? "#f3f3f3"
                          : "white",
                      "&:hover": {
                        backgroundColor: "#c7d4e8",
                        cursor: "pointer",
                      },
                    }}
                    onClick={(event) =>
                      handleSingleSelect(event, currentItem.itemCode)
                    }
                  >
                    <StyledTableCell align="center">
                      <Checkbox
                        checked={selectedItems.includes(currentItem.itemCode)}
                        onChange={(event) =>
                          handleSingleSelect(event, currentItem.itemCode)
                        }
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Typography variant="subtitle2" fontWeight={400}>
                        {currentItem.itemCode}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="subtitle2" fontWeight={400}>
                        {currentItem.itemName}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="subtitle2" fontWeight={400}>
                        {currentItem.spec}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="subtitle2" fontWeight={400}>
                        {currentItem.unit}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Typography variant="subtitle2" fontWeight={400}>
                        {currentItem.itemPrice}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {/* 페이지 네이션 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            my: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              my: 2,
            }}
          >
            {initItems ? (
              <Pagination
                count={totalPage}
                page={currentPage + 1}
                variant="outlined"
                onChange={handlePageChange}
              />
            ) : (
              <div>Loading products...</div>
            )}
          </Box>
        </Box>
        {/* 페이지 네이션 */}
      </DashboardCard>
      {/* 모달 창 출력 여부 */}
      <ItemInsertModal
        open={insertModalOpen}
        onClose={() => setInsertModalOpen(false)}
        isSuccessCallback={insertSuccessCallback}
      />
      <ItemModifyModal
        open={modifyModalOpen}
        onClose={() => setModifyModalOpen(false)}
        selectedItem={initItems.filter((i) => selectedItems[0] === i.itemCode)}
        isSuccessCallback={modifySuccessCallback}
      />
    </>
  );
};

export default Item;
