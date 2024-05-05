import { darken } from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  .render-lottie {
    top: -10000px;
  }

  .lottie-preview,
  .gif-preview,
  .video-preview {
    max-height: 350px;
  }

  .btn-blue {
    background-color: rgba(191, 221, 255, 0.2);
    border: 1px solid rgba(191, 221, 255);
    color: rgb(146 178 225);
    transition-duration: 0.3s;

    :hover {
      background-color: rgba(191, 221, 255);
      color: ${darken(0.3, 'rgb(146 178 225)')};
    }
  }
`;

export const InputFile = styled.label`
  transition-duration: 0.3s;
  background-color: rgba(191, 221, 255, 0.2);
  border: 1px dashed rgba(191, 221, 255);
  border-radius: 20px;
  cursor: pointer;

  span {
    color: rgb(146 178 225);
  }

  :hover {
    background-color: rgba(191, 221, 255);
    border-color: ${darken(0.3, 'rgb(146 178 225)')};

    span {
      color: ${darken(0.3, 'rgb(146 178 225)')};
    }
  }
`;
