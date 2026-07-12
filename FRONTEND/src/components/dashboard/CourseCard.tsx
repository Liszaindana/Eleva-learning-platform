import { BookOpen, Clock, User } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface CourseCardProps {
  id: number | string;
  title: string;
  category: string;
  level: string;
  progress: number;
  lastAccess?: string;
  mentorName: string;
  imageUrl?: string;
  onClick?: () => void;
  onActionClick?: (e: React.MouseEvent) => void;
  actionText?: string;
}

export default function CourseCard({
  title,
  category,
  level,
  progress,
  lastAccess,
  mentorName,
  imageUrl,
  onClick,
  onActionClick,
  actionText = 'Continue',
}: CourseCardProps) {
  // Fallback image using a high quality learning photo if none is provided
  const imgSource = imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Course Image */}
      <div className="h-44 w-full relative overflow-hidden bg-slate-100 shrink-0">
        <img
          src={imgSource}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Badges overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5">
          <Badge variant="info" className="backdrop-blur-md bg-blue-50/90 shadow-sm text-[10px] font-bold uppercase tracking-wider">
            {level}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Course Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <User className="h-3.5 w-3.5 text-slate-400" />
            by {mentorName}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-500">Learning Progress</span>
              <span className="text-blue-600">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-50">
            {lastAccess ? (
              <span className="flex items-center gap-1 font-medium">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {lastAccess}
              </span>
            ) : (
              <span className="flex items-center gap-1 font-medium">
                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                No activity
              </span>
            )}
            <Button
              size="sm"
              className="text-xs py-1.5 px-4 font-semibold"
              onClick={(e) => {
                if (onActionClick) {
                  onActionClick(e);
                } else if (onClick) {
                  onClick();
                }
              }}
            >
              {actionText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
