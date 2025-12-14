import Login from "@/app/components/Login";

export default function LoginPage({ searchParams }: any) {
  
  const { game, pending } = searchParams;

  const proceedTo =
    game ? `/game/${game}` :
    pending ? `/pending/${pending}` :
    "/";

  return (
    <>
      <h2>Login</h2>
      <Login proceedTo={proceedTo} />
    </>
  );
}
