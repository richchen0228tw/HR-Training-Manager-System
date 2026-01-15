import { Course } from "../types";

// Key for LocalStorage
const STORAGE_KEY = 'hr_training_data';
const SETTINGS_KEY = 'hr_training_settings';

// Mock Data for initial load
const MOCK_DATA: Course[] = [
  {
    id: '1',
    name: 'React 基礎與實戰',
    company: '神資',
    department: '600-數位科技事業群',
    objective: '提升前端開發能力',
    startDate: '2023-11-05',
    endDate: '2023-11-05',
    time: '09:00-17:00',
    duration: 7,
    expectedAttendees: 30,
    actualAttendees: 28,
    instructor: '張志明',
    instructorOrg: '前端技術學院',
    cost: 15000,
    satisfaction: 4.6,
    status: 'Completed',
    createdBy: 'HR'
  },
  {
    id: '2',
    name: '溝通與領導力工作坊',
    company: '新達',
    department: 'Z10-統合通訊處',
    objective: '強化中階主管管理職能',
    startDate: '2023-11-15',
    endDate: '2023-11-16',
    time: '13:00-17:00',
    duration: 8,
    expectedAttendees: 15,
    actualAttendees: 0,
    instructor: '李春嬌',
    instructorOrg: '企管顧問公司',
    cost: 25000,
    satisfaction: 0,
    status: 'Planned',
    createdBy: 'HR'
  },
    {
    id: '3',
    name: 'AI 工具應用分享',
    company: '神耀',
    department: 'QA0-智能科技中心',
    objective: '學習使用 Generative AI 提升工作效率',
    startDate: '2023-12-01',
    endDate: '2023-12-01',
    time: '12:00-13:30',
    duration: 1.5,
    expectedAttendees: 50,
    actualAttendees: 0,
    instructor: '王小明',
    instructorOrg: '內部講師',
    cost: 0,
    satisfaction: 0,
    status: 'Planned',
    createdBy: 'User'
  }
];

export interface AppSettings {
  googleScriptUrl: string;
}

export const getSettings = (): AppSettings => {
  const saved = localStorage.getItem(SETTINGS_KEY);
  return saved ? JSON.parse(saved) : { googleScriptUrl: '' };
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// --- Data Operations ---

export const fetchCourses = async (): Promise<Course[]> => {
  const settings = getSettings();
  
  // If Google Script URL is provided, try to fetch from it
  if (settings.googleScriptUrl) {
    try {
      const response = await fetch(settings.googleScriptUrl);
      const data = await response.json();
      if (data && Array.isArray(data)) {
        return data;
      }
    } catch (e) {
      console.error("Failed to fetch from Google Sheet, falling back to local.", e);
    }
  }

  // Fallback to LocalStorage
  const localData = localStorage.getItem(STORAGE_KEY);
  if (localData) {
    return JSON.parse(localData);
  }
  
  // Initial Mock Data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
  return MOCK_DATA;
};

export const saveCourses = async (courses: Course[]): Promise<void> => {
  const settings = getSettings();
  
  // Save to LocalStorage first (optimistic UI)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));

  // If connected to Google Sheets, push data
  // Note: Standard GAS Web App CORS policy often requires 'no-cors' mode for simple POSTs 
  // or proper setup. For this demo, we simulate the logic.
  if (settings.googleScriptUrl) {
    try {
        // In a real scenario, you'd post the whole array or the diff
        await fetch(settings.googleScriptUrl, {
            method: 'POST',
            mode: 'no-cors', // Often needed for GAS Web Apps unless configured strictly
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(courses)
        });
    } catch (e) {
        console.error("Failed to save to Google Sheet", e);
    }
  }
};