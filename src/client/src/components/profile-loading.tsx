import Navbar from './navbar';

export default function ProfileLoading() {
    return (
        <>
            <Navbar />
            <main className="flex justify-center mt-[64px] p-4 animate-pulse">
                <section className="flex flex-col max-w-3xl w-full">
                    <header className="mb-3">
                        <div className="w-[64px] h-[64px] rounded-full bg-neutral-400 mb-2"></div>
                        <section className="flex flex-row items-center mb-3">
                            <div className="w-36 h-6 bg-neutral-400 mr-2 rounded"></div>
                            <div className="w-6 h-6 rounded-full bg-neutral-400"></div>
                        </section>
                    </header>
                    <section className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                        <section className="flex flex-col">
                            <div className="w-full h-64 rounded bg-neutral-400"></div>
                            <div className="w-full h-5 rounded bg-neutral-400 mt-2"></div>
                            <div className="w-28 h-4 rounded bg-neutral-400 mt-2"></div>
                        </section>

                        <section className="flex flex-col">
                            <div className="w-full h-72 rounded bg-neutral-400"></div>
                            <div className="w-full h-5 rounded bg-neutral-400 mt-2"></div>
                            <div className="w-28 h-4 rounded bg-neutral-400 mt-2"></div>
                        </section>

                        <section className="flex flex-col">
                            <div className="w-full h-56 rounded bg-neutral-400"></div>
                            <div className="w-full h-5 rounded bg-neutral-400 mt-2"></div>
                            <div className="w-28 h-4 rounded bg-neutral-400 mt-2"></div>
                        </section>
                    </section>
                </section>
            </main>
        </>
    );
}
