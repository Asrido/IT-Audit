'use server';

import prisma from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit-logger';
import { revalidatePath } from 'next/cache';

export async function createProject(data: any) {
  try {
    // Ensure we have valid auditor and auditee IDs for the demo
    let auditorId = data.auditorId;
    let auditeeId = data.auditeeId;

    const auditorExists = await prisma.user.findUnique({ where: { id: auditorId } });
    if (!auditorExists) {
      const firstAuditor = await prisma.user.findFirst({ where: { role: 'AUDITOR' } });
      if (firstAuditor) auditorId = firstAuditor.id;
    }

    const auditeeExists = await prisma.user.findUnique({ where: { id: auditeeId } });
    if (!auditeeExists) {
      const firstAuditee = await prisma.user.findFirst({ where: { role: 'AUDITEE' } });
      if (firstAuditee) auditeeId = firstAuditee.id;
    }

    const project = await prisma.auditProject.create({
      data: {
        title: data.title,
        description: data.description,
        scope: data.scope,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        auditorId: auditorId,
        auditeeId: auditeeId,
        status: 'PLANNED',
      },
    });

    await createAuditLog({
      userId: 'system-admin', // Replace with actual user ID from session
      action: 'CREATE_PROJECT',
      entity: 'AuditProject',
      entityId: project.id,
      details: { title: project.title },
    });

    revalidatePath('/projects');
    return { success: true, data: project };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: 'Gagal membuat proyek' };
  }
}

export async function updateChecklist(id: string, data: any) {
  try {
    const checklist = await prisma.auditChecklist.update({
      where: { id },
      data: {
        status: data.status,
        evidence: data.evidence,
        notes: data.notes,
        score: data.score,
        auditorSign: data.auditorSign,
        signedAt: data.auditorSign ? new Date() : null,
      },
    });

    await createAuditLog({
      userId: 'system-auditor',
      action: 'UPDATE_CHECKLIST',
      entity: 'AuditChecklist',
      entityId: checklist.id,
      details: data,
    });

    revalidatePath('/projects/[id]');
    return { success: true, data: checklist };
  } catch (error) {
    console.error('Error updating checklist:', error);
    return { success: false, error: 'Gagal memperbarui daftar periksa' };
  }
}

export async function createFinding(data: any) {
  try {
    // Generate a simple finding number for now
    const count = await prisma.finding.count();
    const findingNumber = `F-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

    // Ensure we have a valid auditor ID for the demo
    let auditorId = 'system-auditor-id';
    const auditorExists = await prisma.user.findUnique({ where: { id: auditorId } });
    if (!auditorExists) {
      const firstAuditor = await prisma.user.findFirst({ where: { role: 'AUDITOR' } });
      if (firstAuditor) auditorId = firstAuditor.id;
      else {
        // Fallback to any user if no auditor exists
        const anyUser = await prisma.user.findFirst();
        if (anyUser) auditorId = anyUser.id;
      }
    }

    // Ensure we have a valid project ID for the demo
    let projectId = data.projectId;
    const projectExists = await prisma.auditProject.findUnique({ where: { id: projectId } });
    if (!projectExists) {
      const firstProject = await prisma.auditProject.findFirst();
      if (firstProject) projectId = firstProject.id;
    }

    const finding = await prisma.finding.create({
      data: {
        title: data.title,
        findingNumber,
        condition: data.condition,
        criteria: data.criteria,
        cause: data.cause,
        impact: data.impact,
        recommendation: data.recommendation,
        severity: data.severity,
        projectId: projectId,
        auditorId: auditorId,
      },
    });

    await createAuditLog({
      userId: 'system-auditor',
      action: 'CREATE_FINDING',
      entity: 'Finding',
      entityId: finding.id,
      details: { title: finding.title, findingNumber },
    });

    revalidatePath('/findings');
    revalidatePath(`/projects/${data.projectId}`);
    return { success: true, data: finding };
  } catch (error) {
    console.error('Error creating finding:', error);
    return { success: false, error: 'Gagal membuat temuan' };
  }
}

