export type BuildingId = 'ecsw' | 'ecsn' | 'atec' | 'jsom';
export type Condition = 'slow' | 'down' | 'good';
export type CommunityStatus = Condition | 'unknown';
export interface Building { id: BuildingId; code: string; name: string; x: number; y: number }
export interface ReportInput { building: BuildingId; condition: Condition; area: string; note: string }
export interface Report extends ReportInput { id: string; time: number; confirmations: number; confirmed: boolean; mine: boolean; origin: 'sample' | 'community' }
export interface Feed { reports: Report[]; serverTime: number; seeded: boolean }
export interface SurveyQuestion { id: string; label: string; n: number; multi: boolean; options: [string, number][] }
