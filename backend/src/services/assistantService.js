const complaintRepository = require('../repositories/complaintRepository');
const categorySettingRepository = require('../repositories/categorySettingRepository');
const riskScoringService = require('./riskScoringService');
const dashboardService = require('./dashboardService');

class AssistantService {
  /**
   * Generates intelligent operational insights based on live system telemetry.
   * @param {string} prompt - User operational query
   * @param {Object} user - Context of inquiring user
   */
  async processQuery(prompt, user) {
    const cleanPrompt = (prompt || '').trim().toLowerCase();

    // Fetch live system telemetry for context injection
    const [summary, riskAnalytics, categories, overdueComplaints] = await Promise.all([
      dashboardService.getSummaryMetrics(),
      riskScoringService.getRiskAnalytics(),
      categorySettingRepository.findAll(),
      complaintRepository.find({
        dueDate: { $lt: new Date() },
        currentStatus: { $in: ['Open', 'In Progress'] }
      }, { createdAt: -1 }, 10)
    ]);

    const kpi = summary.kpi;
    const topClusters = riskAnalytics.clusters.slice(0, 5);

    // Context-Driven Analysis Logic
    if (
      cleanPrompt.includes('risk') ||
      cleanPrompt.includes('cluster') ||
      cleanPrompt.includes('recurring') ||
      cleanPrompt.includes('highest')
    ) {
      if (topClusters.length === 0) {
        return {
          reply: `**Risk Analysis Summary:**\n\nNo unit clusters currently exceed the minimum risk threshold (3.0 pts). All assets are operating within nominal baseline parameters.`,
          actionType: 'RISK_REPORT',
          data: { clusterCount: 0 }
        };
      }

      const clusterList = topClusters
        .map(
          (c, i) =>
            `${i + 1}. **${c.unitNumber}** (${c.category}): Decayed Risk Score **${c.totalRiskScore} pts** (${c.complaintCount} total defects, ${c.activeComplaintsCount} currently open). Classification: **${c.riskLevel}**.`
        )
        .join('\n');

      return {
        reply: `### High-Risk Defect Cluster Analysis\n\nBased on exponential decay calculations across the 90-day rolling lookback window, the following assets require immediate preventative intervention:\n\n${clusterList}\n\n**Strategic Recommendation:**\n• Dispatch specialized contractors to inspect common risers for Unit **${topClusters[0].unitNumber}** to avoid cascading structural dampness.\n• Review component supplier warranty for **${topClusters[0].category}** fittings.`,
        actionType: 'RISK_REPORT',
        data: { clusters: topClusters }
      };
    }

    if (
      cleanPrompt.includes('overdue') ||
      cleanPrompt.includes('sla') ||
      cleanPrompt.includes('breach') ||
      cleanPrompt.includes('delayed')
    ) {
      if (overdueComplaints.length === 0) {
        return {
          reply: `### SLA Compliance Report\n\n**100% SLA Adherence Verified.**\nThere are currently zero maintenance tickets exceeding their resolution targets. All ${kpi.activeComplaints} active requests are progressing on schedule.`,
          actionType: 'SLA_REPORT',
          data: { overdueCount: 0 }
        };
      }

      const overdueList = overdueComplaints
        .map(
          (t, i) =>
            `${i + 1}. Ticket **#${t._id.toString().slice(-6).toUpperCase()}** — *${t.title}* (${t.category} at ${t.unitNumber}). Due on: ${new Date(t.dueDate).toLocaleString()}.`
        )
        .join('\n');

      return {
        reply: `### SLA Breach Escalation\n\nThere are **${overdueComplaints.length} overdue tickets** requiring immediate dispatch:\n\n${overdueList}\n\n**Corrective Action:**\n• Escalate vendor contract technicians.\n• Update ticket audit logs with reason for delay to maintain tenant transparency.`,
        actionType: 'SLA_REPORT',
        data: { overdueCount: overdueComplaints.length }
      };
    }

    if (
      cleanPrompt.includes('draft') ||
      cleanPrompt.includes('notice') ||
      cleanPrompt.includes('circular') ||
      cleanPrompt.includes('announcement')
    ) {
      return {
        reply: `### Proposed Resident Maintenance Circular Draft\n\n**Subject:** Notice: Preventative Facility Audit & Central Plumbing Riser Inspection\n\n**To:** Greenwood Heights Residents (Block A & B)\n\nDear Residents,\n\nAs part of our proactive infrastructure maintenance and defect-reduction strategy, our operations team will conduct an audit of the common utility shafts this coming **Wednesday between 11:00 AM and 2:00 PM**.\n\nWater supply will remain normal, but facility engineers may access service corridors. We appreciate your cooperation.\n\n*Greenwood Heights Facility Operations & Management Team*`,
        actionType: 'DRAFT_NOTICE',
        data: {
          title: 'Notice: Preventative Facility Audit & Central Riser Inspection',
          category: 'Maintenance'
        }
      };
    }

    // Default Overview & Executive Operations Briefing
    return {
      reply: `### Executive Facility Operations Copilot\n\n**Current Community Operations Pulse:**\n• **Active Work Orders:** ${kpi.activeComplaints} (${kpi.openComplaints} Open, ${kpi.inProgressComplaints} In Progress)\n• **SLA Adherence:** ${kpi.overdueComplaints > 0 ? `${kpi.overdueComplaints} Overdue Breaches` : '100% On-Track'}\n• **Resolution Velocity:** ${kpi.resolutionRate}% completed\n• **Critical Risk Clusters:** ${kpi.criticalRiskCount} critical units detected via dynamic exponential decay\n\n**Available Commands:**\n1. *"Analyze top high-risk units"*\n2. *"Show overdue SLA tickets"*\n3. *"Draft maintenance notice to residents"*\n4. *"Provide preventative inspection checklist"*`,
      actionType: 'GENERAL_SUMMARY',
      data: { kpi }
    };
  }
}

module.exports = new AssistantService();
