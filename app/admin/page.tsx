// app/admin/page.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, verifyToken, setAuthToken } from '../_actions/action'

const AdminLoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // If token already present, verify and redirect to /admin/manage
    const token = typeof window !== 'undefined' ? localStorage.getItem('api_token') : null;
    if (token) {
      (async () => {
        setLoading(true);
        try {
          const res = await verifyToken(token);
          if (res.data && res.data.status) {
            setAuthToken(token);
            router.push('/admin/manage');
          } else {
            localStorage.removeItem('api_token');
            setAuthToken('');
          }
        } catch (err) {
          localStorage.removeItem('api_token');
          setAuthToken('');
        } finally {
          setLoading(false);
        }
      })();
    }    
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await login(username, password);
      if (res.data && res.data.status && res.data.token) {
        const token = res.data.token;
        const username=res.data.user;
        localStorage.setItem('api_token', token);
        localStorage.setItem('username',username.username );
        setAuthToken(token);
        router.push('/admin/manage');
      } else {
        setErrorMsg(res.data?.message || 'Login failed');
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title mb-3 text-center text-primary">Admin Login</h4>
              {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button className="btn btn-primary" disabled={loading}>
                    {loading ? 'Please wait...' : 'Log in'}
                  </button>
                </div>
              </form>
              <hr />
          <div className="d-grid">
                  <button className="btn btn-success" onClick={()=>{
                    router.push("/search")
                  }}>
                    Go back
                  </button>
                </div>
              <hr />

              <div className="text-muted small text-center">
                If you are already logged in you'll be redirected automatically.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
