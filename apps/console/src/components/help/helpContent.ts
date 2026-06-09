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
          "Click the Add Framework button to import a built-in framework like SOC 2 Type II or ISO 27001. Once imported, you will see the framework's controls organized by sections. Open any control to see its requirements and start linking measures to it.",
      },
      {
        title: "How frameworks connect",
        content:
          "Frameworks contain controls. Controls are implemented by measures. For example, if you implement an MFA measure, you can link it to the SOC 2 CC6.1 access control and the ISO 27001 A.8.5 authentication control simultaneously. This way, one action covers requirements across multiple frameworks.",
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
          "Open a control to see its details and linked measures. Click Link Measure to connect an existing measure, or create a new one directly from the control page. The control's progress bar updates automatically as linked measures move through implementation states (not started, in progress, implemented).",
      },
      {
        title: "Evidence",
        content:
          "During an audit, auditors review the evidence attached to each control's measures. To add evidence, go to a linked measure, click Add Evidence, and upload screenshots, exports, or documents that prove the control is operating effectively.",
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
          "When creating a measure (for example, \"Enable MFA for all employees\"), link it to every control it satisfies across your frameworks. Open the measure, go to the Controls tab, and click Link Control. You might link it to SOC 2 CC6.1, ISO 27001 A.8.5, and HIPAA 164.312(d) in a single measure.",
      },
      {
        title: "Implementation tracking",
        content:
          "Update each measure's status as you progress: Not Started, In Progress, or Implemented. Assign an owner responsible for the measure, attach evidence (screenshots, configuration exports, policy documents), and link any related risks that this measure mitigates.",
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
          "Click Add Risk to create a new risk entry. Set the likelihood (rare, unlikely, possible, likely, almost certain) and impact (negligible, minor, moderate, major, severe). The system calculates a risk score automatically. For example, a \"Data breach via unencrypted backup\" risk with likely likelihood and major impact would score as critical.",
      },
      {
        title: "Mitigation",
        content:
          "Open a risk and click Link Measure to connect mitigating actions. For example, link an \"Encrypt all backups at rest\" measure to your data breach risk. As you implement the measure, the risk's mitigation status updates to show progress toward reducing the threat.",
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
          "Click Add Third Party to register a new vendor. Fill in the vendor's name, legal entity, and category. Then add contacts (your account manager, their security team), services they provide, and upload their compliance reports (SOC 2 report, ISO certificate). Conduct a risk assessment to evaluate their security posture.",
      },
      {
        title: "Risk tracking",
        content:
          "For each third party, add a risk assessment scoring their data handling, security practices, and business continuity. Link the vendor to risks in your risk register (for example, \"Vendor data breach\" risk) and to measures that mitigate those risks (such as requiring encryption in their DPA).",
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
          "Click Add Asset to register a system, application, or infrastructure component. For example, add your production database with its type, owner, and hosting location. You can then link assets to controls that protect them and risks that threaten them, giving auditors a clear view of what is protected and how.",
      },
      {
        title: "Classification",
        content:
          "Set each asset's criticality level (critical, high, medium, low) and data sensitivity classification. A production database holding customer PII would be critical/confidential, while a marketing analytics dashboard might be low/internal. These classifications help prioritize which assets get the strongest protections.",
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
          "Click Add Audit to create a new audit campaign. Select the framework being audited (for example, SOC 2 Type II), set the audit period, and assign a lead. Before the audit begins, review each control in the framework to ensure measures are implemented and evidence is attached. Download the audit report when ready to share with your auditor.",
      },
      {
        title: "Findings management",
        content:
          "When an auditor identifies a gap, click Add Finding and classify it: Nonconformity (must fix immediately), Observation (should address in next cycle), or Opportunity for Improvement (nice to have). Link the finding to the specific control, document the root cause, and create a task to track remediation.",
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
          "Click Add Document and choose a template (Information Security Policy, Acceptable Use Policy, etc.) or start blank. Edit the content in the built-in editor, then click Publish to create a new version. Previous versions are preserved automatically, so you can always compare changes or revert.",
      },
      {
        title: "Digital signatures",
        content:
          "After publishing a document version, go to the Signatures tab and click Request Signature to select team members who need to acknowledge the policy. Track who has signed and who hasn't. Click Send Signing Notifications to remind outstanding signers via email.",
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
          "When adding a finding, choose its type: Nonconformity (a control that failed; for example, \"MFA not enforced for admin accounts\"), Observation (a weakness that hasn't caused failure yet), Opportunity for Improvement (a suggestion), or Exception (a documented deviation). Nonconformities require immediate corrective action before the next audit cycle.",
      },
      {
        title: "Root cause analysis",
        content:
          "Open a finding and document why it occurred (for example, \"MFA was not required in the SSO configuration for admin roles\"). Define the corrective action (\"Update SSO policy to require MFA for all roles\"), link the finding to the affected control, and create a remediation task with a due date. Track progress until the finding is resolved.",
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
          "Click Add Task to create a new work item. Give it a clear title (for example, \"Review and update password policy\"), set a due date, choose a priority, and assign it to a team member. Link the task to the measure or finding it addresses so progress is tracked in context.",
      },
      {
        title: "Progress tracking",
        content:
          "Use the task list to filter by assignee, status, or due date. Overdue tasks are highlighted. When a task is complete, mark it as done. The linked measure or finding updates to reflect the completed work.",
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
          "First, add access sources (your identity provider, GitHub, AWS IAM, etc.) under Settings. Then create a review campaign: give it a name, select the scope (which access sources to review), and assign reviewers. Once started, reviewers see each user's access entries and can approve, revoke, or flag them for investigation.",
      },
      {
        title: "Compliance evidence",
        content:
          "Completed access reviews are automatically recorded with timestamps, reviewer decisions, and any notes. This serves as audit evidence for SOC 2 CC6.2/CC6.3 (logical access controls), ISO 27001 A.9.2.5 (review of user access rights), and similar requirements across other frameworks.",
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
          "Go to the Branding tab to upload your organization's logo (both light and dark mode variants). Set your brand colors and customize the page title. The preview updates in real time so you can see how it will look to visitors.",
      },
      {
        title: "Content management",
        content:
          "Use the Frameworks tab to choose which frameworks to display (for example, show SOC 2 Type II but hide an in-progress ISO 27001). Add external references (links to your security page, SOC 2 report download) and upload files (PDF audit reports, certifications) that visitors can access. Set frameworks to Public or Private visibility individually.",
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
          "When you receive a data subject request (for example, \"Please delete my account data\"), click Add Rights Request. Select the request type (access, rectification, erasure, portability, restriction, or objection), enter the requester's details, and set the deadline (GDPR requires response within 30 days). Update the status as you process it.",
      },
      {
        title: "Compliance tracking",
        content:
          "Each rights request maintains a timestamped log of actions taken, the final response, and any supporting documents. This audit trail proves to regulators that your organization handles privacy requests within mandated timeframes. Filter requests by status to find any approaching their deadline.",
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
          "Run Prowler against your AWS account (prowler aws --output-formats csv), then click Upload Report and select the generated CSV file. The system parses the semicolon-delimited output and extracts pass/fail statistics by AWS service (IAM, S3, EC2, etc.) and finding severity (critical, high, medium, low, informational).",
      },
      {
        title: "Reviewing results",
        content:
          "Click any uploaded report to see two tabs. The Summary tab shows a visual breakdown of pass/fail counts by severity and service. The Raw Data tab lets you search, sort, and paginate through individual findings. Use the column selector to show or hide specific fields. Save column preferences for your next visit.",
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

  devicePosture: {
    title: "Device Posture",
    subtitle: "Endpoint monitoring",
    description:
      "Monitor the security posture of enrolled devices across your organization. The soc2start-agent runs on employee machines and reports encryption status, OS version, firewall state, and other security indicators.",
    sections: [
      {
        title: "Enrolling devices",
        content:
          "Click Enroll Device to generate a one-time enrollment token. Install the soc2start-agent on the target machine, then run: soc2start-agent enroll --token <token>. The agent registers the device and begins reporting posture data. If a device is re-enrolled (same hardware UUID), the existing record is updated rather than duplicated.",
      },
      {
        title: "Reviewing posture",
        content:
          "Each enrolled device shows its hostname, OS, last seen timestamp, and overall posture status. Click a device to see detailed posture checks: disk encryption enabled, firewall active, OS up to date, screen lock configured, and antivirus running. Devices that fail checks are flagged for remediation.",
      },
      {
        title: "Compliance evidence",
        content:
          "Device posture data serves as evidence for SOC 2 CC6.7 (endpoint protection) and ISO 27001 A.8.1 (user endpoint devices). Auditors can verify that employee devices meet your security baseline by reviewing posture reports.",
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
        title: "MCP endpoint URL",
        content:
          "The MCP server endpoint is at /mcp/v1 relative to your instance's base URL. For example, if your SOC2Start instance is at https://app.soc2start.io, the MCP endpoint is https://app.soc2start.io/mcp/v1. You can retrieve just the URL by running: soc2start ai mcp connect --format url.",
      },
      {
        title: "Generating an API token",
        content:
          "MCP connections require an API token for authentication. To generate one: go to your profile menu (top right), select Settings, then API Keys. Click Create API Key, give it a name (for example, \"Claude MCP\"), set an expiration date, and copy the generated token. You can also use the CLI: run soc2start auth login to authenticate, and the CLI will store your token automatically.",
      },
      {
        title: "Generating connection config",
        content:
          "Use the CLI command to generate connection configuration for your AI client. Run: soc2start ai mcp connect --format <format>. Supported formats are claude-desktop (for Claude Desktop app), claude-code (for Claude Code CLI), generic (for other MCP clients), url (endpoint URL only), and all (all formats at once). The output includes your endpoint URL and API token ready to paste.",
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
          "MCP connections authenticate using your API token sent as a Bearer token in the Authorization header. The CLI command soc2start ai mcp connect automatically embeds the token from your active login session into the generated config. Alternatively, create a dedicated API key in Settings > API Keys and use it in your MCP client configuration.",
      },
    ],
  },
};
