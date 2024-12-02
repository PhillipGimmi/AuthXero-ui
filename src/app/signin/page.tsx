// src/app/signin/page.tsx
import DarkGridAuth from './DarkGridAuth';

export const metadata = {
  title: 'Sign In - MyApp',
  description: 'Access your account or create a new one on MyApp.',
};

export default function SignInPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950">
      {/* Radial gradient overlay */}
      <div 
        style={{ backgroundImage: "radial-gradient(100% 100% at 100% 0%, rgba(9,9,11,0), rgba(9,9,11,1))" }} 
        className="absolute inset-0 pointer-events-none"
      />
      {/* Main content */}
      <DarkGridAuth />
    </div>
  );
}
