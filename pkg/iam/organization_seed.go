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

package iam

import (
	"context"
	"fmt"
	"time"

	"go.gearno.de/kit/pg"
	"go.probo.inc/probo/pkg/coredata"
	"go.probo.inc/probo/pkg/gid"
	"go.probo.inc/probo/pkg/slug"
)

type seedControl struct {
	Section     string
	Name        string
	Description string
}

type seedFramework struct {
	Name        string
	Description string
	Controls    []seedControl
}

type seedRisk struct {
	Name                string
	Category            string
	Treatment           coredata.RiskTreatment
	InherentLikelihood  int
	InherentImpact      int
}

type seedThirdParty struct {
	Name        string
	Description string
	Category    coredata.ThirdPartyCategory
}

type seedMeasure struct {
	Name     string
	Category string
}

var seedFrameworks = []seedFramework{
	{
		Name:        "ISO 27001:2022",
		Description: "International standard for information security management systems",
		Controls: []seedControl{
			{"A.5.1", "Policies for information security", "Management direction for information security shall be established"},
			{"A.5.2", "Information security roles and responsibilities", "Information security roles and responsibilities shall be defined and allocated"},
			{"A.5.3", "Segregation of duties", "Conflicting duties and areas of responsibility shall be segregated"},
			{"A.5.10", "Acceptable use of information", "Rules for the acceptable use of information shall be identified and documented"},
			{"A.5.23", "Information security for cloud services", "Processes for acquisition, use, management and exit from cloud services shall be established"},
			{"A.5.34", "Privacy and protection of PII", "The organization shall identify and meet requirements regarding privacy and protection of PII"},
			{"A.6.1", "Screening", "Background verification checks on all candidates for employment shall be carried out"},
			{"A.6.2", "Terms and conditions of employment", "Employment contractual agreements shall state personnel and organization responsibilities for information security"},
			{"A.6.3", "Information security awareness training", "Personnel and relevant interested parties shall receive appropriate information security awareness education and training"},
			{"A.7.1", "Physical security perimeters", "Security perimeters shall be defined and used to protect areas that contain information and information processing facilities"},
			{"A.7.2", "Physical entry", "Secure areas shall be protected by appropriate entry controls and access points"},
			{"A.8.1", "User endpoint devices", "Information stored on, processed by or accessible via user endpoint devices shall be protected"},
			{"A.8.2", "Privileged access rights", "The allocation and use of privileged access rights shall be restricted and managed"},
			{"A.8.3", "Information access restriction", "Access to information and other associated assets shall be restricted"},
			{"A.8.5", "Secure authentication", "Secure authentication technologies and procedures shall be established and implemented"},
			{"A.8.9", "Configuration management", "Configurations, including security configurations, of hardware, software, services and networks shall be established and managed"},
			{"A.8.15", "Logging", "Logs that record activities, exceptions, faults and other relevant events shall be produced and stored"},
			{"A.8.16", "Monitoring activities", "Networks, systems and applications shall be monitored for anomalous behavior"},
		},
	},
	{
		Name:        "SOC 2",
		Description: "Service Organization Control 2 trust services criteria",
		Controls: []seedControl{
			{"CC1.1", "Integrity and Ethical Values", "The entity demonstrates a commitment to integrity and ethical values"},
			{"CC1.2", "Board Independence", "The board of directors demonstrates independence from management"},
			{"CC1.3", "Management Structure", "Management establishes structures, reporting lines, and authorities"},
			{"CC2.1", "Internal Communication", "The entity obtains or generates and uses relevant information to support internal control"},
			{"CC3.1", "Objective Specification", "The entity specifies objectives with sufficient clarity"},
			{"CC3.2", "Risk Identification", "The entity identifies risks to the achievement of its objectives"},
			{"CC3.3", "Fraud Risk Assessment", "The entity considers the potential for fraud in assessing risks"},
			{"CC4.1", "Monitoring Activities", "The entity selects, develops, and performs ongoing evaluations"},
			{"CC5.1", "Control Selection", "The entity selects and develops control activities that mitigate risks"},
			{"CC5.2", "Technology General Controls", "The entity selects and develops general control activities over technology"},
			{"CC6.1", "Logical and Physical Access", "The entity implements logical access security over protected assets"},
			{"CC6.2", "User Registration and Authorization", "The entity registers and authorizes new internal and external users"},
			{"CC6.3", "Role-Based Access", "The entity authorizes access based on authorization credentials and role"},
			{"CC7.1", "Infrastructure and Software Monitoring", "The entity uses detection and monitoring procedures to identify changes to configurations"},
			{"CC7.2", "Change Management", "The entity monitors system components for anomalies indicative of malicious acts"},
		},
	},
	{
		Name:        "GDPR",
		Description: "General Data Protection Regulation",
		Controls: []seedControl{
			{"Art.5", "Principles relating to processing", "Personal data shall be processed lawfully, fairly and in a transparent manner"},
			{"Art.6", "Lawfulness of processing", "Processing shall be lawful only if at least one legal basis applies"},
			{"Art.7", "Conditions for consent", "Where processing is based on consent, the controller shall be able to demonstrate consent"},
			{"Art.13", "Information to be provided", "Information to be provided where personal data are collected from the data subject"},
			{"Art.15", "Right of access", "The data subject shall have the right to obtain confirmation of processing"},
			{"Art.17", "Right to erasure", "The data subject shall have the right to obtain erasure of personal data"},
			{"Art.25", "Data protection by design", "The controller shall implement appropriate technical and organizational measures"},
			{"Art.30", "Records of processing activities", "Each controller shall maintain a record of processing activities"},
			{"Art.32", "Security of processing", "The controller shall implement appropriate technical and organizational measures to ensure security"},
			{"Art.33", "Notification of personal data breach", "The controller shall notify the supervisory authority within 72 hours"},
		},
	},
}

