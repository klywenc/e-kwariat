// app/components/ContentSection.js (lub inna odpowiednia ścieżka)
import Image from "next/image";

const ContentSection = ({
                            title,
                            children,
                            imageSrc,
                            imageAlt,
                            imagePosition = "before"
                        }) => {
    // Tekst będzie wyrównany do lewej, jeśli jest obrazek LUB tytuł.
    // W przeciwnym razie (np. tylko przycisk jako children), tekst będzie wyśrodkowany.
    const contentTextAlignClass = (imageSrc || title) ? 'text-left' : 'text-center';

    return (
        <section className="mb-12 md:mb-16 px-4"> {/* Zmniejszony margines dolny dla sekcji */}
            {title && (
                <div className="text-center mb-8 md:mb-10"> {/* Zmniejszony margines dolny dla tytułu */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        {title}
                    </h2>
                    <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
                </div>
            )}

            <div className={`flex flex-col ${imageSrc ? 'gap-8' : ''} items-center`}>
                {imagePosition === "before" && imageSrc && imageAlt && (
                    <div className="relative w-full max-w-2xl h-64 md:h-80 lg:h-96 mb-6 md:mb-0">
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            fill
                            className="rounded-lg shadow-md object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                        />
                    </div>
                )}

                {children && (
                    <div className={`prose prose-indigo max-w-3xl mx-auto ${contentTextAlignClass} text-gray-700`}>
                        {/*
                           Użycie klas 'prose' z @tailwindcss/typography dla lepszego formatowania tekstu.
                           Jeśli nie używasz @tailwindcss/typography, usuń klasy 'prose prose-indigo'
                           i styluj <p>, <ul>, <h3> itp. ręcznie, jak w przykładach stron.
                           W takim przypadku klasa text-gray-700 powinna być na tym divie.
                        */}
                        {children}
                    </div>
                )}

                {imagePosition === "after" && imageSrc && imageAlt && (
                    <div className="relative w-full max-w-2xl h-64 md:h-80 lg:h-96 mt-6 md:mt-8">
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            fill
                            className="rounded-lg shadow-md object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default ContentSection;