const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
];

export const fetchUsers = () => Promise.resolve(users);
export const fetchUserById = (id) =>
    Promise.resolve(users.find((user) => user.id === Number(id)));