var seedRisks = []seedRisk{
	// Security
	{"Unauthorized access to production systems", "SECURITY", coredata.RiskTreatmentMitigated, 4, 5},
	{"Sensitive data exfiltration by insider threat", "SECURITY", coredata.RiskTreatmentMitigated, 2, 5},
	{"Phishing campaign targeting employees", "SECURITY", coredata.RiskTreatmentMitigated, 4, 3},
	{"Ransomware via supply chain compromise", "SECURITY", coredata.RiskTreatmentMitigated, 2, 5},
	{"Credential stuffing on customer login portal", "SECURITY", coredata.RiskTreatmentMitigated, 3, 4},
	{"Stolen developer laptop with source code", "SECURITY", coredata.RiskTreatmentMitigated, 3, 3},
	{"API key leaked in public repository", "SECURITY", coredata.RiskTreatmentMitigated, 3, 4},
	{"Social engineering of support staff", "SECURITY", coredata.RiskTreatmentMitigated, 3, 3},
	{"Brute force attack on admin panel", "SECURITY", coredata.RiskTreatmentMitigated, 2, 4},
	{"Man-in-the-middle attack on internal network", "SECURITY", coredata.RiskTreatmentMitigated, 1, 4},
	{"Malicious browser extension on corporate devices", "SECURITY", coredata.RiskTreatmentMitigated, 2, 3},
	{"Unauthorized physical access to server room", "SECURITY", coredata.RiskTreatmentMitigated, 1, 5},

	// Operational
	{"Third-party SaaS data breach", "OPERATIONAL", coredata.RiskTreatmentTransferred, 3, 4},
	{"Cloud region outage causing service disruption", "OPERATIONAL", coredata.RiskTreatmentAccepted, 2, 4},
	{"Database corruption from failed migration", "OPERATIONAL", coredata.RiskTreatmentMitigated, 2, 5},
	{"Loss of key personnel with critical knowledge", "OPERATIONAL", coredata.RiskTreatmentMitigated, 3, 3},
	{"Backup restoration failure during disaster recovery", "OPERATIONAL", coredata.RiskTreatmentMitigated, 2, 5},
	{"DNS hijacking of company domain", "OPERATIONAL", coredata.RiskTreatmentMitigated, 1, 5},
	{"CDN provider outage affecting content delivery", "OPERATIONAL", coredata.RiskTreatmentAccepted, 2, 3},
	{"Email service compromise leaking internal comms", "OPERATIONAL", coredata.RiskTreatmentMitigated, 2, 4},

	// Compliance
	{"Non-compliance with GDPR data subject rights", "COMPLIANCE", coredata.RiskTreatmentMitigated, 2, 4},
	{"Failure to meet SOC 2 audit requirements", "COMPLIANCE", coredata.RiskTreatmentMitigated, 2, 4},
	{"Breach notification deadline missed", "COMPLIANCE", coredata.RiskTreatmentMitigated, 1, 5},
	{"Inadequate data processing agreements with third parties", "COMPLIANCE", coredata.RiskTreatmentMitigated, 3, 3},
	{"Employee data retained beyond legal period", "COMPLIANCE", coredata.RiskTreatmentMitigated, 2, 3},
	{"Cross-border data transfer without safeguards", "COMPLIANCE", coredata.RiskTreatmentMitigated, 2, 4},
	{"Cookie consent mechanism non-compliant", "COMPLIANCE", coredata.RiskTreatmentMitigated, 3, 2},
	{"Incomplete records of processing activities", "COMPLIANCE", coredata.RiskTreatmentMitigated, 3, 3},

	// Technical
	{"Cloud infrastructure misconfiguration exposing data", "TECHNICAL", coredata.RiskTreatmentMitigated, 3, 4},
	{"Loss of encryption keys for production database", "TECHNICAL", coredata.RiskTreatmentMitigated, 1, 5},
	{"Denial of service attack on customer-facing APIs", "TECHNICAL", coredata.RiskTreatmentMitigated, 3, 3},
	{"TLS certificate expiration causing service outage", "TECHNICAL", coredata.RiskTreatmentMitigated, 2, 3},
	{"Container escape vulnerability in production cluster", "TECHNICAL", coredata.RiskTreatmentMitigated, 1, 5},
	{"Dependency with known CVE deployed to production", "TECHNICAL", coredata.RiskTreatmentMitigated, 3, 4},
	{"Logging pipeline failure hiding security incidents", "TECHNICAL", coredata.RiskTreatmentMitigated, 2, 4},
}

