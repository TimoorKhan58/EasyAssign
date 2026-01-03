import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalTasks: 0, completed: 0, pending: 0, overdue: 0 });
    const [recentTasks, setRecentTasks] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/tasks');
                // Simple client-side stats calc for now
                const total = data.length;
                const completed = data.filter(t => t.status === 'COMPLETED').length;
                const pending = data.filter(t => t.status !== 'COMPLETED').length;
                const overdue = data.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED').length;

                setStats({ totalTasks: total, completed, pending, overdue });
                setRecentTasks(data.slice(0, 5));
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ label, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
                <Icon size={24} className="text-white bg-opacity-90" />
            </div>
        </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard label="Total Tasks" value={stats.totalTasks} icon={CheckCircle} color="bg-blue-500" />
                <StatCard label="Pending" value={stats.pending} icon={Clock} color="bg-yellow-500" />
                <StatCard label="Completed" value={stats.completed} icon={CheckCircle} color="bg-green-500" />
                <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} color="bg-red-500" />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Recent Tasks</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {recentTasks.length === 0 ? (
                        <div className="p-6 text-center text-slate-400">No tasks found</div>
                    ) : (
                        recentTasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => navigate(`/tasks/${task.id}`)}
                                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                            >
                                <div>
                                    <p className="font-medium text-slate-800">{task.title}</p>
                                    <p className="text-sm text-slate-500">{task.status} • {task.priority}</p>
                                </div>
                                {task.dueDate && <div className="text-xs text-slate-400">{new Date(task.dueDate).toLocaleDateString()}</div>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
