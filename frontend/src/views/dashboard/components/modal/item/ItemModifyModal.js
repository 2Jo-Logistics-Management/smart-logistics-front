import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Paper,
  TextField,
} from "@mui/material";

const ItemModifyModal = (props) => {

  const { open, onClose, selectedItem } = props;

  const [ itemModifyDto, setItemModifyDto ] = useState({
    itemName: null,
    spec: null,
    unit: null,
    itemPrice: null,
  });

  const handleModifyItem = () => {

    if (itemModifyDto.itemName === null) {
       itemModifyDto.itemName = selectedItem[0].itemName;
    }

    if (itemModifyDto.spec === null) {
       itemModifyDto.spec = selectedItem[0].spec;
    }

    if (itemModifyDto.unit === null) {
        itemModifyDto.unit = selectedItem[0].unit;
    }

    if (itemModifyDto.itemPrice === null) {
        itemModifyDto.itemPrice = selectedItem[0].itemPrice;
    }

    axios.patch(`http://localhost:8888/api/item/modify/${selectedItem[0].itemCode}`, itemModifyDto)
    .then(response => {
        alert(response.data.data);
        onClose(true);
        window.location.reload();
    })
    .catch(error => {
        alert(error.message);
    })
  }

  const closeModal = () => {
    setItemModifyDto({
        itemName: null,
        spec: null,
        unit: null,
        itemPrice: null,
      });
    onClose(true);
  }

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
            물품 수정
          </Typography>
          <TextField
            label="물품명"
            variant="outlined"
            type="text"
            value={itemModifyDto.itemName === null ? selectedItem[0]?.itemName : itemModifyDto.itemName}
            onChange={(e) => setItemModifyDto({...itemModifyDto, itemName: e.currentTarget.value})}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="규격"
            variant="outlined"
            type="text"
            value={itemModifyDto.spec === null ? selectedItem[0]?.spec : itemModifyDto.spec}
            onChange={(e) => setItemModifyDto({...itemModifyDto, spec: e.currentTarget.value})}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="단위"
            variant="outlined"
            type="text"
            value={itemModifyDto.unit === null ? selectedItem[0]?.unit : itemModifyDto.unit}
            onChange={(e) => setItemModifyDto({...itemModifyDto, unit: e.currentTarget.value})}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="가격"
            variant="outlined"
            type="text"
            value={itemModifyDto.itemPrice === null ? selectedItem[0]?.itemPrice : itemModifyDto.itemPrice}
            onChange={(e) => setItemModifyDto({...itemModifyDto, itemPrice: e.currentTarget.value})}
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
              onClick={handleModifyItem}
            >
              수정
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={closeModal}
            >
              취소
            </Button>
          </Box>
        </div>
      </Paper>
    </Modal>
  );
};

export default ItemModifyModal;
