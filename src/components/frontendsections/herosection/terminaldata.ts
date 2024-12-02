export interface Command {
    name: string;
    description: string;
    action: () => string;
  }
  
  export const initialMessages = [
    'Welcome to DashAuth Terminal',
    'Initializing secure connection...',
    'Verifying environment...',
    'Loading security protocols...',
    'Establishing encrypted channel...',
    'Connection established',
    'Type "help" to see available commands.'
  ];
  
  export const commands: Command[] = [
    {
      name: 'help',
      description: 'Show available commands',
      action: () => `Available Commands:
  -------------------
  Authentication
    auth         - Authentication system overview
    sso          - Single Sign-On implementation
    mfa          - Multi-factor authentication
    oauth        - OAuth2 and social login
    session      - Session management
    tokens       - Token handling and JWT
    passwordless - Passwordless authentication
  
  Security
    security     - Security features overview
    encryption   - Data encryption methods
    audit        - Audit logging system
    compliance   - Compliance certifications
    2fa          - Two-factor options
    recovery     - Account recovery
    roles        - Role management
    permissions  - Permission system
  
  Integration
    api          - API documentation
    sdk          - Available SDKs
    webhooks     - Webhook configuration
    events       - Event system
    callbacks    - Callback handling
    libraries    - Client libraries
    frameworks   - Framework support
  
  Infrastructure
    setup        - Implementation guide
    deploy       - Deployment options
    regions      - Available regions
    scaling      - Scaling guidance
    monitoring   - System monitoring
    backup       - Backup solutions
    migration    - Migration tools
  
  Billing
    pricing      - Pricing plans
    usage        - Usage statistics
    limits       - Rate limits
    upgrade      - Upgrade options
    enterprise   - Enterprise features
  
  Support
    contact      - Contact support
    status       - System status
    docs         - Documentation
    examples     - Code examples
    about        - About DashAuth
    version      - Version info
    changelog    - Recent updates
  
  Type any command for detailed information.`
    },
    {
      name: 'auth',
      description: 'Authentication overview',
      action: () => `Authentication System Overview
  ---------------------------
  Core Features:
  • JWT-based authentication
  • Passwordless authentication
  • Social login integration
  • Custom authentication flows
  • Brute force protection
  • Account linking
  • Custom claims support
  
  Security Features:
  • Automatic password hashing
  • Session management
  • Rate limiting
  • IP blocking
  • Device fingerprinting
  • Risk-based authentication
  
  Integration Methods:
  • REST API
  • GraphQL API
  • WebSocket support
  • Mobile SDK
  • Web SDK
  • Server-side libraries
  
  For specific features, try:
  • "oauth" - OAuth2 details
  • "session" - Session management
  • "tokens" - Token handling
  • "mfa" - Multi-factor auth`
    },
    {
      name: 'security',
      description: 'Security features',
      action: () => `Security Features Overview
  -----------------------
  Encryption:
  • AES-256 data encryption
  • RSA public/private key
  • End-to-end encryption
  • At-rest encryption
  • In-transit encryption
  
  Protection:
  • DDoS mitigation
  • WAF integration
  • Rate limiting
  • Fraud detection
  • Bot protection
  • XSS prevention
  • CSRF protection
  
  Compliance:
  • SOC2 Type II
  • ISO 27001
  • GDPR compliant
  • HIPAA ready
  • PCI DSS Level 1
  • CCPA compliant
  
  Monitoring:
  • 24/7 security monitoring
  • Automatic threat detection
  • Security alerts
  • Audit logging
  • Access monitoring`
    },
    {
      name: 'pricing',
      description: 'Pricing information',
      action: () => `DashAuth Pricing Plans
  -------------------
  Developer Plan: $29/month
  • 10,000 monthly active users
  • Basic authentication
  • Email/password + social login
  • Community support
  • 99.9% uptime SLA
  
  Business Plan: $199/month
  • 50,000 monthly active users
  • Advanced authentication
  • SSO + MFA
  • Premium support
  • 99.95% uptime SLA
  • Custom domains
  
  Enterprise Plan: Custom pricing
  • Unlimited users
  • Custom features
  • Dedicated support
  • 99.99% uptime SLA
  • Custom SLA
  • Dedicated infrastructure
  • Advanced security
  • Custom compliance
  
  All Plans Include:
  • Authentication API
  • User management
  • Dashboard access
  • Basic analytics
  • Developer docs
  • Community access`
    },
    {
      name: 'mfa',
      description: 'MFA implementation',
      action: () => `Multi-Factor Authentication
  ----------------------
  Supported Methods:
  • TOTP (Google Auth)
  • SMS verification
  • Email codes
  • Security keys (FIDO2)
  • Biometric
  • Push notifications
  • Hardware tokens
  
  Features:
  • Multiple factor support
  • Custom factor rules
  • Risk-based MFA
  • Backup codes
  • Remember device
  • Force MFA policy
  • Custom challenges
  
  Integration:
  • REST API support
  • SDK integration
  • WebAuthn support
  • Custom UI options
  • Branded experience`
    },
    {
      name: 'api',
      description: 'API documentation',
      action: () => `API Documentation
  ----------------
  Base URL: api.dashauth.com
  
  Authentication:
  POST /auth/login
  POST /auth/register
  POST /auth/logout
  POST /auth/refresh
  GET  /auth/session
  
  Users:
  GET    /users
  POST   /users
  GET    /users/:id
  PATCH  /users/:id
  DELETE /users/:id
  
  MFA:
  POST /mfa/enable
  POST /mfa/disable
  POST /mfa/verify
  GET  /mfa/status
  
  Roles:
  GET    /roles
  POST   /roles
  DELETE /roles/:id
  PATCH  /roles/:id
  
  Rate Limits:
  • 1000 requests/min (free)
  • 10000 requests/min (pro)
  • Custom limits (enterprise)
  
  For full documentation:
  docs.dashauth.com/api`
    },
    {
      name: 'sso',
      description: 'SSO implementation',
      action: () => `Single Sign-On (SSO)
  ------------------
  Supported Protocols:
  • SAML 2.0
  • OpenID Connect
  • OAuth 2.0
  • WS-Federation
  
  Identity Providers:
  • Active Directory
  • Azure AD
  • Okta
  • Google Workspace
  • Custom IdP
  
  Features:
  • Just-in-time provisioning
  • Attribute mapping
  • Role mapping
  • Group sync
  • Custom claims
  • IdP-initiated login
  • SP-initiated login
  
  Enterprise Features:
  • Multiple IdP support
  • Automatic user sync
  • Custom attributes
  • Advanced mapping
  • Identity federation`
    },
    {
      name: 'status',
      description: 'System status',
      action: () => `System Status
  -------------
  All Systems Operational
  
  Current Uptime: 99.99%
  API Response: 45ms
  Error Rate: 0.001%
  
  Region Status:
  • US-East    : Operational
  • US-West    : Operational
  • EU-Central : Operational
  • AP-South   : Operational
  • AP-East    : Operational
  
  Service Health:
  • Authentication : ✓
  • Database      : ✓
  • API           : ✓
  • MFA           : ✓
  • SSO           : ✓
  • Webhooks      : ✓
  
  Last Incident: None
  Scheduled Maintenance: None`
    },
    {
      name: 'version',
      description: 'Version information',
      action: () => `DashAuth Version Info
  -------------------
  Current Version: 2.4.0
  Released: March 2024
  Build: 2024.03.15.1
  
  API Versions:
  • v2 (Current)
  • v1 (Deprecated)
  
  SDK Versions:
  • Node.js: 2.4.0
  • Python: 2.4.0
  • Java: 2.4.0
  • Go: 2.4.0
  • Ruby: 2.4.0
  • PHP: 2.4.0
  
  Compatibility:
  • API: v1, v2
  • OAuth: 2.0
  • OIDC: 1.0
  • SAML: 2.0`
    },
    {
      name: 'contact',
      description: 'Contact information',
      action: () => `Contact Information
  ------------------
  Support Channels:
  • Email: support@dashauth.com
  • Phone: +1 (888) 555-0123
  • Chat: dashboard.dashauth.com
  • Docs: docs.dashauth.com
  
  Response Times:
  • Enterprise: 1 hour
  • Business: 4 hours
  • Developer: 24 hours
  
  Office Locations:
  • SF HQ: 123 Tech St
  • NYC: 456 Dev Ave
  • London: 789 Auth Lane
  
  Social:
  • Twitter: @dashauth
  • GitHub: github.com/dashauth
  • LinkedIn: linkedin.com/dashauth`
    }
  ];
  