var seedThirdParties = []seedThirdParty{
	{"Amazon Web Services", "Cloud infrastructure and compute", coredata.ThirdPartyCategoryCloudProvider},
	{"Google Cloud Platform", "BigQuery analytics and AI services", coredata.ThirdPartyCategoryCloudProvider},
	{"Google Workspace", "Email, calendar, and productivity suite", coredata.ThirdPartyCategoryCollaboration},
	{"Microsoft 365", "Office productivity and collaboration", coredata.ThirdPartyCategoryCollaboration},
	{"Datadog", "Application monitoring and observability", coredata.ThirdPartyCategoryCloudMonitoring},
	{"PagerDuty", "Incident management and on-call scheduling", coredata.ThirdPartyCategoryIT},
	{"Slack", "Team communication and messaging", coredata.ThirdPartyCategoryCollaboration},
	{"GitHub", "Source code management and CI/CD", coredata.ThirdPartyCategoryVersionControl},
	{"Stripe", "Payment processing and billing", coredata.ThirdPartyCategoryFinance},
	{"Salesforce", "Customer relationship management", coredata.ThirdPartyCategorySales},
	{"HubSpot", "Marketing automation and CRM", coredata.ThirdPartyCategoryMarketing},
	{"Notion", "Documentation and knowledge management", coredata.ThirdPartyCategoryDocumentManagement},
	{"1Password", "Enterprise password management", coredata.ThirdPartyCategoryPasswordManagement},
	{"Okta", "Identity and access management", coredata.ThirdPartyCategoryIdentityProvider},
	{"CrowdStrike", "Endpoint protection and threat intelligence", coredata.ThirdPartyCategorySecurity},
	{"Jira", "Project management and issue tracking", coredata.ThirdPartyCategoryEngineering},
	{"Cloudflare", "CDN, DNS, and DDoS protection", coredata.ThirdPartyCategorySecurity},
	{"Twilio SendGrid", "Transactional email delivery", coredata.ThirdPartyCategoryIT},
	{"Snowflake", "Cloud data warehouse", coredata.ThirdPartyCategoryDataStorageAndProcessing},
}

