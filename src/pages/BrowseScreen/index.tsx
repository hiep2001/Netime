import React, { useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useLocation } from "react-router";
import AnimeCard from "../../components/AnimeCard";
import Loader from "../../components/Loader";
import Select from "../../components/Select";
import { GENRES, SEASONS, SORTS, TYPES } from "../../constants";
import useBrowseList from "./useBrowseList";

const ALL = [...TYPES, ...GENRES, ...SEASONS];

const TypeScreen = () => {
  const [selectedSorting, setSelectedSorting] = useState(SORTS[0].slug);
  const { pathname } = useLocation();

  const [category, ...slug] = pathname.replace("/", "").split("/");

  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useBrowseList({ category, sort: selectedSorting, slug: slug.join("/") });

  const [sentryRef] = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    onLoadMore: fetchNextPage,
    rootMargin: "0px 0px 100px 0px",
  });

  const handleSortingSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSorting(e.target.value);
  };

  const current = ALL.find((type) => pathname.includes(type.slug));

  const list = data?.pages.map((list) => list.data).flat();

  return (
    <div className="w-full">
      <div className="w-full p-2">
        <div className="flex items-center justify-between">
          <p className="text-white font-bold text-4xl">{current?.name}</p>

          <Select
            value={selectedSorting}
            onChange={handleSortingSelectChange}
            className="bg-black text-white p-2"
          >
            {SORTS.map((sort) => (
              <option value={sort.slug} key={sort.slug}>
                {sort.name}
              </option>
            ))}
          </Select>
        </div>

        {isLoading && (
          <div className="w-full flex justify-center items-center">
            <Loader />
          </div>
        )}

        <div className="my-12 flex flex-wrap">
          {!isLoading &&
            list?.map((anime) => (
              <div
                className="mt-2 -mr-2 px-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 2xl:w-1/7"
                key={anime.slug}
              >
                <AnimeCard {...anime} />
              </div>
            ))}
        </div>

        {(isFetchingNextPage || hasNextPage) && (
          <div ref={sentryRef}>
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default TypeScreen;
