import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "@mui/material";
import DashboardCard from "../../../components/shared/DashboardCard";
import ItemInsertModal from "../components/modal/item/ItemInsertModal";
import ItemModifyModal from "../components/modal/item/ItemModifyModal";
import swal from "sweetalert2";
import { fetchItemsFromApi } from "src/redux/thunks/fetchItemsFromApi";
import { fetchSearchItemsFromApi } from "src/redux/thunks/fetchSearchItemsFromApi";
import { changeCurrentPage } from "src/redux/slices/ItemsReducer";
import {
  ADD_SELECTED_ITEM,
  REMOVE_SELECTED_ITEM,
  REMOVE_SELECTED_ALL_ITEM,
} from "src/redux/slices/selectedItemsReducer";
import axios from "axios";

const Item = () => {
  const ITEMS_PER_PAGE = 5; // 한 페이지당 표시할 아이템 개수
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [searchItemCode, setSearchItemCode] = useState("");
  const [searchItemName, setSearchItemName] = useState("");
  const [searchItemPrice, setSearchItemPrice] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchItemsFromApi());
  }, [dispatch]);

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

  const itemInsertButtonClick = () => {
    setInsertModalOpen(true);
  };

  const itemModifyButtonClick = () => {
    if (selectedItems.length === 1) {
      setModifyModalOpen(true);
    } else if (selectedItems.length >= 2) {
      alert("수정은 데이터 하나만 가능합니다!");
    } else {
      alert("수정할 데이터를 선택해주세요!");
    }
  };

  const itemDeleteButtonClick = () => {
    if (selectedItems.length >= 1) {
      swal
        .fire({
          title: `정말로 ${selectedItems.length}개의 물품을 삭제하시겠습니까?`,
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
    }
  };

  const itemDeleteAxios = () => {
    axios
      .delete(
        `http://localhost:8888/api/item/delete?itemCodes=${selectedItems}`
      )
      .then((response) => {
        swal
          .fire({
            title: "삭제 완료",
            text: "재고가 삭제되었습니다.",
            icon: "success",
          })
          .then(() => {
            dispatch(REMOVE_SELECTED_ALL_ITEM());
            window.location.reload();
          });
      })
      .catch((error) => {
        swal.fire({
          title: "삭제 실패",
          text: `${error.data.message}`,
          icon: "error",
        });
      });
  };

  const handleSingleSelect = (event, itemCode) => {
    if (selectedItems.includes(itemCode)) {
      dispatch(REMOVE_SELECTED_ITEM(itemCode));
      return;
    } else {
      dispatch(ADD_SELECTED_ITEM(itemCode));
      return;
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

  return (
    <>
      <DashboardCard>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2, // 하단 간격 조절
            padding: "10px",
          }}
        >
          <Typography variant="h4" component="div">
            물품관리
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={handleSearch}
            >
              조회
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={itemInsertButtonClick}
            >
              추가
            </Button>
            <Button
              variant="contained"
              color="info"
              sx={{ mr: 2 }}
              onClick={itemModifyButtonClick}
            >
              수정
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ mr: 2 }}
              onClick={itemDeleteButtonClick}
            >
              삭제
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            물품코드
          </Typography>
          <TextField
            label="물품코드를 입력해주세요"
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
            value={searchItemCode}
            onChange={(e) => setSearchItemCode(e.target.value)}
          />
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            물품명
          </Typography>
          <TextField
            label="물품명을 입력해주세요"
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
            value={searchItemName}
            onChange={(e) => setSearchItemName(e.target.value)}
          />
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            물품가격
          </Typography>
          <TextField
            label="물품가격을 입력해주세요"
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
            value={searchItemPrice}
            onChange={(e) => setSearchItemPrice(e.target.value)}
          />
        </Box>
        <br />
        <Box sx={{ overflow: "auto", maxHeight: "650px" }}>
          <Table
            aria-label="simple table"
            sx={{
              whiteSpace: "nowrap",
              "& td": {
                padding: "9px 16px",
              },

              borderCollapse: "collapse", // 테이블 셀 경계선 병합
            }}
          >
            <TableHead
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                backgroundColor: "#fff",
              }}
            >
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight={600}>
                    물품코드
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight={600}>
                    물품명
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight={600}>
                    규격
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight={600}>
                    단위
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight={600}>
                    단가
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                mt: 0.5, // 상단 간격 조절
                mb: 0.5, // 하단 간격 조절
              }}
            >
              {currentItems.map((item) => (
                <TableRow
                  key={item.itemCode}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    },
                  }}
                  onClick={(event) => handleSingleSelect(event, item.itemCode)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.itemCode)}
                      onChange={(event) =>
                        handleSingleSelect(event, item.itemCode)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={400}>
                      {item.itemCode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={400}>
                      {item.itemName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={400}>
                      {item.spec}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={400}>
                      {item.unit}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={400}>
                      {item.itemPrice}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                color="primary"
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
      />
      <ItemModifyModal
        open={modifyModalOpen}
        onClose={() => setModifyModalOpen(false)}
        selectedItem={selectedItems}
      />
    </>
  );
};

export default Item;
