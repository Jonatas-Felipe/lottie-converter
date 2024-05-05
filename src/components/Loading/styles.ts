import styled from 'styled-components';

interface IContainer {
  active: boolean;
}

export const Container = styled.div<IContainer>`
  position: fixed;
  top: 0;
  height: 0;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100vh;
  opacity: ${(props) => (props.active ? 1 : 0)};
  visibility: ${(props) => (props.active ? 'visible' : 'hidden')};
  transition-duration: 0.3;

  > div {
    > div:nth-child(1) {
      pointer-events: none;
    }

    > div:nth-child(2) {
      zoom: 1.2;

      p,
      small {
        text-align: center;
        color: #f5f5f5;
      }
    }
  }
`;
