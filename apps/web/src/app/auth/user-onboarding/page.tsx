import Link from 'next/link';

export default async function Onboarding({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const response = await fetch(
    `http://localhost:8000/api/v1/auth/confirm-email?token=${searchParams.token}`,
  );
  if (!response.ok) {
    return (
      <section>
        <p>Confirmation email failed!. please re register</p>
        <Link href="/auth/user-register">Go to Register Page</Link>
      </section>
    );
  }
  return (
    <section>
      <p>Welcome!!!</p>
      <Link href="/auth/user-login">Go to Login Page</Link>
    </section>
  );
}
