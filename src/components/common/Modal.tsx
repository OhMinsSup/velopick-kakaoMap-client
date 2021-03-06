import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { BiX } from "react-icons/bi";
import { css } from "@emotion/react";
import palette from "../../libs/style/palette";
import media from "../../libs/style/media";
import zIndexes from "../../libs/style/zIndexes";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ visible, children, onClose }) => {
  const [closed, setClosed] = useState(true);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (visible) {
      setClosed(false);
    } else {
      timeoutId = setTimeout(() => {
        setClosed(true);
      }, 200);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [visible]);

  if (!visible && closed) return null;

  return (
    <ModalBlock visible={visible}>
      <div className="wrapper">
        <div className="white-block">
          <div className="exit-wrapper">
            <BiX onClick={onClose} tabIndex={1} />
          </div>
          <div className="block-content">{children}</div>
        </div>
      </div>
    </ModalBlock>
  );
};

export default Modal;

const ModalBlock = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${zIndexes.Modal};
  background-color: rgba(0, 0, 0, 0.35);
  .wrapper {
    width: 606px;
    height: 480px;
    ${media.small} {
      flex: 1;
      width: auto;
      height: 100%;
    }
    ${(props) =>
      props.visible
        ? css`
            animation: popInFromBottom 0.4s forwards ease-in-out;
          `
        : css`
            animation: popOutToBottom 0.2s forwards ease-in-out;
          `}
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.09);
    display: flex;
    .white-block {
      flex: 1;
      background: white;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      overflow-y: auto;

      .exit-wrapper {
        display: flex;
        justify-content: flex-end;
        font-size: 1.5rem;
        color: ${palette.blueGray600};
        margin-bottom: 1rem;
        svg {
          cursor: pointer;
        }
        ${media.small} {
          margin-bottom: 0;
        }
      }
      .block-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    }
  }
`;
