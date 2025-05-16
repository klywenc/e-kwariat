// app/terms-of-service/page.js
import ContentSection from "@/app/components/contentSection"; // Dostosuj ścieżkę

export const metadata = {
    title: 'Regulamin Sklepu - E-Kwariaty',
    description: 'Zapoznaj się z regulaminem sklepu internetowego E-Kwariaty. Warunki sprzedaży, dostawy, płatności i reklamacji.',
};

const RegulaminPage = () => {
    return (
        // <Layout>
        <div className="container mx-auto py-8 lg:py-12">
            <ContentSection title="Regulamin Sklepu E-Kwariaty">
                {/* Jeśli nie używasz @tailwindcss/typography, każdy element <p>, <h3>, <ol> itp. */}
                {/* powinien mieć własne klasy stylujące. */}
                <p>
                    Niniejszy regulamin (dalej: "Regulamin") określa zasady i warunki świadczenia usług drogą elektroniczną oraz sprzedaży towarów za pośrednictwem sklepu internetowego E-Kwariaty, dostępnego pod adresem www.e-kwariaty.pl (dalej: "Sklep").
                </p>

                <h3>§1 Postanowienia ogólne</h3>
                <ol>
                    <li>Sklep internetowy E-Kwariaty prowadzony jest przez E-Kwariaty Sp. z o.o., z siedzibą w Warszawie (00-001), ul. Książkowa 1, NIP: 123-456-78-90, REGON: 123456789, adres e-mail: kontakt@e-kwariaty.pl (dalej: "Sprzedawca").</li>
                    <li>Regulamin jest integralną częścią umowy sprzedaży zawieranej z Klientem.</li>
                    <li>Ceny podane w Sklepie są cenami brutto (zawierają podatek VAT).</li>
                </ol>

                <h3>§2 Definicje</h3>
                <ul>
                    <li><strong>Klient</strong> – osoba fizyczna, osoba prawna lub jednostka organizacyjna.</li>
                    <li><strong>Konsument</strong> – Klient będący osobą fizyczną dokonującą czynności prawnej niezwiązanej bezpośrednio z jej działalnością gospodarczą lub zawodową.</li>
                    <li><strong>Towar</strong> – produkt prezentowany w Sklepie.</li>
                    <li><strong>Umowa Sprzedaży</strong> – umowa sprzedaży Towarów.</li>
                </ul>

                <h3>§3 Składanie zamówień</h3>
                <ol>
                    <li>Zamówienia można składać 24 godziny na dobę.</li>
                    <li>Warunkiem realizacji zamówienia jest podanie przez Klienta danych pozwalających na weryfikację.</li>
                    <li>Do zawarcia umowy sprzedaży dochodzi z chwilą potwierdzenia przez Sklep przyjęcia Zamówienia do realizacji.</li>
                </ol>

                <h3>§4 Płatności</h3>
                <ol>
                    <li>Klient ma do wyboru formy płatności: przelew bankowy, płatność online (np. PayU, Przelewy24), płatność przy odbiorze.</li>
                    <li>W przypadku płatności "z góry", Klient zobowiązany jest do dokonania płatności w terminie 7 dni.</li>
                </ol>

                <h3>§5 Dostawa</h3>
                <ol>
                    <li>Towary dostarczane są na terytorium Rzeczypospolitej Polskiej.</li>
                    <li>Koszty dostawy są wskazane podczas składania zamówienia.</li>
                    <li>Termin realizacji dostawy wynosi zazwyczaj od 1 do 3 dni roboczych.</li>
                </ol>

                <h3>§6 Prawo odstąpienia od umowy</h3>
                <ol>
                    <li>Konsument może w terminie 14 dni odstąpić od umowy bez podawania przyczyny.</li>
                    <li>Bieg terminu do odstąpienia od umowy rozpoczyna się od objęcia Towaru w posiadanie przez Konsumenta.</li>
                    <li>Oświadczenie o odstąpieniu można złożyć na formularzu lub w innej formie.</li>
                </ol>

                <h3>§7 Reklamacje</h3>
                <ol>
                    <li>Sprzedawca jest zobowiązany dostarczyć Towar wolny od wad.</li>
                    <li>Reklamacje należy składać pisemnie lub drogą elektroniczną.</li>
                    <li>Sprzedawca rozpatrzy reklamację w terminie 14 dni.</li>
                </ol>

                <h3>§8 Ochrona danych osobowych</h3>
                <p>
                    Zasady przetwarzania danych osobowych Klientów Sklepu określa Polityka Prywatności, dostępna na stronie Sklepu.
                </p>

                <h3>§9 Postanowienia końcowe</h3>
                <ol>
                    <li>W sprawach nieuregulowanych mają zastosowanie przepisy prawa polskiego.</li>
                    <li>Sprzedawca zastrzega sobie prawo do dokonywania zmian Regulaminu.</li>
                    <li>Spory będą rozstrzygane przez sądy właściwe.</li>
                </ol>
                <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    Data ostatniej aktualizacji: 1 sierpnia 2024 r.
                </p>
            </ContentSection>
        </div>
        // </Layout>
    );
};

export default RegulaminPage;