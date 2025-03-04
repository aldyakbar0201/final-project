export function getSession() {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('session') || 'null');
  }
  return null;
}

export function login(email: string, password: string) {
  if (email === 'admin@example.com' && password === 'password') {
    localStorage.setItem('session', JSON.stringify({ role: 'super-admin' }));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem('session');
}