var seedMeasures = []seedMeasure{
	// Policy
	{"Information Security Policy", "POLICY"},
	{"Access Control Policy", "POLICY"},
	{"Incident Response Plan", "POLICY"},
	{"Data Classification Policy", "POLICY"},
	{"Acceptable Use Policy", "POLICY"},

	// Technical
	{"Multi-Factor Authentication", "TECHNICAL"},
	{"Endpoint Detection and Response", "TECHNICAL"},
	{"Full Disk Encryption", "TECHNICAL"},
	{"Automated Vulnerability Scanning", "TECHNICAL"},
	{"Network Segmentation and Firewall Rules", "TECHNICAL"},
	{"TLS Encryption in Transit", "TECHNICAL"},

	// Organizational
	{"Annual Security Awareness Training", "ORGANIZATIONAL"},
	{"Quarterly Access Reviews", "ORGANIZATIONAL"},
	{"Background Checks for New Hires", "ORGANIZATIONAL"},
	{"Tabletop Disaster Recovery Exercises", "ORGANIZATIONAL"},
}

func seedOrganizationData(
	ctx context.Context,
	tx pg.Tx,
	scope coredata.Scoper,
	organizationID gid.GID,
	tenantID gid.TenantID,
) error {
	now := time.Now()

	for _, sf := range seedFrameworks {
		desc := sf.Description
		framework := &coredata.Framework{
			ID:             gid.New(tenantID, coredata.FrameworkEntityType),
			OrganizationID: organizationID,
			ReferenceID:    slug.Make(sf.Name),
			Name:           sf.Name,
			Description:    &desc,
			CreatedAt:      now,
			UpdatedAt:      now,
		}

		if err := framework.Insert(ctx, tx, scope); err != nil {
			return fmt.Errorf("cannot insert framework %q: %w", sf.Name, err)
		}

		for _, sc := range sf.Controls {
			desc := sc.Description
			control := &coredata.Control{
				ID:             gid.New(tenantID, coredata.ControlEntityType),
				OrganizationID: organizationID,
				FrameworkID:    framework.ID,
				SectionTitle:   sc.Section,
				Name:           sc.Name,
				Description:    &desc,
				MaturityLevel:  coredata.ControlMaturityLevelNone,
				CreatedAt:      now,
				UpdatedAt:      now,
			}

			if err := control.Insert(ctx, tx, scope); err != nil {
				return fmt.Errorf("cannot insert control %q: %w", sc.Name, err)
			}
		}
	}

	for _, sr := range seedRisks {
		risk := &coredata.Risk{
			ID:                 gid.New(tenantID, coredata.RiskEntityType),
			OrganizationID:     organizationID,
			Name:               sr.Name,
			Category:           sr.Category,
			Treatment:          sr.Treatment,
			InherentLikelihood: sr.InherentLikelihood,
			InherentImpact:     sr.InherentImpact,
			ResidualLikelihood: sr.InherentLikelihood,
			ResidualImpact:     sr.InherentImpact,
			CreatedAt:          now,
			UpdatedAt:          now,
		}

		if err := risk.Insert(ctx, tx, scope); err != nil {
			return fmt.Errorf("cannot insert risk %q: %w", sr.Name, err)
		}
	}

	for _, st := range seedThirdParties {
		desc := st.Description
		tp := &coredata.ThirdParty{
			ID:                gid.New(tenantID, coredata.ThirdPartyEntityType),
			OrganizationID:    organizationID,
			Name:              st.Name,
			Description:       &desc,
			Category:          st.Category,
			ShowOnTrustCenter: false,
			FirstLevel:        true,
			CreatedAt:         now,
			UpdatedAt:         now,
		}

		if err := tp.Insert(ctx, tx, scope); err != nil {
			return fmt.Errorf("cannot insert third party %q: %w", st.Name, err)
		}
	}

	for i, sm := range seedMeasures {
		measure := &coredata.Measure{
			ID:             gid.New(tenantID, coredata.MeasureEntityType),
			OrganizationID: organizationID,
			Name:           sm.Name,
			Category:       sm.Category,
			ReferenceID:    fmt.Sprintf("seed-measure-%d", i),
			State:          coredata.MeasureStateNotStarted,
			CreatedAt:      now,
			UpdatedAt:      now,
		}

		if err := measure.Insert(ctx, tx, scope); err != nil {
			return fmt.Errorf("cannot insert measure %q: %w", sm.Name, err)
		}
	}

	return nil
}
