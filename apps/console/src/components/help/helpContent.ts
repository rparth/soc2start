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

  prowler: {
    title: "Prowler Reports",
    subtitle: "Security monitoring",
    description:
      "Upload Prowler CSV scan reports to track your cloud security posture over time. Each report is parsed to extract pass/fail statistics by service and severity.",
    sections: [
      {
        title: "Uploading reports",
        content:
          "Upload semicolon-delimited CSV files exported from Prowler. The system parses each report to extract summary statistics including pass/fail counts broken down by AWS service and finding severity.",
      },
      {
        title: "Reviewing results",
        content:
          "Each uploaded report shows a summary tab with pass/fail breakdowns by severity and service, plus a raw data tab where you can search and paginate through individual findings.",
      },
    ],
  },

  pentesting: {
    title: "Pentesting Reports",
    subtitle: "Security monitoring",
    description:
      "Upload penetration testing reports to maintain a record of security assessments. Track findings over time and ensure remediation actions are completed.",
    sections: [
      {
        title: "Uploading reports",
        content:
          "Upload CSV reports from penetration testing engagements. Reports are stored securely and parsed to provide summary statistics.",
      },
      {
        title: "Tracking assessments",
        content:
          "Maintain a chronological record of all penetration tests. Review findings from each assessment to track your security posture improvements.",
      },
    ],
  },

  signaturesAndApprovals: {
    title: "Signature and Approvals",
    subtitle: "Document workflows",
    description:
      "Manage document signatures and approval workflows. This page shows documents that require your signature or approval, allowing you to track and complete pending requests.",
    sections: [
      {
        title: "Signatures",
        content:
          "View documents that require your digital signature. When a document owner requests your signature, it appears here. Sign documents to acknowledge policies, accept terms, or certify compliance artifacts. You can filter by state to see requested or already-signed documents.",
      },
      {
        title: "Approvals",
        content:
          "Review document versions awaiting your approval. As an approver, you can approve or reject a document version. Approval quorums determine how many approvals are needed before a document version is considered accepted.",
      },
      {
        title: "How it works",
        content:
          "Document owners create new versions and request signatures or set up approval quorums. When your signature or approval is requested, you receive a notification and the document appears in this section. Completed signatures and approvals serve as compliance evidence for audits.",
      },
    ],
  },

  userRoles: {
    title: "User Roles",
    subtitle: "Access control",
    description:
      "SOC2Start uses role-based access control with five distinct roles. Each role determines what a user can see and do within the organization. Roles are assigned when inviting users or through SCIM/SAML provisioning.",
    wide: true,
    sections: [
      {
        title: "Owner",
        content:
          "Full administrative control over the organization. Owners can manage all compliance data, configure SSO (SAML) and SCIM provisioning, delete the organization, promote other users to Owner, and remove members. There must always be at least one Owner.",
        subsections: [
          {
            title: "Unique capabilities",
            content:
              "Only Owners can: delete the organization, configure SAML SSO, set up SCIM provisioning, promote users to Owner role, remove members from the organization, and delete SCIM-sourced memberships.",
          },
        ],
      },
      {
        title: "Admin",
        content:
          "Full access to all compliance data (frameworks, controls, measures, risks, documents, audits, and more). Admins can manage team members, send invitations, and update the organization. They can view SAML and SCIM configurations but cannot modify them.",
        subsections: [
          {
            title: "Limitations",
            content:
              "Admins cannot: delete the organization, configure SAML SSO, manage SCIM provisioning, promote users to Owner, or remove members from the organization.",
          },
        ],
      },
      {
        title: "Viewer",
        content:
          "Read-only access to all compliance data across the organization. Viewers can browse frameworks, controls, measures, risks, documents, audits, findings, assets, data classifications, processing activities, monitoring reports, and the trust center. They can also sign and approve documents.",
        subsections: [
          {
            title: "Limitations",
            content:
              "Viewers cannot: create, update, or delete any compliance entities. They have read-only access to all data but cannot make changes to frameworks, controls, measures, or other resources.",
          },
        ],
      },
      {
        title: "Auditor",
        content:
          "Read-only access to compliance data needed for auditing. Auditors can view frameworks, controls, measures, risks, documents, audits, findings, risk assessments, and monitoring reports. They can sign documents and export PDFs for evidence collection.",
        subsections: [
          {
            title: "Differences from Viewer",
            content:
              "Auditors have similar read access to Viewers but without access to internal organizational features like the trust center, webhooks, access reviews, cookie banners, rights requests, or connector configurations.",
          },
        ],
      },
      {
        title: "Employee",
        content:
          "Limited access focused on document workflows. Employees can view and sign documents assigned to them, approve or reject document versions, and view their device posture status. This role is typically assigned to non-compliance team members who only need to acknowledge policies.",
        subsections: [
          {
            title: "Limitations",
            content:
              "Employees cannot: view compliance frameworks, controls, measures, risks, audits, third parties, or other compliance management features. Their access is restricted to documents shared with them and their own device information.",
          },
        ],
      },
    ],
  },

  mcpSupport: {
    title: "MCP Support",
    subtitle: "AI integration",
    description:
      "SOC2Start exposes a Model Context Protocol (MCP) server that lets AI assistants like Claude, Codex, and other MCP-compatible clients interact with your compliance data programmatically. Connect your AI tools to query frameworks, manage risks, create documents, and automate compliance workflows.",
    wide: true,
    sections: [
      {
        title: "What is MCP",
        content:
          "The Model Context Protocol is an open standard that lets AI assistants connect to external tools and data sources. SOC2Start's MCP server exposes 272 tools covering every area of the platform, from frameworks and controls to risk assessments and document management.",
      },
      {
        title: "Generating connection config",
        content:
          "Use the CLI command to generate connection configuration for your AI client. Run: soc2start ai mcp connect --format <format>. Supported formats are claude-desktop (for Claude Desktop app), claude-code (for Claude Code CLI), generic (for other MCP clients), url (endpoint URL only), and all (all formats at once).",
      },
      {
        title: "Connecting Claude Desktop",
        content:
          "Run: soc2start ai mcp connect --format claude-desktop. Copy the output JSON into your Claude Desktop configuration file (Settings > Developer > MCP Servers). Restart Claude Desktop to activate the connection.",
      },
      {
        title: "Connecting Claude Code",
        content:
          "Run: soc2start ai mcp connect --format claude-code. Copy the output JSON into your Claude Code MCP settings file (.claude/mcp.json or the project-level equivalent). The connection will be available in your next Claude Code session.",
      },
      {
        title: "Available tool categories",
        content:
          "The MCP server provides tools organized by domain. Each category includes list, get, create, update, and delete operations where applicable.",
        subsections: [
          {
            title: "Governance",
            content:
              "Frameworks, controls, measures, findings, and statements of applicability. Import compliance frameworks, link controls to measures, track implementation progress, and manage compliance gaps.",
          },
          {
            title: "Risk management",
            content:
              "Risks, risk assessments, risk assessment nodes, processes, scenarios, scopes, and threats. Create structured risk assessments, model threat scenarios, and link risks to mitigating measures.",
          },
          {
            title: "Organization",
            content:
              "Users, assets, data classification, documents (with versioning, approvals, and digital signatures), tasks, and third parties (with contacts, services, and risk assessments).",
          },
          {
            title: "Privacy",
            content:
              "Processing activities, rights requests, data protection impact assessments, transfer impact assessments, cookie banners (with categories, consent records, translations, and tracker management).",
          },
          {
            title: "Compliance",
            content:
              "Audits, obligations, audit log entries, compliance external URLs, access reviews (campaigns, sources, entries, and decisions), and trust center management (references, files, and custom domains).",
          },
          {
            title: "Monitoring",
            content:
              "Webhook subscriptions and events, SCIM configuration and events, and organization context management.",
          },
        ],
      },
      {
        title: "Authentication",
        content:
          "MCP connections authenticate using your API token. The CLI command automatically uses the token from your active login session. If you haven't logged in yet, run: soc2start auth login.",
      },
    ],
  },
};
