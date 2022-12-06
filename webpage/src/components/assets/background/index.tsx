import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: yellow;
`;

type Props = {
  className?: string;
};

const Background: React.FC<Props> = ({ className }) => {
  const [background, setBackground] = useState<any>();
  useEffect(() => {
    import('./background').then(({ Background: HeroBackground }) => {
      setBackground(<HeroBackground />);
    });
  }, []);

  return (
    <Wrapper suppressHydrationWarning className={className}>
      {background || null}
    </Wrapper>
  );
};

export { Background };
