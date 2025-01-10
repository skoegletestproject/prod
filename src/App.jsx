import Layout from "./Layout/Layout";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import Live from "./Pages/Live";
export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
          <Home/>
        </Layout>
      ),
    },
    {
      path:"/live",
      element: <Layout><Live/></Layout>
    },
    {
      path:"/preview",
      element: <Layout><h1>preview</h1></Layout>
    },
    {
      path:"/login",
      element: <Layout><h1>login</h1></Layout>
    },
    {
      path:"/signup",
      element: <Layout><h1>signup</h1></Layout>
    }
  ]);
  return <RouterProvider router={router} />;
}
