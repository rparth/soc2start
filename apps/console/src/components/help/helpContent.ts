// Copyright (c) 2026 Probo Inc <hello@getprobo.com>.
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

import type { HelpContent } from "@probo/ui";

export const helpContent: Record<string, HelpContent> = {
  frameworks: {
    title: "Frameworks",
    subtitle: "Governance",
    description:
      "Frameworks are compliance standards your organization follows, such as SOC 2, ISO 27001, HIPAA, or GDPR. Each framework contains a set of controls that define specific requirements you need to meet.",
    sections: [
      {
        title: "Getting started",
        content:
          "Import a built-in framework to get started quickly, or create a custom framework tailored to your organization's needs. Each framework organizes its requirements into controls grouped by sections.",
      },
      {
        title: "How frameworks connect",
        content:
          "Frameworks contain controls. Controls are implemented by measures. A single measure can satisfy controls across multiple frameworks, so implementing multi-factor authentication once can cover requirements in both SOC 2 and ISO 27001.",
      },
    ],
  },

  controls: {
    title: "Controls",
    subtitle: "Framework requirements",
    description:
      "Controls are specific requirements within a framework that your organization needs to achieve. Examples include access controls, encryption requirements, and incident response procedures.",
    sections: [
      {
        title: "Controls and measures",
        content:
          "Each control is satisfied by one or more measures. Link existing measures to a control or create new ones directly. Progress is tracked automatically based on the implementation state of linked measures.",
      },
      {
        title: "Evidence",
        content:
          "Controls require evidence to demonstrate compliance during audits. Evidence is collected through the measures linked to each control and can be gathered manually or automatically.",
      },
    ],
  },

  measures: {
    title: "Measures",
    subtitle: "Compliance actions",
    description:
      "Measures are the actions and processes your organization implements to satisfy controls. A single measure can address multiple controls across different frameworks.",
    sections: [
      {
        title: "Cross-framework coverage",
        content:
          "Measures can be linked to controls from multiple frameworks. For example, an MFA implementation measure might satisfy access control requirements in SOC 2, ISO 27001, and HIPAA simultaneously.",
      },
      {
        title: "Implementation tracking",
        content:
          "Track the implementation state of each measure from not started through to fully implemented. Attach evidence, assign owners, and link related risks to maintain a complete compliance picture.",
      },
    ],
  },

  risks: {
    title: "Risks",
    subtitle: "Risk management",
    description:
      "Risks are identified security and compliance threats that your organization needs to assess and mitigate. Each risk is evaluated for likelihood and impact, and linked to measures that reduce or eliminate the threat.",
    sections: [
      {
        title: "Risk assessment",
        content:
          "Assess each risk by evaluating its likelihood of occurrence and potential impact. The combination produces a risk score that helps prioritize mitigation efforts.",
      },
      {
        title: "Mitigation",
        content:
          "Link measures to risks to track how each threat is being mitigated. As measures are implemented, the residual risk decreases, giving you a clear view of your security posture.",
      },
    ],
  },

  thirdParties: {
    title: "Third Parties",
    subtitle: "Vendor management",
    description:
      "Third parties are the service providers, vendors, and suppliers your organization relies on. Managing third-party risk requires tracking contracts, conducting risk assessments, and ensuring compliance with your security requirements.",
    sections: [
      {
        title: "Vendor assessments",
        content:
          "Evaluate each third party's security posture and compliance certifications. Track contract terms, data processing agreements, and review schedules to maintain oversight.",
      },
      {
        title: "Risk tracking",
        content:
          "Link third parties to relevant risks and measures. Monitor their compliance status and set up review cycles to ensure ongoing adherence to your security standards.",
      },
    ],
  },

  assets: {
    title: "Assets",
    subtitle: "Asset inventory",
    description:
      "Assets are the systems, applications, databases, and infrastructure that your organization uses. Maintaining a comprehensive asset inventory is fundamental to compliance and security management.",
    sections: [
      {
        title: "Asset management",
        content:
          "Catalog your critical assets and link them to applicable controls and risks. Understanding which assets support which business processes helps prioritize security investments.",
      },
      {
        title: "Classification",
        content:
          "Classify assets by sensitivity and criticality. This determines the level of protection required and helps ensure appropriate security controls are in place.",
      },
    ],
  },

  audits: {
    title: "Audits",
    subtitle: "Compliance verification",
    description:
      "Audits are formal evaluations of your compliance posture. They involve preparing evidence, demonstrating control effectiveness, and tracking any findings that arise during the assessment.",
    sections: [
      {
        title: "Audit preparation",
        content:
          "Prepare for audits by reviewing control effectiveness and gathering required evidence. Use snapshots to capture your compliance posture at a specific point in time.",
      },
      {
        title: "Findings management",
        content:
          "Track findings identified during audits, classify their severity, and implement corrective actions. Link findings to specific controls and measures for traceability.",
      },
    ],
  },

  documents: {
    title: "Documents",
    subtitle: "Policies and procedures",
    description:
      "Documents are the compliance policies, procedures, and records your organization maintains. Version control and digital signatures ensure document integrity and accountability.",
    sections: [
      {
        title: "Version control",
        content:
          "Track document revisions with full version history. Each version is preserved, providing a complete audit trail of policy changes over time.",
      },
      {
        title: "Digital signatures",
        content:
          "Require digital signatures for policy acknowledgment. Track who has signed each document and send reminders for outstanding signatures.",
      },
    ],
  },

  findings: {
    title: "Findings",
    subtitle: "Gaps and issues",
    description:
      "Findings are identified gaps or failures in your compliance controls. They include nonconformities, observations, opportunities for improvement, and exceptions that require attention.",
    sections: [
      {
        title: "Classification",
        content:
          "Classify findings by type and severity. Nonconformities require immediate corrective action, while observations and opportunities for improvement can be addressed in planned cycles.",
      },
      {
        title: "Root cause analysis",
        content:
          "Document the root cause of each finding and define corrective actions. Link findings to specific controls and track remediation progress to prevent recurrence.",
      },
    ],
  },

  obligations: {
    title: "Obligations",
    subtitle: "Legal requirements",
    description:
      "Obligations are legal and regulatory requirements tracked separately from framework controls. They capture jurisdiction-specific needs, contractual commitments, and industry-specific regulations.",
    sections: [
      {
        title: "Tracking obligations",
        content:
          "Catalog your legal obligations by jurisdiction and regulation. Link each obligation to the measures and controls that ensure compliance.",
      },
      {
        title: "Compliance monitoring",
        content:
          "Monitor obligation status and set review schedules to ensure ongoing compliance as regulations evolve. Track changes in requirements across different jurisdictions.",
      },
    ],
  },

  data: {
    title: "Data",
    subtitle: "Data classification",
    description:
      "Data classification organizes your data by sensitivity level, determining appropriate handling, storage, and protection protocols for each category.",
    sections: [
      {
        title: "Classification levels",
        content:
          "Define sensitivity levels such as public, internal, confidential, and restricted. Each level carries specific handling requirements that guide how data should be stored, transmitted, and accessed.",
      },
      {
        title: "Data protection",
        content:
          "Link data classifications to controls and measures that enforce appropriate protection. Ensure that sensitive data receives the security controls mandated by your compliance frameworks.",
      },
    ],
  },

  processingActivities: {
    title: "Processing Activities",
    subtitle: "Privacy compliance",
    description:
      "Processing activities are GDPR-mandated records documenting what personal data your organization processes, the legal basis for processing, retention periods, and the categories of data subjects involved.",
    sections: [
      {
        title: "Records of processing",
        content:
          "Maintain detailed records of each processing activity including the purpose, legal basis, data categories, recipients, and retention periods as required by GDPR Article 30.",
      },
      {
        title: "Data subject rights",
        content:
          "Link processing activities to the rights available to data subjects. Ensure your organization can fulfill access, rectification, erasure, and portability requests for each activity.",
      },
    ],
  },

  statementsOfApplicability: {
    title: "Statements of Applicability",
    subtitle: "ISO 27001",
    description:
      "Statements of Applicability are an ISO 27001 tracking mechanism that documents which Annex A controls apply to your organization, their implementation status, and the justification for inclusion or exclusion.",
    sections: [
      {
        title: "Control applicability",
        content:
          "Review each Annex A control and determine whether it applies to your organization's context. Document the justification for excluding any controls.",
      },
      {
        title: "Implementation status",
        content:
          "Track the implementation status of each applicable control. Link to your measures and evidence to demonstrate compliance during certification audits.",
      },
    ],
  },

  tasks: {
    title: "Tasks",
    subtitle: "Work management",
    description:
      "Tasks are work assignments that track control implementation, vendor reviews, assessments, and remediation efforts. They help coordinate compliance activities across your team.",
    sections: [
      {
        title: "Task management",
        content:
          "Create and assign tasks for compliance activities. Set due dates, priorities, and link tasks to the controls, measures, or findings they address.",
      },
      {
        title: "Progress tracking",
        content:
          "Monitor task completion across your team. Track overdue items and ensure that compliance deadlines are met.",
      },
    ],
  },

  accessReviews: {
    title: "Access Reviews",
    subtitle: "Identity governance",
    description:
      "Access reviews verify that user access to systems and applications remains appropriate. Regular reviews help detect unauthorized access and ensure compliance with the principle of least privilege.",
    sections: [
      {
        title: "Review process",
        content:
          "Connect your identity providers and applications to automatically pull user access data. Review each user's access and approve, revoke, or flag for further investigation.",
      },
      {
        title: "Compliance evidence",
        content:
          "Completed access reviews serve as evidence for SOC 2, ISO 27001, and other frameworks that require periodic access certification.",
      },
    ],
  },

  riskAssessments: {
    title: "Risk Assessments",
    subtitle: "Risk evaluation",
    description:
      "Risk assessments are structured evaluations that identify, analyze, and prioritize risks to your organization. They provide a systematic approach to understanding your threat landscape.",
    sections: [
      {
        title: "Assessment process",
        content:
          "Identify potential threats and vulnerabilities, assess their likelihood and impact, and determine appropriate risk treatment strategies: mitigate, accept, transfer, or avoid.",
      },
      {
        title: "Continuous improvement",
        content:
          "Schedule regular risk assessments to capture new threats and evaluate the effectiveness of existing controls. Track changes in your risk profile over time.",
      },
    ],
  },

  compliancePage: {
    title: "Compliance Page",
    subtitle: "Public trust center",
    description:
      "Your compliance page is a public-facing trust center that showcases your organization's security posture. Share frameworks, audit reports, and documentation with customers and prospects.",
    sections: [
      {
        title: "Branding",
        content:
          "Customize your compliance page with your organization's logo, colors, and branding. Upload light and dark mode logos for a polished appearance.",
      },
      {
        title: "Content management",
        content:
          "Choose which frameworks, audits, and documents to display publicly. Control visibility at a granular level to share only what's appropriate for external audiences.",
      },
    ],
  },

  rightsRequests: {
    title: "Rights Requests",
    subtitle: "Data subject rights",
    description:
      "Rights requests track and manage data subject access requests (DSARs) and other privacy rights under GDPR and similar regulations. Ensure timely responses within regulatory deadlines.",
    sections: [
      {
        title: "Request management",
        content:
          "Log incoming rights requests, verify the requester's identity, and track the response workflow. Ensure each request is fulfilled within the required timeframe.",
      },
      {
        title: "Compliance tracking",
        content:
          "Maintain a complete audit trail of all rights requests and responses. This documentation serves as evidence of your organization's compliance with privacy regulations.",
      },
    ],
  },
};
