// app/privacy-policy/page.js
import ContentSection from "@/app/components/contentSection"; // Dostosuj ścieżkę, jeśli jest inna

export const metadata = {
    title: 'Polityka Prywatności - E-Kwariaty',
    description: 'Przeczytaj naszą politykę prywatności, aby dowiedzieć się, jak chronimy Twoje dane osobowe w sklepie E-Kwariaty.',
};

const PolitykaPrywatnosciPage = () => {
    return (
        // Zakładając, że masz globalny komponent Layout dla nagłówka i stopki
        // <Layout>
        <div className="container mx-auto py-8 lg:py-12">
            <ContentSection title="Polityka Prywatności">
                {/* Jeśli nie używasz @tailwindcss/typography, każdy element <p>, <h3> itp. */}
                {/* powinien mieć własne klasy stylujące, np. text-gray-700, mb-4 itp. */}
                <p>
                    Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazywanych przez Użytkowników w związku z korzystaniem przez nich z usług oferowanych przez serwis internetowy E-Kwariaty (dalej: "Serwis").
                </p>

                <h3>1. Administrator Danych Osobowych</h3>
                <p>
                    Administratorem danych osobowych Użytkowników Serwisu jest E-Kwariaty Sp. z o.o., z siedzibą w Warszawie (00-001), ul. Książkowa 1, NIP: 123-456-78-90, REGON: 123456789 (dalej: "Administrator").
                </p>

                <h3>2. Zakres i cel gromadzenia danych</h3>
                <p>
                    Serwis zbiera dane osobowe, które są dobrowolnie podawane przez Użytkowników podczas:
                </p>
                <ul>
                    <li>Rejestracji konta w Serwisie.</li>
                    <li>Składania zamówień.</li>
                    <li>Zapisywania się do newslettera.</li>
                    <li>Korzystania z formularza kontaktowego.</li>
                </ul>
                <p>
                    Dane te mogą obejmować: imię i nazwisko, adres e-mail, numer telefonu, adres dostawy, dane do faktury. Dane osobowe Użytkowników są przetwarzane w celu:
                </p>
                <ul>
                    <li>Realizacji umów sprzedaży zawartych za pośrednictwem Serwisu.</li>
                    <li>Obsługi konta Użytkownika.</li>
                    <li>Prowadzenia działań marketingowych, za zgodą Użytkownika.</li>
                    <li>Odpowiedzi na zapytania kierowane przez formularz kontaktowy.</li>
                    <li>Wypełnienia obowiązków prawnych ciążących na Administratorze.</li>
                </ul>

                <h3>3. Podstawa prawna przetwarzania danych</h3>
                <p>
                    Dane osobowe są przetwarzane na podstawie:
                </p>
                <ul>
                    <li>Art. 6 ust. 1 lit. b RODO (niezbędność do wykonania umowy).</li>
                    <li>Art. 6 ust. 1 lit. c RODO (obowiązek prawny).</li>
                    <li>Art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes Administratora).</li>
                    <li>Art. 6 ust. 1 lit. a RODO (zgoda Użytkownika).</li>
                </ul>

                <h3>4. Prawa Użytkownika</h3>
                <p>
                    Użytkownik posiada prawo dostępu do treści swoich danych oraz prawo ich sprostowania, usunięcia, ograniczenia przetwarzania, prawo do przenoszenia danych, prawo wniesienia sprzeciwu, prawo do cofnięcia zgody w dowolnym momencie.
                </p>
                <p>
                    W celu realizacji powyższych praw, Użytkownik może skontaktować się z Administratorem poprzez adres e-mail: kontakt@e-kwariaty.pl lub pisemnie na adres siedziby Administratora.
                </p>

                <h3>5. Ciasteczka (Cookies)</h3>
                <p>
                    Serwis wykorzystuje pliki cookies. Są to niewielkie pliki tekstowe wysyłane przez serwer www i przechowywane przez oprogramowanie komputera przeglądarki. Cookies ułatwiają korzystanie z wcześniej odwiedzonych witryn.
                </p>
                <p>
                    Więcej informacji na temat plików cookies można znaleźć w sekcji "Pomoc" w menu przeglądarki internetowej.
                </p>

                <h3>6. Zabezpieczenie danych</h3>
                <p>
                    Administrator dokłada wszelkich starań, aby chronić dane Użytkowników przed nieuprawnionym dostępem osób trzecich i w tym celu stosuje odpowiednie środki techniczne i organizacyjne.
                </p>

                <h3>7. Zmiany w Polityce Prywatności</h3>
                <p>
                    Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce Prywatności. O wszelkich zmianach Użytkownicy będą informowani poprzez publikację nowej treści Polityki Prywatności na stronie Serwisu.
                </p>

                <h3>8. Kontakt</h3>
                <p>
                    W przypadku pytań dotyczących polityki prywatności, prosimy o kontakt pod adresem e-mail: kontakt@e-kwariaty.pl.
                </p>
                <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#6b7280' }}> {/* Inline style dla przykładu, lepiej przez klasy */}
                    Data ostatniej aktualizacji: 1 sierpnia 2024 r.
                </p>
            </ContentSection>
        </div>
        // </Layout>
    );
};

export default PolitykaPrywatnosciPage;