import { useState } from 'react';
import Navbar from '../components/navbar';
import { useQuery } from 'react-query';
import { Link, useLocation } from 'react-router-dom';
import Loading from '../components/loading';
import Pin from '../components/pin';

export default function Board () {
    const [userData, setUserData] = useState({
        name: '',
    });
    const location = useLocation();

    const { isLoading, error, data } = useQuery('boardData', async () => {
        try {
            const res = await fetch(`/api/board/${location.pathname.split('/')[2]}`, {
                method: 'POST',
            });

            if (res.status === 200) {
                let response = await res.json();
                getUserData();

                return response;
            }
        } catch (err) {
            console.log(err);
        }
    });

    async function getUserData () {
        try {
            const res = await fetch('/api/user', {
                method: 'POST',
            });

            if (res.status === 200) {
                let user = await res.json();
                setUserData(user);
            }
        } catch (err) {
            console.log(err);
        }
    }

    if (isLoading) return <Loading />;

    if (error) return 'Error';

    if (data !== undefined && userData.name !== '') {
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
                                    <Pin userName={userData.name} id={pin._id} title={pin.title} author={pin.author} image={pin.image.url} key={index} />
                                )} 
                            </section>
                        )}
                    </section>
                </main>
            </>
        );
    }
}
