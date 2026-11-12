import { useState } from 'react'
import { supabase } from './supabase'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() }
          }
        })

        if (error) throw error

        if (data.session) {
          setMessage('Your account is ready. Welcome to AgencyOS!')
        } else {
          setMessage(
            'Account created. Check your email to confirm your account, then log in.'
          )
          setMode('login')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })

        if (error) throw error
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function switchMode() {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError('')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center p-5 text-white">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-600/25">
            <Sparkles size={27} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            AgencyOS
          </h1>

          <p className="text-slate-400 mt-2">
            Your agency. One workspace.
          </p>
        </div>

        <div className="bg-[#151923] border border-white/10 rounded-2xl p-7 shadow-2xl">

          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {mode === 'login'
                ? 'Welcome back'
                : 'Create your account'}
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              {mode === 'login'
                ? 'Log in to manage your agency.'
                : 'Get started with your AgencyOS workspace.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {mode === 'signup' && (
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Full name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  className="w-full bg-[#0B0D12] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full bg-[#0B0D12] border border-white/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete={
                    mode === 'login'
                      ? 'current-password'
                      : 'new-password'
                  }
                  minLength={6}
                  required
                  className="w-full bg-[#0B0D12] border border-white/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="text-sm text-emerald-400 bg-emerald-400/10 rounded-lg p-3"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 rounded-xl py-3 font-semibold transition"
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Log in'
                  : 'Create account'}

              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          <div className="text-center text-sm text-slate-400 mt-6">
            {mode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}

            <button
              type="button"
              onClick={switchMode}
              className="text-violet-400 hover:text-violet-300 font-semibold ml-1"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>

        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Secure authentication powered by Supabase
        </p>

      </div>
    </div>
  )
}