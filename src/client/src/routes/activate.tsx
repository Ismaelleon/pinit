import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Activate() {
    let location = useLocation(),
        navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/activate/${location.pathname.split('/')[2]}`, {
            method: 'GET',
        }).then((res) => {
            if (res.status === 200) {
                navigate('/home');
            }
        });
    }, []);

    return (
        <>
            <h1>Loading</h1>
        </>
    );
}
