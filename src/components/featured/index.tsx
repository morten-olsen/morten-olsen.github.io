import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { SlideIn } from '../animations/slide-in';

type Props = {
  title: string;
  children: ReactNode;
};

const Wrapper = styled.div`

`;

const Title = styled.h2`
  margin: 2rem 0;
  text-align: center;
`;

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;

  &> * {
    border: solid 1px #efefef;
    max-width: calc(50% - 20px);
    min-width: calc(300px);
    margin: 10px;
  }
`;

const Featured: React.FC<Props> = ({ title, children }) => (
  <Wrapper>
    <Title>{title}</Title>
    <Items>
      {children}
    </Items>
  </Wrapper>
);

export { Featured };
