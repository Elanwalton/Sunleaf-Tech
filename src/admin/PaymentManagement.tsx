import React from 'react';

const PaymentManagement: React.FC = () => {
  return (
    <div>
      <h1>Payment Management</h1>
      <table>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Display payment data */}
          <tr>
            <td>#P12345</td>
            <td>John Doe</td>
            <td>$200.00</td>
            <td>Completed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PaymentManagement;
