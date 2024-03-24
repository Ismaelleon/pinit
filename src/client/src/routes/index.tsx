import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import LogIn from '../components/log-in';
import SignUp from '../components/sign-up';

export default function Index() {
    const [signUpModal, setSignUpModal] = useState(false),
        [logInModal, setLogInModal] = useState(false);

    const cookies = new Cookies();
    const navigate = useNavigate();

    function checkAuthToken() {
        let token = cookies.get('token');

        if (token !== undefined) {
            if (token.split('.').length === 3) {
                navigate('/home');
            }
        }
    }

    useEffect(checkAuthToken, []);

    return (
        <>
            <header className="flex w-full justify-center p-3 fixed left-0 top-0 bg-white dark:bg-neutral-900 dark:text-white">
                <div className="flex justify-between items-center max-w-4xl w-full">
                    <Link to="/" className="text-xl font-bold">
                        PinIt
                    </Link>

                    <ul className="flex items-center">
                        <li
                            className="text-sm p-2 px-3 bg-red-600 mr-3 text-white rounded font-semibold hover:bg-red-800 cursor-pointer"
                            onClick={() => setLogInModal(!logInModal)}
                        >
                            Log In
                        </li>
                        <li
                            className="text-sm p-2 px-3 bg-neutral-200 rounded font-semibold hover:bg-neutral-400 cursor-pointer dark:bg-neutral-700 hover:bg-neutral-800"
                            onClick={() => setSignUpModal(!signUpModal)}
                        >
                            Sign Up
                        </li>
                    </ul>
                </div>
            </header>
            <main className="flex justify-center w-full dark:text-white">
                <section className="flex justify-center items-center h-screen w-full max-w-4xl">
                    <h1 className="text-3xl sm:text-5xl font-bold text-center">
                        Discover your next
                        <br />
                        great idea.
                    </h1>
                </section>
            </main>
            <LogIn
                logInModal={logInModal}
                setLogInModal={setLogInModal}
                setSignUpModal={setSignUpModal}
            />
            <SignUp
                signUpModal={signUpModal}
                setSignUpModal={setSignUpModal}
                setLogInModal={setLogInModal}
            />
        </>
    );
}
