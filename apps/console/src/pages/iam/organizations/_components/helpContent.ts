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

export const navigationHelpContent: HelpContent = {
  title: "Help",
  subtitle: "Navigation guide",
  description:
    "This guide describes each section and page available in the navigation menu. Use the table of contents to jump to a specific section.",
  wide: true,
  sections: [
    {
      id: "context",
      title: "Context",
      content:
        "View and manage your organization's context information. This provides a centralized view of your organization's compliance posture, including key details about your business, infrastructure, and security environment that inform your compliance program.",
    },
    {
      id: "tasks",
      title: "Tasks",
      content:
        "Track and manage compliance tasks assigned to you or your team. Tasks represent actionable items that need to be completed as part of your compliance program, such as implementing controls, reviewing policies, or addressing audit findings.",
    },
    {
      id: "governance",
      title: "Governance",
      content:
        "The Governance section contains the core compliance management tools for frameworks, measures, risks, and findings.",
      subsections: [
        {
          title: "Frameworks",
          content:
            "Browse and manage compliance frameworks (e.g., SOC 2, ISO 27001, GDPR). Each framework contains a set of controls and requirements that your organization needs to satisfy.",
        },
        {
          title: "Measures",
          content:
            "Define and track the security controls and measures your organization has implemented. Measures map to framework requirements and demonstrate how you meet compliance obligations.",
        },
        {
          title: "Risks",
          content:
            "Identify, assess, and manage organizational risks. Each risk can be scored by likelihood and impact, assigned an owner, and linked to mitigating measures.",
        },
        {
          title: "Findings",
          content:
            "Track compliance findings from audits, monitoring, or internal reviews. Findings represent gaps or issues that need remediation to maintain compliance.",
        },
      ],
    },
    {
      id: "organization",
      title: "Organization",
      content:
        "Manage organizational resources including people, documents, assets, data inventories, third-party vendors, and signature workflows.",
      subsections: [
        {
          title: "People",
          content:
            "Manage team members, roles, and access within your organization. View employee details, assign compliance responsibilities, and manage onboarding/offboarding.",
        },
        {
          title: "Documents",
          content:
            "Create, manage, and track compliance documents such as policies, procedures, and evidence. Documents can be versioned, reviewed, and linked to framework controls.",
        },
        {
          title: "Assets",
          content:
            "Maintain an inventory of organizational assets including hardware, software, and cloud infrastructure. Asset tracking is essential for risk assessment and compliance audits.",
        },
        {
          title: "Data",
          content:
            "Catalog and manage data inventories. Track what data your organization collects, processes, and stores, including classification levels and retention policies.",
        },
        {
          title: "Third parties",
          content:
            "Track and assess third-party vendors and service providers. Manage vendor risk assessments, contracts, and compliance status for your supply chain.",
        },
        {
          title: "Signature and Approvals",
          content:
            "Review and sign documents requiring your approval. Track pending signatures and view completed approval workflows.",
        },
      ],
    },
    {
      id: "compliance",
      title: "Compliance",
      content:
        "Manage audits, regulatory obligations, and statements of applicability.",
      subsections: [
        {
          title: "Audits",
          content:
            "Plan and manage compliance audits. Create audit campaigns, track progress, assign evidence collection tasks, and generate audit reports.",
        },
        {
          title: "Obligations",
          content:
            "Track legal and regulatory obligations your organization must comply with. Map obligations to frameworks, controls, and responsible teams.",
        },
        {
          title: "Statements of Applicability",
          content:
            "Generate and manage Statements of Applicability (SoA) that document which controls are applicable to your organization and their implementation status.",
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      content:
        "Tools for managing data privacy compliance including processing activities, rights requests, and cookie consent.",
      subsections: [
        {
          title: "Processing Activities",
          content:
            "Document and manage records of processing activities (ROPA) as required by GDPR and other privacy regulations. Track data flows, legal bases, and retention periods.",
        },
        {
          title: "Rights Requests",
          content:
            "Handle data subject access requests (DSARs) and other privacy rights requests. Track request status, deadlines, and fulfillment workflows.",
        },
        {
          title: "Cookie Banners",
          content:
            "Configure and manage cookie consent banners for your web properties. Ensure compliance with ePrivacy and GDPR cookie consent requirements.",
        },
      ],
    },
    {
      id: "monitoring",
      title: "Monitoring",
      content:
        "Continuous monitoring tools for security posture and vulnerability management.",
      subsections: [
        {
          title: "Prowler",
          content:
            "View cloud security scan results from Prowler. Monitor your AWS, Azure, or GCP infrastructure for misconfigurations and security issues.",
        },
        {
          title: "Pentesting",
          content:
            "Manage penetration testing campaigns and track discovered vulnerabilities. Upload pentest reports and track remediation progress.",
        },
        {
          title: "Device Posture",
          content:
            "Monitor the security posture of employee devices. Track compliance with device management policies including encryption, OS updates, and endpoint protection.",
        },
      ],
    },
    {
      id: "access-reviews",
      title: "Access Reviews",
      content:
        "Conduct periodic access review campaigns to ensure employees have appropriate access levels. Create review campaigns, assign reviewers, and track certification of user access across systems.",
    },
    {
      id: "compliance-page",
      title: "Compliance Page",
      content:
        "Manage your public-facing trust center and compliance page. Showcase your organization's security certifications, compliance status, and policies to customers and prospects.",
    },
    {
      id: "settings",
      title: "Settings",
      content:
        "Configure organization-level settings including identity, authentication, integrations, and API access.",
      subsections: [
        {
          title: "General",
          content:
            "Manage basic organization settings such as name, logo, and contact information.",
        },
        {
          title: "SAML SSO",
          content:
            "Configure SAML-based Single Sign-On for your organization to enable centralized authentication through your identity provider.",
        },
        {
          title: "SCIM",
          content:
            "Set up SCIM provisioning to automatically sync user accounts from your identity provider, enabling automated onboarding and offboarding.",
        },
        {
          title: "Webhooks",
          content:
            "Configure webhook endpoints to receive real-time notifications about events in your organization, such as status changes and new findings.",
        },
        {
          title: "Audit Log",
          content:
            "Review a detailed log of all actions taken within your organization. The audit log provides accountability and traceability for compliance purposes.",
        },
        {
          title: "API Keys",
          content:
            "Create and manage personal API keys for programmatic access to the platform. Set expiration dates and revoke keys as needed.",
        },
      ],
    },
    {
      id: "mcp-integration",
      title: "MCP Integration",
      content:
        "SOC2Start exposes a Model Context Protocol (MCP) server with 272 tools that lets AI assistants interact with your compliance data. Connect Claude, Codex, or any MCP-compatible client to automate compliance workflows.",
      subsections: [
        {
          title: "Getting connected",
          content:
            "Install the SOC2Start CLI and run: soc2start auth login. Then run: soc2start ai mcp connect --format <client> (use claude-desktop, claude-code, or generic). Copy the output JSON into your AI client's MCP configuration.",
        },
        {
          title: "What you can do",
          content:
            "Query frameworks and controls, create and update risks, generate documents, manage third-party assessments, run access reviews, and more. All 272 tools are organized by domain: governance, risk management, organization, privacy, compliance, and monitoring.",
        },
      ],
    },
  ],
};
