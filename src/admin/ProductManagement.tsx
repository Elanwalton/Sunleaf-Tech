import React from 'react';

const ProductManagement: React.FC = () => {
  return (
    <div>
      <h1>Product Management</h1>
      <button>Add New Product</button>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Display product data here */}
          <tr>
            <td>Product 1</td>
            <td>$20.00</td>
            <td>50</td>
            <td><button>Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
