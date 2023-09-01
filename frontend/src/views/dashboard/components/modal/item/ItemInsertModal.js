import axios from "axios";
import React, { useState } from "react";
import {
    Typography,
    Box,
    TextField,
    Button,
    Modal,
    Paper,
} from "@mui/material";

const ItemInsertModal = (props) => {
  const [ itemInsertDto, setItemInsertDto ] = useState({
    itemName: "",
    spec: "",
    unit: "",
    itemPrice: "",
  });
  const { open, onClose } = props;

  const handlerSetInputData = (state, data) => {
    setItemInsertDto(prevItem => ({
      ...prevItem,
      [state]: data
    }));
  };

  const handleSaveNewItem = () => {
    axios.post(`http://localhost:8888/api/item/insert`, itemInsertDto)
    .then(response => {
        alert(response.data.data);
        onClose(true);
        window.location.reload();
    })
    .catch(error => {
        alert(error.message);
    })
  };

  const closeModal = () => {
    onClose(true);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        className="modal-paper"
        style={{ padding: "30px", margin: "20px" }}
      >
        <div style={{ width: "400px" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "18px", marginBottom: "20px" }}
          >
            신규 물품 추가
          </Typography>
          <TextField
            label="물품명"
            variant="outlined"
            type="text"
            onChange={(e) => handlerSetInputData('itemName', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="규격"
            variant="outlined"
            type="text"
            onChange={(e) => handlerSetInputData("spec", e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="단위"
            variant="outlined"
            type="text"
            onChange={(e) => handlerSetInputData("unit", e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="가격"
            variant="outlined"
            type="text"
            onChange={(e) => handlerSetInputData("itemPrice", e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveNewItem}
            >
              추가
            </Button>
            <Button variant="contained" color="error" onClick={closeModal}>
              취소
            </Button>
          </Box>
        </div>
      </Paper>
    </Modal>
  );
};

export default ItemInsertModal;
