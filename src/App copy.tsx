/* eslint-disable no-await-in-loop */
import React, { useCallback, useRef, useState } from 'react';
import GIF from 'gif.js';
import Lottie from 'react-lottie';

import 'bootstrap/dist/css/bootstrap.min.css';

import GlobalStyles from './styles/global';
import { Container, InputFile } from './styles';
import Loading from '~/components/Loading';

const App: React.FC = () => {
  const lottieRef = useRef<any>(null);
  const lottiePreviewRef = useRef<any>(null);
  const [lottieData, setLottieData] = useState<any>({});
  const [fileName, setFileName] = useState('');
  const [gifData, setGifData] = useState('');
  const [videoData, setVideoData] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConvertToGif = async () => {
    setLoading(true);
    try {
      if (lottieRef.current && lottiePreviewRef.current) {
        const gif = new GIF({
          workers: 2,
          quality: 100,
          workerScript: `data:text/javascript;base64,${btoa(
            // eslint-disable-next-line import/no-unresolved, @typescript-eslint/no-var-requires, import/no-webpack-loader-syntax
            require('!!raw-loader!gif.js/dist/gif.worker.js').default
          )}`,
        });

        const { totalFrames } = lottieRef.current.anim;
        for (let i = 0; i <= totalFrames; i += 1) {
          lottieRef.current.anim.goToAndStop(i * 16.666666666666667);
          lottiePreviewRef.current.anim.goToAndStop(i * 16.666666666666667);
          const canvas = document.querySelector('canvas');
          if (canvas) {
            gif.addFrame(canvas, { copy: true, delay: 25 });
            await new Promise((resolve) => setTimeout(resolve, 25));
          }
        }
        gif.on('finished', (blob) => {
          // Criar um URL de objeto para o Blob
          const gifUrl = URL.createObjectURL(blob);

          // Criar um elemento de link para download
          const downloadLink = document.createElement('a');
          downloadLink.href = gifUrl;
          downloadLink.download = fileName ? `${fileName}.gif` : 'imagem.gif';
          document.body.appendChild(downloadLink);

          setGifData(URL.createObjectURL(blob));
          if (lottieRef.current && lottiePreviewRef.current) {
            lottieRef.current.anim.goToAndStop(0);
            lottiePreviewRef.current.anim.goToAndStop(0);
          }
          setLoading(false);
        });
        gif.render();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleConvertToVideo = useCallback(() => {
    try {
      setLoading(true);
      // Selecionar o canvas
      const canvas = document.querySelector('canvas') as any;

      if (canvas) {
        // Criar uma stream de mídia do canvas
        const stream = canvas.captureStream();

        // Criar uma nova instância de MediaRecorder
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

        // Criar uma matriz para armazenar os dados do vídeo
        const chunks: any = [];

        // Adicionar um evento para ouvir quando a gravação estiver completa
        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        // Adicionar um evento para ouvir quando a gravação for concluída
        recorder.onstop = () => {
          // Criar um objeto Blob com os dados do vídeo
          const videoBlob = new Blob(chunks, { type: 'video/mp4' });

          // Criar um URL de objeto para o Blob
          const videoUrl = URL.createObjectURL(videoBlob);

          // Criar um elemento de link para download
          const downloadLink = document.createElement('a');
          downloadLink.href = videoUrl;
          downloadLink.download = fileName ? `${fileName}.mp4` : 'video.mp4';
          document.body.appendChild(downloadLink);

          // Clicar no link para iniciar o download
          downloadLink.click();

          setVideoData(videoUrl);
          if (lottieRef.current && lottiePreviewRef.current) {
            lottieRef.current.pause();
            lottiePreviewRef.current.pause();
          }

          setLoading(false);
        };

        // Iniciar a gravação
        recorder.start();
        if (lottieRef.current && lottiePreviewRef.current) {
          setTimeout(() => {
            lottieRef.current.play();
            lottiePreviewRef.current.play();
          }, 500);
        }

        // Parar a gravação após 1 minuto
        setTimeout(() => {
          recorder.stop();
        }, 60000);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [fileName]);

  const handleFileChange = useCallback((e: any) => {
    try {
      const file = e.target.files[0];
      setFileName(file.name.replace('.json', ''));
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (event) => {
        if (event.target) {
          const { result } = event.target as any;
          setLottieData(JSON.parse(atob(result.split(',')[1])));
        }
      };
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <Container>
        <div className="container py-5">
          <div className="row">
            <div className="col-12">
              <h1 className="fw-bold mb-4">Converter Lottie</h1>
              <InputFile className="text-center p-5 d-block">
                <span>
                  Clique aqui para procurar e enviar seu arquivo lottie
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="d-none"
                />
              </InputFile>
            </div>
            {Object.keys(lottieData).length > 0 && (
              <>
                <div className="position-absolute render-lottie">
                  <Lottie
                    ref={lottieRef}
                    options={
                      {
                        renderer: 'canvas',
                        animationData: lottieData,
                        autoplay: false,
                        loop: false,
                        rendererSettings: {
                          preserveAspectRatio: 'xMidYMid slice',
                        },
                      } as any
                    }
                    isPaused
                    width={1080}
                    height={1350}
                  />
                </div>
                <div className="col-12 pt-5">
                  <div className="row">
                    <div className="col-lg-6 mb-5 lottie-preview">
                      <Lottie
                        ref={lottiePreviewRef}
                        options={
                          {
                            animationData: lottieData,
                            autoplay: false,
                            loop: false,
                            rendererSettings: {
                              preserveAspectRatio: 'xMidYMid meet',
                            },
                          } as any
                        }
                        isPaused
                      />
                    </div>
                    {gifData && (
                      <div className="col-lg-6 mb-5 h-100">
                        <img
                          src={gifData}
                          alt="Generated GIF"
                          className="h-100 gif-preview d-block mx-auto"
                        />
                      </div>
                    )}
                    {videoData && (
                      <div className="col-lg-6 mb-5 h-100">
                        <video controls className="w-100 h-100 video-preview">
                          <source src={videoData} type="video/mp4" />
                          <track
                            kind="captions"
                            label="English"
                            src="captions_en.vtt"
                            srcLang="en"
                          />
                        </video>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col-lg-6">
                      <button
                        type="button"
                        onClick={handleConvertToGif}
                        className="btn btn-blue w-100"
                      >
                        Converter para GIF
                      </button>
                    </div>
                    <div className="col-lg-6">
                      <button
                        type="button"
                        onClick={handleConvertToVideo}
                        className="btn btn-blue w-100"
                      >
                        Converter para video
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <Loading active={loading} />
      </Container>
      <GlobalStyles />
    </>
  );
};

export default App;
