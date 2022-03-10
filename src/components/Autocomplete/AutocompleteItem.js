import React, {useEffect, useRef} from 'react';
import classnames from 'classnames';
import Highlighter from 'react-highlight-words';

const AutocompleteItem = ({
  item,
  active,
  searchKey,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (active && ref && ref.current) {
      ref.current.scrollIntoView({ block: 'nearest' });
    }
  }, [active])

  return (
    <div
      ref={ref}
      className={classnames('autocomplete-item', { active })}
      onClick={() => window.open(item.url)}
    >
      <span className="item-tag">
        {item.type}
      </span>

      <Highlighter
        highlightClassName="highlighted"
        searchWords={[searchKey]}
        autoEscape={true}
        textToHighlight={item.name}
      />
    </div>
  );
};

export default AutocompleteItem;
