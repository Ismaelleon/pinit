import { useState } from 'react';
import Navbar from '../components/navbar';
import { useQuery } from 'react-query';
import { Link, useLocation } from 'react-router-dom';

export default function Board () {
    const location = useLocation();

    const { isLoading, error, data } = useQuery('boardData', async () => {
        try {
            const res = await fetch(`/api/board/${location.pathname.split('/')[2]}`, {
                method: 'POST',
            });

            if (res.status === 200) {
                let data = await res.json();

                console.log(data);

                return data;
            }
        } catch (err) {
            console.log(err);
        }
    });

    if (isLoading) return 'Loading...';

    if (error) return 'Error';

    return (
        <>
            <Navbar />
			<main className="flex justify-center mt-[64px] p-4">
				<section className="flex flex-col max-w-3xl w-full">
                    <header className="mb-3">
                        <h1 className="text-2xl font-bold mb-3 sm:text-xl">{data.name}</h1>                 
                    </header>
                    {data.pins.length > 0 && (
                        <section className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                            {data.pins.map((pin: any, index: number) =>
                                <section key={index}> 
                                    <Link to={`/pin/${pin._id}`}>
                                        <img src={pin.image.url} className="rounded" />
                                        <h2 className="text-lg font-bold mt-1">{pin.title}</h2>
                                    </Link>
                                </section>
                            )} 
                        </section>
                    )}
				</section>
			</main>
        </>
    );
}
