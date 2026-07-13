import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Award, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { classApi } from '../../../api/class';
import { examApi } from '../../../api/exam';
import LoadingState from '../../../components/ui/LoadingState';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

// 1. Bank Soal Fundamental IT Global (Pasti relevan untuk semua course IT)
const quizQuestions = [
  {
    id: 1,
    q: 'Manakah dari berikut ini yang merupakan karakteristik utama dari arsitektur REST API?',
    options: ['Statelessness', 'Stateful connection', 'Menggunakan protokol SMTP saja', 'Wajib menggunakan XML'],
    correctAnswer: 'Statelessness',
  },
  {
    id: 2,
    q: 'Struktur data manakah yang menggunakan prinsip LIFO (Last In First Out)?',
    options: ['Queue / Antrean', 'Stack / Tumpukan', 'Tree / Pohon', 'Graph'],
    correctAnswer: 'Stack / Tumpukan',
  },
  {
    id: 3,
    q: 'Apa kegunaan utama dari pembuatan Indexing pada sebuah tabel database SQL?',
    options: ['Mengenkripsi data sensitif', 'Mempercepat proses pencarian data (SELECT)', 'Menghapus data duplikat otomatis', 'Memperkecil ukuran file database'],
    correctAnswer: 'Mempercepat proses pencarian data (SELECT)',
  },
  {
    id: 4,
    q: 'Manakah di bawah ini yang merupakan metode otentikasi berbasis token yang populer digunakan di web?',
    options: ['JWT (JSON Web Token)', 'FTP Single Sign', 'MD5 Checksum', 'WPA2 Enterprise'],
    correctAnswer: 'JWT (JSON Web Token)',
  }
];

export default function ExamsGradesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.user_id;

  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  // Fetch semua kelas
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['classesListAll'],
    queryFn: classApi.getAll,
  });

  // Fetch semua riwayat nilai ujian
  const { data: examRecords = [], isLoading: recordsLoading } = useQuery({
    queryKey: ['examsList'],
    queryFn: examApi.getAll,
  });

  // Mutation untuk mengirimkan skor hasil ujian
  const submitExamMutation = useMutation({
    mutationFn: (payload: { class_id: number; user_id: number; title: string; score: number; min_score: number }) =>
      examApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examsList'] });
      alert('Ujian selesai! Hasil penilaian kamu telah berhasil disimpan.');
      setActiveExam(null);
      setSelectedAnswers({});
    },
  });

  if (classesLoading || recordsLoading) {
    return <LoadingState text="Memuat daftar ujian dan nilai..." />;
  }

  // Filter nilai milik mahasiswa aktif
  const myGrades = examRecords.filter((rec: any) => Number(rec.user_id) === Number(userId));

  // Ambil daftar kelas yang di-join oleh mahasiswa
  const myEnrolledClasses = classes.filter((c: any) =>
    c.enrollment?.some((e: any) => Number(e.user_id) === Number(userId))
  );

  // Menyusun daftar kuis final per kelas yang diambil
  const availableExams: any[] = [];
  myEnrolledClasses.forEach((cls: any) => {
    const clsExams = cls.exams || [];
    if (clsExams.length === 0) {
      // Siasati dengan Exam Global berlabel nama kelas masing-masing
      availableExams.push({
        exam_id: `final-${cls.class_id}`,
        class_id: cls.class_id,
        title: `IT Competency Assessment: ${cls.title}`,
        min_score: 70,
        courseTitle: cls.title,
      });
    } else {
      clsExams.forEach((ex: any) => {
        availableExams.push({
          ...ex,
          courseTitle: cls.title,
        });
      });
    }
  });

  // Filter kuis yang belum pernah diambil oleh mahasiswa ini
  const pendingExams = availableExams.filter(
    (ex) => !myGrades.some((grade) => grade.title === ex.title && Number(grade.class_id) === Number(ex.class_id))
  );

  // Perhitungan Stats Ringkas
  const totalTaken = myGrades.length;
  const totalPassed = myGrades.filter((g: any) => g.is_passed).length;
  const avgScore =
    totalTaken > 0
      ? Math.round(myGrades.reduce((sum: number, g: any) => sum + g.score, 0) / totalTaken)
      : 0;

  const handleStartExam = (exam: any) => {
    setActiveExam(exam);
    setSelectedAnswers({});
  };

  const handleSelectAnswer = (qId: number, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: option,
    }));
  };

  // Kalkulasi Skor Riil berdasarkan Kunci Jawaban
  const handleSubmitQuiz = () => {
    if (!activeExam || !userId) return;

    let correctCount = 0;
    quizQuestions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount += 1;
      }
    });

    // Menghitung persentase nilai akhir (0 - 100)
    const finalScore = Math.round((correctCount / quizQuestions.length) * 100);

    submitExamMutation.mutate({
      class_id: Number(activeExam.class_id),
      user_id: Number(userId),
      title: activeExam.title,
      score: finalScore,
      min_score: activeExam.min_score || 70,
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ujian & Nilai</h1>
        <p className="text-slate-500 text-sm mt-1">Selesaikan asesmen akhir untuk memvalidasi pemahaman materi IT kamu</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{totalTaken}</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Ujian Diikuti</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{totalPassed}</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Dinyatakan Lulus</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{avgScore}%</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Rata-rata Nilai</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Exams */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ujian Menunggu</h3>
          {pendingExams.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-400">
              <p className="text-sm font-medium">Luar biasa! Semua ujian kelas telah kamu selesaikan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingExams.map((exam) => (
                <div
                  key={exam.exam_id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{exam.title}</h4>
                    <p className="text-xs text-slate-500 font-semibold">Kelas: {exam.courseTitle}</p>
                    <p className="text-xs text-slate-400 font-medium">Batas Minimum Kelulusan: {exam.min_score || 70}</p>
                  </div>
                  <Button size="sm" className="text-xs font-bold cursor-pointer" onClick={() => handleStartExam(exam)}>
                    Mulai Ujian
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grades History */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-semibold">Riwayat Nilai</h3>
          {myGrades.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-400">
              <p className="text-sm font-medium">Belum ada riwayat pengerjaan ujian.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myGrades.map((grade: any) => (
                <div key={grade.exam_id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-800 text-xs truncate">{grade.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">ID Kelas: {grade.class_id}</p>
                    </div>
                    <Badge variant={grade.is_passed ? 'success' : 'danger'} className="text-[9px] px-2 py-0.5 uppercase font-bold shrink-0">
                      {grade.is_passed ? 'Lulus' : 'Gagal'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2 text-slate-500">
                    <span>Skor Diperoleh:</span>
                    <span className="font-black text-slate-900 text-sm">{grade.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Quiz Modal Dialog */}
      {activeExam && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-md font-bold text-slate-900">{activeExam.title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mt-1 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Syarat Kelulusan: Minimal skor {activeExam.min_score || 70}</span>
                </div>
              </div>
              <button onClick={() => setActiveExam(null)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 text-lg cursor-pointer">&times;</button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              {quizQuestions.map((question, qIdx) => (
                <div key={question.id} className="space-y-3">
                  <p className="text-sm font-bold text-slate-800">
                    {qIdx + 1}. {question.q}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {question.options.map((opt) => {
                      const isSelected = selectedAnswers[question.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectAnswer(question.id, opt)}
                          className={`p-3 text-left text-xs rounded-xl border font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50/80'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
              <Button variant="secondary" size="sm" onClick={() => setActiveExam(null)} className="cursor-pointer">
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitQuiz}
                isLoading={submitExamMutation.isPending}
                disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                className="cursor-pointer"
              >
                Kirim Jawaban
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}