import React from "react";
import { Global, css } from "@emotion/react";
import { Helmet } from "react-helmet-async";

import { AppLayout } from "./components/AppLayout";

import palette from "./libs/style/palette";

import PickPage from "./pages/PickPage";

function App() {
  return (
    <>
      <Helmet>
        <title>velopick</title>
        <meta
          name="description"
          content="나의 기억을 Pick! 너의 기억을 Pick!"
        />
      </Helmet>
      <AppLayout>
        <AppLayout.Main>
          <PickPage />
        </AppLayout.Main>
      </AppLayout>

      <Global styles={globalStyle} />
    </>
  );
}

export default App;

const globalStyle = css`
  html,
  body,
  #root {
    height: 100%;
  }
  html {
    box-sizing: border-box;
    * {
      box-sizing: inherit;
    }
  }

  .button-transparent:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(238, 238, 238, var(--tw-bg-opacity));
  }

  .button-transparent {
    border-color: transparent;
    border-radius: 0.5rem;
    border-width: 1px;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.5rem;
    line-height: 1.625;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    --tw-text-opacity: 1;
    color: rgba(55, 65, 81, var(--tw-text-opacity));
  }

  .input-text {
    background-color: transparent;
    border-radius: 0.5rem;
    border-width: 1px;
    outline: 2px solid transparent;
    outline-offset: 2px;
    padding: 1rem;
    width: 100%;
    &:focus {
      border: 2px solid ${palette.amber400};
    }
  }

  .input-text.small {
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .button-primary.small {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .button-primary {
    border-radius: 0.5rem;
    border-width: 1px;

    border-color: ${palette.amber500};
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    line-height: 1.625;
    --tw-text-opacity: 1;
    color: ${palette.amber500};
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    &:hover {
      background: ${palette.amber50};
      color: ${palette.blueGray800};
    }
  }

  .blog-follow-button {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    transition-duration: 150ms;
  }

  .blog-follow-button {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 0.375rem;
    border-width: 1px;
    --tw-bg-opacity: 1;
    background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 600;
    line-height: 1.625;
    --tw-text-opacity: 1;
    color: rgba(51, 51, 51, var(--tw-text-opacity));
  }

  .blog-follow-button {
    position: relative;
  }

  @media (min-width: 768px) {
    .blog-follow-button {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      font-size: 1rem;
      line-height: 1.5rem;
    }
  }

  @keyframes popIn {
    0% {
      opacity: 0.7;
      transform: scale3d(0.8, 0.8, 1);
    }
    100% {
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
  }

  @keyframes popInFromBottom {
    0% {
      opacity: 0;
      transform: translateY(400px) scale(0.75);
    }

    75% {
      opacity: 1;
      transform: translateY(-16px) scale(1);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @keyframes popOutToBottom {
    0% {
      opacity: 1;
      transform: translateY(0px) scale(1);
    }

    100% {
      opacity: 0;
      transform: translateY(400px) scale(0.75);
    }
  }

  @keyframes shining {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;
