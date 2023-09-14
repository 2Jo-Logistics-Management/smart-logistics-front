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
} from "@mui/material";
import { Edit, Done, Delete } from "@mui/icons-material";
import DashboardCard from "../../../components/shared/DashboardCard";
import swal from "sweetalert2";
import receiveItemUpdateAxios from "src/axios/receiveItemUpdateAxios";
import axios from "axios";
import receiveInsertAxios from "src/axios/receiveInsertAxios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { lightBlue } from "@mui/material/colors";
import { log } from "util";

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
  const [modifyReceiveItemData, setModfiyReceiveItemData] = useState(null);
  const [addPOrderProducts, setAddPOrderProducts] = useState([]);
  const [addReceiveManager, setAddReceiveManager] = useState(null);
  const [addSelectedDateTime, setAddSelectedDateTime] = useState("");
  const [receiveItemCounts, setReceiveItemCounts] = useState(
    Array(addPOrderProducts.length).fill("")
  );
  const [selectedWarehouses, setSelectedWarehouses] = useState(
    Array(addPOrderProducts.length).fill("")
  );
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
    }
    if (props.receiveItemData.data === undefined) {
      setReceiveProducts([]);
    }
  }, [props.receiveItemData]);
  useEffect(() => {
    setVisibleProducts(receiveProducts.slice(0, visibleCount));
  }, [visibleCount, receiveProducts]);

  useEffect(() => {
    if (props.receiveCheckData === true) {
      setSelectedProducts([]);
    }
  }, [props.receiveCheckData]);

  useEffect(() => {
    if (props.modifyReceiveCode !== null) {
      setModfiyReceiveItemData(props.modifyReceiveCode);
    }
  }, [props.modifyReceiveCode]);

  useEffect(() => {
    if (props.modalSelectedProducts.length !== 0) {
      setAddPOrderProducts(props.modalSelectedProducts);
    } else if (props.modalSelectedProducts.length === 0) {
      setAddPOrderProducts([]);
    }
  }, [props.modalSelectedProducts]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const newVisibleCount = visibleCount + 10;
      setVisibleCount(newVisibleCount);
    }
    e.target = clientHeight;
  };

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
      }
      setReceiveCounts("");
      setSelectWarehouse("");
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
      setAddPOrderProducts([]);
      setAddReceiveManager(null);
      setAddSelectedDateTime(null);
      props.addPOrdersClear([]);
      props.newReceiveCode(receiveNewData);
    } catch (error) {
      console.log("오류발생 : ", error.message);
    }
  };
  const handleCancel = () => {
    setAddPOrderProducts([]);
    setAddReceiveManager(null);
    setAddSelectedDateTime(null);
    props.addPOrdersClear([]);
  };

  return (
    <DashboardCard sx={{}} disabled={receiveProducts.length !== 0}>
      <Box
        sx={{
          overflow: "auto",
          maxHeight: "800px",
          height: "800px",
          padding: "3px",
          marginTop: "-40px",
          marginLeft: "-15px",
        }}
        onScroll={handleScroll}
      >
        {addPOrderProducts.length !== 0 && (
          <Table>
            <TableRow sx={{ backgroundColor: "rgba(200, 200, 200, 0.5)" }}>
              <TableCell
                sx={{ fontSize: "13px", paddingLeft: 30, textAlign: "center", paddingRight: 0 }}
              >
                입고담당자
              </TableCell>
              <TableCell sx={{ fontSize: "13px", textAlign: "center", paddingLeft: "0px" }}>
                <TextField
                  label="입고담당자"
                  size="small"
                  value={addReceiveManager}
                  onChange={(e) => setAddReceiveManager(e.target.value)}
                />
              </TableCell>

              <TableCell sx={{ fontSize: "13px" }}>입고일</TableCell>
              <TableCell sx={{ fontSize: "13px" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="입고일"
                    value={addSelectedDateTime}
                    onChange={(newDate) => setAddSelectedDateTime(newDate)}
                    renderInput={(props) => <TextField {...props} />}
                    views={["year", "month", "day"]}
                    format="yyyy.MM.dd"
                    defaultValue={new Date()}
                    slotProps={{ textField: { size: "small" } }}
                  />
                </LocalizationProvider>
              </TableCell>
              <TableCell sx={{ textAlign: "right" }}>
                <Button onClick={handleCancel} variant="contained" color="error">
                  등록취소
                </Button>
              </TableCell>
              <TableCell sx={{ textAlign: "right", width: 120 }}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    if (addReceiveManager === null || receiveItemCounts.length === 0) {
                      swal.fire({
                        title: "담당자 또는 수량 입력 필요",
                        text: "담당자와 수량을 정확히 입력하세요",
                        icon: "warning",
                      });
                    }

                    if (addReceiveManager !== null && receiveItemCounts.length !== 0) {
                      setAddReceiveManager(addReceiveManager);
                      handleSave(addReceiveManager, addSelectedDateTime);
                    }
                  }}
                >
                  등록완료
                </Button>
              </TableCell>
            </TableRow>
          </Table>
        )}
        <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2, marginLeft: "-5px" }}>
          <TableHead
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#fff",
              padding: "3px",
            }}
          >
            <TableRow sx={{ padding: "3px" }}>
              <TableCell sx={{ width: 215 }}>
                {addPOrderProducts.length === 0 ? "선택" : "발주번호"}
              </TableCell>
              <TableCell sx={{ width: 200 }}>순번</TableCell>
              <TableCell sx={{ width: 200 }}>품목코드</TableCell>
              <TableCell sx={{ width: 200 }}>
                {addPOrderProducts.length === 0 ? "품목이름" : "거래처번호"}
              </TableCell>
              <TableCell sx={{ width: 200 }}>입고수량</TableCell>
              <TableCell sx={{ width: 200 }}>창고</TableCell>
              <TableCell sx={{ width: 200 }}>
                {addPOrderProducts.length === 0 ? "발주정보" : ""}
              </TableCell>
              <TableCell sx={{ visibility: "hidden" }}>수정</TableCell>
            </TableRow>
          </TableHead>
          {addPOrderProducts.length !== 0 && (
            <TableBody>
              {addPOrderProducts.map((product, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <TableCell>{product.porderCode}</TableCell>
                  <TableCell>{product.porderItemNo}</TableCell>
                  <TableCell>{product.itemCode}</TableCell>
                  <TableCell>{product.accountNo}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      sx={{ width: 100 }}
                      label={`잔량: ${product.availableCount}`}
                      value={receiveItemCounts[index]}
                      onChange={(e) => handleReceiveItemCountChange(e.target.value, index)}
                    />
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleRemoveRow(index)}>✖️</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
          {addPOrderProducts.length === 0 && (
            <TableBody sx={{ padding: "3px" }} disabled={false}>
              {visibleProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: "3px" }}>
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
                  <TableCell>{product.receiveItemNo}</TableCell>
                  <TableCell>{product.itemCode}</TableCell>
                  <TableCell>{product.itemName}</TableCell>
                  <TableCell>
                    {editMode[`${product.receiveCode}-${product.receiveItemNo}`] &&
                    (product.receiveCount !== null || product.warehouseNo !== null) ? (
                      <TextField
                        value={receiveCounts[index] || product.receiveCount}
                        onChange={(e) => handleReceiveCountChange(e.target.value, index)}
                        size="small"
                        sx={{ width: "80px" }}
                      />
                    ) : (
                      <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                        {product.receiveCount}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
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
                        <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                          {product.warehouseName}
                        </Typography>
                      )}
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        <div>
                          발주코드: {product.porderCode}
                          <br />
                          발주순번: {product.porderItemNo}
                        </div>
                      }
                      sx={{ marginRight: "50px" }}
                    >
                      <Button
                        sx={{
                          marginRight: 10,
                          marginLeft: 0,
                        }}
                      >
                        ℹ️
                      </Button>
                    </Tooltip>
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
                      disabled={String(modifyReceiveItemData) !== String(product.receiveCode)}
                    >
                      {editMode[`${product.receiveCode}-${product.receiveItemNo}`]
                        ? "Save"
                        : "Edit"}
                    </Button>
                  </TableCell>
                </TableRow>
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
