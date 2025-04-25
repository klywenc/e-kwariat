import Image from "next/image";

const ContentSection = ({
                            title,
                            children,
                            imageSrc,
                            imageAlt,
                            imagePosition = "before"
                        }) => {
    return (
        <section className="mb-16 px-4">
            {title && (
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        {title}
                    </h2>
                    <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
                </div>
            )}

            <div className={`flex flex-col ${imageSrc ? 'gap-8' : ''} items-center`}>
                {imagePosition === "before" && imageSrc && imageAlt && (
                    <div className="relative w-full max-w-2xl h-64 md:h-80 lg:h-96">
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
                    <div className={`text-gray-600 max-w-3xl mx-auto ${imageSrc ? 'text-left' : 'text-center'}`}>
                        {children}
                    </div>
                )}

                {imagePosition === "after" && imageSrc && imageAlt && (
                    <div className="relative w-full max-w-2xl h-64 md:h-80 lg:h-96">
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