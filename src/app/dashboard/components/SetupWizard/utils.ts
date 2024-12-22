// utils.ts

import { COMMON_EMAIL_PROVIDERS } from './constants';
import { PlatformId, SetupDefaults } from './types';

type EmailProvider = (typeof COMMON_EMAIL_PROVIDERS)[number];

const isCommonEmailProvider = (domain: string): domain is EmailProvider => {
  return COMMON_EMAIL_PROVIDERS.includes(domain as EmailProvider);
};

export const extractDomain = (email: string): string => {
  const domain = email?.split('@')?.[1];
  if (!domain) return '';

  return isCommonEmailProvider(domain.toLowerCase()) ? '' : domain;
};

export const generateSecureDefaults = (domain: string): SetupDefaults => {
  return {
    clientId: `authxero_${Math.random().toString(36).slice(2)}_${Date.now()}`,
    redirectUrl: `https://${domain}/auth/callback`,
    configVersion: '1.0.0',
    timestamp: new Date().toISOString(),
  };
};

type CodeSnippets = {
  [K in PlatformId]: string;
};

export const getCodeSnippet = (optionId: PlatformId, domain: string) => {
  const defaults = generateSecureDefaults(domain);

  const snippets: CodeSnippets = {
    spa: `
// Install the package
npm install @authxero/client

// Initialize in your app entry point
import { AuthXero } from '@authxero/client';

const authConfig = {
  domain: '${domain}',
  clientId: '${defaults.clientId}',
  redirectUri: '${defaults.redirectUrl}'
};

AuthXero.init(authConfig);

// Use in your components
const LoginButton = () => {
  const handleLogin = () => AuthXero.login();
  return <button onClick={handleLogin}>Login</button>;
};

// Add to next.config.js or remix.config.js
{
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'Accept, Accept-Version, Content-Length, Content-Type, Date' },
        ],
      },
    ];
  }
}

// Protected Route Example
import { useAuth } from '@authxero/client';

const ProtectedPage = () => {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>;
  }

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};`,

    website: `
<!-- Add to your HTML head -->
<script src="https://cdn.authxero.com/auth.js"></script>

<script>
  const authConfig = {
    domain: '${domain}',
    clientId: '${defaults.clientId}',
    redirectUri: '${defaults.redirectUrl}'
  };

  AuthXero.init(authConfig);
  
  function login() {
    AuthXero.login();
  }

  function logout() {
    AuthXero.logout();
  }

  function checkAuth() {
    const isAuthenticated = AuthXero.isAuthenticated();
    const user = AuthXero.getUser();
    
    if (isAuthenticated && user) {
      document.getElementById('user-name').textContent = user.name;
      document.getElementById('auth-status').textContent = 'Logged In';
    }
  }

  // Check authentication status on page load
  document.addEventListener('DOMContentLoaded', checkAuth);
</script>

<!-- Example protected content -->
<div id="protected-content">
  <h1>Welcome <span id="user-name"></span></h1>
  <p>Auth Status: <span id="auth-status">Not Logged In</span></p>
  <button onclick="login()">Login</button>
  <button onclick="logout()">Logout</button>
</div>`,

    android: `
// Add to your build.gradle
implementation 'com.authxero:sdk:latest'

// Add to AndroidManifest.xml
<activity
    android:name=".AuthActivity"
    android:launchMode="singleTask">
    <intent-filter>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
        <data
            android:host="${domain}"
            android:scheme="authxero"/>
    </intent-filter>
</activity>

// Initialize in your Application class
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        val config = AuthXeroConfig.Builder()
            .domain("${domain}")
            .clientId("${defaults.clientId}")
            .redirectUri("${defaults.redirectUrl}")
            .scope("openid profile email")
            .build()
            
        AuthXero.init(this, config)
    }
}

// Use in your Activities/Fragments
class LoginActivity : AppCompatActivity() {
    private val authClient = AuthXero.getInstance()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        
        findViewById<Button>(R.id.loginButton).setOnClickListener {
            handleLogin()
        }
    }
    
    private fun handleLogin() {
        authClient.login(this)
    }
    
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        authClient.handleLoginResult(requestCode, resultCode, data)
    }
}

// Handle authentication state
class MainViewModel : ViewModel() {
    private val authClient = AuthXero.getInstance()
    
    val isAuthenticated: StateFlow<Boolean> = authClient.isAuthenticated
    val user: StateFlow<User?> = authClient.user
    
    fun logout() {
        viewModelScope.launch {
            authClient.logout()
        }
    }
}`,

    ios: `
// Add to your Podfile
platform :ios, '13.0'
use_frameworks!

target 'YourApp' do
  pod 'AuthXero'
end

// Initialize in AppDelegate
import AuthXero
import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    
    func application(_ application: UIApplication,
                    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        let config = AuthXeroConfig(
            domain: "${domain}",
            clientId: "${defaults.clientId}",
            redirectUri: "${defaults.redirectUrl}",
            scope: "openid profile email"
        )
        
        AuthXero.setup(config)
        return true
    }
    
    func application(_ app: UIApplication,
                    open url: URL,
                    options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return AuthXero.resume(url: url)
    }
}

// Use in your ViewControllers
class LoginViewController: UIViewController {
    private let authClient = AuthXero.shared
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        observeAuthState()
    }
    
    private func setupUI() {
        let loginButton = UIButton(type: .system)
        loginButton.setTitle("Login", for: .normal)
        loginButton.addTarget(self, action: #selector(handleLogin), for: .touchUpInside)
        // Add button to view hierarchy
    }
    
    @objc private func handleLogin() {
        authClient.login(from: self)
    }
    
    private func observeAuthState() {
        authClient.addStateDidChangeListener { [weak self] isAuthenticated in
            if isAuthenticated {
                self?.handleAuthenticationSuccess()
            }
        }
    }
    
    private func handleAuthenticationSuccess() {
        if let user = authClient.user {
            print("Logged in user: \\(user.name)")
            // Navigate to main app interface
        }
    }
}

// SwiftUI Support
import SwiftUI

struct AuthButton: View {
    @ObservedObject private var authState = AuthXero.shared.observableState
    
    var body: some View {
        if authState.isAuthenticated {
            Button("Logout") {
                AuthXero.shared.logout()
            }
        } else {
            Button("Login") {
                AuthXero.shared.login()
            }
        }
    }
}`,
  };

  return {
    code: snippets[optionId],
    defaults,
  };
};
