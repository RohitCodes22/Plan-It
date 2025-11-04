import Header from "../header/header";
import LogInWidget from "./log_in_widget";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white font-sans">
      <Header />
      <main className="w-full max-w-md mt-12 rounded-2xl shadow-lg p-10 border">
        <LogInWidget />
      </main>
    </div>
  );
}
