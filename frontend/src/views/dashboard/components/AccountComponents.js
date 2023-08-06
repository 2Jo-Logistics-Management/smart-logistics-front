import React, { useState } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import swal from 'sweetalert2';
import { Delete } from '@mui/icons-material';

const Account = () => {
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedProduct, setEditedProduct] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const handleClick = () => {
        let timerInterval;
        swal.fire({
            title: '거래처 조회중',
            html: '잠시만 기다려주세요',
            timer: 1000,
            timerProgressBar: true,
            didOpen: () => {
                swal.showLoading();
                const b = swal.getHtmlContainer().querySelector('b');
                timerInterval = setInterval(() => {
                    b.textContent = swal.getTimerLeft();
                }, 10000);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            if (result.dismiss === swal.DismissReason.timer) {
                console.log('I was closed by the timer');
            }
        });
    };

    const products = [
        {
            Account_NO: "1",
            representative: "대표자1",
            contact_number: "010-xxxx-xxxx",
            account_name: "짱구네 과일가게",
            priority: "배송 대기중",
            pbg: "primary.main",
            create_date: "3.9",
        },
        {
            Account_NO: "2",
            representative: "대표자2",
            contact_number: "010-xxxx-xxxx",
            pname: "유리네 과일과게",
            priority: "배송 중",
            pbg: "secondary.main",
            budget: "24.5",
        },
        {
            Account_NO: "3",
            representative: "대표자3",
            contact_number: "010-xxxx-xxxx",
            pname: "훈이네 과일과게",
            priority: "발주 처리중",
            pbg: "error.main",
            budget: "12.8",
        },
        {
            Account_NO: "4",
            representative: "대표자4",
            contact_number: "010-xxxx-xxxx",
            pname: "철수네 과일가게",
            priority: "입고 완료",
            pbg: "success.main",
            budget: "2.4",
        },
    ];

    const handleEdit = (productId) => {
        setEditingProductId(productId);
        const productToEdit = products.find((product) => product.Account_NO === productId);
        setEditedProduct({ ...productToEdit });
        setOpenModal(true);
    };

    const handleSave = () => {
        swal.fire({
            title:'수정 완료.',         
            text: '발주 상품이 수정되었습니다.',  
            icon: 'success',                    
          });
        console.log('Save button clicked:', editedProduct);
        const updatedProducts = products.map((product) =>
            product.Account_NO === editingProductId ? editedProduct : product
        );
        
        console.log('Updated products:', updatedProducts);
        setEditingProductId(null);
        setEditedProduct({});
        setOpenModal(false);
    };

    const handleCancel = () => {
        console.log('Cancel button clicked');
        setEditingProductId(null);
        setEditedProduct({});
        setOpenModal(false);
    };

    const handleInputChange = (e) => {
        setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
    };
    const handleDelete = (productId) => {
        swal.fire({
            title: '정말로 삭제하시겠습니까?',
            text: '삭제된 데이터는 복구할 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedProducts = products.filter((product) => product.Account_NO !== productId);
                swal.fire({
                    title: '삭제 완료',
                    text: '발주 상품이 삭제되었습니다.',
                    icon: 'success',
                });
                console.log('Deleted product ID:', productId);
                console.log('Updated products:', updatedProducts);
                setEditingProductId(null);
                setEditedProduct({});
                setOpenModal(false);
            }
        });
    };

    return (
        <DashboardCard title="Customer Management System" variant="poster" >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    거래처번호:
                </Typography>
                <TextField label="거래처번호" variant="outlined" size="small" sx={{ mr: 2 }} />
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    거래처명:
                </Typography>
                <TextField label="거래처명" variant="outlined" size="small" sx={{ mr: 2 }} />
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    거래품목:
                </Typography>
                <TextField label="거래 품목" variant="outlined" size="small" sx={{ mr: 2 }} />
                <Button onClick={handleClick} variant="contained">
                    Search
                </Button>
            </Box>
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table
                    aria-label="simple table"
                    sx={{
                        whiteSpace: 'nowrap',
                        mt: 2
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    거래처번호
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    사업자명
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    거래처명
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    State
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Price
                                </Typography>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.representative}>
                                <TableCell>
                                    <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>{product.Account_NO}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {product.representative}
                                            </Typography>
                                            <Typography color="textSecondary" sx={{ fontSize: '13px' }}>
                                                {product.post}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                        {product.pname}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        sx={{
                                            px: '4px',
                                            backgroundColor: product.pbg,
                                            color: '#fff',
                                        }}
                                        size="small"
                                        label={product.priority}
                                    ></Chip>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="h6">${product.budget}k</Typography>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleEdit(product.Account_NO)}
                                    >
                                        Edit
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button variant="outlined" 
                                    size="small" 
                                    onClick={() => handleDelete(product.Account_NO)} startIcon={<Delete/>} color='error'>
                                    Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
            <Dialog open={openModal} onClose={handleCancel}>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    <TextField
                        label="ID"
                        name="id"
                        value={editedProduct.Account_NO || ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Name"
                        name="name"
                        value={editedProduct.name || ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Post"
                        name="post"
                        value={editedProduct.post || ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Pname"
                        name="pname"
                        value={editedProduct.pname || ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Priority"
                        name="priority"
                        value={editedProduct.priority || ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Budget"
                        name="budget"
                        value={editedProduct.budget || ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave} color="primary" variant="contained" > 
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </DashboardCard>
    );
};

export default Account;
