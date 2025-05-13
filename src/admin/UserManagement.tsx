import React from 'react';

const UserManagement: React.FC = () => {
  return (
    <div>
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Display user data */}
          <tr>
            <td>#1</td>
            <td>John Doe</td>
            <td>johndoe@example.com</td>
            <td>Admin</td>
            <td><button>Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
