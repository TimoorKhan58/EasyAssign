import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Filter } from 'lucide-react';

const Tasks = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [selectedAssignees, setSelectedAssignees] = useState([]); // Array of IDs

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks');
            setTasks(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaff = async () => {
        if (user?.role !== 'ADMIN') return;
        try {
            const { data } = await api.get('/users');
            setStaffList(data);
        } catch (err) {
            console.error("Failed to fetch staff", err);
        }
    };

    useEffect(() => {
        fetchTasks();
        if (user?.role === 'ADMIN') {
            fetchStaff();
        }
    }, [user]);

    const filteredTasks = tasks.filter(task => {
        const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
        return matchesStatus && matchesPriority;
    });

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', {
                title,
                description,
                priority,
                dueDate: dueDate ? dueDate : null,
                assigneeIds: selectedAssignees
            });
            setIsModalOpen(false);
            // Reset form
            setTitle('');
            setDescription('');
            setPriority('MEDIUM');
            setDueDate('');
            setSelectedAssignees([]);
            fetchTasks();
        } catch (err) {
            alert('Failed to create task');
            console.error(err);
        }
    };

    const toggleAssignee = (id) => {
        if (selectedAssignees.includes(id)) {
            setSelectedAssignees(selectedAssignees.filter(uid => uid !== id));
        } else {
            setSelectedAssignees([...selectedAssignees, id]);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>
                <div className="flex gap-3 relative">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition shadow-sm ${isFilterOpen ? 'bg-brand-50 border-brand-300 text-brand-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Filter size={18} />
                        Filter
                        {(statusFilter !== 'ALL' || priorityFilter !== 'ALL') && (
                            <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                        )}
                    </button>

                    {isFilterOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                            <div className="absolute right-0 top-12 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-4 animate-in fade-in zoom-in duration-200 origin-top-right">
                                <h4 className="text-sm font-bold text-slate-900 mb-3">Filter Tasks</h4>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                                        <select
                                            className="w-full text-sm border-slate-200 rounded-lg focus:ring-brand-500 outline-none"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        >
                                            <option value="ALL">All Statuses</option>
                                            <option value="PENDING">Pending</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</label>
                                        <select
                                            className="w-full text-sm border-slate-200 rounded-lg focus:ring-brand-500 outline-none"
                                            value={priorityFilter}
                                            onChange={(e) => setPriorityFilter(e.target.value)}
                                        >
                                            <option value="ALL">All Priorities</option>
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setStatusFilter('ALL');
                                            setPriorityFilter('ALL');
                                        }}
                                        className="w-full py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {user?.role === 'ADMIN' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-sm"
                        >
                            <Plus size={18} />
                            New Task
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center text-slate-500 py-12">Loading tasks...</div>
                ) : filteredTasks.length === 0 ? (
                    <div className="col-span-full text-center text-slate-500 py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                        {tasks.length === 0 ? 'No tasks assigned yet.' : 'No tasks match your filters.'}
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <div
                            key={task.id}
                            onClick={() => navigate(`/tasks/${task.id}`)}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col h-full cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-3">
                                {/* ... existing content ... */}
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                   ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {task.priority}
                                </span>
                                <span className="text-xs text-slate-400">{new Date(task.createdAt).toLocaleDateString()}</span>
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800 mb-2">{task.title}</h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">{task.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                <div className="flex -space-x-2">
                                    {task.assignees?.map((u, i) => (
                                        <div key={u.id} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600" title={u.name}>
                                            {u.name[0]}
                                        </div>
                                    ))}
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded 
                   ${task.status === 'COMPLETED' ? 'text-green-600 bg-green-50' :
                                        task.status === 'IN_PROGRESS' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 bg-slate-100'}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-bold text-slate-800">Create New Task</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleCreateTask} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                        value={priority}
                                        onChange={e => setPriority(e.target.value)}
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                        value={dueDate}
                                        onChange={e => setDueDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Assign To</label>
                                <div className="border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                                    {staffList.length === 0 ? (
                                        <p className="text-xs text-slate-400">No staff available</p>
                                    ) : (
                                        staffList.map(staff => (
                                            <label key={staff.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAssignees.includes(staff.id)}
                                                    onChange={() => toggleAssignee(staff.id)}
                                                    className="rounded text-brand-600 focus:ring-brand-500"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-800">{staff.name}</p>
                                                    <p className="text-xs text-slate-400">{staff.email}</p>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
