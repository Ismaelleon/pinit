import Navbar from './navbar';

export default function PinLoading () {
    return (
        <>
            <Navbar />
            <main className="flex justify-center mt-[64px] p-4">
                <section className="flex flex-col max-w-3xl w-full sm:flex-row gap-3">
                    <div className="w-full sm:w-64 h-56 rounded bg-neutral-400"></div>
                    <section className="sm:w-1/2">
                        <section className="p-2">
                            <div className="w-[40px] h-[40px] rounded-full bg-neutral-400 mb-3"></div>
                            <div className="w-64 h-5 rounded bg-neutral-400 mb-2"></div>
                            <div className="w-64 h-4 rounded bg-neutral-400 mb-3"></div>
                            <span className="flex flex-row items-center">
                                <div className="w-[24px] h-[24px] rounded-full bg-neutral-400 mr-3"></div>
                                <div className="w-48 h-4 rounded bg-neutral-400"></div>
                            </span>
                        </section>
                    </section>
                </section>
            </main>
        </>
    );
}
