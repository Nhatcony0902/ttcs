import Product from "../../components/Product";
import SearchProduct from "../../components/SearchProduct";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchProduct />
        </div>
        <div>
          <Product />
        </div>
      </div>
    </div>
  );
}

export default Home;