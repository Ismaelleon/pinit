import Navbar from '../components/navbar';
import { BiSolidUserCircle } from 'react-icons/bi';
import { MdVerified } from 'react-icons/md';
import { useQuery } from 'react-query';
import { Link, useLocation } from 'react-router-dom';
import Loading from '../components/loading';

export default function User () {
    const location = useLocation();
    const { isLoading, error, data } = useQuery('userData', async () => {
        try {
                const res = await fetch(`/api/user?name=${location.pathname.split('/')[2]}`, {
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
                            <section className="flex flex-row items-center mb-3">
                                <h1 className="text-2xl font-bold sm:text-xl">{data.name!}</h1>                 
                                {data.verified && <MdVerified className="ml-2 text-lg text-pink-600" />}
                            </section>
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
