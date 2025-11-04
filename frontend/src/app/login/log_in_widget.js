export default function LogInWidget() {
  return (
    <div className="w-full flex flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-sm text-gray-600">Welcome back! Please sign in.</p>
      </header>

      <form className="flex flex-col gap-4" method="post">
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="text"
            id="username"
            name="username"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="password"
            id="password"
            name="password"
          />
        </div>

        <button
          className="w-full border rounded-md py-2 mt-2 hover:bg-gray-100 transition font-medium"
          type="submit"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
