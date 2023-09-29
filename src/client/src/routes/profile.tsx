import React from 'react';
import Navbar from '../components/navbar';
import { BiExit, BiSolidUserCircle } from 'react-icons/bi';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../components/loading';

export default function Profile () {
    const navigate = useNavigate();
    const { isLoading, error, data } = useQuery('userData', async () => {
        try {
            const res = await fetch('/api/user', {
                method: 'POST',
            });

            if (res.status === 200) {
                let response = await res.json();
                console.log(response);
                return response;
            }
        } catch (err) {
            console.log(err);
        }
    });

    if (isLoading) return <Loading />;

    if (error) return 'Error';

    if ('boards' in data) {
        return (
            <>
                <Navbar />
                <main className="flex justify-center mt-[64px] p-4">
                    <section className="flex flex-col max-w-3xl w-full">
                        <header className="mb-3">
                            <BiSolidUserCircle size={64} />
                            <span className="flex flex-row items-center">
                                <h1 className="text-2xl font-bold mb-3 sm:text-xl">{data.name!}</h1>                 
                                <button className="p-2 hover:bg-neutral-200 rounded-full ml-2 -translate-y-1/4" 
                                        onClick={() => {
                                            document.cookie = 'token=;Expires=Thu, 01 Jan 1970 00:00:00 UTC;'
                                            navigate('/');
                                        }}>
                                    <BiExit className="text-xl text-red-500" />
                                </button>
                            </span>
                        </header>
                        {data.boards.length > 0 && (
                            <section className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                                {data.boards.map((board: any, index: number) =>
                                    <section key={index}> 
                                        <Link to={`/board/${board._id}`}>
                                            <img src={board.thumbnail} className="rounded max-w-xs w-full" />
                                            <h2 className="text-xl sm:text-lg font-bold mt-1">{board.name}</h2>
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
}
