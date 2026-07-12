import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Download } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function MaterialVideoPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white border border-slate-200"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Lesson Material</h1>
            <p className="text-slate-500 text-sm">Machine Learning Basics • Types of AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Reading Material</h2>
              <div className="prose prose-sm text-slate-600">
                <h3>Introduction to Machine Learning</h3>
                <p>
                  Machine learning is a branch of artificial intelligence (AI) and computer science
                  which focuses on the use of data and algorithms to imitate the way that humans learn,
                  gradually improving its accuracy.
                </p>
                <h4>Key Concepts</h4>
                <ul>
                  <li>Supervised Learning</li>
                  <li>Unsupervised Learning</li>
                  <li>Reinforcement Learning</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Download Resources</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Complete Guide.pdf</p>
                    <p className="text-xs text-slate-500">3.8 MB</p>
                  </div>
                  <Button variant="secondary" size="sm" className="text-xs flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Other Lessons</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs font-semibold text-blue-800">What is AI? (Video)</p>
                  <p className="text-[10px] text-blue-600 mt-1">Completed</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-xs font-semibold text-slate-700">History of AI (Reading)</p>
                  <p className="text-[10px] text-slate-500 mt-1">Completed</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-xs font-semibold text-slate-700">Quiz 1</p>
                  <p className="text-[10px] text-slate-500 mt-1">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
