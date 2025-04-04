export default function HomePage() {
  return (
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Witaj w e-kwariat!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Twój ulubiony antykwariat online. Znajdź unikalne książki, meble i inne skarby.
        </p>
        <div className="mt-10">
          <a
              href="#"
              className="inline-block bg-amber-700 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Przeglądaj kolekcję
          </a>
        </div>
      </div>
  );
}