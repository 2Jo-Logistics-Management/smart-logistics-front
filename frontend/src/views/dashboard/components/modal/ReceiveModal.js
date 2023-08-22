import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import swal from "sweetalert2";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { close_Modal } from "../../../../redux/slices/receiveModalDuck";
import { Delete } from "@mui/icons-material";
import pOrderWaitIngAxios from "src/axios/pOrderWaitIngAxios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import ko from "date-fns/locale/ko"; // 한국어 로케일 import
import { TextField } from "@mui/material";

const ReceiveModal = () => {
  const dispatch = useDispatch();
  const receiveModalState = useSelector((state) => state.receiveModal.openModal);
  const [searchPOrders, setSearchPOrder] = useState([]);
  const [selectedPOrderCode, setSelectedPOrderCode] = useState([]);
  const [selectedItemCode, setSelectedItemCode] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedPOrderDate, setSelectedPOrderDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  // useEffect(() => {
  //   pOrderWaitIngAxios(selectedItems);
  // }, [selectedItems]);
  useEffect(() => {
    pOrderWaitIngAxios(selectedItems)
      .then((data) => {
        setSearchPOrder(data.data); // Assuming the data you want to display is stored in 'data' field
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedItems]);

  const handleCancel = () => {
    dispatch(close_Modal());
  };

  const handleSave = () => {
    try {
      //여기서 insert
      //await axios.post('/api/saveData', selectedItems);
      //dispatch(SAVE_MODAL_DATA(selectedItems)); ->selectItems를 사용하지 않을꺼면 지워도 됨
      dispatch(close_Modal()); //위에 dispatch를 사용하면 지워야함
      //   itemAddAxios(selectedItems);
      swal.fire({
        title: "입고 등록 완료.",
        text: "입고 및 재고가 완료되었습니다.",
        icon: "success",
        showConfirmButton: false,
      });
    } catch (error) {
      swal.fire({
        title: "오류 발생",
        text: "데이터 저장 중 오류가 발생했습니다.",
        icon: "error",
        showConfirmButton: false,
      });
    }
  };

  const handleSelectePOrderCode = (selectedOption) => {
    setSelectedPOrderCode(selectedOption);
  };

  const porderCodeOptions = [
    // { value: "all", label: "All" }, // Option for "All" selection
    // { value: "Product 1", label: "Product 1" },
    // { value: "Product 2", label: "Product 2" },
    // { value: "Product 3", label: "Product 3" },
    // { value: "Product 4", label: "Product 4" },
    // { value: "Product 5", label: "Product 5" },
  ];

  const handleSelectedItemCode = (selectedOption) => {
    handleSelectedItemCode(selectedOption);
  };

  const itemCodeOptions = [];

  const porderDateOptions = [];

  const handleSelectedPOrderDate = [];

  const handleFilterData = () => {
    const selectedData = {
      porderCode: selectedPOrderCode?.value || null,
      itemCode: selectedItemCode?.value || null,
      quantity: "0", // 초기에는 수량을 0으로 설정합니다.
    };
    setSelectedItems([...selectedItems, selectedData]);
  };

  return (
    <Dialog
      open={receiveModalState}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "md",
          height: "100%",
          maxHeight: "md",
        },
      }}
    >
      <DialogTitle>입고 등록</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "70px",
          }}
        >
          발주번호
          <Select
            options={porderCodeOptions}
            value={selectedPOrderCode}
            onChange={handleSelectePOrderCode}
          />
          품목코드
          <Select
            options={itemCodeOptions}
            value={selectedItemCode}
            onChange={handleSelectedItemCode}
          />
          발주일
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="날짜 선택"
              value={new Date()}
              onChange={(newDate) => setSelectedDate(newDate)}
              renderInput={(props) => <TextField {...props} />} // TextField 등을 사용해 사용자 정의 입력 요소를 렌더링
            />
          </LocalizationProvider>
          <Button variant="contained" onClick={handleFilterData}>
            조회
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>발주번호</TableCell>
              <TableCell>발주순번</TableCell>
              <TableCell>품목번호</TableCell>
              <TableCell>발주수량</TableCell>
              <TableCell>품목단가</TableCell>
              <TableCell>발주금액</TableCell>
              <TableCell>진행상태</TableCell>
              <TableCell>납기일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchPOrders.map((porders, index) => (
              <TableRow key={index}>
                <TableCell>{porders.porderCode}</TableCell>
                <TableCell>{porders.porderItemNo}</TableCell>
                <TableCell>{porders.itemCode}</TableCell>
                <TableCell>{porders.porderCount}</TableCell>
                <TableCell>{porders.porderPrice}</TableCell>
                <TableCell>{porders.porderItemPrice}</TableCell>
                <TableCell>{porders.porderState}</TableCell>
                <TableCell>{porders.receiveDeadline.split(" ")[0]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReceiveModal;
