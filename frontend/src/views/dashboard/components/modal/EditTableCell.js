// import React, { useState, useEffect } from 'react';

// const EditableCell = ({ product, column }) => {
//     const [value, setValue] = useState(product[column]);
  
//     useEffect(() => {
//       setValue(product[column]);
//     }, [product]);
  
//     if (editMode[product.id]) {
//       return (
//         <TableCell>
//           <TextField
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//           />
//         </TableCell>
//       );
//     } else {
//       return <TableCell>{value}</TableCell>;
//     }
//   }
//   export default EditableCell;