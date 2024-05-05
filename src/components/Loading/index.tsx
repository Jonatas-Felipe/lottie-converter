import React from 'react';
import Lottie from 'react-lottie';

import loading from '~/assets/animations/loading.json';

import { Container } from './styles';

interface ILoadingProps {
  active: boolean;
}

const Loading: React.FC<ILoadingProps> = ({ active }) => {
  return (
    <Container
      active={active}
      className="d-flex align-items-center justify-content-center"
    >
      <div className="d-flex flex-column align-items-center">
        <div>
          <Lottie
            options={{
              animationData: loading,
              autoplay: true,
              loop: true,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
              },
            }}
            width={250}
            height={250}
          />
        </div>
        <div>
          <p className="mb-0 fw-bold">Carregando...</p>
          <small>Por favor, não feche o app!</small>
        </div>
      </div>
    </Container>
  );
};

export default Loading;
