import { useEffect, useState } from 'react';
import api from '../services/api';
import { UserPlus, MoreVertical, Trash2, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Staff = () => {
    const { user } = useAuth();
    const [staffList, setStaffList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const filteredStaff = staffList.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchStaff = async () => {
        try {
            const { data } = await api.get('/users');
            setStaffList(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchStaff();
    }, [user, navigate]);

    const handleOpenModal = (staff = null) => {
        if (staff) {
            setEditingStaff(staff);
            setFormData({ name: staff.name, email: staff.email, password: '' });
        } else {
            setEditingStaff(null);
            setFormData({ name: '', email: '', password: '' });
        }
        setIsModalOpen(true);
        setMenuOpenId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingStaff) {
                const updateData = { name: formData.name, email: formData.email };
                if (formData.password) updateData.password = formData.password;
                await api.put(`/users/${editingStaff.id}`, updateData);
            } else {
                await api.post('/users', { ...formData, role: 'STAFF' });
            }
            setIsModalOpen(false);
            setEditingStaff(null);
            setFormData({ name: '', email: '', password: '' });
            fetchStaff();
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchStaff();
            setMenuOpenId(null);
        } catch (err) {
            alert('Failed to delete staff');
        }
    };

    const handleToggleStatus = async (staff) => {
        const newStatus = staff.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            await api.put(`/users/${staff.id}`, { status: newStatus });
            fetchStaff();
            setMenuOpenId(null);
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Staff Management</h2>
                <div className="flex flex-1 max-w-md gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search staff by name or email..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-sm whitespace-nowrap"
                    >
                        <UserPlus size={18} />
                        Add Staff
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm rounded-tl-xl">Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Email</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Role</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm w-12 text-center rounded-tr-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredStaff.map((staff, index) => (
                            <tr
                                key={staff.id}
                                className={`group hover:bg-slate-50 transition-colors relative ${index === filteredStaff.length - 1 ? 'rounded-b-xl' : ''}`}
                            >
                                <td className={`px-6 py-4 ${index === staffList.length - 1 ? 'rounded-bl-xl' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm uppercase transition-transform group-hover:scale-110">
                                            {staff.name[0]}
                                        </div>
                                        <span className="font-medium text-slate-900">{staff.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{staff.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${staff.status === 'ACTIVE' ? 'bg-green-100 text-green-700 ring-1 ring-green-600/10' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-600/10'}`}>
                                        {staff.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{staff.role}</td>
                                <td className={`px-6 py-4 text-right relative ${index === staffList.length - 1 ? 'rounded-br-xl' : ''}`}>
                                    <button
                                        onClick={() => setMenuOpenId(menuOpenId === staff.id ? null : staff.id)}
                                        className={`p-2 rounded-lg transition-all ${menuOpenId === staff.id ? 'bg-brand-50 text-brand-600 shadow-inner' : 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'}`}
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {menuOpenId === staff.id && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)}></div>
                                            <div className="absolute right-6 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in duration-200 origin-top-right">
                                                <button
                                                    onClick={() => handleOpenModal(staff)}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                                                >
                                                    Edit Details
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(staff)}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                                                >
                                                    {staff.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(staff.id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredStaff.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        {staffList.length === 0 ? 'No staff members found.' : `No results found for "${searchTerm}"`}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {editingStaff ? 'New Password (Leave blank to keep same)' : 'Password'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingStaff}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
                                    {editingStaff ? 'Update Staff' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
