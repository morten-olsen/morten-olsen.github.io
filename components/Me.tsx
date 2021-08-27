import React from 'react';
import styled from 'styled-components';
import image from '../public/images/me.jpg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
`;

const ImageWrapper = styled.div`
  border-radius: 50%;
  border: solid 10px rgba(255, 255, 255, .5);
  box-shadow: 0 0 35px rgba(0, 0, 0, .5);
  overflow: hidden;
  width: 100%;
  max-width: 360px;
  position: relative;
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const Me: React.FC<{}> = () => (
  <Wrapper>
    <ImageWrapper>
      <Image src={image.src} blurDataURL={image.blurDataURL} />
      <Spacer />
    </ImageWrapper>
    <Title>Morten Olsen</Title>
    <SubTitle>“...One part genius, one part crazy”</SubTitle>
    <Divider />
  </Wrapper>
);

export default Me;
