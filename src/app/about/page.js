// app/about/page.tsx
import ContentSection from "@/app/components/contentSection";
import MainSlider from "@/app/components/slider/mainPageSlider";

export const metadata = {
    title: 'O Nas - E-Kwariat | Twoja Księgarnia z Historią',
    description: 'Poznaj E-Kwariat - miejsce, gdzie pasja do książek łączy się z szacunkiem dla ich historii. Odkryj naszą misję, wartości i unikalne zbiory.',
};

export default function AboutPage() {
    return (
        <main className="flex-grow flex items-center justify-center py-8 bg-gray-50">
            <div className="container mx-auto px-4 text-center"> {/* Globalne text-center */}
                <ContentSection title="Witamy w E-Kwariat!">
                    {/* Ten tekst będzie wyśrodkowany dzięki text-center z kontenera i ContentSection (brak obrazka) */}
                    <p className="text-xl md:text-2xl text-gray-600 mb-10">
                        Poznaj miejsce, gdzie każda książka ma swoją duszę, a miłość do literatury łączy pokolenia.
                    </p>
                </ContentSection>

                <MainSlider />

                <ContentSection title="Nasza historia">
                    {/* Dodajemy text-center bezpośrednio do elementu <p>,
                        aby tekst wewnątrz tego paragrafu był wyśrodkowany.
                        mx-auto wyśrodkuje sam blok paragrafu, a max-w-2xl ograniczy jego szerokość. */}
                    <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                        E-Kwariat narodził się z głębokiej pasji do literatury i niezachwianego szacunku dla materialnego dziedzictwa kultury.
                        Zaczynaliśmy jako mały, stacjonarny antykwariat, gdzie miłośnicy książek mogli dzielić się swoimi skarbami. Dziś, przenosząc naszą działalność do świata online, pragniemy dotrzeć do czytelników
                        w całym kraju, oferując starannie wyselekcjonowane pozycje z różnych dziedzin i epok.
                    </p>
                </ContentSection>

                <ContentSection imageSrc="/images/antykwariat.jpg" imageAlt="Nasz antykwariat - miejsce pełne książkowych skarbów">
                    {/* ContentSection z obrazkiem domyślnie ustawi text-left dla children. Nadpisujemy to przez div z text-center. */}
                    <div className="text-center">
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                            Każda książka w naszym asortymencie przechodzi staranną, ręczną selekcję. Dbamy nie tylko o stan fizyczny
                            woluminów, ale przede wszystkim o ich wartość merytoryczną, historyczną i sentymentalną. Wierzymy, że dobre książki
                            zasługują na drugie, a nawet trzecie życie, a naszą misją jest łączenie ich z nowymi, ciekawymi czytelnikami.
                        </p>
                    </div>
                </ContentSection>

                {/* Sekcja bez tytułu, skupiona na ofercie */}
                <ContentSection>
                    {/* Ten tekst będzie wyśrodkowany */}
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                        Specjalizujemy się w szerokim spektrum literatury: od polskiej i światowej klasyki, przez książki naukowe i popularnonaukowe, po wydania kolekcjonerskie. Szczególną uwagę
                        poświęcamy polskiej literaturze, wydaniom z okresu międzywojennego oraz lat 50-90 XX wieku, a także książkom z autografami
                        autorów. W naszym zbiorze znajdziesz zarówno popularne tytuły, jak i prawdziwe białe kruki.
                    </p>
                </ContentSection>

                <ContentSection imageSrc="/images/books-collection.jpg" imageAlt="Nasz zbiór książek - różnorodność tytułów i gatunków">
                    {/* ContentSection z obrazkiem domyślnie ustawi text-left dla children. Nadpisujemy to przez div z text-center. */}
                    <div className="text-center">
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                            W E-Kwariat nie sprzedajemy jedynie książek – oferujemy fragmenty historii, emocje i wspomnienia
                            zamknięte na kartach papieru. Każdy zakup to nie tylko transakcja, ale początek nowej, fascynującej relacji między
                            książką a jej nowym opiekunem. Dołącz do naszej społeczności pasjonatów i odkryj magię książek z duszą.
                        </p>
                    </div>
                </ContentSection>

                <ContentSection title="Godziny Działalności Sklepu Online">
                    {/* Dodajemy klasę text-center bezpośrednio do elementu <ul>,
                        aby upewnić się, że wszystkie elementy <li> wewnątrz
                        będą miały tekst wyśrodkowany. */}
                    <ul className="text-center text-lg text-gray-600 list-none space-y-1">
                        <li>Nasz sklep internetowy jest dla Ciebie otwarty: <strong>24/7</strong></li>
                        <li>Obsługa Klienta i realizacja zamówień:</li>
                        <li>Poniedziałek - Piątek: <strong>9:00 - 17:00</strong></li>
                        <li>Sobota: <strong>Odpowiadamy na zapytania</strong></li>
                        <li>Niedziela i Święta: <strong>Nieczynne</strong></li>
                    </ul>
                </ContentSection>

                <ContentSection title="Skontaktuj Się z Nami">
                    {/* Dodajemy klasę text-center bezpośrednio do tego diva,
                        aby upewnić się, że wszystkie elementy <p> wewnątrz
                        będą miały tekst wyśrodkowany. */}
                    <div className="text-center text-lg text-gray-600 space-y-2">
                        <p>
                            📍 E-Kwariat Sp. z o.o., Ul. Literacka 7A, 01-234 Warszawa
                        </p>
                        <p>
                            📞 <a href="tel:+48987654321" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200">+48 987 654 321</a>
                        </p>
                        <p>
                            📧 <a href="mailto:kontakt@e-kwariat.pl" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200">kontakt@e-kwariat.pl</a>
                        </p>
                    </div>
                </ContentSection>
            </div>
        </main>
    );
}