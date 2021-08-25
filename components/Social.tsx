import React from 'react';
import styled from 'styled-components';

interface Props {
  sites: {
    title: string,
    link: string,
    logo: string,
  }[];
}

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.div<{ src: string }>`
  width: 50px;
  height: 50px;
  background: url('${({ src }) => src}');
  background-size: cover;
  margin-right: 10px;
  filter: grayscale(100%);
  transition: all .8s;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-wrap: wrap;
  max-width: 1000px;
`;

const ItemWrapper = styled.a`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #fff;
  margin: 20px;
  width: 220px;
  height: 100px;
  text-decoration: none;
  color: #000;

  &:hover > div {
    background: #000;
    color: #fff;
    box-shadow: 0 0 35px rgba(0, 0, 0, .3);

    &> div {
      filter: grayscale(100%) invert();
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
            <Image src={`/images/logos/${logo}`} />
            {title}
          </InnerWrapper>
        </ItemWrapper>
      ))}
    </Wrapper>
  </Outer>
);

export default Social;
