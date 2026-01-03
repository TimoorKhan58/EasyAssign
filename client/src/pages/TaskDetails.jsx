import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Calendar, User, Send, Clock, CheckCircle, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchTask = async () => {
        try {
            // We need a specific endpoint for single task or filter from list
            // Since we implemented getTasks with list, let's just reuse that if we don't have getTaskById
            // Wait, implementation plan check: did we make getTaskById?
            // checking task.controller.js...
            // It seems we only have getTasks (all). 
            // We should add getTaskById to backend or filter client side.
            // For now, let's try to fetch all and find (inefficient but works for small app)
            // Or better, let's quickly update backend to support GET /tasks/:id

            // Temporary: fetch all and find. 
            const { data } = await api.get('/tasks');
            const found = data.find(t => t.id === id);
            if (found) {
                setTask(found);
            } else {
                navigate('/tasks');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTask();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        try {
            const { data } = await api.put(`/tasks/${id}`, { status: newStatus });
            setTask(prev => ({ ...prev, status: data.status }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSubmitting(true);
        try {
            const { data } = await api.post(`/tasks/${id}/comments`, { content: comment });
            setTask(prev => ({
                ...prev,
                comments: [...(prev.comments || []), data]
            }));
            setComment('');
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (!task) return <div className="p-8 text-center text-slate-500">Task not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/tasks')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition"
            >
                <ArrowLeft size={18} />
                Back to Tasks
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 text-sm font-bold rounded-full 
                                ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                    task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                {task.priority}
                            </span>
                            <span className="text-sm text-slate-500">
                                Created {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-slate-900 mb-4">{task.title}</h1>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{task.description}</p>

                        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assignees</h4>
                                <div className="flex flex-wrap gap-2">
                                    {task.assignees?.map(u => (
                                        <div key={u.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {u.name[0]}
                                            </div>
                                            <span className="text-sm text-slate-700">{u.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Due Date</h4>
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Calendar size={18} className="text-slate-400" />
                                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            Comments <span className="text-slate-400 text-sm font-normal">({task.comments?.length || 0})</span>
                        </h3>

                        <div className="space-y-6 mb-8">
                            {task.comments?.length === 0 ? (
                                <p className="text-slate-400 text-center py-4">No comments yet. Start the discussion!</p>
                            ) : (
                                task.comments?.map(comment => (
                                    <div key={comment.id} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-600">
                                            {comment.user?.name?.[0] || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className="font-semibold text-slate-900 text-sm">{comment.user?.name}</span>
                                                    <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-slate-700 text-sm">{comment.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleCommentSubmit} className="relative">
                            <input
                                type="text"
                                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition"
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={submitting || !comment.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-600 hover:bg-brand-50 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Status</h4>
                        <div className="space-y-2">
                            {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusUpdate(status)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${task.status === status
                                            ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500'
                                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <span className="text-sm font-medium">{status.replace('_', ' ')}</span>
                                    {task.status === status && <CheckCircle size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
