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
        <div className="mx-auto w-full max-w-3xl space-y-8 p-6 md:p-10">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Account Profile
                    </h1>

                    <p className="mt-2 text-sm text-slate-600">
                        View your personal information and account details.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                    <Shield className="h-4 w-4" />
                    {roleName}
                </div>

            </div>

            {/* Profile Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">

                {/* Avatar */}
                <div className="mb-8 flex items-center gap-5 border-b border-slate-200 pb-8">

                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg">
                        <User className="h-10 w-10 text-white" />
                    </div>

                    <div>

                        <h2 className="text-2xl font-bold text-slate-900">
                            {profileData.name}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            User ID #{profileData.user_id}
                        </p>

                    </div>

                </div>

                {/* Information */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* Name */}
                    <div className="space-y-2">

                        <label className="text-sm font-semibold text-slate-700">
                            Full Name
                        </label>

                        <div className="relative">

                            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                readOnly
                                value={profileData.name}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-slate-900"
                            />

                        </div>

                    </div>

                    {/* Email */}
                    <div className="space-y-2">

                        <label className="text-sm font-semibold text-slate-700">
                            Email Address
                        </label>

                        <div className="relative">

                            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                readOnly
                                value={profileData.email}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-slate-900"
                            />

                        </div>

                    </div>

                    {/* Join Date */}
                    <div className="space-y-2">

                        <label className="text-sm font-semibold text-slate-700">
                            Join Date
                        </label>

                        <div className="relative">

                            <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                readOnly
                                value={formattedJoinDate}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-slate-900"
                            />

                        </div>

                    </div>

                    {/* Password */}
                    <div className="space-y-2">

                        <label className="text-sm font-semibold text-slate-700">
                            Password
                        </label>

                        <div className="relative">

                            <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                readOnly
                                type="password"
                                value="••••••••••••••••"
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 tracking-[0.3em] text-slate-500"
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* Security Note */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

                <h3 className="mb-2 font-semibold text-amber-800">
                    Security Information
                </h3>

                <p className="text-sm leading-relaxed text-amber-700">
                    Your password is securely hashed and cannot be viewed. Sensitive
                    account information is never exposed to the client application.
                </p>

            </div>

        </div>
    );
}