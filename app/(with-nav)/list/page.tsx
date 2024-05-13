import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@nextui-org/input";

const ListPage = () => {
  return (
    <>
      <SearchBar />
    </>
  );
};

const SearchBar = () => {
  return (
    // <div className="relative w-fit h-fit">
    //   <input className="border-width-1 border-color- pe-6" />
    //   <FontAwesomeIcon
    //     icon={faMagnifyingGlass}
    //     className="size-4 absolute bottom-1/2 right-1 translate-y-1/2"
    //   />
    // </div>
    <Input
      endContent={
        <FontAwesomeIcon icon={faMagnifyingGlass} className="size-4" />
      }
    />
  );
};

const SearchResultContainer = () => {};

const GameCard = () => {};

export default ListPage;
