import axios from "axios";
import React, { useState, useEffect } from "react";
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
  Modal,
  Paper,
  Snackbar,
  Alert,
  Checkbox,
  Pagination,
} from "@mui/material";
import DashboardCard from "../../../components/shared/DashboardCard";

const Item = () => {
  const ITEMS_PER_PAGE = 5; // 한 페이지당 표시할 아이템 개수
  const [initItems, setInitItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태

  useEffect(() => {
    axios
      .get("http://localhost:8888/api/item/list")
      .then((response) => {
        setInitItems(response.data.data);
      })
      .catch((error) => {
        alert(error.message);
      });
  }, []);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1); // 페이지 변경 시 현재 페이지 상태 업데이트
  };

  const itemInsertButtonClick = () => {

  }

  const itemModifyButtonClick = () => {

  }

  const itemDeleteButtonClick = () => {

  }

  // 현재 페이지에 따른 아이템들 계산
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = Array.isArray(initItems)
    ? initItems.slice(offset, offset + ITEMS_PER_PAGE)
    : [];

  return (
    <>
      <DashboardCard>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 0.5, // 상단 간격 조절
            mb: 0.5, // 하단 간격 조절
          }}
        >
          <Typography variant="h4" component="div">
            물품관리
          </Typography>
          <Box>
            <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={itemInsertButtonClick} >
              추가
            </Button>
            <Button variant="contained" color="info" sx={{ mr: 2 }} onClick={itemModifyButtonClick}>
              수정
            </Button>
            <Button variant="contained" color="error" sx={{ mr: 2 }} onClick={itemDeleteButtonClick}>
              삭제
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
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
          />
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            물품명
          </Typography>
          <TextField
            label="물품명을 입력해주세요"
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
          />
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            물품가격
          </Typography>
          <TextField
            label="물품가격을 입력해주세요"
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
          />
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            조회
          </Button>
        </Box>
        <br />
        <Box sx={{ overflow: "auto", maxHeight: "600px" }}>
          <Table
            aria-label="simple table"
            sx={{
              whiteSpace: "nowrap",
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
                <TableCell>
                  <Checkbox />
                </TableCell>
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
                    금액
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
                  key={currentItems.itemCode}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell>
                    <Checkbox />
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
                count={Math.ceil(initItems.length / ITEMS_PER_PAGE)}
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
    </>
  );
};

export default Item;
