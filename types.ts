export interface Course {
  id: string;
  name: string; // 課程名稱
  company: string; // 公司別
  department: string; // 事業群/中心/獨立處室
  objective: string; // 課程目的
  startDate: string; // 課程起日 (YYYY-MM-DD)
  endDate: string; // 課程迄日 (YYYY-MM-DD)
  time: string; // 課程時間 (e.g., 09:00-12:00)
  duration: number; // 課程時數 (hours)
  expectedAttendees: number; // 預計人數
  actualAttendees: number; // 實際人數
  instructor: string; // 講師姓名
  instructorOrg: string; // 講師服務單位
  cost: number; // 課程費用
  satisfaction: number; // 課程滿意度 (1-5)
  status: 'Planned' | 'Completed' | 'Cancelled'; // 執行情形
  cancellationReason?: string; // 取消原因
  createdBy: 'HR' | 'User';
}

export interface DashboardStats {
  totalCourses: number;
  expectedTotalCost: number; // 年度總預算
  actualTotalCost: number;   // 實際預算消耗
  expectedTotalHours: number; // 預計訓練總時數
  actualTotalHours: number;   // 實際訓練總時數
  avgSatisfaction: number;
  completionRate: number;
  openingRate: number;       // 開課率
  participationRate: number; // 參訓率
}

export type ViewState = 'dashboard' | 'list' | 'import';