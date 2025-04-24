export default function Footer() {
    return (
      <footer className="bg-gray-800 text-gray-300 mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} E-Kwariat. Wszelkie prawa zastrzeżone.</p>
          {/* Możesz dodać linki do polityki prywatności, regulaminu itp. */}
          <div className="mt-2 space-x-4">
             <a href="/polityka-prywatnosci" className="hover:text-white text-sm">Polityka Prywatności</a>
             <a href="/regulamin" className="hover:text-white text-sm">Regulamin</a>
          </div>
        </div>
      </footer>
    );
  }