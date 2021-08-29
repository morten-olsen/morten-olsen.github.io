import React from 'react';
import styled from 'styled-components';

interface Props {
  sites: {
    title: string,
    link: string,
    logo: any,
  }[];
}

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img<{ src: string }>`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  transition: all .8s;
  filter: grayscale(100%) invert();
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-wrap: wrap;
  max-width: 1600px;
`;

const ItemWrapper = styled.a`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 20px;
  width: 220px;
  height: 100px;
  text-decoration: none;
  font-weight: bold;
  color: #fff;
  font-family: 'Source Code Pro', monospace;
  text-transform: uppercase;
  text-shadow: 0 0 5px rgba(255, 255, 255, .5);

  &:hover > div {
    background: #fff;
    color: #000;
    box-shadow: 0 0 35px rgba(0, 0, 0, .3);

    &> img {
      filter: grayscale(100%);
    }
  }
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 10px;
  height: 100px;
  padding: 0 30px;
  transition: all .8s;
`;

const Social: React.FC<Props> = ({ sites }) => (
  <Outer>
    <Wrapper>
      {sites.map(({ title, link, logo }) => (
        <ItemWrapper target="_blank" href={link} key={link}>
          <InnerWrapper>
            <Image src={logo.src} />
            {title}
          </InnerWrapper>
        </ItemWrapper>
      ))}
    </Wrapper>
  </Outer>
);

export default Social;
