import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { DocumentResult } from '@morten-olsen/goodwrites';

type Block = DocumentResult['parts'][0];

interface BlockProps {
  block: Block;
  doc: DocumentResult;
}

const getBreadcrumb = (block: Block, doc: DocumentResult) => {
  const path = [...block.path];
  const elements: any[] = [
    {
      title: '#',
    },
  ];

  path.reduce((acc, part) => {
    const parent = acc[part as keyof typeof acc] as any;
    elements.push({
      ...parent,
      title: parent.title ?? part,
    });
    return parent.content;
  }, doc.original.content as any);

  return elements.map((s: any) => s.title).join(' > ');
};

const Wrapper = styled.div`
  margin: 8px 0;
  border-radius: 5px;
  position: relative;
`;

const Note = styled.div`
  background-color: #efefef;
  text-align: center;
`;

const Content = styled.div<{
  level: number;
  border?: string;
}>`
  letter-spacing: 0.5px;
  line-height: 2.1rem;
  border: solid 5px ${(props) => props.border || '#fff'};
  padding: 8px 32px;

  p:first-of-type::first-letter {
    font-size: 6rem;
    float: left;
    padding: 1rem;
    margin: 0px 2rem;
    font-weight: 100;
    margin-left: 0rem;
  }

  p + p::first-letter {
    margin-left: 1.8rem;
  }
`;

const Breacrumb = styled.div`
  font-size: 10px;
  text-align: center;
  font-family: monospace;
  text-transform: uppercase;
  font-weight: bold;
  opacity: 0.5;
`;

const getBorderColor = (state: Block['state']) => {
  switch (state) {
    case 'first-draft':
      return '#3498db';
    case 'final-draft':
      return '#2ecc71';
    case 'revisions':
      return '#f1c40f';
    case 'placeholder':
      return '#e74c3c';
  }

  return '#fff';
};

const Block: FC<BlockProps> = ({ block, doc }) => {
  return (
    <Wrapper>
      <Breacrumb>{getBreadcrumb(block, doc)}</Breacrumb>
      {block.content && (
        <Content level={1} border={getBorderColor(block.state)}>
          <ReactMarkdown>{block.content}</ReactMarkdown>
        </Content>
      )}
      {block.notes && <Note>{block.notes}</Note>}
    </Wrapper>
  );
};

export { Block };
