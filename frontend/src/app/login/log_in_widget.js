export default function Home() {
  return (
    <div className="w-72 h-96 bg-gray-900 rounded-xl flex border-gray-100 border-2 flex-col">
        <header className="flex-1 w-full rounded-t-xl flex items-center justify-center border-b-2 border-gray-100">
            <h1 className="text-2xl text-center">Login</h1>
        </header>

        <div className="flex-4 flex flex-col">

            <form className="m-3" method="post">
                <label htmlFor="username">Username:</label>
                <input className="border-gray-100 border-2 rounded-md mb-3" type="text" id="username" value={" "}/>

                <label htmlFor="username">Password:</label>
                <input className="border-gray-100 border-2 rounded-md mb-3" type="text" id="username" value={" "}/>

                <button className="border-gray-100 border-2 rounded-md p-3 hover:scale-105 transition" type="submit">Log in</button>
            </form>
        </div>
    </div>
  );
}
