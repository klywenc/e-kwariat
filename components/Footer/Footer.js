const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-gray-300 mt-auto py-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p>© {currentYear} e-kwariat. Wszelkie prawa zastrzeżone.</p>
            </div>
        </footer>
    );
};

export default Footer;