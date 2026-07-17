/**
 * Login — Authentication page shell ported from Vetify.
 * Decoupled from next-auth. Wire up handleSubmit to POST /api/v1/auth/login
 * on your Express backend when you add authentication.
 *
 * Client-side validation uses zod (already in dependencies).
 */
import { useState } from 'react';
import { z } from 'zod';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setFieldErrors({ email: fe.email?.[0], password: fe.password?.[0] });
      setError('Please correct the highlighted fields.');
      setLoading(false);
      return;
    }

    try {
      // TODO: replace with your auth endpoint
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Invalid email or password');
      } else {
        // TODO: store token, redirect to dashboard
        window.location.href = '/';
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 animate-scaleIn">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 font-black text-white shadow-md shadow-teal-500/30 text-xl">
            B
          </div>
        </div>

        <div className="text-center animate-slideDown">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 animate-slideUp delay-200">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm animate-shake">
              {error}
            </div>
          )}
          <Input
            label="Email address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            required
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-600" />
              Remember me
            </label>
            <a href="#" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
              Forgot password?
            </a>
          </div>
          <Button
            type="submit"
            className="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="relative my-6 animate-fadeIn delay-400">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Social login placeholders — wire up to your OAuth provider */}
        <div className="grid grid-cols-2 gap-3 animate-slideUp delay-600">
          <Button variant="secondary" className="w-full gap-2 hover:-translate-y-0.5 hover:shadow-md transition-all" onClick={() => alert('Wire up Google OAuth')}>
            <span className="text-base">G</span> Google
          </Button>
          <Button variant="secondary" className="w-full gap-2 hover:-translate-y-0.5 hover:shadow-md transition-all" onClick={() => alert('Wire up GitHub OAuth')}>
            <span className="text-base">⌥</span> GitHub
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600 animate-fadeIn delay-700">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
