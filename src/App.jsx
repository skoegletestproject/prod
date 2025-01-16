import Layout from "./Layout/Layout";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import Live from "./Pages/LivePreview";
import LivePreview from "./Pages/LivePreview";
export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
       <h1></h1>
        </Layout>
      ),
    },
    {
      path:"/live",
      element: <Layout><LivePreview/></Layout>
    },
    {
      path:"/preview",
      element: <Layout><Home/></Layout>
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
