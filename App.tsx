import React, { useState, useEffect } from 'react';
import { Course, ViewState } from './types';
import { fetchCourses, saveCourses, saveSettings, getSettings } from './services/dataService';
import { Dashboard } from './components/Dashboard';
import { CourseForm } from './components/CourseForm';
import { BatchImport } from './components/BatchImport';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isBatchImportOpen, setIsBatchImportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scriptUrl, setScriptUrl] = useState('');

  // Initial Load
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCourses();
      setCourses(data);
      const settings = getSettings();
      setScriptUrl(settings.googleScriptUrl || '');
    };
    loadData();
  }, []);

  const handleSaveCourse = async (course: Course) => {
    let newCourses = [];
    if (courses.some(c => c.id === course.id)) {
      newCourses = courses.map(c => c.id === course.id ? course : c);
    } else {
      newCourses = [...courses, course];
    }
    setCourses(newCourses);
    await saveCourses(newCourses);
  };

  const handleDeleteCourse = async (id: string) => {
    if (window.confirm('確定要刪除此課程嗎？')) {
      const newCourses = courses.filter(c => c.id !== id);
      setCourses(newCourses);
      await saveCourses(newCourses);
    }
  };

  const handleBatchImport = async (importedCourses: Course[]) => {
    const newCourses = [...courses, ...importedCourses];
    setCourses(newCourses);
    await saveCourses(newCourses);
    setIsBatchImportOpen(false);
    setView('list');
  };

  const handleSaveSettings = () => {
      saveSettings({ 
        googleScriptUrl: scriptUrl,
      });
      setIsSettingsOpen(false);
      alert("設定已儲存。");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans text-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M22 10v6M2 10v6"/><path d="M20 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M12 4v16"/></svg>
           <h1 className="text-lg font-bold tracking-tight">HR 培訓管理</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'dashboard' ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
             儀表板
          </button>
          
          <button 
            onClick={() => setView('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'list' ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>
             課程列表
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
             <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                系統設定
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <h2 className="text-xl font-bold text-slate-800">
                {view === 'dashboard' ? '年度教育訓練總覽' : '教育訓練課程清單'}
            </h2>
            <div className="flex gap-3">
                 <button 
                    onClick={() => setIsBatchImportOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg shadow-md shadow-slate-500/20 transition-all active:scale-95 font-medium text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M3 15h6"/><path d="M6 12v6"/></svg>
                    整批匯入
                </button>
                <button 
                    onClick={() => { setEditingCourse(null); setIsFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-md shadow-primary-500/20 transition-all active:scale-95 font-medium text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    新增
                </button>
            </div>
        </header>

        <div className="p-8">
            {view === 'dashboard' && <Dashboard courses={courses} />}
            
            {view === 'list' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold">課程名稱</th>
                                    <th className="p-4 font-semibold">單位</th>
                                    <th className="p-4 font-semibold">日期/時間</th>
                                    <th className="p-4 font-semibold">講師</th>
                                    <th className="p-4 font-semibold text-center">人數 (預/實)</th>
                                    <th className="p-4 font-semibold text-right">費用</th>
                                    <th className="p-4 font-semibold text-center">滿意度</th>
                                    <th className="p-4 font-semibold text-center">狀態</th>
                                    <th className="p-4 font-semibold text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {courses.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="p-8 text-center text-slate-400">尚無課程資料，請點擊右上角新增或匯入。</td>
                                    </tr>
                                ) : (
                                    courses.map(course => (
                                        <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-semibold text-slate-800">{course.name}</div>
                                                <div className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{course.objective}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-slate-800 font-medium">{course.company || '-'}</div>
                                                <div className="text-xs text-slate-500 mt-1">{course.department}</div>
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                <div>{course.startDate} {course.startDate !== course.endDate && `~ ${course.endDate}`}</div>
                                                <div className="text-xs text-slate-400 mt-1">{course.time} ({course.duration}h)</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-slate-700">{course.instructor}</div>
                                                <div className="text-xs text-slate-400">{course.instructorOrg}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="text-slate-400">{course.expectedAttendees}</span>
                                                <span className="mx-1 text-slate-300">/</span>
                                                <span className={`font-medium ${course.actualAttendees > 0 ? 'text-primary-600' : 'text-slate-400'}`}>{course.actualAttendees}</span>
                                            </td>
                                            <td className="p-4 text-right text-slate-700 font-mono">
                                                ${course.cost.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                {course.satisfaction > 0 ? (
                                                     <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-600 font-bold">
                                                        {course.satisfaction}
                                                     </div>
                                                ) : <span className="text-slate-300">-</span>}
                                            </td>
                                            <td className="p-4 text-center vertical-top">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                                    course.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    course.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                    {course.status === 'Completed' ? '已完成' : course.status === 'Cancelled' ? '已取消' : '規劃中'}
                                                </span>
                                                {course.status === 'Cancelled' && course.cancellationReason && (
                                                    <div className="text-xs text-red-500 mt-2 max-w-[120px] mx-auto break-words bg-red-50 p-1 rounded border border-red-100" title={course.cancellationReason}>
                                                        {course.cancellationReason}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => { setEditingCourse(course); setIsFormOpen(true); }}
                                                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                        title="編輯"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteCourse(course.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="刪除"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      </main>

      <CourseForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleSaveCourse}
        initialData={editingCourse}
      />

      {isBatchImportOpen && (
        <BatchImport 
            onImport={handleBatchImport}
            onCancel={() => setIsBatchImportOpen(false)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">系統設定</h3>

                  <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Google Sheets (Web App URL)</label>
                      <input 
                        type="text" 
                        value={scriptUrl} 
                        onChange={(e) => setScriptUrl(e.target.value)}
                        placeholder="https://script.google.com/macros/s/..."
                        className="w-full rounded-lg border-slate-200 border p-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                          若要啟用 Google Sheets 同步，請將 Apps Script 發布為 Web App 並貼上網址。
                      </p>
                  </div>

                  <div className="flex justify-end gap-2">
                      <button onClick={() => setIsSettingsOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm">取消</button>
                      <button onClick={handleSaveSettings} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm">儲存</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default App;