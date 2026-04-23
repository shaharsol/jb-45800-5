import { Route, Routes } from "react-router-dom";
import Search from "../../search/Search";

export default function Main(){
    return (
        <Routes>
            <Route path="/search" element={<Search />}/>
        </Routes>
    )
}