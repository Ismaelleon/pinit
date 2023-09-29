import { useQuery } from "react-query";
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";
import { BiSolidUserCircle } from "react-icons/bi";

export default function Home () {
    const { isLoading, error, data } = useQuery('latestPins', async () => {
        try {
            const res = await fetch(`/api/pin/latest`, {
                method: 'POST',
            });

            if (res.status === 200) {
                let response = await res.json();
                return response;
            }
        } catch (err) {
            console.log(err);
        }
    });

    if (isLoading) return 'Loading...';

    if (error) return 'Error';

    if (data !== undefined) {
        return (
            <>
                <Navbar />
                <main className="flex justify-center mt-[64px] p-4">
                    <section className="flex flex-col max-w-3xl w-full">
                        {data.length > 0 && (
                            <section className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                                {data.map((pin: any, index: number) =>
                                    <section key={index}> 
                                        <Link to={`/pin/${pin._id}`}>
                                            <img src={pin.image.url} className="rounded" />
                                            <h2 className="text-lg font-bold mt-1">{pin.title}</h2>
                                            <Link to={`/user/${pin.author}`} className="flex flex-row items-center mt-2">
                                                <BiSolidUserCircle className="text-2xl mr-2" />
                                                <p>{pin.author}</p>
                                            </Link>
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
