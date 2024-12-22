export type FAQTag =
  | 'react'
  | 'react-19'
  | 'spa'
  | 'traditional'
  | 'server-side'
  | 'client-side'
  | 'webapp'
  | 'mobile'
  | 'desktop'
  | 'nocode'
  | 'webflow'
  | 'framer'
  | 'flutterflow'
  | 'electron'
  | 'lowcode'
  | 'angular'
  | 'vue'
  | 'svelte'
  | 'nextjs'
  | 'nuxtjs'
  | 'blazor'
  | 'django'
  | 'flask'
  | 'rails'
  | 'wordpress'
  | 'shopify'
  | 'static-site'
  | 'gatsby'
  | 'eleventy'
  | 'web'
  | 'tauri'
  | 'react-native'
  | 'vanilla-js'
  | 'jquery'
  | 'alpinejs'
  | 'astro'
  | 'emberjs'
  | 'handlebars'
  | 'qwik'
  | 'lit'
  | 'preact'
  | 'htmx'
  | 'solidjs'
  | 'elm'
  | 'nwjs'
  | 'squarespace'
  | 'wix'
  | 'windows'
  | 'macos'
  | 'linux'
  | 'unity'
  | 'godot'
  | 'pyqt'
  | 'pyside'
  | 'python';

export interface FAQItem {
  readonly question: string;
  readonly answer: string;
  readonly tags: ReadonlyArray<FAQTag>;
}

