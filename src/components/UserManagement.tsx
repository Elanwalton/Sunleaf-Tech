import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiUserAdd } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/UserManagement.module.css';

/* ───── Types ───── */
export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'customer';
  status: 'Active' | 'Suspended';
  joined: string; // ISO date
};

const USERS_ENDPOINT = '/api/getUsers.php';   // through Vite proxy

export default function UserManagement() {
  /* global helpers */
  const { clearSession } = useAuth();
  const navigate = useNavigate();

  /* ───────── state ───────── */
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'' | User['role']>('');

  /* ───────── fetch on mount ───────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(USERS_ENDPOINT, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!data.authenticated) {
          clearSession();        // session expired → log out
          navigate('/login');
          return;
        }
        setUsers(data.users as User[]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [clearSession, navigate]);

  /* ───────── live filtering ───────── */
  const visible = useMemo(() => {
    return users.filter(u => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.includes(search);
      const matchRole = filterRole ? u.role === filterRole : true;
      return matchSearch && matchRole;
    });
  }, [users, search, filterRole]);

  /* ───────── render ───────── */
  if (loading) return <p className={styles.subtitle}>Loading users…</p>;
  if (error)   return <p className={styles.subtitle}>Error: {error}</p>;

  /* helper to display Title‑Case role */
  const prettyRole = (r: User['role']) =>
    r.charAt(0).toUpperCase() + r.slice(1);

  return (
    <div className={styles.wrapper}>
      <header>
        <h1 className={styles.title}>User Management</h1>
        <p className={styles.subtitle}>Manage your platform users</p>
      </header>

      {/* toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <HiSearch className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search name, email, phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className={styles.select}
          value={filterRole}
          onChange={e => setFilterRole(e.target.value as any)}
        >
          <option value="">Role</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="customer">Customer</option>
        </select>

        <button className={styles.addButton}>
          <HiUserAdd /> Add User
        </button>
      </div>

      {/* table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Phone</th>
              <th className={styles.th}>Role</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Joined</th>
              <th className={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(u => (
              <tr key={u.id} className={styles.tr}>
                <td className={styles.td}>{u.name}</td>
                <td className={styles.td}>{u.email}</td>
                <td className={styles.td}>{u.phone}</td>
                <td className={styles.td}>{prettyRole(u.role)}</td>
                <td className={styles.td}>
                  <span
                    className={`${styles.statusBadge} ${
                      u.status === 'Active'
                        ? styles.statusActive
                        : styles.statusSuspended
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className={styles.td}>
                  {new Date(u.joined).toLocaleDateString()}
                </td>
                <td className={styles.td}>
                  <button className={styles.editButton}>Edit</button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className={styles.td}
                  style={{
                    textAlign: 'center',
                    padding: '32px 0',
                    color: '#6b7280',
                  }}
                >
                  No users match your search / filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
