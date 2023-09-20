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
  Pagination,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  TableContainer,
  Paper,
  styled,
  InputAdornment,
} from "@mui/material";
import DashboardCard from "../../../components/shared/DashboardCard";
import swal from "sweetalert2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import porderAxios from "./../../../axios/porderAxios";
import { Delete } from "@mui/icons-material";
import { warehouseList } from "../../../redux/thunks/warehouseList";
import Loading from "../../../loading";
import { warehouseSectionList } from "../../../redux/thunks/warehouseSectionList";
import { searchWarehouseList } from "src/redux/thunks/searchWarehouseList";
import PageviewOutlinedIcon from "@mui/icons-material/PageviewOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { tableCellClasses } from "@mui/material/TableCell";
import { IconBuildingWarehouse } from "@tabler/icons";
import { IconSearch } from "@tabler/icons";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#505e82",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 40,
    minWidth: 100,
    padding: "27px",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Warehouse = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(warehouseList());
    dispatch(warehouseSectionList());
  }, [dispatch]);
  const productsData = useSelector((state) => state.warehouseList.products);
  const products = JSON.parse(JSON.stringify(productsData));
  const realProducts = products?.data || [];
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

  const selectedProducts = useSelector(
    (state) => state.selectedProduct.selectedProduct
  );

  useEffect(() => {
    if (selectedProducts.length === 1) {
      porderAxios(selectedProducts, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts]);

  const [warehouseName, setWarehouseName] = useState("");
  const [itemName, setItemName] = useState("");
  const [manager, setManager] = useState("");

  const handleClick = () => {
    let timerInterval;
    dispatch(searchWarehouseList(warehouseName, itemName, manager));
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

  const [sectionAddOpen, setSectionAddOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [sectionName, setSectionName] = useState("");
  const warehouseSectionInsert = async () => {
    try {
      // sectionList에서 동일한 warehouseName이 있는지 확인
      const isDuplicate = sectionList.some(
        (section) => section.warehouseName === sectionName
      );

      // 중복된 이름이 있다면 경고 메시지를 표시하고 함수를 종료
      if (isDuplicate) {
        setOpen(false);
        setSectionAddOpen(false);
        await swal.fire({
          title: "창고구역 추가 실패.",
          text: "이미 동일한 이름의 창고구역이 있습니다.",
          icon: "error",
          showConfirmButton: true,
        });

        setSectionName("");
        return;
      }

      const warehouseInsertDto = {
        warehouseName: sectionName,
      };

      setSectionName("");
      setSectionAddOpen(false);
      setOpen(false);

      const response = await axios.post(
        "http://localhost:8888/api/warehouse/insert",
        warehouseInsertDto
      );
      if (response.status === 201) {
        swal
          .fire({
            title: "창고구역 추가완료.",
            text: "창고구역이 추가되었습니다.",
            icon: "success",
          })
          .then(() => {
            dispatch(warehouseSectionList());
            setOpen(true);
          });
      }
    } catch (error) {
      {
        swal.fire({
          title: "추가 실패.",
          text: "창고구역 추가에 실패했습니다.",
          icon: "error",
          showConfirmButton: false,
        });
      }
    }
  };

  const sectionListData = useSelector(
    (state) => state.warehouseSectionList.warehouseSectionList.data
  );
  const sectionList = Array.isArray(sectionListData) ? sectionListData : [];

  const [selectedWarehouseSection, setSelectedWarehouseSection] = useState("");

  const warehouseDelete = async () => {
    // 해당 창고명에 일치하는 첫 번째 창고 객체를 찾습니다.
    const selectedWarehouse = sectionList.find(
      (warehouse) => warehouse.warehouseName === selectedWarehouseSection
    );

    // 해당 창고명에 창고재고가 담겨있는지 확인합니다.
    const isExistWarehouseStock = realProducts.some(
      (i) => i.warehouseName === selectedWarehouse.warehouseName
    );

    if (!selectedWarehouse) {
      setSelectedWarehouseSection("");
      setOpen(false);

      await swal
        .fire({
          title: "삭제 실패",
          text: "해당 창고구역은 존재하지 않습니다.",
          icon: "error",
        })
        .then(() => {
          setOpen(true);
        });

      return;
    }

    if (isExistWarehouseStock) {
      setSelectedWarehouseSection("");
      setOpen(false);

      await swal
        .fire({
          title: "삭제 실패",
          text: "재고가 있는 창고는 삭제할 수 없습니다.",
          icon: "error",
        })
        .then(() => {
          setOpen(true);
        });

      return;
    }

    const warehouseNo = selectedWarehouse.warehouseNo;

    setSelectedWarehouseSection("");
    setOpen(false);

    const response = await axios.delete(
      `http://localhost:8888/api/warehouse/delete/${warehouseNo}`
    );

    if (response.status === 200) {
      await swal
        .fire({
          title: "창고구역 삭제완료.",
          text: "창고구역이 삭제되었습니다.",
          icon: "success",
        })
        .then(() => {
          dispatch(warehouseSectionList()); // 추가
          setOpen(true);
        });
    } else {
      await swal.fire({
        title: "오류 발생",
        text: "창고구역 삭제 중 오류가 발생했습니다.",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Dialog open={open} sx={{ width: "100%" }}>
        <DialogTitle>창고구역</DialogTitle>
        <DialogContent>
          <Box
            sx={{ display: "flex", marginBottom: "16px" }}
            justifyContent={"flex-start"}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              선택된 구역명: {selectedWarehouseSection}
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", marginBottom: "16px" }}
            justifyContent={"flex-end"}
          >
            <Button
              onClick={() => {
                setSectionAddOpen(true);
              }}
              startIcon={<AddCircleOutlineOutlinedIcon />}
              variant="contained"
            >
              추가
            </Button>
            &nbsp;&nbsp;
            <Button
              variant="contained"
              size="big"
              startIcon={<Delete />}
              color="error"
              onClick={warehouseDelete}
            >
              삭제
            </Button>
          </Box>
          <Table
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.12)", // 테이블에 테두리 추가
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // 그림자 추가
              backgroundColor: "#fafafa", // 배경색 변경
            }}
          >
            <TableBody>
              {sectionList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>데이터가 없습니다.</TableCell>
                </TableRow>
              ) : (
                Array.from({ length: Math.ceil(sectionList.length / 5) }).map(
                  (_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Array.from({ length: 5 }).map((_, colIndex) => {
                        const dataIndex = rowIndex * 5 + colIndex;
                        const warehouse = sectionList[dataIndex];
                        return (
                          <TableCell
                            key={colIndex}
                            sx={{
                              border: "1px solid rgba(0, 0, 0, 0.08)",
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                              },
                            }}
                            onClick={() =>
                              warehouse &&
                              setSelectedWarehouseSection(
                                warehouse.warehouseName
                              )
                            }
                          >
                            {warehouse ? warehouse.warehouseName : ""}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={sectionAddOpen}>
        <DialogTitle
          style={{
            backgroundColor: "#f0f0f0",
            padding: "16px",
            fontWeight: "bold",
          }}
        >
          창고구역 추가
        </DialogTitle>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding="16px"
        >
          <TextField
            label="창고구역명"
            variant="outlined"
            placeholder="ex) A-1"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            style={{ marginBottom: "16px", width: "100%" }}
          />
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            width="100%"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => warehouseSectionInsert()}
              style={{ width: "45%" }}
            >
              추가
            </Button>

            <Button
              variant="contained"
              color="warning"
              onClick={() => setSectionAddOpen(false)}
              style={{ width: "45%" }}
            >
              취소
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Box>
        <DashboardCard>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              padding: "10px",
            }}
          >
            <IconBuildingWarehouse />
            <Typography variant="h4" component="div" sx={{ ml: 1 }}>
              창고 관리
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
            <Box
              sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
            >
              <Typography variant="h6" sx={{ mr: 1 }}>
                창고구역
              </Typography>
              <TextField
                label="창고구역명"
                variant="outlined"
                size="small"
                sx={{ mr: 2 }}
                value={warehouseName}
                onChange={(e) => {
                  setWarehouseName(e.target.value);
                }}
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
                품목 이름
              </Typography>
              <TextField
                label="품목 이름"
                variant="outlined"
                size="small"
                sx={{ marginRight: 2 }}
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
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
                담당자 이름
              </Typography>
              <TextField
                label="담당자 이름"
                variant="outlined"
                size="small"
                sx={{ marginRight: 2 }}
                value={manager}
                onChange={(e) => {
                  setManager(e.target.value);
                }}
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
            </Box>
            <Box>
              <Button
                onClick={handleClick}
                variant="contained"
                color="success"
                size="large"
                startIcon={<PageviewOutlinedIcon />}
                sx={{ mr: 2 }}
              >
                검색
              </Button>
              <Button
                onClick={() => {
                  setOpen(true);
                }}
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddCircleOutlineOutlinedIcon />}
                sx={{ mr: 2 }}
              >
                추가
              </Button>
            </Box>
          </Box>
          <Box sx={{ overflow: "auto", maxHeight: "650px" ,height: 'calc(45vh)' }}>
            <TableContainer component={Paper}>
              <Table aria-label="customized table" sx={{ minWidth: 700 }}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell style={{ width: "10%" }}></StyledTableCell>
                    <StyledTableCell style={{ width: "10%" }}>
                      <Typography variant="h6" fontWeight={600}>
                        창고구역명
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "30%" }}>
                      <Typography variant="h6" fontWeight={600}>
                        품목명
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "20%" }}>
                      <Typography variant="h6" fontWeight={600}>
                        수량
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "30%" }}>
                      <Typography variant="h6" fontWeight={600}>
                        담당자
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
                  {currentItems.map((realProduct, index) => (
                    <StyledTableRow
                      key={index}
                      sx={{
                        backgroundColor: index % 2 !== 0 ? "#f3f3f3" : "white",
                        "&:hover": {
                          backgroundColor: "#c7d4e8",
                          cursor: "pointer",
                        },
                      }}
                      style={{ height: "20%" }}
                    >
                      <TableCell></TableCell>
                      <StyledTableCell align="left">
                        <Typography sx={{ fontWeight: "400" }}>
                          {realProduct.warehouseName}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography variant="subtitle2" fontWeight={400}>
                          {realProduct.itemName}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Typography variant="subtitle2" fontWeight={400}>
                          {realProduct.totalCount}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography variant="subtitle2" fontWeight={400}>
                          {realProduct.manager}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
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
              {realProducts ? (
                <Pagination
                  count={Math.ceil(realProducts.length / ITEMS_PER_PAGE)}
                  page={currentPage + 1}
                  variant="outlined"
                  color="primary"
                  onChange={handlePageChange}
                />
              ) : (
                <Loading />
              )}
            </Box>
          </Box>
        </DashboardCard>
      </Box>
    </>
  );
};

export default Warehouse;
