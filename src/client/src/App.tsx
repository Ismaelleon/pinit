import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Import routes
import Index from "./routes/index";
import Home from "./routes/home";
import Create from "./routes/create";
import Pin from "./routes/pin";
import Activate from "./routes/activate";
import Profile from "./routes/profile";
import { QueryClient, QueryClientProvider } from "react-query";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Index />,
	},
    {
        path: "/activate/:activation_key",
        element: <Activate />,
    },
	{
		path: "/home",
		element: <Home />,
	},
	{
		path: "/create",
		element: <Create />,
	},
	{
		path: "/pin/:id",
		element: <Pin />,
	},
    {
        path: "/profile",
        element: <Profile />
    }
]);

const queryClient = new QueryClient();

function App() {
	return (
		<React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
		</React.StrictMode>
	);
}

export default App;
