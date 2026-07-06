import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Worker Pages
import WorkerHome from './worker/WorkerHome';
import TaskList from './worker/TaskList';
import TaskDetails from './worker/TaskDetails';
import MySubmissions from './worker/MySubmissions';
import Withdrawals from './worker/Withdrawals';

// Buyer Pages
import BuyerHome from './buyer/BuyerHome';
import AddTask from './buyer/AddTask';
import BuyerMyTasks from './buyer/MyTasks';
import PurchaseCoins from './buyer/PurchaseCoins';

// Admin Pages
import AdminHome from './admin/AdminHome';
import ManageUsers from './admin/ManageUsers';
import ManageTasks from './admin/ManageTasks';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div className="dashboard-section">Loading...</div>;
  }

  const dashboardMenus = {
    worker: [
      { label: 'Home', path: 'worker-home' },
      { label: 'Browse Tasks', path: 'task-list' },
      { label: 'My Submissions', path: 'my-submissions' },
      { label: 'Withdrawals', path: 'withdrawals' },
    ],
    buyer: [
      { label: 'Home', path: 'buyer-home' },
      { label: 'Add Task', path: 'add-task' },
      { label: 'My Tasks', path: 'my-tasks' },
      { label: 'Purchase Coins', path: 'purchase-coins' },
    ],
    admin: [
      { label: 'Home', path: 'admin-home' },
      { label: 'Manage Users', path: 'manage-users' },
      { label: 'Manage Tasks', path: 'manage-tasks' },
    ],
  };

  const menu = dashboardMenus[user.role] || [];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>{user.name}</h3>
          <p className="role-badge">{user.role}</p>
          <p className="coins-display">💰 {user.coins} coins</p>
        </div>
        <nav className="sidebar-nav">
          {menu.map((item) => (
            <Link key={item.path} to={`/dashboard/${item.path}`} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <Routes>
          {user.role === 'worker' && (
            <>
              <Route path="worker-home" element={<WorkerHome />} />
              <Route path="task-list" element={<TaskList />} />
              <Route path="task-details/:taskId" element={<TaskDetails />} />
              <Route path="my-submissions" element={<MySubmissions />} />
              <Route path="withdrawals" element={<Withdrawals />} />
            </>
          )}
          {user.role === 'buyer' && (
            <>
              <Route path="buyer-home" element={<BuyerHome />} />
              <Route path="add-task" element={<AddTask />} />
              <Route path="my-tasks" element={<BuyerMyTasks />} />
              <Route path="purchase-coins" element={<PurchaseCoins />} />
            </>
          )}
          {user.role === 'admin' && (
            <>
              <Route path="admin-home" element={<AdminHome />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="manage-tasks" element={<ManageTasks />} />
            </>
          )}
          <Route path="*" element={user.role === 'worker' ? <WorkerHome /> : user.role === 'buyer' ? <BuyerHome /> : <AdminHome />} />
        </Routes>
      </main>
    </div>
  );
}
