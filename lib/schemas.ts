import { z } from 'zod';

export const AuditProjectSchema = z.object({
  title: z.string().min(5, 'Judul harus minimal 5 karakter'),
  description: z.string().optional(),
  scope: z.string().min(10, 'Ruang lingkup harus detail'),
  startDate: z.date(),
  endDate: z.date(),
  auditorId: z.string(),
  auditeeId: z.string(),
});

export const FindingSchema = z.object({
  condition: z.string().min(10),
  criteria: z.string().min(10),
  cause: z.string().min(10),
  impact: z.string().min(10),
  recommendation: z.string().min(10),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

export const ActionPlanSchema = z.object({
  description: z.string().min(10),
  picId: z.string(),
  targetDate: z.date(),
});
