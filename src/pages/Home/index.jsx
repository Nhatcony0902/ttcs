
import Product from "../../components/Product";
import SearchProduct from "../../components/SearchProduct";


function Home() {
  return (

    <div className="flex flex-col items-center justify-center h-screen">
      <div>
         <SearchProduct/>
      </div>
      <div>
        <Product/>
      </div>
    </div>
  );
}

export default Home;