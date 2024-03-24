import React, { createContext } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import DarkModeProvider from './context/dark-mode';
import './index.css';

// Import routes
import Index from './routes/index';
import Home from './routes/home';
import Create from './routes/create';
import Pin from './routes/pin';
import Activate from './routes/activate';
import Profile from './routes/profile';
import Board from './routes/board';
import User from './routes/user';
import Settings from './routes/settings';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Index />,
    },
    {
        path: '/activate/:activation_key',
        element: <Activate />,
    },
    {
        path: '/home',
        element: <Home />,
    },
    {
        path: '/create',
        element: <Create />,
    },
    {
        path: '/pin/:id',
        element: <Pin />,
    },
    {
        path: '/profile',
        element: <Profile />,
    },
    {
        path: '/user/:name',
        element: <User />,
    },
    {
        path: '/board/:id',
        element: <Board />,
    },
	{
		path: '/settings',
		element: <Settings />
	}
]);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
				<DarkModeProvider>
					<RouterProvider router={router} />
				</DarkModeProvider>
            </QueryClientProvider>
        </React.StrictMode>
    );
}

export default App;
