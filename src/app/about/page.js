// app/about/page.tsx
import ContentSection from "@/app/components/contentSection";
import MainSlider from "@/app/components/slider/mainPageSlider";

export default function AboutPage() {
    return (
        <main className="flex-grow flex items-center justify-center py-8 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
                <ContentSection title="Witamy w E-Kwariat!">
                    <p className="text-xl md:text-2xl text-gray-600 mb-10">
                        Twoje źródło wyjątkowych książek z drugiej ręki, gdzie każdy wolumin ma swoją historię.
                    </p>
                </ContentSection>

                <MainSlider />

                <ContentSection title="Nasza historia">
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                        E-Kwariat narodził się z pasji do literatury i szacunku dla materialnego dziedzictwa kultury.
                        Zaczynaliśmy jako mały antykwariat w centrum miasta, gdzie miłośnicy książek mogli wymieniać się
                        swoimi skarbami. Dziś, przenosząc naszą działalność do internetu, chcemy dotrzeć do czytelników
                        w całym kraju, oferując wyselekcjonowane pozycje z różnych dziedzin.
                    </p>
                </ContentSection>

                <ContentSection imageSrc="/images/antykwariat.jpg" imageAlt="Nasz antykwariat">
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                        Każda książka w naszym asortymencie przechodzi ręczną selekcję. Dbamy nie tylko o stan fizyczny
                        woluminów, ale też o ich wartość merytoryczną i sentymentalną. Wierzymy, że dobre książki
                        zasługują na drugie życie, a naszą misją jest łączenie ich z nowymi czytelnikami.
                    </p>
                </ContentSection>

                <ContentSection>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                        Specjalizujemy się w literaturze pięknej, naukowej i kolekcjonerskiej. Szczególną uwagę
                        poświęcamy polskiej literaturze, wydaniom z lat 50-90 XX wieku oraz książkom z autografami
                        autorów. W naszym zbiorze znajdziesz zarówno popularne tytuły, jak i prawdziwe białe kruki.
                    </p>
                </ContentSection>

                <ContentSection imageSrc="/images/books-collection.jpg" imageAlt="Nasz zbiór książek">
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                        W E-Kwariat nie sprzedajemy tylko książek - oferujemy kawałki historii, emocje i wspomnienia
                        zapisane na kartkach. Każdy zakup to nie tylko transakcja, ale początek nowej relacji między
                        książką a czytelnikiem. Dołącz do naszej społeczności i odkryj magię książek z duszą.
                    </p>
                </ContentSection>

                <ContentSection title="Godziny otwarcia">
                    <ul className="text-lg text-gray-600">
                        <li>Poniedziałek - Piątek: <strong>10:00 - 18:00</strong></li>
                        <li>Sobota: <strong>10:00 - 14:00</strong></li>
                        <li>Niedziela: <strong>Nieczynne</strong></li>
                    </ul>
                </ContentSection>

                <ContentSection title="Kontakt">
                    <p className="text-lg text-gray-600">
                        📍 Ul. Książkowa 7, 00-001 Warszawa
                    </p>
                    <p className="text-lg text-gray-600 mt-2">
                        📞 +48 987 654 321
                    </p>
                    <p className="text-lg text-gray-600 mt-2">
                        📧 kontakt@e-kwariat.pl
                    </p>
                </ContentSection>
            </div>
        </main>
    );
}