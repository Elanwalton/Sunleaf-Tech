import React from 'react';

const OrderManagement: React.FC = () => {
  return (
    <div>
      <h1>Order Management</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {/* Display order data */}
          <tr>
            <td>#12345</td>
            <td>Customer 1</td>
            <td>Shipped</td>
            <td>$100.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
