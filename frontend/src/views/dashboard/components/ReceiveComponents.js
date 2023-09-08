import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Button,
  Checkbox,
  Pagination,
} from "@mui/material";
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
import porderAxios from "./../../../axios/porderAxios";
import { Delete } from "@mui/icons-material";
import receiveDeleteAxios from "../../../axios/receiveDeleteAxios";
import { receiveListAll } from "../../../redux/thunks/receiveList";
import ReceviveComponents2 from "./ReceiveComponents2";
import axios from "axios";
import { open_Modal } from "../../../redux/slices/receiveModalDuck";
import ReceiveModal from "./modal/ReceiveModal";
axios.defaults.withCredentials = true;

const ReceviveComponents = () => {
  const dispatch = useDispatch();
  const productsData = useSelector((state) => state.receiveList.products);
  const [receiveItemData, setReceiveItemData] = useState([]);

  const products = JSON.parse(JSON.stringify(productsData));
  const realProducts = products?.data || [];
  const [selectedDate, setSelectedDate] = useState(null);
  const receiveModalState = useSelector((state) => state.receiveModal);

  useEffect(() => {
    dispatch(receiveListAll());
  }, [dispatch]);

  const ITEMS_PER_PAGE = 5; // 한 페이지당 표시할 아이템 개수

  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1); // 페이지 변경 시 현재 페이지 상태 업데이트
  };

  // 현재 페이지에 따른 아이템들 계산
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = Array.isArray(realProducts)
    ? realProducts.slice(offset, offset + ITEMS_PER_PAGE)
    : [];

  const selectedProducts = useSelector((state) => state.selectedProduct.selectedProduct);
  useEffect(() => {
    // 페이지가 변경될 때마다 체크박스 상태를 초기화한다.
    dispatch(REMOVE_ALL_SELECTED_PRODUCTS());
    setSelectAll(false);
  }, [currentPage]);
  useEffect(() => {
    // 선택된 아이템의 수가 현재 페이지의 아이템 수와 동일하다면, 전체 선택 체크박스를 선택 상태로 설정한다.
    const allSelectedOnCurrentPage = currentItems.every((item) =>
      selectedProducts.includes(item.receiveCode)
    );
    setSelectAll(allSelectedOnCurrentPage);
  }, [selectedProducts, currentItems]);

  useEffect(() => {
    if (selectedProducts.length === 1) {
      porderAxios(selectedProducts, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts]);

  const handleClick = () => {
    let timerInterval;
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

  const handleCheckboxChange = (event, productId) => {
    if (event.target.checked) {
      if (!selectedProducts.includes(productId)) {
        dispatch(ADD_SELECTED_PRODUCT(productId));
      }
    } else {
      dispatch(REMOVE_SELECTED_PRODUCT(productId));
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
      .then((result) => {
        if (result.isConfirmed) {
          receiveDeleteAxios(selectedProducts);
        }
      });
  };

  //**********************selectbox */
  useEffect(() => {
    // 컴포넌트가 마운트되었을 때 모든 상품 선택을 해제한다.
    dispatch(REMOVE_ALL_SELECTED_PRODUCTS());
  }, []);

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = () => {
    if (selectAll) {
      currentItems.forEach((item) => {
        dispatch(REMOVE_SELECTED_PRODUCT(item.receiveCode));
      });
    } else {
      currentItems.forEach((item) => {
        dispatch(ADD_SELECTED_PRODUCT(item.receiveCode));
      });
    }
    setSelectAll(!selectAll);
  };

  const handleProductClick = async (selectReceiveCode) => {
    try {
      const response = await axios.get("http://localhost:8888/api/receive-item/list", {
        params: {
          receiveCode: selectReceiveCode,
        },
      });
      setReceiveItemData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInsert = () => {
    dispatch(open_Modal());
  };

  return (
    <Box>
      {receiveModalState && <ReceiveModal />}
      <DashboardCard title="입고 List" variant="poster">
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <span style={{ marginRight: "1rem" }}>
              <Typography variant="subtitle2">입고번호:</Typography>
            </span>
            <TextField label="입고번호" variant="outlined" size="small" sx={{ marginRight: 2 }} />
            <span style={{ marginRight: "1rem" }}>
              <Typography variant="subtitle2">담당자:</Typography>
            </span>
            <TextField label="담당자명" variant="outlined" size="small" sx={{ marginRight: 2 }} />
            <span style={{ marginRight: "1rem" }}>
              <Typography variant="subtitle2">입고일:</Typography>
            </span>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="조회 시작일"
                value={new Date()}
                onChange={(newDate) => setSelectedDate(newDate)}
                renderInput={(props) => <TextField {...props} />} // TextField 등을 사용해 사용자 정의 입력 요소를 렌더링
              />
              <DatePicker
                label="조회 종료일"
                value={new Date()}
                onChange={(newDate) => setSelectedDate(newDate)}
                renderInput={(props) => <TextField {...props} />} // TextField 등을 사용해 사용자 정의 입력 요소를 렌더링
              />
            </LocalizationProvider>
            {/* <TextField label="거래 품목" variant="outlined" size="small" sx={{ marginRight: 2 }} /> */}
            <Button onClick={handleClick} variant="contained">
              Search
            </Button>
            <Button onClick={handleInsert} variant="contained">
              입고등록
            </Button>
            <Button
              variant="outlined"
              size="big"
              startIcon={<Delete />}
              color="error"
              onClick={handleDelete}
              disabled={selectedProducts.length === 0} // 선택된 상품이 없을 때 버튼 비활성화
            >
              삭제
            </Button>
          </Box>
        </Box>

        <Box>
          {selectedProducts.length >= 2 && (
            <Typography variant="h6" style={{ color: "red", fontWeight: "bold" }}>
              선택된 상품 개수: {selectedProducts.length} 입니다
            </Typography>
          )}
        </Box>

        <br />

        <Box sx={{ overflow: "auto", maxHeight: "400px" }}>
          <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
            <TableHead sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fff" }}>
              <TableRow>
                <TableCell>
                  <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    입고번호
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    담당자
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    입고일
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* currentItems.map() 함수 내부에서 괄호로 묶어서 행과 셀을 생성 */}
              {currentItems.map((realProduct) => (
                <TableRow
                  key={realProduct.receiveCode}
                  onClick={() => handleProductClick(realProduct.receiveCode)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(realProduct.receiveCode)}
                      onChange={(event) => handleCheckboxChange(event, realProduct.receiveCode)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                      {realProduct.receiveCode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {realProduct.manager}
                        </Typography>
                        <Typography color="textSecondary" sx={{ fontSize: "13px" }}>
                          물류관리자
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                      {realProduct.receiveDate ? realProduct.receiveDate.split(" ")[0] : "데이터 로딩중"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 2 }}>
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
      <ReceviveComponents2 receiveItemData={receiveItemData} />
    </Box>
  );
};

export default ReceviveComponents;
