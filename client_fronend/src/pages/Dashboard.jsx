import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Placeholder pages for each role
function WorkerHome() {
  return <div className="dashboard-section"><h2>Worker Home</h2><p>Total Submissions: 0 | Pending: 0 | Earned: $0</p></div>;
}

function WorkerTasks() {
  return <div className="dashboard-section"><h2>Available Tasks</h2><p>No tasks available yet.</p></div>;
}

function WorkerSubmissions() {
  return <div className="dashboard-section"><h2>My Submissions</h2><p>You have no submissions yet.</p></div>;
}

function WorkerWithdrawals() {
  return <div className="dashboard-section"><h2>Withdrawals</h2><p>Manage your coin withdrawals here.</p></div>;
}

function BuyerHome() {
  return <div className="dashboard-section"><h2>Buyer Home</h2><p>Tasks: 0 | Pending: 0 | Spent: $0</p></div>;
}

function BuyerAddTask() {
  return <div className="dashboard-section"><h2>Add New Task</h2><p>Create a new task form here.</p></div>;
}

function BuyerTasks() {
  return <div className="dashboard-section"><h2>My Tasks</h2><p>You have no tasks yet.</p></div>;
}

function BuyerPurchaseCoins() {
  return <div className="dashboard-section"><h2>Purchase Coins</h2><p>Coin packages available here.</p></div>;
}

function AdminHome() {
  return <div className="dashboard-section"><h2>Admin Home</h2><p>Workers: 0 | Buyers: 0 | Total Coins: 0</p></div>;
}

function AdminUsers() {
  return <div className="dashboard-section"><h2>Manage Users</h2><p>User management table here.</p></div>;
}

function AdminTasks() {
  return <div className="dashboard-section"><h2>Manage Tasks</h2><p>Task management table here.</p></div>;
}

function AdminWithdrawals() {
  return <div className="dashboard-section"><h2>Withdrawal Requests</h2><p>Pending withdrawals here.</p></div>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div className="dashboard-section">Loading...</div>;
  }

  const dashboardMenus = {
    worker: [
      { label: 'Home', path: 'worker-home' },
      { label: 'Task List', path: 'task-list' },
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
      { label: 'Withdrawals', path: 'manage-withdrawals' },
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
              <Route path="task-list" element={<WorkerTasks />} />
              <Route path="my-submissions" element={<WorkerSubmissions />} />
              <Route path="withdrawals" element={<WorkerWithdrawals />} />
            </>
          )}
          {user.role === 'buyer' && (
            <>
              <Route path="buyer-home" element={<BuyerHome />} />
              <Route path="add-task" element={<BuyerAddTask />} />
              <Route path="my-tasks" element={<BuyerTasks />} />
              <Route path="purchase-coins" element={<BuyerPurchaseCoins />} />
            </>
          )}
          {user.role === 'admin' && (
            <>
              <Route path="admin-home" element={<AdminHome />} />
              <Route path="manage-users" element={<AdminUsers />} />
              <Route path="manage-tasks" element={<AdminTasks />} />
              <Route path="manage-withdrawals" element={<AdminWithdrawals />} />
            </>
          )}
          <Route path="*" element={<WorkerHome />} />
        </Routes>
      </main>
    </div>
  );
}
