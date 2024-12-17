'use client';
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { 
  Menu, X, Bell, User, Building,
  Users, Shield, Key, Lock, Database, Code, Activity,
  Webhook, Terminal, FileCode, Blocks, Fingerprint, 
  History, CheckCircle, ChevronDown,
  KeyRound, Network, FolderTree, ShieldCheck, 
  AlertTriangle, BookLock, FileText, Puzzle, AlertOctagon, 
  BarChart2, LineChart, Mail, Smartphone, Rocket,
  UserCheck, FileKey, BoxSelect, ArrowRight, Zap,
  Binary, Globe, Eye, BrainCircuit, KeySquare, HelpCircle,
  Brush, Mountain, ScrollText, GanttChart, PaintBucket,
  Component, Wrench, FileJson, Search, Cog
} from 'lucide-react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import type { AuthContextType } from '@/types/auth';
import DashAuthLogo from '@/components/DashAuthLogo';

type Plan = 'pro' | 'enterprise';

type SidebarItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  requiresPlan?: Plan;
  description?: string;
  isNew?: boolean;
}

interface ShowTooltipEvent extends CustomEvent {
  detail: TooltipState;
}

type SidebarSection = {
  label: string;
  id: string;
  requiresPlan?: Plan;
  items: SidebarItem[];
}

type TooltipState = {
  text: string;
  x: number;
  y: number;
}

const TOOLTIP_DELAY = 200;
const TOOLTIP_OFFSET = 8;

function GlobalTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    const showTooltip = (e: ShowTooltipEvent) => {
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      setTooltip(e.detail);
      showTimer = setTimeout(() => setIsVisible(true), TOOLTIP_DELAY);
    };

    const hideTooltip = () => {
      clearTimeout(showTimer);
      setIsVisible(false);
      hideTimer = setTimeout(() => setTooltip(null), 200);
    };

    window.addEventListener('showTooltip', showTooltip as EventListener);
    window.addEventListener('hideTooltip', hideTooltip);

    return () => {
      window.removeEventListener('showTooltip', showTooltip as EventListener);
      window.removeEventListener('hideTooltip', hideTooltip);
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            left: tooltip.x + TOOLTIP_OFFSET,
            top: tooltip.y,
            transform: 'translateY(-50%)',
            zIndex: 100
          }}
          className="px-3 py-2 text-sm bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-xl shadow-black/10 text-zinc-200 whitespace-pre-wrap max-w-sm pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.2, ease: 'easeOut', delay: 0.05 }}
          >
            {tooltip.text}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TooltipTrigger({ item }: { readonly item: SidebarItem | SidebarSection }) {
  const pathname = usePathname();

  const getTooltipText = () => {
    if ('items' in item) {
      return sectionDescriptions[item.id] ?? '';
    } else {
      const pathKey = item.href.split('/').pop() ?? '';
      const description = tooltipDescriptions[pathKey];
      if (!description) return '';
      
      let text = description;
      if (item.requiresPlan) {
        text += `\nRequires ${item.requiresPlan} plan`;
      }
      return text;
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const text = getTooltipText();
    if (!text) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const event = new CustomEvent('showTooltip', {
      detail: {
        text,
        x: rect.right,
        y: rect.top + (rect.height / 2)
      }
    }) as CustomEvent<TooltipState>;

    window.dispatchEvent(event);
  };

  const handleMouseLeave = () => {
    window.dispatchEvent(new Event('hideTooltip'));
  };

  let planLabel = null;
  if (item.requiresPlan === 'pro') {
    planLabel = (
      <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded ml-2">
        Pro
      </span>
    );
  } else if (item.requiresPlan === 'enterprise') {
    planLabel = (
      <span className="text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded ml-2">
        Enterprise
      </span>
    );
  }

  if ('items' in item) {
    return (
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex items-center gap-2"
        type="button"
      >
        <span>{item.label}</span>
        {planLabel}
      </button>
    );
  }

  return (
    <Link
      href={item.href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:translate-x-1
        ${pathname === item.href ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <item.icon size={18} className={pathname === item.href ? 'text-blue-400' : 'text-zinc-400 group-hover:text-white'} />
        {item.isNew && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </motion.div>
      <div className="flex-1 flex items-center justify-between">
        <span>{item.label}</span>
        {planLabel}
      </div>
    </Link>
  );
}

const tooltipDescriptions: Record<string, string> = {
  'quickstart': 'Get up and running quickly with our step-by-step guide',
  'implementation': 'Detailed implementation guide and best practices',
  'migration': 'Tools and guides for migrating from other auth providers',
  'faqs': 'Frequently asked questions and troubleshooting',
  'examples': 'Code examples and sample implementations',
  'users': 'User management and authentication controls',
  'roles': 'Role-based access control management',
  'permissions': 'Fine-grained permission management',
  'api-keys': 'API key management and rotation',
  'social': 'Social authentication provider integration',
  'mfa': 'Multi-factor authentication for enhanced security',
  'jwt': 'JSON Web Token configuration and management',
  'orgs': 'Organization management and hierarchy',
  'multitenancy': 'Multi-tenant infrastructure setup and management',
  'sso': 'Single Sign-On with SAML 2.0 support',
  'directory': 'LDAP and Active Directory integration',
  'teams': 'Team management and permissions',
  'zk': 'Zero-Knowledge authentication overview',
  'proofs': 'Zero-knowledge proof generation and verification',
  'keys': 'Cryptographic key management',
  'blind': 'Zero-knowledge blind signing implementation',
  'trust': 'Zero Trust Architecture overview',
  'trust/policies': 'Zero Trust policy configuration',
  'trust/devices': 'Device management and trust levels',
  'trust/rules': 'Security rule configuration',
  'security': 'Security overview and configuration options',
  'threats': 'Advanced threat detection and prevention',
  'sessions': 'Session management and monitoring',
  'policies': 'Security policy configuration and management',
  'rate-limits': 'Configure rate limiting and throttling',
  'compliance': 'Overview of compliance tools and configurations',
  'compliance/soc2': 'SOC2 compliance tools and reporting',
  'compliance/hipaa': 'HIPAA compliance configuration',
  'compliance/gdpr': 'GDPR compliance tools and settings',
  'compliance/pci': 'PCI DSS compliance configuration',
  'compliance/reports': 'Compliance reporting and auditing tools',
  'sdks': 'Software Development Kits for all platforms',
  'webhooks': 'Configure and manage webhook integrations',
  'cli': 'Command Line Interface tools and usage for admins',
  'api': 'API documentation and configuration options',
  'extensions': 'Custom extensions and plugins for advanced use',
  'auth-ui': 'Authentication UI customization options',
  'branding': 'Custom branding and white-labeling options',
  'emails': 'Email template customization options',
  'sms': 'SMS notification setup and customization',
  'components': 'UI component library for custom development',
  'themes': 'Advanced theme customization options',
  'analytics': 'Analytics and reporting overview',
  'analytics/usage': 'Usage statistics and trends',
  'analytics/reports': 'Generate and customize reports',
  'analytics/alerts': 'Set up alerts and monitoring',
  'analytics/audit': 'Detailed audit logging and tracking tools',
  'settings': 'Manage general system settings',
  'storage': 'Configure data storage settings',
  'domain': 'Set up custom domain configuration',
  'advanced': 'Advanced system settings and options'
};

const sectionDescriptions: Record<string, string> = {
  'start': 'Resources to get you started quickly',
  'auth': 'Core authentication and user management features',
  'enterprise': 'Enterprise-grade authentication features',
  'zk': 'Zero-Knowledge Authentication features and settings',
  'zero-trust': 'Zero Trust Architecture implementation options',
  'security': 'Security controls and configurations',
  'compliance': 'Compliance and regulatory features',
  'integration': 'Integration with external systems and tools',
  'customize': 'UI and branding customization options',
  'analytics': 'Usage analytics and reporting',
  'settings': 'Global system settings and configurations'
};

const variants = {
  sidebar: {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: -280, transition: { type: "spring", stiffness: 300, damping: 30 } }
  },
  rotate: {
    open: { rotate: 180 },
    closed: { rotate: 0 }
  },
  fade: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 }
  },
  expand: {
    initial: { height: 0, opacity: 0 },
    animate: { 
      height: 'auto', 
      opacity: 1,
      transition: {
        height: { type: "spring", stiffness: 400, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: { 
      height: 0,
      opacity: 0,
      transition: {
        height: { type: "spring", stiffness: 400, damping: 30 },
        opacity: { duration: 0.2 }
      }
    }
  }
};

type DashboardLayoutProps = {
  readonly children: React.ReactNode;
}

const sidebarItems: SidebarSection[] = [
  {
    label: 'Getting Started',
    id: 'start',
    items: [
      { icon: Rocket, label: 'Quick Start', href: '/dashboard/quickstart' },
      { icon: ArrowRight, label: 'Implementation', href: '/dashboard/implementation' },
      { icon: Mountain, label: 'Migration', href: '/dashboard/migration' },
      { icon: HelpCircle, label: 'FAQs', href: '/dashboard/faqs' },
      { icon: FileJson, label: 'Examples', href: '/dashboard/examples' },
    ]
  },
  {
    label: 'Core Auth',
    id: 'auth',
    items: [
      { icon: Users, label: 'Users', href: '/dashboard/users' },
      { icon: Shield, label: 'Roles', href: '/dashboard/roles' },
      { icon: Lock, label: 'Permissions', href: '/dashboard/permissions' },
      { icon: Key, label: 'API Keys', href: '/dashboard/api-keys' },
      { icon: UserCheck, label: 'Social Auth', href: '/dashboard/social' },
      { icon: Fingerprint, label: 'MFA', href: '/dashboard/mfa', requiresPlan: 'pro' },
      { icon: Binary, label: 'JWT', href: '/dashboard/jwt' },
    ]
  },
  {
    label: 'Advanced Security',
    id: 'pro-security',
    requiresPlan: 'pro',
    items: [
      { icon: Shield, label: 'Overview', href: '/dashboard/security' },
      { icon: AlertTriangle, label: 'Threats', href: '/dashboard/threats' },
      { icon: History, label: 'Sessions', href: '/dashboard/sessions' },
      { icon: BookLock, label: 'Policies', href: '/dashboard/policies' },
      { icon: Zap, label: 'Rate Limits', href: '/dashboard/rate-limits' },
    ]
  },
  {
    label: 'Enterprise',
    id: 'enterprise',
    requiresPlan: 'enterprise',
    items: [
      { icon: Building, label: 'Organizations', href: '/dashboard/orgs' },
      { icon: Network, label: 'Multi-tenant', href: '/dashboard/multitenancy' },
      { icon: KeyRound, label: 'SSO / SAML', href: '/dashboard/sso' },
      { icon: Globe, label: 'LDAP/AD', href: '/dashboard/directory' },
      { icon: FolderTree, label: 'Teams', href: '/dashboard/teams' },
    ]
  },
  {
    label: 'ZK Auth',
    id: 'zk-auth',
    requiresPlan: 'enterprise',
    items: [
      { icon: Eye, label: 'Overview', href: '/dashboard/zk' },
      { icon: BrainCircuit, label: 'Proofs', href: '/dashboard/zk/proofs' },
      { icon: KeySquare, label: 'Keys', href: '/dashboard/zk/keys' },
      { icon: ScrollText, label: 'Blind Sign', href: '/dashboard/zk/blind' },
    ]
  },
  {
    label: 'Zero Trust',
    id: 'zero-trust',
    requiresPlan: 'enterprise',
    items: [
      { icon: ShieldCheck, label: 'Overview', href: '/dashboard/trust' },
      { icon: GanttChart, label: 'Policies', href: '/dashboard/trust/policies' },
      { icon: FileKey, label: 'Devices', href: '/dashboard/trust/devices' },
      { icon: BoxSelect, label: 'Rules', href: '/dashboard/trust/rules' },
    ]
  },
  {
    label: 'Compliance',
    id: 'compliance',
    requiresPlan: 'enterprise',
    items: [
      { icon: CheckCircle, label: 'Overview', href: '/dashboard/compliance' },
      { icon: Shield, label: 'SOC2', href: '/dashboard/compliance/soc2' },
      { icon: Shield, label: 'HIPAA', href: '/dashboard/compliance/hipaa' },
      { icon: Shield, label: 'GDPR', href: '/dashboard/compliance/gdpr' },
      { icon: Shield, label: 'PCI', href: '/dashboard/compliance/pci' },
      { icon: FileText, label: 'Reports', href: '/dashboard/compliance/reports' },
    ]
  },
  {
    label: 'Analytics',
    id: 'analytics',
    requiresPlan: 'pro',
    items: [
      { icon: Activity, label: 'Overview', href: '/dashboard/analytics' },
      { icon: BarChart2, label: 'Usage', href: '/dashboard/analytics/usage' },
      { icon: LineChart, label: 'Reports', href: '/dashboard/analytics/reports', requiresPlan: 'pro' },
      { icon: AlertOctagon, label: 'Alerts', href: '/dashboard/analytics/alerts', requiresPlan: 'pro' },
      { icon: Search, label: 'Audit Logs', href: '/dashboard/analytics/audit', requiresPlan: 'pro' },
    ]
  },
  {
    label: 'Integration',
    id: 'integration',
    items: [
      { icon: Code, label: 'SDKs', href: '/dashboard/sdks' },
      { icon: Webhook, label: 'Webhooks', href: '/dashboard/webhooks' },
      { icon: Terminal, label: 'CLI', href: '/dashboard/cli' },
      { icon: FileCode, label: 'API', href: '/dashboard/api' },
      { icon: Puzzle, label: 'Extensions', href: '/dashboard/extensions', requiresPlan: 'pro' },
    ]
  },
  {
    label: 'Customize',
    id: 'customize',
    items: [
      { icon: Component, label: 'Auth UI', href: '/dashboard/auth-ui', requiresPlan: 'pro' },
      { icon: Brush, label: 'Branding', href: '/dashboard/branding', requiresPlan: 'pro' },
      { icon: Mail, label: 'Emails', href: '/dashboard/emails', requiresPlan: 'pro' },
      { icon: Smartphone, label: 'SMS', href: '/dashboard/sms', requiresPlan: 'pro' },
      { icon: PaintBucket, label: 'Themes', href: '/dashboard/themes', requiresPlan: 'pro' },
    ]
  },
  {
    label: 'Settings',
    id: 'settings',
    items: [
      { icon: Cog, label: 'General', href: '/dashboard/settings' },
      { icon: Database, label: 'Storage', href: '/dashboard/storage' },
      { icon: Blocks, label: 'Domain', href: '/dashboard/domain', requiresPlan: 'pro' },
      { icon: Wrench, label: 'Advanced', href: '/dashboard/advanced' },
    ]
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['start']);
  const { user, logout } = useAuth() as AuthContextType;


  const handleLogout = () => {
    logout();
  };

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-zinc-950 text-white">
        <GlobalTooltip />
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 right-0 left-0 h-16 bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800 z-50"
        >
          <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSidebarOpen(prev => !prev)}
        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
      >
        <motion.div
          variants={variants.rotate}
          initial={false}
          animate={isSidebarOpen ? "open" : "closed"}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.div>
      </motion.button>
      <DashAuthLogo />
    </div>
            
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors relative"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
              </motion.button>
              
              <div className="relative">
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700"
                >
                  <User size={14} />
                  <span className="text-sm">{user?.email}</span>
                </motion.button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      variants={variants.fade}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute right-0 mt-2 w-48 py-2 bg-zinc-900 rounded-lg border border-zinc-800 shadow-xl"
                    >
                      <Link 
                        href="/dashboard/profile" 
                        className="block px-4 py-2 hover:bg-zinc-800 text-sm transition-colors"
                      >
                        Profile
                      </Link>
                      <Link 
                        href="/dashboard/settings" 
                        className="block px-4 py-2 hover:bg-zinc-800 text-sm transition-colors"
                      >
                        Settings
                      </Link>
                      <hr className="my-2 border-zinc-800" />
                        <button
                          onClick={handleLogout}  // Use handleLogout instead of logout
                          className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm text-red-400 transition-colors"
                        >
                          Sign Out
                        </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        <motion.aside 
          variants={variants.sidebar}
          initial={false}
          animate={isSidebarOpen ? "open" : "closed"}
          className="fixed left-0 top-16 bottom-0 w-64 bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800"
        >
          <nav className="h-full overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-800">
            {sidebarItems.map((section) => (
              <div key={section.id} className="mb-6">
                <button
                  onClick={() => toggleSection(section.id)}
                  onMouseEnter={(e) => {
                    const text = sectionDescriptions[section.id] || '';
                    if (text) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const event = new CustomEvent('showTooltip', {
                        detail: {
                          text,
                          x: rect.right,
                          y: rect.top + (rect.height / 2)
                        }
                      });
                      window.dispatchEvent(event);
                    }
                  }}
                  onMouseLeave={() => window.dispatchEvent(new Event('hideTooltip'))}
                  className={`w-full px-3 py-2 mb-2 rounded-lg flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider group hover:bg-white/5 active:bg-white/10 cursor-pointer ${expandedSections.includes(section.id) ? 'bg-zinc-800/30' : ''}`}
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex-1 text-left">{section.label}</span>
                    {section.requiresPlan && (
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`text-[10px] px-1.5 py-0.5 ${section.requiresPlan === 'pro' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'} rounded`}
                      >
                        {section.requiresPlan.charAt(0).toUpperCase() + section.requiresPlan.slice(1)}
                      </motion.span>
                    )}
                  </div>
                  <motion.div
                    initial={false}
                    animate={{ rotate: expandedSections.includes(section.id) ? 180 : 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-zinc-500 group-hover:text-zinc-300 ml-2"
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {expandedSections.includes(section.id) && (
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={variants.expand}
                      className="overflow-hidden"
                    >
                      <motion.div 
                        className="space-y-1 px-2"
                        initial="closed"
                        animate="open"
                        variants={{
                          open: {
                            transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                          },
                          closed: {}
                        }}
                      >
                        {section.items.map((item) => (
                          <motion.div
                            key={item.href}
                            variants={{
                              open: {
                                opacity: 1,
                                y: 0,
                                transition: { type: "spring", stiffness: 300, damping: 24 }
                              },
                              closed: { opacity: 0, y: 20 }
                            }}
                          >
                            <TooltipTrigger item={item} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </motion.aside>

        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`pt-24 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
        >
          <div className="px-8">
            {children}
          </div>
        </motion.main>
      </div>
    </MotionConfig>
  );
}

export default DashboardLayout;
