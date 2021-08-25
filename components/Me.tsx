import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  display-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const Image = styled.div<{ src: string }>`
  border: 30px #efefef solid;
  width: 360px;
  border-radius: 50%;
  background: url('${({ src }) => src}');
  background-size: cover;
`;

const Spacer = styled.div`
  padding-bottom: 100%;
`;

const Me: React.FC<{}> = () => (
  <Wrapper>
    <Image src="/images/me.jpg">
      <Spacer />
    </Image>
  </Wrapper>
);

export default Me;
