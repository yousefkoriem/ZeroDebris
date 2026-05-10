'use client';
import { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import logo from '@/app/icon.png';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

export default function LoginPage() {
  const [username, setUsername] = useState('operator');
  const [password, setPassword] = useState('operator');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-bg to-bg pointer-events-none" />
      <Card className="w-full max-w-sm relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 overflow-hidden">
            <Image src={logo} alt="Observer-1 Logo" width={28} height={28} className="rounded-sm" />
          </div>
          <div>
            <CardTitle className="text-2xl">Egypt Observer-1</CardTitle>
            <p className="text-sm text-muted mt-1">Mission Control Authorization</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Operator ID</label>
              <Input value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Passcode</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <div className="text-sm text-danger-500 font-medium">{error}</div>}
            <Button type="submit" className="w-full h-11 text-base">
              Establish Uplink
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
