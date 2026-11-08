import { useState } from "react";

import SearchBar from "./components/search-bar.jsx";
import UserTable from "./components/table-user.jsx";

export default function App () {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative min-h-svh font-sans">
      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <header>
          <h1 className="mt-5 text-4xl font-bold text-(--bone) sm:text-5xl lg:text-6xl">
            User Dashboard
          </h1>
        </header>
        <main>
          <SearchBar value={ searchQuery } onSearch={ setSearchQuery } />
          <UserTable searchQuery={ searchQuery } />
        </main>
      </div>
    </div>
  );
}
