import React, { useState, useEffect } from 'react';
import { Course } from '../types';

interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: Course) => void;
  initialData?: Course | null;
}

const emptyCourse: Course = {
  id: '',
  name: '',
  company: '',
  department: '',
  objective: '',
  startDate: '',
  endDate: '',
  time: '',
  duration: 0,
  expectedAttendees: 0,
  actualAttendees: 0,
  instructor: '',
  instructorOrg: '',
  cost: 0,
  satisfaction: 0,
  status: 'Planned',
  cancellationReason: '',
  createdBy: 'HR'
};

const COMPANY_OPTIONS = ['神通', '神資', '神耀', '新達', '肇源', '光通信'];

const DEPARTMENT_MAPPING: Record<string, string[]> = {
  '神資': [
    '070-董事長室', 'P00-總經理室', 'PA0-財務處', 'PC0-稽核室', 
    'PG0-資訊服務研發處', '600-數位科技事業群', '700-行政支援中心', 
    'C00-應用系統事業群', 'G00-創新科技事業群', 'K00-智慧交通事業群'
  ],
  '神耀': [
    'Q0A-董事長室', 'Q00-總經理室', 'QF0-管理處', 'Q01-財會部', 
    'QA0-智能科技中心', 'QB0-智慧聯安事業群', 'QC0-AI創新應用研發中心'
  ],
  '新達': [
    'ZA0-董事長室', 'Z00-總經理室', 'Z10-統合通訊處', 
    'Z20-智能影音處', 'Z30-電力系統處', 'Z70-技術支援處'
  ]
};

export const CourseForm: React.FC<CourseFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Course>(emptyCourse);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
            ...emptyCourse,
            ...initialData,
            cancellationReason: initialData.cancellationReason || ''
        });
        if (initialData.company) {
             setAvailableDepartments(DEPARTMENT_MAPPING[initialData.company] || []);
        }
      } else {
        setFormData({ ...emptyCourse, id: crypto.randomUUID() });
        setAvailableDepartments([]);
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'company') {
        const newDepts = DEPARTMENT_MAPPING[value] || [];
        setAvailableDepartments(newDepts);
        setFormData(prev => ({
            ...prev,
            company: value,
            department: '' // Reset department when company changes
        }));
    } else {
        setFormData(prev => ({
          ...prev,
          [name]: type === 'number' ? parseFloat(value) : value
        }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const inputClass = "w-full rounded-lg border-slate-200 border p-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? '編輯課程' : '新增課程'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-4 border-primary-500 pl-2">基本資訊</h3>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">課程名稱</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="例如：2024 年度資訊安全教育訓練"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">公司別</label>
             <select
                required
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={inputClass}
             >
                 <option value="" disabled>請選擇公司</option>
                 {COMPANY_OPTIONS.map(opt => (
                     <option key={opt} value={opt}>{opt}</option>
                 ))}
             </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">事業群/中心/獨立處室</label>
             <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={inputClass}
                disabled={availableDepartments.length === 0}
             >
                 <option value="">{availableDepartments.length > 0 ? '請選擇部門' : '無對應部門'}</option>
                 {availableDepartments.map(opt => (
                     <option key={opt} value={opt}>{opt}</option>
                 ))}
             </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">課程目的</label>
            <textarea
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              rows={3}
              className={inputClass}
              placeholder="說明本課程的主要學習目標..."
            />
          </div>

          {/* Schedule */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-4 border-primary-500 pl-2 mt-4">時間與講師</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">開始日期</label>
            <input
              required
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">結束日期</label>
            <input
              required
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">課程時間</label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="09:00 - 17:00"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">時數 (Hours)</label>
            <input
              type="number"
              name="duration"
              min="0"
              step="0.5"
              value={formData.duration}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">講師姓名</label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">講師服務單位</label>
            <input
              type="text"
              name="instructorOrg"
              value={formData.instructorOrg}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Metrics */}
           <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-4 border-primary-500 pl-2 mt-4">執行成效與費用</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">預計人數</label>
            <input
              type="number"
              name="expectedAttendees"
              min="0"
              value={formData.expectedAttendees}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">實際人數</label>
            <input
              type="number"
              name="actualAttendees"
              min="0"
              value={formData.actualAttendees}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">課程費用</label>
            <input
              type="number"
              name="cost"
              min="0"
              value={formData.cost}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">滿意度 (1-5)</label>
            <input
              type="number"
              name="satisfaction"
              min="0"
              max="5"
              step="0.1"
              value={formData.satisfaction}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">執行狀態</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
                <option value="Planned">規劃中</option>
                <option value="Completed">已完成</option>
                <option value="Cancelled">已取消</option>
            </select>
          </div>
          
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">建立者</label>
            <select
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
              className={inputClass}
            >
                <option value="HR">HR</option>
                <option value="User">員工 (User)</option>
            </select>
          </div>

          {formData.status === 'Cancelled' && (
            <div className="col-span-1 md:col-span-2 animate-fade-in">
              <label className="block text-sm font-medium text-red-600 mb-1">取消原因 (必填)</label>
              <input
                required
                type="text"
                name="cancellationReason"
                value={formData.cancellationReason || ''}
                onChange={handleChange}
                placeholder="請輸入取消原因..."
                className={`${inputClass} border-red-200 bg-red-50 focus:ring-red-500`}
              />
            </div>
          )}

          <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-md shadow-primary-500/20 transition-all transform active:scale-95"
            >
              {initialData ? '儲存變更' : '建立課程'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};