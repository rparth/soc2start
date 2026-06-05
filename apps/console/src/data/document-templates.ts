export type DocumentTemplate = {
  id: string;
  title: string;
  documentType: string;
  content: string;
};

export const documentTemplates: DocumentTemplate[] = [
  {
    id: "access-policy",
    title: "Access Onboarding and Termination Policy",
    documentType: "POLICY",
    content: `# Access Onboarding and Termination Policy

## Purpose and Scope

a. The purpose of this policy is to define procedures to onboard and offboard users to technical infrastructure in a manner that minimizes the risk of information loss or exposure.

a. This policy applies to all technical infrastructure within the organization.

a. This policy applies to all full-time and part-time employees and contractors.

## Background

a. In order to minimize the risk of information loss or exposure (from both inside and outside the organization), the organization is reliant on the principle of least privilege. Account creation and permission levels are restricted to only the resources absolutely needed to perform each person's job duties. When a user's role within the organization changes, those accounts and permission levels are changed/revoked to fit the new role and disabled when the user leaves the organization altogether.

## Policy

a. *During onboarding:*

  i. Hiring Manager informs HR upon hire of a new employee.

  i. HR emails IT to inform them of a new hire and their role.

  i. IT creates a checklist of accounts and permission levels needed for that role.

  i. The owner of each resource reviews and approves account creation and the associated permissions.

  i. IT works with the owner of each resource to set up the user.

a. *During offboarding:*

  i. Hiring Manager notifies HR when an employee has been terminated.

  i. HR sends a weekly email report to IT summarizing list of users terminated and instructs IT to disable their access.

  i. IT terminates access within five business days from receipt of notification.

a. *When an employee changes roles within the organization:*

  i. Hiring Manager will inform HR of a change in role.

  i. HR and IT will follow the same steps as outlined in the onboarding and offboarding procedures.

a. *Review of accounts and permissions:*

  i. Each month, IT and HR will review accounts and permission levels for accuracy.`,
  },
  {
    id: "application-security",
    title: "Application Security Policy",
    documentType: "POLICY",
    content: `# Application Security Policy

## Purpose and Scope

a. The purpose of this policy is to define requirements for secure software development and vulnerability management at [organization name].

a. This policy applies to all applications developed, acquired, or maintained by [organization name] and to all employees, contractors, and third parties involved in software development.

## Background

a. Application-layer attacks represent a significant portion of security incidents. This policy ensures that applications are designed, developed, and maintained with security as a core requirement throughout the software development lifecycle.

## Policy

a. *Secure Development Practices:*

  i. All development must follow secure coding standards aligned with OWASP guidelines.

  i. Developers must receive annual secure coding training.

  i. Code reviews must include security considerations before merging to protected branches.

  i. Secrets, credentials, and API keys must never be committed to source code repositories.

a. *Vulnerability Assessments:*

  i. Static application security testing (SAST) must be integrated into the CI/CD pipeline.

  i. Dynamic application security testing (DAST) must be performed at least quarterly on production applications.

  i. Third-party penetration testing must be conducted annually.

a. *Risk Classification (based on OWASP):*

  i. **Critical** — Remote code execution, authentication bypass, or SQL injection. Must be remediated within 24 hours.

  i. **High** — Cross-site scripting (XSS), privilege escalation, or sensitive data exposure. Must be remediated within 7 days.

  i. **Medium** — Information disclosure, insecure configuration, or missing security headers. Must be remediated within 30 days.

  i. **Low** — Minor issues with limited exploitability. Must be remediated within 90 days.

a. *Dependency Management:*

  i. All third-party libraries and dependencies must be tracked in an inventory.

  i. Known vulnerabilities in dependencies must be remediated according to the risk classification above.

  i. Automated dependency scanning must be enabled for all repositories.`,
  },
  {
    id: "availability-policy",
    title: "Availability Policy",
    documentType: "POLICY",
    content: `# Availability Policy

## Purpose and Scope

a. The purpose of this policy is to define requirements for ensuring the availability of critical systems and data at [organization name].

a. This policy applies to all production systems, infrastructure, and data stores operated by or on behalf of [organization name].

## Background

a. Availability is a core tenet of information security. [organization name] must ensure that critical business systems remain accessible to authorized users within defined service levels, and that data can be recovered in the event of loss or corruption.

## Policy

a. *Availability Classification:*

  i. **Tier 1 — Mission Critical:** Systems whose unavailability directly halts revenue or customer operations. Target uptime: 99.9%.

  i. **Tier 2 — Business Critical:** Systems required for day-to-day operations but with short-term workarounds available. Target uptime: 99.5%.

  i. **Tier 3 — Business Support:** Internal tools and non-customer-facing systems. Target uptime: 99.0%.

a. *Backup Requirements:*

  i. Full backups of all Tier 1 and Tier 2 systems must be performed weekly.

  i. Incremental backups must be performed daily.

  i. Backup retention period is 30 days minimum.

  i. Backups must be stored in a geographically separate location from the primary data.

  i. Backup restoration must be tested at least quarterly.

a. *Redundancy and Failover:*

  i. Tier 1 systems must have automated failover capabilities with no single point of failure.

  i. Tier 2 systems must have documented manual failover procedures.

  i. Failover procedures must be tested at least semi-annually.

a. *Business Continuity:*

  i. Recovery Time Objective (RTO) for Tier 1 systems: 4 hours.

  i. Recovery Time Objective (RTO) for Tier 2 systems: 24 hours.

  i. Recovery Point Objective (RPO) for all tiers: 24 hours maximum.

  i. Business continuity plans must be reviewed and updated annually.`,
  },
  {
    id: "change-management",
    title: "System Change Policy",
    documentType: "POLICY",
    content: `# System Change Policy

## Purpose and Scope

a. The purpose of this policy is to establish a structured approach to managing changes to information systems at [organization name], minimizing service disruption and ensuring all changes are documented, evaluated, and approved.

a. This policy applies to all changes to production systems, infrastructure, networks, and applications.

## Background

a. Uncontrolled changes to information systems are a leading cause of security incidents and service outages. A formal change management process ensures that changes are assessed for risk, approved by appropriate stakeholders, and documented for audit and rollback purposes.

## Policy

a. *Planning:*

  i. All changes must be documented in a change request that includes a description of the change, the reason for the change, affected systems, and rollback plan.

  i. Emergency changes must be documented retrospectively within 48 hours.

a. *Evaluation:*

  i. Each change request must include a risk assessment evaluating the potential impact on confidentiality, integrity, and availability.

  i. Changes must be classified as Standard (pre-approved, low-risk), Normal (requires review), or Emergency (requires expedited approval).

a. *Review:*

  i. Normal and Emergency changes must be reviewed by at least one qualified peer before approval.

  i. Changes to security-critical systems require review by the security team.

a. *Approval:*

  i. Standard changes may proceed without additional approval if they conform to pre-approved templates.

  i. Normal changes require approval from the system owner and change manager.

  i. Emergency changes require approval from at least one member of the leadership team.

a. *Communication:*

  i. Affected stakeholders must be notified before planned changes are implemented.

  i. Communication must include expected impact, timing, and contact information for issues.

a. *Implementation:*

  i. Changes must be implemented during approved maintenance windows when possible.

  i. A rollback plan must be prepared and tested before implementation begins.

a. *Documentation:*

  i. All changes must be recorded in the change management system with implementation details, outcome, and any deviations from the plan.

a. *Post-Change Review:*

  i. All Normal and Emergency changes must undergo a post-implementation review within 5 business days.

  i. Lessons learned must be documented and incorporated into future change processes.`,
  },
  {
    id: "data-classification",
    title: "Data Classification Policy",
    documentType: "POLICY",
    content: `# Data Classification Policy

## Purpose and Scope

a. The purpose of this policy is to establish a framework for classifying data based on its sensitivity and criticality to [organization name], ensuring appropriate handling and protection throughout its lifecycle.

a. This policy applies to all data created, collected, stored, processed, or transmitted by [organization name], regardless of format or location.

## Background

a. Not all data carries the same level of risk. By classifying data into defined tiers, [organization name] can allocate security controls proportionally, ensuring that the most sensitive data receives the strongest protections while avoiding unnecessary overhead on low-risk information.

## Policy

a. *Classification Tiers:*

| Classification | Description | Examples | Access |
|---|---|---|---|
| **Public** | Information intended for public consumption | Marketing materials, public website content, press releases | Unrestricted |
| **Internal Use** | Information intended for internal use that would cause minimal harm if disclosed | Internal memos, non-sensitive project documentation, org charts | All employees |
| **Restricted** | Sensitive information that could cause significant harm if disclosed | Customer PII, financial records, source code, credentials | Need-to-know basis |
| **Confidential** | Highly sensitive information whose disclosure could cause severe harm | Encryption keys, security audit findings, legal strategies, M&A data | Named individuals only |

a. *Data Labeling:*

  i. All documents and data stores must be labeled with their classification level.

  i. Electronic documents must include the classification in the header or metadata.

  i. When data of multiple classification levels is combined, the combined dataset must be classified at the highest applicable level.

a. *Handling Requirements:*

  i. **Public:** No special handling required.

  i. **Internal Use:** Must not be shared externally without management approval. Must be stored on organization-controlled systems.

  i. **Restricted:** Must be encrypted in transit and at rest. Access must be logged. Sharing requires data owner approval.

  i. **Confidential:** Must be encrypted in transit and at rest with organization-managed keys. Access must be logged and reviewed quarterly. Sharing requires executive approval and must use secure channels.

a. *Data Ownership:*

  i. Every data set must have a designated data owner responsible for its classification and access decisions.

  i. Data owners must review classifications annually or when the nature of the data changes.`,
  },
  {
    id: "code-of-conduct",
    title: "Code of Conduct Policy",
    documentType: "POLICY",
    content: `# Code of Conduct Policy

## Purpose and Scope

a. The purpose of this policy is to establish the standards of professional and ethical behavior expected of all individuals representing [organization name].

a. This policy applies to all full-time and part-time employees, contractors, consultants, and temporary workers.

## Policy

a. *Legal Compliance:*

  i. All personnel must comply with applicable local, state, federal, and international laws and regulations.

  i. Any known or suspected violation of law must be reported immediately to management or the legal team.

a. *Respectful Workplace:*

  i. [organization name] is committed to providing a workplace free from discrimination, harassment, and retaliation.

  i. All personnel must treat colleagues, customers, partners, and vendors with respect and professionalism.

  i. Bullying, intimidation, or any form of harassment is strictly prohibited.

a. *Asset Protection:*

  i. Organization assets — including equipment, intellectual property, data, and financial resources — must be used responsibly and solely for legitimate business purposes.

  i. Theft, misuse, or unauthorized disposal of organization assets is prohibited.

  i. Personnel must report lost or stolen assets immediately.

a. *Professional Standards:*

  i. Personnel must perform their duties with diligence, honesty, and integrity.

  i. Misrepresentation of qualifications, work product, or organizational information is prohibited.

a. *Anti-Corruption:*

  i. Bribery, kickbacks, and corrupt payments of any kind are strictly prohibited.

  i. Gifts and entertainment must be reasonable, infrequent, and must not create an appearance of impropriety.

  i. Any offer of an improper payment must be refused and reported immediately.

a. *Conflict of Interest:*

  i. Personnel must disclose any financial, personal, or professional relationships that could create a conflict of interest.

  i. Outside employment or business activities must not interfere with duties to [organization name] and must be disclosed to management.

a. *Disciplinary Actions:*

  i. Violations of this policy may result in disciplinary action up to and including termination of employment or contract.

  i. The severity of disciplinary action will be proportionate to the nature and circumstances of the violation.

  i. [organization name] reserves the right to refer violations to law enforcement where appropriate.`,
  },
  {
    id: "confidentiality-policy",
    title: "Confidentiality Policy",
    documentType: "POLICY",
    content: `# Confidentiality Policy

## Purpose and Scope

a. The purpose of this policy is to ensure that confidential information belonging to [organization name], its clients, and its partners is protected from unauthorized disclosure.

a. This policy applies to all employees, contractors, and third parties who have access to confidential information.

## Policy

a. *Definition of Confidential Information:*

  i. Trade secrets, proprietary technology, and intellectual property.

  i. Customer and employee personally identifiable information (PII).

  i. Financial records, projections, and strategic plans.

  i. Security configurations, architecture diagrams, and vulnerability reports.

  i. Any information designated as "Restricted" or "Confidential" under the Data Classification Policy.

a. *Handling Procedures:*

  i. Confidential information must only be accessed on a need-to-know basis in the performance of job duties.

  i. Confidential information must not be discussed in public areas or shared via unsecured channels.

  i. Electronic confidential information must be encrypted in transit and at rest.

  i. Physical documents containing confidential information must be stored in locked containers and shredded when no longer needed.

a. *Offboarding:*

  i. Upon termination or end of contract, all confidential information and materials must be returned or certified as destroyed.

  i. Access to systems containing confidential information must be revoked in accordance with the Access Onboarding and Termination Policy.

a. *Confidentiality Measures:*

  i. All employees and contractors must sign a confidentiality or non-disclosure agreement before being granted access to confidential information.

  i. Confidentiality obligations survive the termination of employment or contract.

a. *Exceptions:*

  i. Disclosure of confidential information is permitted when required by law, regulation, or valid legal process.

  i. Any such disclosure must be coordinated with the legal team prior to release.

a. *Disciplinary Consequences:*

  i. Unauthorized disclosure of confidential information may result in disciplinary action up to and including termination.

  i. [organization name] reserves the right to pursue legal remedies for breaches of confidentiality.`,
  },
  {
    id: "business-continuity",
    title: "Business Continuity Policy",
    documentType: "POLICY",
    content: `# Business Continuity Policy

## Purpose and Scope

a. The purpose of this policy is to establish requirements for planning and preparedness to ensure the continued operation of [organization name] during and after a disruptive event.

a. This policy applies to all business units, systems, and personnel at [organization name].

## Background

a. Business continuity planning ensures that [organization name] can maintain essential operations during disruptions. Key definitions:

  i. **Business Impact Analysis (BIA):** An assessment identifying critical business functions and the impact of their disruption.

  i. **Disaster Recovery Plan (DRP):** A documented process to recover IT systems and infrastructure following a disaster.

  i. **Recovery Time Objective (RTO):** The maximum acceptable time to restore a business function after disruption.

  i. **Recovery Point Objective (RPO):** The maximum acceptable amount of data loss measured in time.

## Policy

a. *Business Risk Assessment:*

  i. A Business Impact Analysis must be conducted annually to identify critical functions, dependencies, and acceptable downtime thresholds.

  i. Risk assessments must evaluate natural disasters, cyber attacks, supply chain disruptions, pandemic events, and infrastructure failures.

  i. Results of the BIA must be reviewed by the leadership team and used to prioritize continuity investments.

a. *Disaster Recovery Plan (DRP) Requirements:*

  i. A Disaster Recovery Plan must be maintained for all Tier 1 and Tier 2 systems as defined in the Availability Policy.

  i. The DRP must include detailed recovery procedures, responsible personnel, and communication protocols.

  i. The DRP must be tested at least annually through tabletop exercises or live failover tests.

  i. Test results must be documented and deficiencies must be remediated within 30 days.

a. *Data Backup and Restoration:*

  i. Backup procedures must comply with the Availability Policy.

  i. Backup restoration must be tested quarterly to verify data integrity and recovery procedures.

  i. Backup media must be stored offsite in a secure, geographically separate location.

a. *Plan Maintenance:*

  i. Business continuity plans must be reviewed and updated at least annually or following any significant organizational or infrastructure change.

  i. All personnel with roles in the continuity plan must receive annual training on their responsibilities.`,
  },
  {
    id: "disaster-recovery",
    title: "Disaster Recovery Policy",
    documentType: "POLICY",
    content: `# Disaster Recovery Policy

## Purpose and Scope

a. The purpose of this policy is to define requirements for recovering critical IT systems and infrastructure following a disaster event at [organization name].

a. This policy applies to all production systems, data stores, and supporting infrastructure.

## Background

a. A disaster is any event that renders critical systems or facilities unusable for a period exceeding the defined RTO. This includes but is not limited to natural disasters, cyber attacks, hardware failures, and prolonged utility outages. The Disaster Recovery Plan ensures [organization name] can restore operations within acceptable timeframes.

## Policy

a. *Relocation:*

  i. If the primary facility becomes unavailable, operations must relocate to the designated alternate facility or transition to fully remote operations as documented in the Business Continuity Plan.

  i. The alternate facility must have sufficient capacity to support critical operations.

a. *Critical Services:*

  i. Critical services and their recovery priorities must be documented and aligned with the Business Impact Analysis.

  i. Recovery procedures for each critical service must be detailed, tested, and accessible to the recovery team.

a. *Recovery Time Objectives:*

  i. Tier 1 systems: RTO of 4 hours, RPO of 1 hour.

  i. Tier 2 systems: RTO of 24 hours, RPO of 24 hours.

  i. Tier 3 systems: RTO of 72 hours, RPO of 48 hours.

a. *Notification:*

  i. The incident commander must be notified within 30 minutes of a disaster declaration.

  i. The recovery team must be assembled within 1 hour.

  i. Customers and stakeholders must be notified within 4 hours with initial status and estimated recovery time.

a. *Plan Activation and Deactivation:*

  i. The disaster recovery plan may be activated by the incident commander, CTO, or CEO.

  i. The plan remains active until all critical systems are restored and verified, at which point the incident commander declares the recovery complete.

a. *Pre-Authorized Actions:*

  i. The recovery team is pre-authorized to provision emergency cloud infrastructure up to a defined spending limit.

  i. The recovery team is pre-authorized to engage pre-approved third-party recovery vendors.

  i. All pre-authorized actions must be documented and reported to the leadership team within 24 hours.

a. *Appendices:*

  i. Appendix A: Recovery team contact list (maintained separately).

  i. Appendix B: Critical system inventory and recovery procedures (maintained separately).

  i. Appendix C: Third-party vendor contact list (maintained separately).`,
  },
  {
    id: "encryption-policy",
    title: "Encryption Policy",
    documentType: "POLICY",
    content: `# Encryption Policy

## Purpose and Scope

a. The purpose of this policy is to define requirements for the use of cryptographic controls to protect the confidentiality and integrity of data at [organization name].

a. This policy applies to all data classified as Restricted or Confidential, and to all systems that store, process, or transmit such data.

## Background

a. Encryption is a critical control for protecting sensitive data from unauthorized access. This policy establishes minimum cryptographic standards and key management practices to ensure that encryption implementations are effective and auditable.

## Policy

a. *Cryptographic Controls:*

  i. Data at rest classified as Restricted or Confidential must be encrypted using AES-256 or equivalent.

  i. Data in transit must be encrypted using TLS 1.2 or higher.

  i. Deprecated algorithms (e.g., DES, 3DES, MD5, SHA-1, SSL, TLS 1.0/1.1) must not be used.

  i. Full-disk encryption must be enabled on all endpoints (laptops, workstations, mobile devices).

  i. Database encryption must be enabled for all databases containing Restricted or Confidential data.

a. *Key Management:*

  i. Encryption keys must be generated using cryptographically secure random number generators.

  i. Key length must meet or exceed industry standards: AES-256 for symmetric encryption, RSA-2048 or ECC P-256 minimum for asymmetric encryption.

  i. Encryption keys must be rotated at least annually or immediately upon suspected compromise.

  i. Access to encryption keys must be restricted to authorized personnel on a need-to-know basis.

  i. Key access must be logged and reviewed quarterly.

  i. Encryption keys must be backed up securely and stored separately from the encrypted data.

  i. Key destruction must follow secure deletion procedures that render keys unrecoverable.

a. *Certificate Management:*

  i. TLS certificates must be issued by a trusted Certificate Authority.

  i. Certificates must be renewed before expiration with a minimum 30-day lead time.

  i. Certificate inventory must be maintained and reviewed quarterly.`,
  },
  {
    id: "incident-response",
    title: "Security Incident Response Policy",
    documentType: "POLICY",
    content: `# Security Incident Response Policy

## Purpose and Scope

a. The purpose of this policy is to establish requirements for reporting, responding to, and recovering from security incidents at [organization name].

a. This policy applies to all employees, contractors, and third parties who access [organization name] systems or data.

## Background

a. A security incident is any event that compromises the confidentiality, integrity, or availability of information or information systems. Key definitions:

  i. **Event:** An observable occurrence in a system or network.

  i. **Alert:** An event that has been flagged by monitoring systems as potentially anomalous.

  i. **Incident:** A confirmed event that violates security policy or threatens the organization.

  i. **Breach:** An incident that results in confirmed unauthorized access to or disclosure of protected data.

## Policy

a. *Reporting:*

  i. All personnel must report suspected security incidents within 24 hours of discovery.

  i. Reports must be submitted to the security team via the designated incident reporting channel.

  i. Failure to report a known or suspected incident may result in disciplinary action.

a. *Severity Levels:*

  i. **High:** Confirmed data breach, active intrusion, ransomware, or compromise of critical systems. Response within 1 hour. Executive notification required.

  i. **Medium:** Unauthorized access attempt, malware detection, policy violation with potential data exposure. Response within 4 hours.

  i. **Low:** Minor policy violation, phishing attempt without compromise, suspicious but unconfirmed activity. Response within 24 hours.

a. *Incident Response Procedures:*

  i. **Identification:** Validate and classify the incident based on available evidence and severity criteria.

  i. **Containment:** Isolate affected systems to prevent further damage. Short-term containment may include network segmentation or account suspension.

  i. **Eradication:** Remove the root cause of the incident, including malware, unauthorized access, or vulnerable configurations.

  i. **Recovery:** Restore affected systems from known-good backups and verify integrity before returning to production.

  i. **Lessons Learned:** Conduct a post-incident review within 5 business days. Document findings, root cause, timeline, and remediation actions.

a. *Executing Incident Response:*

  i. The security team lead serves as incident commander and coordinates all response activities.

  i. The incident commander may engage external forensic or legal resources as needed.

  i. All incident activities must be documented in the incident tracking system in real time.

  i. Customer and regulatory notifications must be made in accordance with applicable laws and contractual obligations.`,
  },
  {
    id: "information-security",
    title: "Information Security Policy",
    documentType: "POLICY",
    content: `# Information Security Policy

## Purpose and Scope

a. The purpose of this policy is to establish the information security management framework for [organization name], ensuring the confidentiality, integrity, and availability of organizational information assets.

a. This policy applies to all employees, contractors, third parties, and systems that create, access, store, process, or transmit [organization name] information.

## Background

a. Information is a critical asset of [organization name]. The Information Security Management System (ISMS) is the overarching framework that governs how information is protected. This master policy defines the principles and references the supporting policies that together form the ISMS.

a. The three pillars of information security (the CIA triad):

  i. **Confidentiality:** Ensuring that information is accessible only to those authorized to access it.

  i. **Integrity:** Safeguarding the accuracy and completeness of information and processing methods.

  i. **Availability:** Ensuring that authorized users have access to information and associated assets when required.

## Policy

a. *ISMS Framework:*

  i. [organization name] maintains an Information Security Management System that aligns with SOC 2 Trust Services Criteria and industry best practices.

  i. The ISMS is governed by the leadership team with day-to-day oversight delegated to the security team.

  i. The ISMS must be reviewed and updated at least annually.

a. *Supporting Policies:*

  i. This policy is supported by the following domain-specific policies, each of which must be read in conjunction with this document:

    - Access Onboarding and Termination Policy
    - Application Security Policy
    - Availability Policy
    - Business Continuity Policy
    - Change Management Policy
    - Code of Conduct Policy
    - Confidentiality Policy
    - Data Classification Policy
    - Data Retention Policy
    - Disaster Recovery Policy
    - Encryption Policy
    - Incident Response Policy
    - Log Management Policy
    - Password Policy
    - Remote Access Policy
    - Risk Assessment Policy
    - Software Development Lifecycle Policy
    - Vendor Management Policy
    - Workstation Policy

a. *Roles and Responsibilities:*

  i. **Leadership Team:** Approves security policies, allocates resources, and accepts residual risk.

  i. **Security Team:** Develops and maintains policies, monitors compliance, manages incidents, and conducts risk assessments.

  i. **System Owners:** Ensure systems comply with applicable policies and participate in risk assessments.

  i. **All Personnel:** Comply with security policies, complete required training, and report security concerns.

a. *Compliance and Enforcement:*

  i. Compliance with security policies is mandatory for all personnel.

  i. Violations may result in disciplinary action up to and including termination.

  i. The security team will conduct periodic audits to verify compliance.

  i. Exceptions to policy must be documented, risk-assessed, and approved by the security team and leadership.`,
  },
  {
    id: "log-management",
    title: "Log Management Policy",
    documentType: "POLICY",
    content: `# Log Management Policy

## Purpose and Scope

a. The purpose of this policy is to establish requirements for the generation, collection, storage, and review of audit logs to support security monitoring and incident investigation at [organization name].

a. This policy applies to all production systems, applications, network devices, and security tools operated by [organization name].

## Background

a. Audit logs are essential for detecting security incidents, investigating breaches, and demonstrating compliance. Comprehensive logging and centralized log management enable [organization name] to maintain visibility into system activity and respond effectively to threats.

## Policy

a. *Audit Logging Requirements:*

  i. All production systems must generate audit logs for security-relevant events.

  i. Logging must be enabled by default and must not be disabled without documented approval from the security team.

  i. Log data must be protected from unauthorized modification or deletion.

a. *Logged Activities:*

  i. Authentication events (successful and failed login attempts).

  i. Authorization events (access grants, denials, and privilege changes).

  i. System events (startup, shutdown, configuration changes).

  i. Data access events (creation, read, update, deletion of Restricted or Confidential data).

  i. Administrative actions (user creation, role changes, policy modifications).

  i. Network events (firewall rule changes, VPN connections, anomalous traffic).

a. *Central Aggregation:*

  i. All logs must be forwarded to a centralized log management system (SIEM or equivalent).

  i. The centralized system must support search, correlation, and alerting capabilities.

  i. Log transmission must be encrypted in transit.

a. *Review Frequency:*

  i. Automated alerts must be configured for high-severity events (failed authentication thresholds, privilege escalation, unauthorized access attempts).

  i. The security team must review log alerts daily.

  i. A comprehensive log review must be conducted at least monthly.

  i. Log review findings must be documented and tracked to resolution.

a. *Retention:*

  i. Audit logs must be retained for a minimum of 1 year.

  i. Logs related to active incidents or investigations must be preserved until the matter is resolved.

a. *Time Synchronization:*

  i. All systems must synchronize time using NTP from an authoritative source.

  i. Time drift must not exceed 1 second across all systems.`,
  },
  {
    id: "password-policy",
    title: "Password Policy",
    documentType: "POLICY",
    content: `# Password Policy

## Purpose and Scope

a. The purpose of this policy is to establish requirements for password creation, management, and protection to ensure secure access to [organization name] systems and data.

a. This policy applies to all employees, contractors, and third parties who access [organization name] systems.

## Policy

a. *Password Requirements:*

  i. Passwords must be a minimum of 12 characters in length.

  i. Passwords must include a mix of uppercase letters, lowercase letters, numbers, and special characters.

  i. Passwords must not contain the user's name, username, or easily guessable patterns (e.g., "password123", "qwerty").

  i. Passwords must not reuse any of the last 12 passwords.

a. *Password Rotation:*

  i. System-level passwords (root, service accounts, administrative accounts) must be rotated quarterly.

  i. User-level passwords must be rotated every 6 months.

  i. Passwords must be changed immediately upon suspicion of compromise.

a. *Password Storage:*

  i. Passwords must never be stored in plain text, spreadsheets, documents, or code repositories.

  i. Passwords must be stored using approved cryptographic hashing algorithms (bcrypt, scrypt, or Argon2).

  i. Application and service credentials must be stored in an approved secrets management system.

a. *Password Managers:*

  i. All personnel are required to use an organization-approved password manager for storing and generating passwords.

  i. The master password for the password manager must meet all password requirements defined in this policy.

  i. Sharing of passwords via email, chat, or other unsecured channels is prohibited.

a. *Multi-Factor Authentication:*

  i. Multi-factor authentication (MFA) must be enabled for all remote access, privileged accounts, and systems containing Restricted or Confidential data.

  i. SMS-based MFA is discouraged; hardware tokens or authenticator applications are preferred.

a. *Account Lockout:*

  i. Accounts must be locked after 5 consecutive failed login attempts.

  i. Locked accounts must remain locked for a minimum of 15 minutes or until unlocked by an administrator.`,
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment Policy",
    documentType: "POLICY",
    content: `# Risk Assessment Policy

## Purpose and Scope

a. The purpose of this policy is to define the process for identifying, assessing, and treating information security risks at [organization name].

a. This policy applies to all information assets, systems, and processes owned or operated by [organization name].

## Background

a. Risk assessment is a foundational component of the information security program. By systematically identifying threats and vulnerabilities, [organization name] can make informed decisions about where to invest in controls and how to manage residual risk.

## Policy

a. *Asset Identification:*

  i. An inventory of information assets must be maintained, including hardware, software, data stores, and third-party services.

  i. Each asset must have a designated owner responsible for its security.

  i. The asset inventory must be reviewed and updated at least annually.

a. *Risk Scoring:*

  i. Risks must be evaluated using a standardized scoring methodology based on consequence and likelihood.

  i. **Consequence scale (0–2):**
    - 0 = Negligible impact
    - 1 = Moderate impact (limited financial loss, temporary service disruption)
    - 2 = Severe impact (significant financial loss, regulatory penalty, reputational damage)

  i. **Likelihood scale (0–2):**
    - 0 = Unlikely (no known threat activity, strong controls in place)
    - 1 = Possible (threat activity observed, controls partially effective)
    - 2 = Likely (active threat, controls weak or absent)

  i. Risk score = Consequence + Likelihood (range 0–4).

a. *Acceptance Criteria:*

  i. Risks scoring 0–1 may be accepted with documentation and owner acknowledgment.

  i. Risks scoring 2 require a treatment plan within 90 days.

  i. Risks scoring 3–4 require immediate treatment and executive notification.

a. *Treatment Options:*

  i. **Mitigate:** Implement controls to reduce the risk to an acceptable level.

  i. **Transfer:** Shift the risk to a third party (e.g., insurance, outsourcing with contractual protections).

  i. **Avoid:** Eliminate the activity or asset that creates the risk.

  i. **Accept:** Acknowledge and document the risk when the cost of treatment exceeds the potential impact.

a. *Annual Review:*

  i. A comprehensive risk assessment must be conducted at least annually.

  i. Risk assessments must also be performed when significant changes occur to the environment, organization, or threat landscape.

  i. Results must be reported to the leadership team and used to update the risk register and treatment plans.`,
  },
  {
    id: "vendor-management",
    title: "Vendor Management Policy",
    documentType: "POLICY",
    content: `# Vendor Management Policy

## Purpose and Scope

a. The purpose of this policy is to establish requirements for evaluating, engaging, and monitoring third-party vendors to ensure they meet [organization name] security and compliance standards.

a. This policy applies to all third-party vendors, service providers, and partners who access, process, store, or transmit [organization name] data or connect to [organization name] systems.

## Background

a. Third-party vendors extend [organization name]'s attack surface and may introduce risks to the confidentiality, integrity, and availability of organizational data. A structured vendor management program ensures that vendors are assessed for risk before engagement, contractually bound to security requirements, and monitored throughout the relationship.

## Policy

a. *Security Contracts:*

  i. All vendor agreements must include security and confidentiality requirements appropriate to the data and systems the vendor will access.

  i. Contracts must include data protection obligations, breach notification requirements, and right-to-audit clauses.

  i. Vendors handling Restricted or Confidential data must sign a Data Processing Agreement (DPA).

a. *Compliance:*

  i. Vendors must demonstrate compliance with applicable security standards (e.g., SOC 2, ISO 27001) or undergo a security assessment by [organization name].

  i. Compliance evidence must be reviewed annually.

  i. Vendors who fail to demonstrate adequate compliance must be placed on a remediation plan or replaced.

a. *Incident Reporting:*

  i. Vendors must notify [organization name] of any security incident affecting [organization name] data within 24 hours of discovery.

  i. Vendor incident response capabilities must be evaluated during the initial assessment.

a. *SLA Adherence:*

  i. Service Level Agreements must be defined for all critical vendor services, including uptime, response time, and support availability.

  i. SLA performance must be monitored and reviewed quarterly.

a. *Risk Assessment:*

  i. All vendors must undergo a risk assessment before engagement, categorized as Critical, High, Medium, or Low based on data access and system connectivity.

  i. Critical and High-risk vendors must be reassessed annually.

  i. Medium and Low-risk vendors must be reassessed every two years.

a. *Data Handling:*

  i. Vendors must handle [organization name] data in accordance with the Data Classification Policy.

  i. Vendor data retention and destruction practices must be documented and verified.

  i. Upon termination of the vendor relationship, all [organization name] data must be returned or certified as destroyed.

a. *Audit Rights:*

  i. [organization name] reserves the right to audit vendor security controls and practices.

  i. Vendors must cooperate with audit requests and provide evidence of compliance within 30 days.`,
  },
  {
    id: "sdlc-policy",
    title: "Software Development Lifecycle Policy",
    documentType: "POLICY",
    content: `# Software Development Lifecycle Policy

## Purpose and Scope

a. The purpose of this policy is to define the phases and security requirements of the Software Development Lifecycle (SDLC) at [organization name].

a. This policy applies to all software developed, maintained, or commissioned by [organization name], including internal tools, customer-facing applications, and integrations.

## Background

a. A structured SDLC ensures that software is designed, built, tested, and deployed with consistent quality and security controls. By embedding security into each phase, [organization name] reduces the risk of vulnerabilities reaching production and ensures compliance with regulatory and contractual obligations.

## Policy

a. *Requirements Phase:*

  i. Functional and non-functional requirements must be documented before development begins.

  i. Security requirements must be defined based on the data classification and risk profile of the application.

  i. Privacy and compliance requirements must be identified and incorporated.

a. *Architecture and Design Phase:*

  i. A security architecture review must be conducted for new applications and significant changes.

  i. Threat modeling must be performed to identify potential attack vectors and mitigations.

  i. Design must follow the principle of least privilege and defense in depth.

a. *Development Phase:*

  i. Developers must follow secure coding standards aligned with OWASP guidelines.

  i. Static application security testing (SAST) must be integrated into the development workflow.

  i. Code must be peer-reviewed before merging, with security considerations as part of the review checklist.

  i. Secrets and credentials must never be stored in source code.

a. *Testing Phase:*

  i. All code must have unit and integration test coverage meeting minimum thresholds defined by the engineering team.

  i. Dynamic application security testing (DAST) must be performed before release to production.

  i. Penetration testing must be conducted annually or before major releases.

a. *Deployment Phase:*

  i. Deployments must follow the System Change Policy.

  i. Production deployments must use automated CI/CD pipelines with approval gates.

  i. Rollback procedures must be documented and tested.

a. *Operations Phase:*

  i. Production systems must be monitored for performance, availability, and security events.

  i. Vulnerability scanning must be performed regularly.

  i. Patches and updates must be applied in accordance with the patch management procedures.

a. *Decommission Phase:*

  i. Applications being decommissioned must have their data handled in accordance with the Data Retention Policy.

  i. Access credentials, API keys, and certificates associated with the application must be revoked.

  i. Decommission activities must be documented in the change management system.`,
  },
  {
    id: "remote-access",
    title: "Remote Access Policy",
    documentType: "POLICY",
    content: `# Remote Access Policy

## Purpose and Scope

a. The purpose of this policy is to define requirements for secure remote access to [organization name] systems and data.

a. This policy applies to all employees, contractors, and third parties who access [organization name] systems from outside the corporate network.

## Policy

a. *VPN and Secure Connectivity:*

  i. All remote access to internal systems must be conducted through an organization-approved VPN or zero-trust network access (ZTNA) solution.

  i. Split tunneling is prohibited unless explicitly approved by the security team with documented risk acceptance.

  i. VPN connections must use strong encryption (AES-256 or equivalent).

a. *Multi-Factor Authentication:*

  i. Multi-factor authentication (MFA) is required for all remote access sessions.

  i. MFA must use hardware tokens or authenticator applications; SMS-based MFA is not permitted for remote access.

a. *Full-Disk Encryption:*

  i. All devices used for remote access must have full-disk encryption enabled.

  i. Encryption must use AES-256 or equivalent and must be verified before remote access is granted.

a. *Patching:*

  i. Remote devices must have current operating system and application patches applied.

  i. Devices that do not meet minimum patch levels must be denied remote access until patched.

a. *Endpoint Protection:*

  i. Remote devices must have organization-approved endpoint protection (antivirus/EDR) installed and active.

  i. Endpoint protection definitions must be updated within 24 hours of availability.

a. *Telework Authorization:*

  i. Employees must receive written authorization before working remotely on a regular basis.

  i. Remote work environments must provide a secure, private workspace suitable for handling confidential information.

  i. Public Wi-Fi networks must not be used to access [organization name] systems without VPN protection.

a. *Third-Party Remote Access:*

  i. Third-party remote access must be pre-approved and time-limited.

  i. Third-party sessions must be monitored and logged.

  i. Permanent remote access credentials for third parties are prohibited.`,
  },
  {
    id: "data-retention",
    title: "Data Retention Policy",
    documentType: "POLICY",
    content: `# Data Retention Policy

## Purpose and Scope

a. The purpose of this policy is to define the retention, archival, and destruction requirements for data at [organization name].

a. This policy applies to all data created, collected, or maintained by [organization name], in any format, on any system.

## Policy

a. *Retention Phase:*

  i. Active business data must be retained for a minimum of 2 years from the date of creation or last use, unless a longer period is required by law, regulation, or contract.

  i. Data retention periods must be defined for each data category and documented in the data retention schedule.

  i. Data owners are responsible for ensuring their data complies with the retention schedule.

a. *Archival Phase:*

  i. Data that has exceeded its active retention period but must be preserved for legal, regulatory, or historical purposes must be archived.

  i. Archived data must be retained for a minimum of 7 years unless a shorter period is permitted by applicable requirements.

  i. Archived data must remain encrypted and accessible only to authorized personnel.

  i. Archived data must be stored on durable media with integrity verification.

a. *Destruction Phase:*

  i. Data that has exceeded all retention and archival requirements must be securely destroyed.

  i. Electronic data must be destroyed using methods that render it unrecoverable (e.g., cryptographic erasure, secure overwrite, physical destruction of media).

  i. Physical documents must be cross-cut shredded or incinerated.

  i. Destruction activities must be documented, including date, method, data description, and responsible party.

a. *Litigation Hold:*

  i. When [organization name] is subject to or reasonably anticipates litigation, regulatory investigation, or audit, a litigation hold must be issued.

  i. All data subject to a litigation hold must be preserved regardless of the retention schedule until the hold is lifted by the legal team.

  i. Personnel must comply immediately with litigation hold notices.

a. *Media Disposal:*

  i. Storage media (hard drives, USB drives, tapes, etc.) must be sanitized before reuse or disposal in accordance with NIST SP 800-88 guidelines.

  i. Media sanitization must be verified and documented.

  i. Media containing Restricted or Confidential data must be physically destroyed when no longer needed.`,
  },
  {
    id: "workstation-policy",
    title: "Workstation Policy",
    documentType: "POLICY",
    content: `# Workstation Policy

## Purpose and Scope

a. The purpose of this policy is to define security requirements for workstations and mobile devices used to access [organization name] systems and data.

a. This policy applies to all organization-owned and personally-owned devices used for business purposes.

## Policy

a. *Operating System Currency:*

  i. Workstations must run a supported operating system version with current security patches.

  i. Operating system updates must be applied within 14 days of release for critical patches and 30 days for non-critical patches.

  i. End-of-life operating systems are prohibited.

a. *Encryption at Rest:*

  i. Full-disk encryption must be enabled on all workstations and mobile devices.

  i. Encryption must use AES-256 or equivalent.

  i. Encryption status must be verified by endpoint management tools.

a. *Screen Lock:*

  i. Workstations must be configured to lock automatically after 5 minutes of inactivity.

  i. Users must manually lock their workstations when leaving them unattended.

  i. Screen lock must require password or biometric authentication to unlock.

a. *Endpoint Protection:*

  i. All workstations must have organization-approved antivirus or endpoint detection and response (EDR) software installed and active.

  i. Endpoint protection must be configured for automatic updates and real-time scanning.

  i. Users must not disable or circumvent endpoint protection.

a. *Mobile Device Rules:*

  i. Mobile devices accessing organization data must have a passcode or biometric lock enabled.

  i. Remote wipe capability must be enabled on all mobile devices accessing organization data.

  i. Lost or stolen devices must be reported within 4 hours of discovery.

  i. Jailbroken or rooted devices are prohibited from accessing organization systems.

a. *Software Installation:*

  i. Only organization-approved software may be installed on workstations.

  i. Users must not install pirated, unlicensed, or unauthorized software.

  i. The IT team must maintain a list of approved software and review it quarterly.`,
  },
  {
    id: "onboarding-procedure",
    title: "Onboard New User",
    documentType: "PROCEDURE",
    content: `# Onboard New User

## Checklist

- [ ] Append HR add request e-mail to this ticket
- [ ] Proactively validate role assignment with manager (see HR request e-mail)
- [ ] Add user to default group for the specified role
- [ ] Provision any manually-provisioned applications by role
  - [ ] Append manual provisioning confirmation to this ticket
- [ ] Proactively confirm with new user that they can access all provisioned systems`,
  },
  {
    id: "offboarding-procedure",
    title: "Offboard User",
    documentType: "PROCEDURE",
    content: `# Offboard User

## Checklist

- [ ] Immediately suspend user in SSO
- [ ] Append HR termination request e-mail to this ticket
- [ ] Look up manually-provisioned applications for this role or user
- [ ] Validate access revocation in each
- [ ] Append confirmation of revocation to this ticket`,
  },
  {
    id: "patch-procedure",
    title: "Apply OS Patches",
    documentType: "PROCEDURE",
    content: `# OS Patch Procedure

## Checklist

- [ ] Pull the latest scripts from the Ops repository
- [ ] Execute staging patch script
- [ ] Inspect output
  - [ ] Errors? Investigate and resolve
- [ ] Execute production patch script
- [ ] Attach log output to this ticket`,
  },
];

export function getTemplatesForType(
  documentType: string,
): DocumentTemplate[] {
  return documentTemplates.filter(
    (template) => template.documentType === documentType,
  );
}
