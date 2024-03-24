import Navbar from '../components/navbar';
import { BiSolidUserCircle } from 'react-icons/bi';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import ProfileLoading from '../components/profile-loading';
import { MdVerified } from 'react-icons/md';

export default function Profile() {
    const navigate = useNavigate();
    const { isLoading, error, data } = useQuery('userData', async () => {
        try {
            const res = await fetch('/api/user', {
                method: 'POST',
            });

            if (res.status === 200) {
                let response = await res.json();
                return response;
            } else {
                navigate('/');
            }
        } catch (err) {
            console.log(err);
        }
    });

    if (isLoading) return <ProfileLoading />;

    if (error) return 'Error';

    if ('boards' in data) {
        return (
            <>
                <Navbar />
                <main className="flex justify-center mt-[64px] p-4 dark:text-white">
                    <section className="flex flex-col max-w-3xl w-full">
                        <header className="mb-3">
                            <BiSolidUserCircle size={64} />
                            <section className="flex flex-row items-center mb-3">
                                <h1 className="text-2xl font-bold sm:text-xl">
                                    {data.name!}
                                </h1>
                                {data.verified && (
                                    <MdVerified className="ml-2 text-lg text-red-600" />
                                )}
                            </section>
                        </header>
                        {data.boards.length > 0 ? (
                            <section className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                                {data.boards.map(
                                    (board: any, index: number) => (
                                        <section key={index}>
                                            <Link to={`/board/${board._id}`}>
                                                <img
                                                    src={board.thumbnail}
                                                    className="rounded max-w-xs w-full"
                                                />
                                                <h2 className="text-xl sm:text-lg font-bold mt-1 hover:underline">
                                                    {board.name}
                                                </h2>
                                                <p>
                                                    {board.pins.length}{' '}
                                                    {board.pins.length > 1
                                                        ? 'pins'
                                                        : 'pin'}
                                                </p>
                                            </Link>
                                        </section>
                                    ),
                                )}
                            </section>
                        ) : (
                            <p className="text-center text-lg font-bold">
                                No boards yet!
                            </p>
                        )}
                    </section>
                </main>
            </>
        );
    }
}
