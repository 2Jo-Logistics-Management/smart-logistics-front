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
  Checkbox,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Edit, Done, GifBox } from "@mui/icons-material";
import DashboardCard from "../../../components/shared/DashboardCard";
import swal from "sweetalert2";
import receiveItemUpdateAxios from "src/axios/receiveItemUpdateAxios";
import axios from "axios";
import receiveInsertAxios from "src/axios/receiveInsertAxios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import IconButton from "@mui/material/IconButton";
import { tableCellClasses } from "@mui/material/TableCell";

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

const ReceiveComponents2 = (props) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [receiveProducts, setReceiveProducts] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [detailPorder, setDetailPorder] = useState(null);
  const [selectWarehouse, setSelectWarehouse] = useState("");
  const [receiveCounts, setReceiveCounts] = useState("");
  const [modifyReceiveItemData, setModifyReceiveItemData] = useState(null);
  const [addPOrderProducts, setAddPOrderProducts] = useState([]);
  const [addReceiveManager, setAddReceiveManager] = useState(null);
  const [addSelectedDateTime, setAddSelectedDateTime] = useState("");
  const [receiveItemCounts, setReceiveItemCounts] = useState(
    Array(addPOrderProducts.length).fill("")
  );
  const [selectedWarehouses, setSelectedWarehouses] = useState(
    Array(addPOrderProducts.length).fill("")
  );
  const [modifyCode, setModifyCode] = useState("");

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
  useEffect(() => {
    if (props.receiveItemData && props.receiveItemData.data) {
      setReceiveProducts(props.receiveItemData.data);
      props.modifyReceiveItemCode(modifyCode);
      setModifyCode("");
    }
    if (props.receiveItemData.data === undefined) {
      setReceiveProducts([]);
    }
  }, [props.receiveItemData, modifyCode]);
  useEffect(() => {
    setVisibleProducts(receiveProducts.slice(0, visibleCount));
  }, [visibleCount, receiveProducts]);

  useEffect(() => {
    if (props.receiveCheckData === true) {
      setSelectedProducts([]);
    }
  }, [props.receiveCheckData]);

  useEffect(() => {
    if (addSelectedDateTime === "") {
      setAddSelectedDateTime(new Date());
    }
  }, [addSelectedDateTime]);

  useEffect(() => {
    if (props.modifyReceiveCode !== "null") {
      setModifyReceiveItemData(props.modifyReceiveCode);
    }
    if (props.modifyReceiveCode === "null") {
      setModifyReceiveItemData(null);
    }
  }, [props.modifyReceiveCode]);

  useEffect(() => {
    if (props.modalSelectedProducts.length !== 0) {
      setAddPOrderProducts(props.modalSelectedProducts);
    } else if (props.modalSelectedProducts.length === 0) {
      setAddPOrderProducts([]);
    }
  }, [props.modalSelectedProducts]);

  const handleEdit = (receiveCode, receiveItemNo) => {
    setEditMode((prevState) => ({
      ...prevState,
      [`${receiveCode}-${receiveItemNo}`]: !prevState[`${receiveCode}-${receiveItemNo}`],
    }));

    const index = receiveProducts.findIndex(
      (product) => product.receiveCode === receiveCode && product.receiveItemNo === receiveItemNo
    );

    if (editMode[`${receiveCode}-${receiveItemNo}`] && index !== -1) {
      const updatedProduct = receiveProducts[index];

      const updatedProducts = [...receiveProducts];
      updatedProducts[index] = {
        ...updatedProduct,
      };
      setReceiveProducts(updatedProducts);
      if (receiveCounts === "" && selectWarehouse === "") {
        swal.fire({
          title: "변경 사항 없음",
          text: "수정할 입력 사항이 없습니다",
          icon: "warning",
        });
      } else if (receiveCounts !== "" || selectWarehouse !== "") {
        receiveItemUpdateAxios(receiveCode, receiveItemNo, receiveCounts, selectWarehouse);
        setModifyCode(receiveCode);
      }
      setModifyReceiveItemData(null);
      setReceiveCounts("");
      setSelectWarehouse("");
      props.modifyData(true);
    }
  };

  const handleCheckboxChange = (receiveCode, receiveItemNo) => {
    const selectedProduct = { receiveCode, receiveItemNo };
    const isProductSelected = selectedProducts.some(
      (product) => product.receiveCode === receiveCode && product.receiveItemNo === receiveItemNo
    );

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
    props.onCheckboxChange(receiveCode, receiveItemNo, !isProductSelected);
  };

  const handleReceiveCountChange = (value, index) => {
    value = parseFloat(String(value).replace(/,/g, "")) || 0;
    const updatedReceiveCounts = [...receiveCounts];
    updatedReceiveCounts[index] = value;
    setReceiveCounts(updatedReceiveCounts);
  };

  const handleChange = (productId, property, value, index) => {
    value = parseFloat(String(value).replace(/,/g, "")) || 0;
    const updatedSelectWarehouse = [...selectWarehouse];
    updatedSelectWarehouse[index] = value;
    setSelectWarehouse(updatedSelectWarehouse);
    if (
      editMode[productId] &&
      (property === "receiveCount" || property === "warehouseNo" || property === "warehouseName")
    ) {
      const updatedProducts = [...receiveProducts];
      const productIndex = updatedProducts.findIndex(
        (product) => product.receiveItemNo === productId
      );
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        [property]: value,
      };
      setReceiveProducts(updatedProducts);
    }
  };
  const handleReceiveItemCountChange = (value, index) => {
    const updatedItemCounts = [...receiveItemCounts];
    updatedItemCounts[index] = value;
    setReceiveItemCounts(updatedItemCounts);
  };
  const handleSelectedWarehouse = (event, rowIndex) => {
    const updatedSelectedWarehouses = [...selectedWarehouses];
    updatedSelectedWarehouses[rowIndex] = event.target.value;
    setSelectedWarehouses(updatedSelectedWarehouses);
  };
  const handleRemoveRow = (indexToRemove) => {
    setAddPOrderProducts((prevProducts) =>
      prevProducts.filter((_, index) => index !== indexToRemove)
    );
    setSelectedWarehouses((prevWarehouses) =>
      prevWarehouses.filter((_, index) => index !== indexToRemove)
    );
    setReceiveItemCounts((prevCounts) => prevCounts.filter((_, index) => index !== indexToRemove));
  };
  const handleSave = async () => {
    try {
      const dateTimeObj = new Date(addSelectedDateTime);
      const year = dateTimeObj.getFullYear();
      const month = (dateTimeObj.getMonth() + 1).toString().padStart(2, "0");
      const day = dateTimeObj.getDate().toString().padStart(2, "0");
      const hours = dateTimeObj.getHours().toString().padStart(2, "0");
      const minutes = dateTimeObj.getMinutes().toString().padStart(2, "0");
      const seconds = dateTimeObj.getSeconds().toString().padStart(2, "0");
      const finalReceiveDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      const insertData = addPOrderProducts.map((product, index) => ({
        porderCode: product.porderCode,
        porderItemNo: product.porderItemNo,
        itemCode: product.itemCode,
        accountNo: product.accountNo,
        receiveCount: receiveItemCounts[index],
        warehouseNo: selectedWarehouses[index],
      }));
      const response = await receiveInsertAxios([
        addReceiveManager,
        finalReceiveDateTime,
        { insertData },
      ]);
      const receiveNewData = response.data.data;
      props.newReceiveCode(receiveNewData);
    } catch (error) {
      console.log("오류발생 : ", error.message);
    }
    setAddPOrderProducts([]);
    setAddReceiveManager(null);
    props.addPOrdersClear([]);
    setReceiveItemCounts([]);
    setSelectedWarehouses([]);
    setAddSelectedDateTime("");
  };
  const handleCancel = () => {
    setAddPOrderProducts([]);
    setAddReceiveManager(null);
    setAddSelectedDateTime("");
    props.addPOrdersClear([]);
  };

  return (
    <DashboardCard disabled={receiveProducts.length !== 0}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", // Set the direction to column
          alignItems: "center",
          mb: 2,
          padding: "10px",
        }}
      >
        {addPOrderProducts.length !== 0 && (
          <Table>
            <TableRow sx={{ backgroundColor: "rgba(200, 200, 200, 0.5)", textAlign: "center" }}>
              <StyledTableCell sx={{ paddingLeft: 30, textAlign: "right", paddingRight: 0 }}>
                <Typography variant="h6" fontWeight={600}>
                  입고담당자
                </Typography>
              </StyledTableCell>
              <StyledTableCell sx={{ fontSize: "13px", textAlign: "left", paddingLeft: 4 }}>
                <TextField
                  label="입고담당자를 입력해주세요"
                  size="small"
                  value={addReceiveManager}
                  onChange={(e) => setAddReceiveManager(e.target.value)}
                />
              </StyledTableCell>

              <StyledTableCell sx={{ textAlign: "right" }}>
                <Typography variant="h6" fontWeight={600}>
                  입고일
                </Typography>
              </StyledTableCell>
              <StyledTableCell sx={{ textAlign: "left" }}>
                <Typography variant="h6" fontWeight={600}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="입고일을 입력해주세요"
                      value={addSelectedDateTime}
                      onChange={(newDate) => setAddSelectedDateTime(newDate)}
                      renderInput={(props) => <TextField {...props} />}
                      views={["year", "month", "day"]}
                      format="yyyy.MM.dd"
                      defaultValue={new Date()}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </LocalizationProvider>
                </Typography>
              </StyledTableCell>
              <StyledTableCell sx={{ textAlign: "right" }}>
                <Button onClick={handleCancel} variant="contained" color="error">
                  등록취소
                </Button>
              </StyledTableCell>
              <StyledTableCell sx={{ textAlign: "right", width: 120 }}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    if (
                      addReceiveManager === null ||
                      receiveItemCounts.length === 0 ||
                      selectedWarehouses.length === 0
                    ) {
                      swal.fire({
                        title: "입고 정보 입력 필요",
                        text: "담당자, 수량, 창고 위치를 정확히 입력하세요",
                        icon: "warning",
                      });
                    }
                    if (
                      addReceiveManager !== null &&
                      receiveItemCounts.length !== 0 &&
                      selectedWarehouses.length !== 0
                    ) {
                      setAddReceiveManager(addReceiveManager);
                      handleSave(addReceiveManager, addSelectedDateTime);
                    }
                  }}
                >
                  등록완료
                </Button>
              </StyledTableCell>
            </TableRow>
          </Table>
        )}
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
            mt: 2,
          }}
        >
          <TableHead>
            <StyledTableRow>
              <StyledTableCell style={{ width: "10%" }}>
                <Typography variant="h6" fontWeight={600}>
                  {addPOrderProducts.length === 0 ? "선택" : "발주번호"}
                </Typography>
              </StyledTableCell>
              <StyledTableCell style={{ width: "10%" }}>
                <Typography variant="h6" fontWeight={600}>
                  순번
                </Typography>
              </StyledTableCell>
              <StyledTableCell style={{ width: "15%" }}>
                <Typography variant="h6" fontWeight={600}>
                  품목코드
                </Typography>
              </StyledTableCell>
              <StyledTableCell style={{ width: "15%" }}>
                <Typography variant="h6" fontWeight={600}>
                  {addPOrderProducts.length === 0 ? "품목이름" : "거래처번호"}
                </Typography>
              </StyledTableCell>
              <StyledTableCell style={{ width: "10%" }}>
                <Typography variant="h6" fontWeight={600}>
                  입고수량
                </Typography>
              </StyledTableCell>
              <StyledTableCell style={{ width: "15%" }}>
                <Typography variant="h6" fontWeight={600}>
                  창고
                </Typography>
              </StyledTableCell>
              <StyledTableCell style={{ width: "15%" }}>
                <Typography variant="h6" fontWeight={600}>
                  {addPOrderProducts.length === 0 ? "발주정보" : ""}
                </Typography>
              </StyledTableCell>
              <StyledTableCell style={{ width: "20%" }}></StyledTableCell>
            </StyledTableRow>
          </TableHead>
          {addPOrderProducts.length !== 0 && (
            <TableBody>
              {addPOrderProducts.map((product, index) => (
                <StyledTableRow
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <StyledTableCell>
                    <Typography variant="subtitle2" fontWeight={400}>
                      {product.porderCode}
                    </Typography>
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
                      {product.accountNo}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      size="small"
                      sx={{ width: 100 }}
                      label={`잔량: ${product.availableCount}`}
                      value={receiveItemCounts[index]}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value) || 0);
                      }}
                      onChange={(e) => handleReceiveItemCountChange(e.target.value, index)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <FormControl sx={{ width: 80 }} size="small">
                      <Select
                        value={selectedWarehouses[index] || ""}
                        onChange={(event) => handleSelectedWarehouse(event, index)}
                        displayEmpty
                        inputProps={{ "aria-label": "Select warehouse" }}
                      >
                        {warehouseOptions.map((warehouse) => (
                          <MenuItem key={warehouse.warehouseNo} value={warehouse.warehouseNo}>
                            {warehouse.warehouseName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </StyledTableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveRow(index)}
                      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                  <StyledTableCell></StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          )}
          {addPOrderProducts.length === 0 && (
            <TableBody sx={{ padding: "3px" }} disabled={false}>
              {visibleProducts.map((product, index) => (
                <StyledTableRow key={index} receiveCode={visibleProducts.receiveCode}>
                  <StyledTableCell align="center" sx={{ padding: "3px" }}>
                    <Checkbox
                      checked={selectedProducts.some(
                        (selectedProduct) =>
                          selectedProduct.receiveCode === product.receiveCode &&
                          selectedProduct.receiveItemNo === product.receiveItemNo
                      )}
                      onChange={() =>
                        handleCheckboxChange(product.receiveCode, product.receiveItemNo)
                      }
                      disabled={product.porderState === "완료"}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Typography variant="subtitle2" fontWeight={400}>
                      {product.receiveItemNo}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Typography variant="subtitle2" fontWeight={400}>
                      {product.itemCode}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Typography variant="subtitle2" fontWeight={400}>
                      {product.itemName}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Typography variant="subtitle2" fontWeight={400}>
                      {editMode[`${product.receiveCode}-${product.receiveItemNo}`] &&
                      (product.receiveCount !== null || product.warehouseNo !== null) ? (
                        <TextField
                          value={receiveCounts[index] || product.receiveCount}
                          onChange={(e) => handleReceiveCountChange(e.target.value, index)}
                          size="small"
                          sx={{ width: "80px" }}
                        />
                      ) : (
                        product.receiveCount
                      )}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Typography variant="subtitle2" fontWeight={400}>
                      <FormControl sx={{ width: 80 }} size="small">
                        {editMode[`${product.receiveCode}-${product.receiveItemNo}`] &&
                        (product.receiveCount !== null || product.warehouseNo !== null) ? (
                          <Select
                            value={selectWarehouse[index] || product.warehouseName}
                            onChange={(e) =>
                              handleChange(
                                `${product.receiveCode}-${product.receiveItemNo}`,
                                "warehouseNo",
                                e.target.value,
                                index
                              )
                            }
                            sx={{ width: "80px" }}
                          >
                            {warehouseOptions.map((option) => (
                              <MenuItem key={option.warehouseNo} value={option.warehouseNo}>
                                {option.warehouseName}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          product.warehouseName
                        )}
                      </FormControl>
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip
                      title={
                        <div>
                          발주코드: {product.porderCode}
                          <br />
                          발주순번: {product.porderItemNo}
                          <br />
                          발주상태: {product.porderState}
                        </div>
                      }
                    >
                      <IconButton>
                        <FeedOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center">
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
                      disabled={
                        product.porderState === "완료" ||
                        String(modifyReceiveItemData) !== String(product.receiveCode)
                      }
                    >
                      {editMode[`${product.receiveCode}-${product.receiveItemNo}`]
                        ? "Save"
                        : "Edit"}
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          )}
          <Tooltip>
            {detailPorder && (
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  backgroundColor: "white",
                  zIndex: 999,
                  width: "100px",
                  height: "30px",
                  border: "1px solid #ccc",
                }}
              >
                {detailPorder.porderCode}
              </div>
            )}
          </Tooltip>
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default ReceiveComponents2;
