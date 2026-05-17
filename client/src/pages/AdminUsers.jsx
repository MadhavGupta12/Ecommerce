import { Trash2 } from 'lucide-react';
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from '../services/apiSlice';

export default function AdminUsers() {
  const { data: users = [] } = useGetUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  return (
    <section className="panel overflow-x-auto">
      <h1 className="mb-4 text-3xl font-bold">Customer management</h1>
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead><tr className="border-b"><th className="py-3">Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr className="border-b last:border-0" key={user._id}>
              <td className="py-3 font-medium">{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select className="input max-w-36" value={user.role} onChange={(e) => updateUser({ id: user._id, role: e.target.value })}>
                  <option value="customer">customer</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td><button className="btn-secondary" onClick={() => deleteUser(user._id)} type="button"><Trash2 size={18} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
