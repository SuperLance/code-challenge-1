import React, { useCallback, useEffect, useState } from 'react';
import AutocompleteItem from './AutocompleteItem';

const AutocompleteList = ({
  loading,
  error,
  items,
  searchKey,
}) => {
  const [activeIndex, setActiveIndex] = useState(undefined);

  useEffect(() => {
    setActiveIndex(undefined);
  }, [items]);

  const onKeyDown = useCallback((event) => {
    if (!items.length) {
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        setActiveIndex(activeIndex === undefined ? 0 : (activeIndex + 1) % items.length);
        break;
      case "ArrowUp":
        setActiveIndex(activeIndex === undefined ? items.length - 1 : (activeIndex + items.length - 1) % items.length);
        break;
      case "Enter":
        if (activeIndex !== undefined) {
          const item = items[activeIndex];
          window.open(item.url);
        }
        break;
      default:
        return;
    }

    event.preventDefault();
  }, [activeIndex, items]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    }
  }, [onKeyDown]);

  const getContent = () => {
    if (loading) {
      return (
        <div className="status-container">
          <p className="status-container__text text-yellow">Loading ...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="status-container">
          <p className="status-container__text text-red">{error}</p>
        </div>
      );
    }

    if (!items.length) {
      return (
        <div className="status-container">
          <p className="status-container__text">No data</p>
        </div>
      );
    }

    return (
      <div className="scroll-wrapper">
        {
          items.map((item, index) => (
            <AutocompleteItem
              key={index}
              item={item}
              searchKey={searchKey}
              active={index === activeIndex}
            />
          ))
        }
      </div>
    );
  };

  return (
    <div className="search-result-list">
      { getContent() }
    </div>
  );
};

export default AutocompleteList;

