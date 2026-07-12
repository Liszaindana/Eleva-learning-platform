import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Award, FileText, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { classApi } from '../../../api/class';
import { examApi } from '../../../api/exam';
import LoadingState from '../../../components/ui/LoadingState';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

export default function ExamsGradesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.user_id;

  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  // Fetch all classes to get associated exams
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['classesListAll'],
    queryFn: classApi.getAll,
  });

  // Fetch all exam records (scores)
  const { data: examRecords = [], isLoading: recordsLoading } = useQuery({
    queryKey: ['examsList'],
    queryFn: examApi.getAll,
  });

  // Mutation to submit exam score
  const submitExamMutation = useMutation({
    mutationFn: (payload: { class_id: number; user_id: number; title: string; score: number; min_score: number }) =>
      examApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examsList'] });
      alert('Your exam has been graded successfully!');
      setActiveExam(null);
      setSelectedAnswers({});
    },
  });

  if (classesLoading || recordsLoading) {
    return <LoadingState text="Loading exams and grades..." />;
  }

  // Filter student exam scores
  const myGrades = examRecords.filter((rec: any) => Number(rec.user_id) === Number(userId));

  // Get list of all exams defined across the enrolled classes
  // (Filter classes where student is enrolled)
  const myEnrolledClasses = classes.filter((c: any) =>
    c.enrollment?.some((e: any) => Number(e.user_id) === Number(userId))
  );

  // Compile active/pending exams
  // Standard exams defined: we find exams in myEnrolledClasses that have NOT been taken yet
  const availableExams: any[] = [];
  myEnrolledClasses.forEach((cls: any) => {
    // If there are no exams defined in class model, we provide a default Final Quiz
    const clsExams = cls.exams || [];
    if (clsExams.length === 0) {
      // Mock one default exam per course if not created by mentor yet
      availableExams.push({
        exam_id: `mock-${cls.class_id}`,
        class_id: cls.class_id,
        title: `Final Quiz: ${cls.title}`,
        min_score: 70,
        courseTitle: cls.title,
        isMock: true,
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

  // Filter out exams that student has already taken
  const pendingExams = availableExams.filter(
    (ex) => !myGrades.some((grade) => grade.title === ex.title && Number(grade.class_id) === Number(ex.class_id))
  );

  // Stats
  const totalTaken = myGrades.length;
  const totalPassed = myGrades.filter((g: any) => g.is_passed).length;
  const avgScore =
    totalTaken > 0
      ? Math.round(myGrades.reduce((sum: number, g: any) => sum + g.score, 0) / totalTaken)
      : 0;

  // Handle mock exam submission
  const handleStartExam = (exam: any) => {
    setActiveExam(exam);
    setSelectedAnswers({});
  };

  const handleSelectAnswer = (qIndex: number, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!activeExam || !userId) return;

    // Simulate score calculation based on random selection or simple answers matching
    const randomScore = Math.floor(Math.random() * 41) + 60; // Random score between 60 and 100

    submitExamMutation.mutate({
      class_id: Number(activeExam.class_id),
      user_id: Number(userId),
      title: activeExam.title,
      score: randomScore,
      min_score: activeExam.min_score || 70,
    });
  };

  // Mock quiz questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Which of the following is a primary subfield of Artificial Intelligence?',
      options: ['Supervised Learning', 'Blockchain Miner', 'Cascading Stylesheets', 'Virtual Host Configuration'],
    },
    {
      id: 2,
      q: 'What is the standard activation function used in modern deep neural networks?',
      options: ['ReLU (Rectified Linear Unit)', 'Sine Wave', 'Binary Threshold', 'Linear Scaling'],
    },
    {
      id: 3,
      q: 'Which performance metric evaluates both precision and recall of a model?',
      options: ['F1-Score', 'Mean Squared Error', 'R-squared', 'Standard Deviation'],
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exams & Grades</h1>
          <p className="text-slate-500 text-sm mt-1">Take assessments and monitor your scores</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{totalTaken}</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Exams Attempted</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{totalPassed}</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Exams Passed</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{avgScore}%</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Average Score</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Exams */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Pending Exams</h3>
            {pendingExams.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-500">
                <p className="text-sm font-medium">All exams are completed! No pending assessments.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingExams.map((exam) => (
                  <div
                    key={exam.exam_id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">{exam.title}</h4>
                      <p className="text-xs text-slate-500 font-semibold">Course: {exam.courseTitle}</p>
                      <p className="text-xs text-slate-400 font-medium">Passing Score: {exam.min_score || 70}</p>
                    </div>
                    <Button size="sm" className="text-xs font-bold" onClick={() => handleStartExam(exam)}>
                      Start Exam
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grades History */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Attempt History</h3>
            {myGrades.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-500">
                <p className="text-sm font-medium">No exam attempts recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myGrades.map((grade: any) => (
                  <div
                    key={grade.exam_id}
                    className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-850 text-xs line-clamp-1">{grade.title}</h4>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Course ID: {grade.class_id}</p>
                      </div>
                      <Badge variant={grade.is_passed ? 'success' : 'danger'} className="text-[9px] px-2 py-0.5 uppercase font-bold">
                        {grade.is_passed ? 'Pass' : 'Fail'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-slate-50 pt-2 text-slate-650">
                      <span>Score earned:</span>
                      <span className="font-black text-slate-900 text-sm">{grade.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Quiz Dialog */}
        {activeExam && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{activeExam.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Passing Score: {activeExam.min_score || 70}</p>
                </div>
                <button
                  onClick={() => setActiveExam(null)}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
                >
                  &times;
                </button>
              </div>

              <div className="p-6 space-y-6 flex-1">
                {quizQuestions.map((question, qIdx) => (
                  <div key={question.id} className="space-y-3">
                    <p className="text-sm font-bold text-slate-850">
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
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
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
                <Button variant="secondary" size="sm" onClick={() => setActiveExam(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitQuiz}
                  isLoading={submitExamMutation.isPending}
                  disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                >
                  Submit Answers
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
