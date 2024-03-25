import { ReactElement } from 'react';
import Navbar from './navbar';

export default function HomeLoading() {
    return (
        <>
            <Navbar />
            <main className="flex justify-center mt-[64px] p-4">
                <section className="flex flex-col max-w-3xl w-full">
                    <section className="grid gap-4 grid-cols-2 sm:grid-cols-3 animate-pulse">
                        <section>
                            <div className="w-full h-72 rounded bg-neutral-400"></div>
                            <div className="w-full h-5 rounded bg-neutral-400 mt-2"></div>
                            <span className="flex flex-row items-center mt-2">
                                <div className="w-[20px] h-[20px] mr-2 rounded-full bg-neutral-400"></div>
                                <div className="w-11/12 h-4 rounded bg-neutral-400"></div>
                            </span>
                        </section>

                        <section>
                            <div className="w-full h-64 rounded bg-neutral-400"></div>
                            <div className="w-full h-5 rounded bg-neutral-400 mt-2"></div>
                            <span className="flex flex-row items-center mt-2">
                                <div className="w-[20px] h-[20px] mr-2 rounded-full bg-neutral-400"></div>
                                <div className="w-11/12 h-4 rounded bg-neutral-400"></div>
                            </span>
                        </section>

                        <section>
                            <div className="w-full h-80 rounded bg-neutral-400"></div>
                            <div className="w-full h-5 rounded bg-neutral-400 mt-2"></div>
                            <span className="flex flex-row items-center mt-2">
                                <div className="w-[20px] h-[20px] mr-2 rounded-full bg-neutral-400"></div>
                                <div className="w-11/12 h-4 rounded bg-neutral-400"></div>
                            </span>
                        </section>

                        <section>
                            <div className="w-full h-64 rounded bg-neutral-400"></div>
                            <div className="w-full h-5 rounded bg-neutral-400 mt-2"></div>
                            <span className="flex flex-row items-center mt-2">
                                <div className="w-[20px] h-[20px] mr-2 rounded-full bg-neutral-400"></div>
                                <div className="w-11/12 h-4 rounded bg-neutral-400"></div>
                            </span>
                        </section>

                        <section>
                            <div className="w-full h-56 rounded bg-neutral-400"></div>
                            <div className="w-full h-5 rounded bg-neutral-400 mt-2"></div>
                            <span className="flex flex-row items-center mt-2">
                                <div className="w-[20px] h-[20px] mr-2 rounded-full bg-neutral-400"></div>
                                <div className="w-11/12 h-4 rounded bg-neutral-400"></div>
                            </span>
                        </section>

                        <section>
                            <div className="w-full h-72 rounded bg-neutral-400"></div>
                            <div className="w-full h-5 rounded bg-neutral-400 mt-2"></div>
                            <span className="flex flex-row items-center mt-2">
                                <div className="w-[20px] h-[20px] mr-2 rounded-full bg-neutral-400"></div>
                                <div className="w-11/12 h-4 rounded bg-neutral-400"></div>
                            </span>
                        </section>
                    </section>
                </section>
            </main>
        </>
    );
}
