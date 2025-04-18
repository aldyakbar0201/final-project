export async function loginAdmin(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('http://localhost:8000/api/v1/admin/login', {
      method: 'POST',
      credentials: 'include', // cookie diterima dari backend
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.message || 'Login gagal' };
    }

    return { success: true, message: 'Login berhasil' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Terjadi kesalahan saat login' };
  }
}
