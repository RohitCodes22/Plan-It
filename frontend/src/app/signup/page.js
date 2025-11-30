import Header from "../components/header/header";
import SignUpWidget from "./sign_up_widget";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white font-sans">
      <Header />
      <main className="w-full max-w-md mt-12 rounded-2xl shadow-lg p-10 border">
        <SignUpWidget />
      </main>
    </div>
  );
}
