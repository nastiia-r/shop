import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WarningMessage } from "./WarningMessage";

export type SearchProps = {
  genderSearch: "men" | "women" | "all";
  textSearch: string;
};
export default function Search() {
  const location = useLocation(); 

  const [searchDate, setSearchDate] = useState<SearchProps>({
    genderSearch: "all",
    textSearch: "",
  });
  const [warning, setWarning] = useState<{
    description: string;
    level: string;
  } | null>(null);
  const [keyWarning, setKeyWarning] = useState(0);

  const navigate = useNavigate();
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchDate.textSearch !== "") {
      console.log(location.pathname);
      navigate(
        `/search?t=${encodeURIComponent(
          searchDate.textSearch
        )}&c=${encodeURIComponent(searchDate.genderSearch)}`
      , {
        state: {from: location.pathname}
      });
    } else {
      setKeyWarning(Date.now());
      setWarning({ description: "Fill in the fields", level: "medium" });
    }
  }

  return (
    <>
      <div className="search">
        <form className="search-header" onSubmit={handleSubmit}>
          <input
            className="input-search-header"
            type="text"
            value={searchDate.textSearch}
            onChange={(e) =>
              setSearchDate((prev) => ({
                ...prev,
                textSearch: e.target.value.trim(),
              }))
            }
          />
          <button className="button-search-header" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="bi bi-search-heart"
              viewBox="0 0 16 16"
            >
              <path d="M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018" />
              <path d="M13 6.5a6.47 6.47 0 0 1-1.258 3.844q.06.044.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11" />
            </svg>
          </button>
        </form>
      </div>

      {warning && (
        <WarningMessage
          key={keyWarning}
          description={warning.description}
          level={warning.level}
          onClose={() => setWarning(null)}
        />
      )}
    </>
  );
}
