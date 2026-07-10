import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Trophy,
  ArrowRight,
  Sparkles,
  Star,
  Search,
  Code,
  Palette,
  Briefcase,
  Megaphone,
  UserCheck,
  Camera,
  Quote,
} from 'lucide-react';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { PATHS } from '../../routes/paths';
import logo from '../../assets/Logo.png';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Programming', count: '125 Classes', icon: Code, color: 'from-blue-600 to-cyan-500' },
    { name: 'Design', count: '84 Classes', icon: Palette, color: 'from-blue-500 to-indigo-500' },
    { name: 'Business', count: '92 Classes', icon: Briefcase, color: 'from-blue-400 to-sky-500' },
    { name: 'Marketing', count: '67 Classes', icon: Megaphone, color: 'from-blue-600 to-blue-400' },
    { name: 'Soft Skills', count: '45 Classes', icon: UserCheck, color: 'from-blue-500 to-cyan-400' },
    { name: 'Photography', count: '38 Classes', icon: Camera, color: 'from-blue-400 to-blue-600' },
  ];

  const trendingCourses = [
    {
      id: 1,
      category: 'Design',
      title: 'Advanced UI Design Systems',
      rating: '4.9',
      reviewCount: 342,
      mentorName: 'Budi Santoso',
      mentorRole: 'Senior Mentor',
      mentorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      price: 'Rp 499.000',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      category: 'Business',
      title: 'Product Management 101',
      rating: '4.8',
      reviewCount: 215,
      mentorName: 'Sarah Amelia',
      mentorRole: 'Product Lead',
      mentorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      price: 'Rp 399.000',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      category: 'Technology',
      title: 'Fullstack Web Development',
      rating: '5.0',
      reviewCount: 520,
      mentorName: 'Ahmad Dani',
      mentorRole: 'Tech Lead',
      mentorAvatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      price: 'Rp 699.000',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const mentors = [
    {
      name: 'Sarah Amelia',
      role: 'Product Lead at Tokopedia',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Yudi Prastio',
      role: 'Frontend Lead at Gojek',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Budi Santoso',
      role: 'UI/UX Director',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Ahmad Dani',
      role: 'Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ];

  const testimonials = [
    {
      text: 'Materi yang disampaikan sangat terstruktur dan mudah dipahami. Mentornya sangat sabar membimbing dari nol.',
      stars: 5,
      userName: 'Dewi Lestari',
      userRole: 'UI/UX Designer',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      text: 'Sangat terbantu belajar Product Management di sini. Mentornya praktisi industri aktif sehingga studi kasusnya riil.',
      stars: 5,
      userName: 'Andhika Roy',
      userRole: 'Associate PM',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      text: 'Kurikulum Fullstack-nya jempolan. Portofolio hasil project akhir sangat membantu saya lolos rekrutmen kerja.',
      stars: 5,
      userName: 'Rendy Kael',
      userRole: 'Backend Developer',
      userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-blue-100 via-blue-50 to-transparent rounded-full blur-3xl" />
        </div>

        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            {/* Left Content */}
            <div className="flex-1 space-y-6 max-w-xl text-left">
              {/* Announcement badge */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Sparkles className="h-3 w-3" />
                Platform Pembelajaran Online Terbaik
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900">
                Learn New Skills with{' '}
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  Indonesia's Best Mentors
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Kembangkan potensimu dengan materi berkualitas yang dirancang langsung oleh para profesional. Temukan pembelajaran yang sesuai untukmu.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to={PATHS.KELAS}>
                  <Button size="lg" className="shadow-md shadow-blue-500/20">
                    Temukan Kelas
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#choose-us">
                  <Button variant="secondary" size="lg">
                    Pelajari Selengkapnya
                  </Button>
                </a>
              </div>

              {/* Stacked Users Badge */}
              <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
                <div className="flex -space-x-3">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
                    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Student"
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold text-slate-900">10,000+</span>{' '}
                  <span className="text-slate-600">pelajar telah bergabung</span>
                </div>
              </div>
            </div>

            {/* Right Media Graphic */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50 aspect-[4/3] group">
                <img
                  src="/hero_learning_scene.png"
                  alt="Students Studying"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                {/* Floating pill badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-blue-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-md">
                  <span className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">100% Online & Flexible</span>
                </div>
              </div>
              {/* Outer decorative glow blob */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full blur-2xl -z-10" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── SEARCH & DISCOVERY BAR ───────────────────────── */}
      <section className="px-4">
        <Container>
          <div className="relative rounded-3xl border border-slate-200 bg-white p-8 max-w-4xl mx-auto shadow-lg shadow-slate-200/50 overflow-hidden">
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-blue-50/50 -z-10" />
            <div className="text-center space-y-5 max-w-xl mx-auto">
              <h2 className="text-xl font-bold text-slate-900">What do you need to learn today?</h2>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari materi, judul kelas, atau nama mentor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 pr-14 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
                  <Search className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Popular tags list */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
                <span className="text-slate-500 font-semibold uppercase tracking-wider mr-1">Popular:</span>
                {['Design', 'Marketing', 'Technology', 'Business'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all font-medium cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── TOP LEARNING PATHS ────────────────────────────── */}
      <section className="py-8">
        <Container>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Top Learning Paths</h2>
              <p className="text-xs text-slate-600 mt-1">Explore our most popular education categories</p>
            </div>
            <Link to={PATHS.KELAS} className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">
              View All
            </Link>
            <Link
              to={PATHS.RECOMMENDATION}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors">
              Cari Mentor Terbaik
              </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-5 text-center flex flex-col items-center justify-center group hover:border-blue-300 transition-all duration-300 cursor-pointer shadow-md hover:-translate-y-1"
                >
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 truncate w-full">{cat.name}</h3>
                  <p className="text-[10px] text-slate-500 mt-1">{cat.count}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── TRENDING CLASSES ─────────────────────────────── */}
      <section className="py-8">
        <Container>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Trending Classes</h2>
              <p className="text-xs text-slate-600 mt-1">Join the most hot, in-demand courses right now</p>
            </div>
            <Link to={PATHS.KELAS} className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                {/* Course Image */}
                <div className="h-48 w-full relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="info">
                      {course.category}
                    </Badge>
                  </div>
                </div>

                {/* Course Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                      <span>{course.rating}</span>
                      <span className="text-slate-500 font-normal">({course.reviewCount} ulasan)</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                  </div>

                  {/* Mentor details */}
                  <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <img
                      src={course.mentorAvatar}
                      alt={course.mentorName}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{course.mentorName}</p>
                      <p className="text-[10px] text-slate-500">{course.mentorRole}</p>
                    </div>
                  </div>

                  {/* Price & CTA Button */}
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Price</p>
                      <p className="text-base font-bold text-blue-600">{course.price}</p>
                    </div>
                    <Link to={PATHS.REGISTER}>
                      <Button size="sm">Daftar Kelas</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── MENTORS SECTION ──────────────────────────────── */}
      <section className="py-8">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Learn From Indonesia's Best</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Belajar langsung dari mentor terpilih dengan pengalaman industri bertahun-tahun.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {mentors.map((mentor, i) => (
              <div key={i} className="text-center space-y-4 group">
                <div className="relative mx-auto h-28 w-28 rounded-full overflow-hidden border-2 border-blue-200 group-hover:border-blue-400 shadow-lg transition-all duration-300">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{mentor.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{mentor.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── WHY CHOOSE US SECTION ────────────────────────── */}
      <section id="choose-us" className="py-12 relative">
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            {/* Left Content Column */}
            <div className="flex-1 space-y-8 max-w-xl text-left">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Why Students Choose Eleva</h2>
                <p className="text-xs text-slate-600 mt-1.5">Membantu mempercepat karir dan pembelajaran Anda</p>
              </div>

              {/* Benefit features */}
              <div className="space-y-6">
                {[
                  {
                    icon: BookOpen,
                    title: 'Curriculum Terupdate',
                    desc: 'Materi selalu disesuaikan dengan kebutuhan industri terkini.',
                    color: 'text-blue-600 bg-blue-100',
                  },
                  {
                    icon: Users,
                    title: 'Mentor Professional',
                    desc: 'Dibimbing langsung oleh praktisi yang berpengalaman di bidangnya.',
                    color: 'text-blue-600 bg-blue-100',
                  },
                  {
                    icon: Trophy,
                    title: 'Sertifikat Kompetensi',
                    desc: 'Dapatkan sertifikat kelulusan resmi untuk menunjang karirmu.',
                    color: 'text-blue-600 bg-blue-100',
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex gap-4 group">
                      <div className={`p-3.5 rounded-2xl ${item.color} h-12 w-12 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Media Graphic */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg shadow-slate-200/50 aspect-[16/10] bg-white group">
                <img
                  src="/why_choose_us_dashboard.png"
                  alt="Analytics Dashboard"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-transparent pointer-events-none" />
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-100 rounded-full blur-2xl -z-10" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── TESTIMONIALS SECTION ─────────────────────────── */}
      <section className="py-8">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Apa Kata Mereka tentang Eleva</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Testimoni jujur dari para alumni yang telah sukses mencapai impian mereka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((test, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg flex flex-col justify-between hover:border-blue-300 transition-all duration-300 group hover:-translate-y-1"
              >
                <div>
                  {/* Quotes Icon */}
                  <div className="mb-4 text-blue-400">
                    <Quote className="h-8 w-8 stroke-[1.5]" />
                  </div>
                  {/* Text */}
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{test.text}"
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: test.stars }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                  {/* User Profile */}
                  <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                    <img
                      src={test.userAvatar}
                      alt={test.userName}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{test.userName}</p>
                      <p className="text-[10px] text-slate-500">{test.userRole}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="py-8">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 border border-blue-500/20 p-10 sm:p-16 text-center shadow-xl">
            {/* Glow blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-blue-300/10 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-lg">
                  <img src={logo} alt="Eleva Logo" className="h-7 w-7 object-contain" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Mulai Belajar Hari Ini
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto leading-relaxed">
                Bergabung dengan ribuan pelajar lainnya dan mulai perjalanan belajarmu sekarang.
              </p>
              <div className="pt-2">
                <Link to={PATHS.REGISTER}>
                  <Button variant="secondary" size="lg" className="shadow-lg shadow-blue-900/20">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
