import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import image from '../public/images/me.jpg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
`;

const ImageWrapper = styled.div<{loaded: boolean}>`
  border-radius: 50%;
  border: solid 10px rgba(255, 255, 255, .5);
  box-shadow: 0 0 35px rgba(0, 0, 0, .5);
  width: 100%;
  max-width: 300px;
  position: relative;
  transition: all 1.2s;
  opacity: ${({ loaded }) => loaded ? '1' : '0'};
  transform: rotateY(180deg);
`;

const Spacer = styled.div`
  padding-bottom: 100%;
`;

const Title = styled.h1`
  text-transform: uppercase;
  text-align: center;
  color: #fff;
  font-size: 28px;
  font-family: 'Source Code Pro', monospace;
  text-shadow: 
    0 0 5px rgba(255, 255, 255, .5);
    0 0 10px rgba(0, 0, 0, .5);
  margin-bottom: 0px;
  letter-spacing: 1px;
  letter-spacing: 7px;

  &::first-letter {
    font-size: 36px;
  }
`;

const SubTitle = styled.h2`
  text-transform: uppercase;
  text-align: center;
  color: #fff;
  font-size: 14px;
  font-family: 'Source Code Pro', monospace;
  text-shadow: 
    0 0 5px rgba(255, 255, 255, .5);
    0 0 10px rgba(0, 0, 0, .5);
`;

const Divider = styled.div`
  margin-top: 70px;
  width: 100%;
  max-width: 800px;
  height: 1px;
  background: rgba(255, 255, 255, .5);
  box-shadow: 0 0 30px rgba(255, 255, 255, .7);
`;

const Image = styled.img<{blurDataURL: string}>`
  background: url("${({ blurDataURL }) => blurDataURL}");
  position: absolute;
  background-size: cover;
  border-radius: 50%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const Me: React.FC<{}> = () => {
  const imgRef = useRef<HTMLImageElement>();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, [imgRef]);
  return (
    <Wrapper>
      <ImageWrapper loaded={loaded}>
        <Image
          ref={imgRef}
          src={image.src}
          blurDataURL={image.blurDataURL}
          onLoad={() => setLoaded(true)}
        />
        <Spacer />
      </ImageWrapper>
      <Title>Morten Olsen</Title>
      <SubTitle>“...One part genius, one part crazy”</SubTitle>
      <Divider />
    </Wrapper>
  );
};

export default Me;
