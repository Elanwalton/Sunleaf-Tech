import React from 'react';

const Reviews: React.FC = () => {
  return (
    <div>
      <h1>Reviews & Ratings</h1>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>User</th>
            <th>Rating</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          {/* Display reviews data */}
          <tr>
            <td>Product 1</td>
            <td>John Doe</td>
            <td>4</td>
            <td>Great product!</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Reviews;
