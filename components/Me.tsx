import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const ImageWrapper = styled.div`
  border-radius: 50%;
  border: solid 15px rgba(255, 255, 255, .5);
  box-shadow: 0 0 15px rgba(0, 0, 0, .5);
  overflow: hidden;
  margin: 0 40px;
  width: 100%;
  max-width: 360px;
`;

const Image = styled.div<{ src: string }>`
  width: 100%;
  background: url('${({ src }) => src}');
  background-size: cover;
`;

const Spacer = styled.div`
  padding-bottom: 100%;
`;

const Title = styled.h1`
  text-transform: uppercase;
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

const Me: React.FC<{}> = () => (
  <Wrapper>
    <ImageWrapper>
      <Image src="/images/me.jpg">
        <Spacer />
      </Image>
    </ImageWrapper>
    <Title>Morten Olsen</Title>
    <SubTitle>“...One part genius, on part crazy”</SubTitle>
    <Divider />
  </Wrapper>
);

export default Me;
