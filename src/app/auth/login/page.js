export default function LoginPage() {
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                Logowanie
            </h1>
            <p className="text-center text-gray-600 mb-6">
                Wkrótce pojawi się tutaj formularz logowania.
            </p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Hasło</label>
                    <input type="password" id="password" name="password" disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" />
                </div>
                <button type="submit" disabled className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 cursor-not-allowed">
                    Zaloguj się (niedostępne)
                </button>
            </div>
        </div>
    );
}