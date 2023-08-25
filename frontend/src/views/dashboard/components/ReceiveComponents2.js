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
} from "@mui/material";
import { Delete, Edit, Done } from "@mui/icons-material";
import DashboardCard from "../../../components/shared/DashboardCard";
import swal from "sweetalert2";
// import products from '../../data/memberData';
import pOrderItemUpdateAxios from "../../../axios/POrderItemUpdateAxios";
import receiveItemDeleteAxios from "src/axios/receiveItemDeleteAxios";

const ReceiveComponents = (props) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [receiveProducts, setReceiveProducts] = useState([]);

  useEffect(() => {
    if (props.receiveItemData && props.receiveItemData.data) {
      setReceiveProducts(props.receiveItemData.data);
    }
  }, [props.receiveItemData]);

  useEffect(() => {
    setVisibleProducts(receiveProducts.slice(0, visibleCount));
  }, [visibleCount, receiveProducts]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const newVisibleCount = visibleCount + 10;
      setVisibleCount(newVisibleCount);
    }
    e.target = clientHeight;
  };

  const dispatch = useDispatch();
  // const porderModalState = useSelector((state) => state.porderModal);
  // const porderData = useSelector((state) => state.selectedPOrder.seletedPOrder);

  const handleEdit = (receiveCode, receiveItemNo) => {
    setEditMode((prevState) => ({
      ...prevState,
      [`${receiveCode}-${receiveItemNo}`]: !prevState[`${receiveCode}-${receiveItemNo}`],
    }));
    if (editMode[`${receiveCode}-${receiveItemNo}`]) {
      const index = receiveProducts.findIndex(
        (product) => product.receiveCode === receiveCode && product.receiveItemNo === receiveItemNo
      );
      if (index !== -1) {
        const updatedProducts = [...receiveProducts];
        updatedProducts[index] = receiveProducts[index];
        setReceiveProducts(updatedProducts);
        pOrderItemUpdateAxios(updatedProducts[index]);
      }
    }
  };
  const handleDelete = () => {
    swal
      .fire({
        title: "정말로 삭제하시겠습니까?",
        text: "삭제된 데이터는 복구할 수 없습니다.\n 해당하는 데이터의 창고재고도 함께 삭제됩니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      })
      .then((result) => {
        if (result.isConfirmed) {
          receiveItemDeleteAxios(selectedProducts); // 여기서 삭제 처리를 호출
        }
      });
  };

  const handleClick = () => {
    let timerInterval;
    swal.fire({
      title: "품목을 조회중",
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

  const handleCheckboxChange = (receiveCode, receiveItemNo) => {
    const selectedProduct = { receiveCode, receiveItemNo };
    const isProductSelected = selectedProducts.some(
      (product) => product.receiveCode === receiveCode && product.receiveItemNo === receiveItemNo
    );
    console.log("checkBoxTest : " + JSON.stringify(selectedProducts));
    if (isProductSelected) {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter(
          (product) =>
            product.receiveCode !== receiveCode || product.receiveItemNo !== receiveItemNo
        )
      );
    } else {
      setSelectedProducts((prevSelected) => [...prevSelected, selectedProduct]);
    }
  };

  // const handleCheckboxChange = (receiveCode, receiveItemNo) => {
  //   const selectedId = `${receiveCode}-${receiveItemNo}`;
  //   const selectedIndex = selectedProducts.indexOf(selectedId);
  //   let updatedSelectedProducts = [...selectedProducts];
  //   if (selectedIndex === -1) {
  //     updatedSelectedProducts.push(selectedId);
  //   } else {
  //     updatedSelectedProducts.splice(selectedIndex, 1);
  //   }
  //   setSelectedProducts(updatedSelectedProducts);
  // };

  // const handleCheckboxChange = (productId) => {
  //   const selectedIndex = selectedProducts.indexOf(productId);
  //   let updatedSelectedProducts = [...selectedProducts];
  //   if (selectedIndex === -1) {
  //     updatedSelectedProducts.push(productId);
  //   } else {
  //     updatedSelectedProducts.splice(selectedIndex, 1);
  //   }
  //   setSelectedProducts(updatedSelectedProducts);
  // };

  const handleChange = (productId, property, value) => {
    if (editMode[productId] && (property === "receiveCount" || property === "warehouseNo")) {
      const index = receiveProducts.findIndex((product) => product.receiveItemNo === productId);
      const updatedProducts = [...receiveProducts];
      updatedProducts[index][property] = value;
      setReceiveProducts(updatedProducts);
    }
  };

  return (
    <DashboardCard>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Button
            variant="outlined"
            size="big"
            onClick={handleDelete}
            startIcon={<Delete />}
            color="error"
          >
            삭제
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            품목번호:
          </Typography>
          <TextField label="품목번호" variant="outlined" size="small" sx={{ mr: 2 }} />
          <Button onClick={handleClick} variant="contained">
            Search
          </Button>
        </Box>
      </Box>
      <br />
      <Box sx={{ overflow: "auto", maxHeight: "400px" }} onScroll={handleScroll}>
        <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
          <TableHead
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#fff",
            }}
          >
            <TableRow>
              <TableCell>선택</TableCell>
              <TableCell>입고순번</TableCell>
              <TableCell>발주코드</TableCell>
              <TableCell>발주순번</TableCell>
              <TableCell>품목코드</TableCell>
              <TableCell>입고수량</TableCell>
              <TableCell>창고번호</TableCell>
              <TableCell>수정</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleProducts.map((product, index) => (
              <TableRow key={index}>
                {/* <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(
                      `${product.receiveCode}-${product.receiveItemNo}`
                    )}
                    onChange={() =>
                      handleCheckboxChange(product.receiveCode, product.receiveItemNo)
                    }
                  />
                </TableCell> */}
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.some(
                      (selectedProduct) =>
                        selectedProduct.receiveCode === product.receiveCode &&
                        selectedProduct.receiveItemNo === product.receiveItemNo
                    )}
                    onChange={() =>
                      handleCheckboxChange(product.receiveCode, product.receiveItemNo)
                    }
                  />
                </TableCell>

                {/* <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.receiveItemNo)}
                    onChange={() => handleCheckboxChange(product.receiveItemNo)}
                  />
                </TableCell> */}
                <TableCell>
                  {editMode[product.receiveItemNo] ? (
                    <TextField
                      value={product.receiveItemNo}
                      onChange={(e) =>
                        handleChange(product.receiveItemNo, "receiveItemNo", e.target.value)
                      }
                    />
                  ) : (
                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                      {product.receiveItemNo}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {editMode[product.porderCode] ? (
                    <TextField
                      value={product.porderCode}
                      onChange={(e) =>
                        handleChange(product.porderCode, "receiveItemNo", e.target.value)
                      }
                    />
                  ) : (
                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                      {product.porderCode}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {editMode[product.porderItemNo] ? (
                    <TextField
                      value={product.porderItemNo}
                      onChange={(e) =>
                        handleChange(product.porderItemNo, "receiveItemNo", e.target.value)
                      }
                    />
                  ) : (
                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                      {product.porderItemNo}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {editMode[product.itemCode] ? (
                    <TextField
                      value={product.itemCode}
                      onChange={(e) =>
                        handleChange(product.itemCode, "receiveItemNo", e.target.value)
                      }
                    />
                  ) : (
                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                      {product.itemCode}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {editMode[`${product.receiveCode}-${product.receiveItemNo}`] &&
                  (product.receiveCount !== null || product.warehouseNo !== null) ? (
                    <TextField
                      value={product.receiveCount}
                      onChange={(e) =>
                        handleChange(
                          `${product.receiveCode}-${product.receiveItemNo}`,
                          "receiveCount",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                      {product.receiveCount}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {editMode[`${product.receiveCode}-${product.receiveItemNo}`] &&
                  (product.receiveCount !== null || product.warehouseNo !== null) ? (
                    <TextField
                      value={product.warehouseNo}
                      onChange={(e) =>
                        handleChange(
                          `${product.receiveCode}-${product.receiveItemNo}`,
                          "warehouseNo",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                      {product.warehouseNo}
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={
                      editMode[`${product.receiveCode}-${product.receiveItemNo}`] ? (
                        <Done />
                      ) : (
                        <Edit />
                      )
                    }
                    onClick={() => handleEdit(product.receiveCode, product.receiveItemNo)}
                  >
                    {editMode[`${product.receiveCode}-${product.receiveItemNo}`] ? "Save" : "Edit"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default ReceiveComponents;
