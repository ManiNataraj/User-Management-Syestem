import React from 'react';
import '../../styles/UserTable.css';

const UserTable = ({ users, onDelete, onEdit }) => {
    return (
        <div className="user-table-container">
            <h3>All System Users ({users.length})</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Location (City, State)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>**{user.role.toUpperCase()}**</td>
                            <td>{user.city}, {user.state}</td>
                            <td>
                                <button onClick={() => onEdit(user.id)} className="edit-btn">Edit</button>
                                <button onClick={() => onDelete(user.id)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{textAlign: 'center'}}>No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;