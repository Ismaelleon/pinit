import { useQuery } from "react-query";
import Navbar from "../components/navbar";
import Loading from "../components/loading";
import Pin from "../components/pin";
import { useState } from "react";

export default function Home () {
    const [userData, setUserData] = useState({
        name: '',
    });
    const { isLoading, error, data } = useQuery('latestPins', async () => {
        try {
            const res = await fetch(`/api/pin/latest`, {
                method: 'POST',
            });

            if (res.status === 200) {
                let response = await res.json();
                console.log(response);
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
                        {data.length > 0 && (
                            <section className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                                {data.map((pin: any, index: number) =>
                                    <Pin userName={userData.name}
                                        id={pin._id} 
                                        title={pin.title} 
                                        author={pin.author} 
                                        image={pin.image.url} 
                                        key={index} />
                                )} 
                            </section>
                        )}
                    </section>
                </main>
            </>
        );
    }
}