export const FAQ_ITEMS: ReadonlyArray<FAQItem> = [
  // React and React Native
  {
    question: 'I use React. What should I select?',
    answer:
      "If your React app uses client-side routing (e.g., react-router) and dynamically updates without full page reloads, select 'Single Page Application'. If it uses server-side rendering (e.g., with Next.js), select 'Traditional Web App'.",
    tags: ['react', 'spa', 'traditional', 'nextjs'],
  },
  {
    question: 'I use React Native. What should I select?',
    answer:
      "React Native builds native apps for iOS and Android. If your app handles platform-specific authentication workflows (e.g., native SDKs for OAuth, biometric login), choose 'iOS App' or 'Android App' based on the platform. However, if you want a unified backend authentication flow using a centralized API, select 'Traditional Web App' for cross-platform compatibility.",
    tags: ['react-native', 'mobile', 'traditional'],
  },

  // Angular, Vue, Svelte
  {
    question: 'I use Angular or Vue. What should I select?',
    answer:
      "If your Angular or Vue app uses client-side routing, choose 'Single Page Application'. For server-rendered apps (e.g., Angular Universal or Nuxt.js), select 'Traditional Web App'.",
    tags: ['angular', 'vue', 'spa', 'server-side', 'nuxtjs'],
  },
  {
    question: 'I use Svelte. What should I select?',
    answer:
      "If your Svelte app updates dynamically on the client, select 'Single Page Application'. For apps rendered on the server with SvelteKit, select 'Traditional Web App'.",
    tags: ['svelte', 'spa', 'server-side'],
  },

  // Backend Frameworks
  {
    question: 'I use Django or Flask. What should I select?',
    answer:
      "Django and Flask apps are server-rendered. Select 'Traditional Web App'.",
    tags: ['django', 'flask', 'traditional'],
  },
  {
    question: 'I use Ruby on Rails. What should I select?',
    answer:
      "Rails apps render content on the server. Choose 'Traditional Web App'.",
    tags: ['rails', 'traditional'],
  },

  // CMS Platforms
  {
    question: 'I use WordPress. What should I select?',
    answer:
      "For standard WordPress sites, select 'Traditional Web App'. If you use WordPress as a headless CMS with a custom JavaScript frontend, select 'Single Page Application'.",
    tags: ['wordpress', 'traditional', 'spa'],
  },
  {
    question: 'I use Shopify. What should I select?',
    answer:
      "For a default Shopify store, select 'Traditional Web App'. If you use a headless storefront like Hydrogen, choose 'Single Page Application'.",
    tags: ['shopify', 'traditional', 'spa'],
  },
  {
    question: 'I use Squarespace or Wix. What should I select?',
    answer:
      "Squarespace and Wix sites are typically server-rendered. Select 'Traditional Web App'.",
    tags: ['squarespace', 'wix', 'traditional'],
  },

  // Static Site Generators
  {
    question: 'I use Gatsby or Eleventy. What should I select?',
    answer:
      "Both Gatsby and Eleventy generate static HTML. Select 'Traditional Web App'.",
    tags: ['gatsby', 'eleventy', 'static-site', 'traditional'],
  },
  {
    question: 'I use Astro. What should I select?',
    answer:
      "Astro apps typically generate static sites or server-rendered content. Select 'Traditional Web App'.",
    tags: ['astro', 'static-site', 'traditional'],
  },

  // JavaScript Frameworks
  {
    question: 'I use Vanilla JavaScript. What should I select?',
    answer:
      "For Vanilla JavaScript apps, select 'Single Page Application' if your app dynamically updates content. For server-rendered or static sites, select 'Traditional Web App'.",
    tags: ['vanilla-js', 'spa', 'traditional'],
  },
  {
    question: 'I use jQuery. What should I select?',
    answer:
      "jQuery-based apps are typically server-rendered and enhance static HTML. Select 'Traditional Web App'.",
    tags: ['jquery', 'traditional'],
  },
  {
    question: 'I use Alpine.js. What should I select?',
    answer:
      "Alpine.js apps typically enhance server-rendered HTML. Select 'Traditional Web App'.",
    tags: ['alpinejs', 'traditional'],
  },
  {
    question: 'I use Ember.js. What should I select?',
    answer:
      "Ember.js apps are typically SPAs. Select 'Single Page Application'.",
    tags: ['emberjs', 'spa'],
  },
  {
    question: 'I use Solid.js. What should I select?',
    answer:
      "Solid.js apps are typically SPAs. Select 'Single Page Application'.",
    tags: ['solidjs', 'spa'],
  },
  {
    question: 'I use HTMX. What should I select?',
    answer:
      "HTMX enhances server-rendered pages with dynamic updates. Select 'Traditional Web App'.",
    tags: ['htmx', 'traditional'],
  },

  // Mobile App Frameworks
  {
    question: 'I use Flutter. What should I select?',
    answer:
      "For Flutter mobile apps, choose 'iOS App' or 'Android App' based on your target platform. For web builds, select 'Traditional Web App'.",
    tags: ['flutterflow', 'mobile', 'web'],
  },
  {
    question: 'I use Blazor. What should I select?',
    answer:
      "If your Blazor app uses WebAssembly and updates dynamically, choose 'Single Page Application'. If it's server-hosted, select 'Traditional Web App'.",
    tags: ['blazor', 'spa', 'traditional'],
  },
  {
    question: 'I use Elm. What should I select?',
    answer: "Elm apps are typically SPAs. Select 'Single Page Application'.",
    tags: ['elm', 'spa'],
  },

  // Desktop Apps
  {
    question: 'I am building a desktop app for Windows. What should I select?',
    answer:
      "For a native Windows desktop app, choose 'Traditional Web App' if it relies on a centralized API for authentication. For Windows-specific native authentication workflows (e.g., Active Directory, Microsoft Authentication Library), ensure integration with your chosen backend service.",
    tags: ['windows', 'desktop', 'traditional'],
  },
  {
    question: 'I am building a desktop app for macOS. What should I select?',
    answer:
      "For a native macOS desktop app, choose 'Traditional Web App' for centralized API authentication. For macOS-specific workflows (e.g., Keychain, Touch ID), integrate these with your backend service.",
    tags: ['macos', 'desktop', 'traditional'],
  },
  {
    question: 'I am building a desktop app for Linux. What should I select?',
    answer:
      "For a native Linux desktop app, choose 'Traditional Web App' if your authentication is API-based. If your app integrates with platform-specific workflows (e.g., PAM for authentication), ensure compatibility with your backend.",
    tags: ['linux', 'desktop', 'traditional'],
  },
  {
    question:
      'I am building a desktop app with Electron.js. What should I select?',
    answer:
      "For Electron.js apps, choose 'Traditional Web App' since Electron typically uses centralized API authentication for both desktop and web compatibility. You can also integrate platform-specific authentication workflows, such as biometric login, using Electron's native modules.",
    tags: ['electron', 'desktop', 'traditional'],
  },
  {
    question:
      'I am building a desktop app with Flutter Desktop. What should I select?',
    answer:
      "Flutter Desktop apps for Windows, macOS, and Linux should use 'Traditional Web App' for centralized API-based authentication. If you need platform-specific features like biometric login (e.g., Face ID or Windows Hello), integrate them via platform channels and connect to your backend service.",
    tags: [
      'flutterflow',
      'desktop',
      'windows',
      'macos',
      'linux',
      'traditional',
    ],
  },
  {
    question: 'I am building a desktop app with Tauri. What should I select?',
    answer:
      "Tauri apps, which combine Rust and web technologies, should use 'Traditional Web App' for authentication via a centralized API. For platform-specific workflows like biometric login, integrate these through Tauri's native bindings and ensure backend compatibility.",
    tags: ['tauri', 'desktop', 'traditional'],
  },
  {
    question: 'I am building a desktop app with NW.js. What should I select?',
    answer:
      "NW.js apps, like Electron.js, typically rely on centralized API authentication for cross-platform compatibility. Select 'Traditional Web App' and use native modules for platform-specific features if needed.",
    tags: ['nwjs', 'desktop', 'traditional'],
  },
  {
    question:
      'I am building a desktop app with Qt for Python (PySide or PyQt). What should I select?',
    answer:
      "For apps built with PySide or PyQt, select 'Traditional Web App' if using centralized API-based authentication. For local authentication workflows, ensure integration with your backend where applicable.",
    tags: ['pyside', 'pyqt', 'python', 'desktop', 'traditional'],
  },
  {
    question: 'I am building a desktop app with Unity. What should I select?',
    answer:
      "For Unity desktop apps, choose 'Traditional Web App' if using a centralized API for authentication. For apps with local-only workflows, you may need to customize backend integration as Unity is not inherently tied to web authentication standards.",
    tags: ['unity', 'desktop', 'traditional'],
  },
  {
    question: 'I am building a desktop app with Godot. What should I select?',
    answer:
      "Godot desktop apps should use 'Traditional Web App' for centralized API-based authentication. For platform-specific workflows, integrate native extensions where needed and connect them to your backend service.",
    tags: ['godot', 'desktop', 'traditional'],
  },
  {
    question:
      'I am building a desktop app with Windows Forms or WPF. What should I select?',
    answer:
      "For apps built with Windows Forms or WPF, choose 'Traditional Web App' to use centralized API-based authentication. If you require integration with Active Directory or other Windows-specific workflows, ensure compatibility with your backend.",
    tags: ['windows', 'desktop', 'traditional'],
  },
] as const;
