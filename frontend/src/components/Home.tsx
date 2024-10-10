import StoreSearchBar from "./StoreSearchBar";
import useStores from "@/hooks/useStores";
import { Loader } from "lucide-react";

export default function Home() {
    const {stores, loading, error} = useStores();
    return (
        <main className="flex flex-col gap-10">
            {!loading && stores.length > 0 ? <StoreSearchBar stores={stores} /> : 
            loading? <Loader className='animate-spin' /> : 
            error ? <span>an error: {error}</span> :
            <span>no stores in db</span>}
            
            <div>rest of page</div>
        </main>
    )
}