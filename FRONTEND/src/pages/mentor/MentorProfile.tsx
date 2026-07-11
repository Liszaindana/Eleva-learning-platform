import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { userApi } from '../../api/endpoints';
import { User, Mail, Calendar, Shield, Loader2, KeyRound } from 'lucide-react';

// 1. Definisikan tipe User sesuai dengan kolom tabelmu
interface UserItem {
    user_id: number;
    role_id: number;
    name: string;
    email: string;
    join_date: string;
}

export default function ProfilePage() {
    const { user: authUser } = useAuthStore();
    const userId = authUser?.user_id;

    // 2. Gunakan query untuk mengambil wrapper ApiResponse
    const { data: apiResponse, isLoading, error } = useQuery({
        queryKey: ['userProfile', userId],
        queryFn: () => userApi.getById(userId!),
        enabled: !!userId,
    });

    // 3. Ekstrak data user asli dari dalam apiResponse (mengantisipasi struktur bersarang)
    const profileData = useMemo(() => {
        if (!apiResponse) return null;
        
        // Jika respons langsung berisi objek user
        if ('user_id' in apiResponse) {
            return apiResponse as unknown as UserItem;
        }
        
        // Jika dibungkus di dalam properti .data atau .user
        const res = apiResponse as any;
        return (res.data || res.user || res) as UserItem;
    }, [apiResponse]);

    // 4. Mapping nama Role berdasarkan role_id
    const roleName = useMemo(() => {
        if (!profileData) return 'Unknown';
        switch (profileData.role_id) {
            case 1: return 'Administrator';
            case 2: return 'Mentor';
            case 3: return 'Student';
            default: return 'User';
        }
    }, [profileData?.role_id]);

    // 5. Format tanggal join
    const formattedJoinDate = useMemo(() => {
        if (!profileData?.join_date) return '-';
        try {
            return new Date(profileData.join_date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch {
            return profileData.join_date;
        }
    }, [profileData?.join_date]);

    if (isLoading) {
        return (
            <div className="w-full text-slate-400 text-sm text-center py-24 flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                Retrieving secure profile credentials...
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="w-full text-center py-24 text-red-400 text-sm">
                Failed to load profile. Please refresh or re-authenticate.
            </div>
        );
    }

    return (
        <div className="w-full p-6 md:p-10 max-w-3xl mx-auto space-y-8 text-slate-100">
            {/* Header Profil */}
            <div className="border-b border-slate-900 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Account Profile</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Manage your user identity, credentials, and access role properties.
                    </p>
                </div>
                <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-400 tracking-wide uppercase">
                    <Shield className="h-3.5 w-3.5" />
                    {roleName}
                </div>
            </div>

            {/* Form Informasi Akun */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-800/60 pb-6">
                    <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white leading-none">{profileData.name}</h3>
                        <p className="text-xs text-slate-500 mt-1.5 font-mono">User ID: #{profileData.user_id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Field: Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input 
                                type="text" 
                                readOnly 
                                value={profileData.name}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-300 focus:outline-none cursor-default"
                            />
                        </div>
                    </div>

                    {/* Input Field: Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input 
                                type="email" 
                                readOnly 
                                value={profileData.email}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-300 focus:outline-none cursor-default"
                            />
                        </div>
                    </div>

                    {/* Input Field: Registration Date */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Join Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input 
                                type="text" 
                                readOnly 
                                value={formattedJoinDate}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-300 focus:outline-none cursor-default"
                            />
                        </div>
                    </div>

                    {/* Input Field: Password Masked */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Security Credentials</label>
                        <div className="relative">
                            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input 
                                type="password" 
                                readOnly 
                                value="••••••••••••••••" 
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-500 tracking-widest focus:outline-none cursor-default"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Catatan Kaki */}
            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-300">Security Note:</span> Password data is hashed client-side and never exposed in cleartext formatting within the network architecture payload.
            </div>
        </div>
    );
}