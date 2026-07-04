import { useTheme } from '../context/ThemeContext';

interface LoadingSkeletonProps {
  count?: number;
}

const LoadingSkeleton = ({ count = 3 }: LoadingSkeletonProps): JSX.Element => {
  const { theme } = useTheme();

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse overflow-hidden rounded-[1.5rem] border shadow-sm ${
            theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
          }`}
        >
          <div className={`h-40 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
          <div className="space-y-3 p-5">
            <div className={`h-4 w-3/4 rounded ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className={`h-3 w-1/2 rounded ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className={`h-3 w-full rounded ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className={`h-3 w-5/6 rounded ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
