import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTransition, animated } from "react-spring";
import styled from "@emotion/styled";

import { useTagAction, useTagValue } from "../../atoms/tagState";

import palette from "../../libs/style/palette";
import { mediaQuery } from "../../libs/style/media";
import { intervalCall } from "../../libs/utils";

const intervalCall1000 = intervalCall(1000);

interface TagEditorProps {
  ref?: React.RefObject<HTMLDivElement>;
  tags: string[];
}

function Help({ focus }: { focus: boolean }) {
  const transitions = useTransition(focus, {
    from: { opacity: 0, transform: "translateY(-1rem)" },
    enter: { opacity: 1, transform: "translateY(0rem)" },
    leave: { opacity: 0, transform: "translateY(-1rem)" },
    config: {
      tension: 350,
      friction: 22,
    },
  });

  return (
    <HelpBlock>
      {transitions((props, item) =>
        item ? (
          <animated.div className="inside" style={props}>
            쉼표 혹은 엔터를 입력하여 태그를 등록 할 수 있습니다.
            <br />
            그리고 최대 5개까지만 등록이 가능합니다.
            <br />
            등록된 태그를 클릭하면 삭제됩니다.
          </animated.div>
        ) : null
      )}
    </HelpBlock>
  );
}

const TagItem: React.FC<{
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}> = ({ onClick, children }) => {
  return <Tag onClick={onClick}>{children}</Tag>;
};

const TagEditor: React.FC<TagEditorProps> = ({ tags: initialTags }) => {
  const tags = useTagValue();
  const { removeTag, insertTag, changeTag } = useTagAction();

  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(false);

  const editableDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    changeTag(initialTags);
  }, [initialTags]);

  useEffect(() => {
    if (editableDiv.current) {
      if (value === "") {
        editableDiv.current.innerText = value;
      }
    }
  }, [value]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && value === "") {
        changeTag(tags.slice(0, tags.length - 1));
        return;
      }
      const keys = [",", "Enter"];
      if (keys.includes(e.key) && tags.length < 5) {
        // 등록
        e.preventDefault();
        const fn = () => setValue("");
        intervalCall1000(() => insertTag(value, fn));
      }
    },
    [tags, value]
  );

  const onRemove = (tag: string) => removeTag(tag);

  return (
    <TagEditorBlock>
      {tags.map((tag) => (
        <TagItem key={tag} onClick={() => onRemove(tag)}>
          {tag}
        </TagItem>
      ))}
      <StyledInput
        placeholder="태그를 입력하세요"
        tabIndex={2}
        value={value}
        onChange={onChangeInput}
        onKeyDown={onKeyDown}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <Help focus={focus} />
    </TagEditorBlock>
  );
};

export default TagEditor;

const HelpBlock = styled.div`
  display: block;
  width: 100%;
  color: ${palette.blueGray700};
  transition: ease-in 0.125s;
  & > .inside {
    position: absolute;
    background: ${palette.blueGray800};
    color: white;
    padding: 0.75rem;
    z-index: 20;
    line-height: 1.5;
    font-size: 0.75rem;
  }
`;

const TagEditorBlock = styled.div`
  color: ${palette.blueGray800};
  font-size: 1.125rem;
  display: flex;
  flex-wrap: wrap;
  [contenteditable="true"]:empty:before {
    content: attr(placeholder);
    display: block; /* For Firefox */
    color: ${palette.blueGray500};
  }
`;

const StyledInput = styled.input`
  display: inline-flex;
  outline: none;
  cursor: text;
  font-size: 1.125rem;
  line-height: 2rem;
  ${mediaQuery(767)} {
    line-height: 1.5rem;
    font-size: 0.75rem;
  }
  margin-bottom: 0.75rem;
  min-width: 8rem;
  border: none;
`;

const Tag = styled.div`
  color: ${palette.blueGray900};
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  height: 2rem;
  border-radius: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border: 1px solid ${palette.amber300};
  color: ${palette.amber300};
  margin-right: 0.75rem;
  transition: ease-in 0.125s;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
  margin-bottom: 0.75rem;
  animation: popIn 0.125s forwards ease-in-out;
  ${mediaQuery(767)} {
    height: 1.5rem;
    font-size: 0.75rem;
    border-radius: 0.75rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;
