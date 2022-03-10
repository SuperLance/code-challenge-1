import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import AutocompleteList from './AutocompleteList';
import './styles.scss';

const ITEM_TYPE = {
  REPOSITORY: 'Repository',
  USER: 'User',
};

const MIN_SEARCH_LENGTH = 3;

const Autocomplete = ({
  ajax,
  limit,
}) => {
  const [searchKey, setSearchKey] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropList, setShowDropList] = useState(false);
  const toggleContainer = useRef(null);

  const onClickOutsideHandler = useCallback((event) => {
    if (showDropList && toggleContainer.current && !toggleContainer.current.contains(event.target)) {
      setShowDropList(false);
    }
  }, [showDropList]);

  const initAutocompleteList = useCallback((data) => {
    const { repositories = [], users = [] } = data;

    repositories.forEach((item) => item.type = ITEM_TYPE.REPOSITORY);
    users.forEach((item) => item.type = ITEM_TYPE.USER);

    const list = [...repositories, ...users].sort((a, b) => (
      (a.name || '').localeCompare(b.name || '')
    ));
    setItems(list);
  }, []);

  const searchAutoCompleteItems = useCallback((value) => {
    setLoading(true);
    ajax({ search: value, limit })
      .then(({ data }) => {
        initAutocompleteList(data);
        setError('');
      })
      .catch((err) => {
        setError(err.message || 'Server Error');
      })
      .finally(() => setLoading(false))
  }, [ajax, limit, initAutocompleteList]);

  const debouncedSearch = useMemo(() => (
    _.debounce(searchAutoCompleteItems, 500)
  ), [searchAutoCompleteItems]);

  const onSearchChange = useCallback((value) => {
    setSearchKey(value);
    if (value.length >= MIN_SEARCH_LENGTH) {
      debouncedSearch(value)
    } else {
      setItems([]);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    window.addEventListener('click', onClickOutsideHandler);

    return () => {
      window.removeEventListener('click', onClickOutsideHandler);
    };
  }, [onClickOutsideHandler]);

  return (
    <div className="autocomplete-container" ref={toggleContainer}>
      <div className="search-input-container">
        <input
          className="search-input"
          placeholder="Search for repositories and users here"
          value={searchKey}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setShowDropList(true)}
        />
      </div>

      {
        showDropList && searchKey.length >= MIN_SEARCH_LENGTH && (
          <div className="dropdown-container">
            <AutocompleteList
              loading={loading}
              error={error}
              items={items}
              searchKey={searchKey}
            />
          </div>
        )
      }
    </div>
  );
};

export default Autocomplete;
