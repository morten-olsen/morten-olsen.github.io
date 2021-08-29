import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import Head from 'next/head';
import Background from '../components/Background';
import Me from '../components/Me';
import Social from '../components/Social';
import htbLogo from '../public/images/logos/htb.svg';
import githubLogo from '../public/images/logos/github.svg';
import linkedinLogo from '../public/images/logos/linkedin.svg';
import stackOverflowLogo from '../public/images/logos/stackoverflow.svg';
import codinGameLogo from '../public/images/logos/codingame.svg';
import resumeLogo from '../public/images/logos/resume.svg';

const Globals = createGlobalStyle`
  html, body, #__next {
    height: 90%;
    margin: 0;
  }
  body {
    background: #03544e;
  }

  @keyframes fadein {
    from {opacity: 0}
    to {opacity: 1}
  }
`;

const Wrapper = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Frontpage: React.FC<{}> = () => {
  return (
    <Wrapper>
      <Head>
        <title>Morten Olsen</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300&display=swap" rel="stylesheet" />
      </Head>
      <Globals />
      <Background />
      <Me />
      <Social
        sites={[{
          title: 'Github',
          link: 'https://github.com/morten-olsen',
          logo: githubLogo,
        }, {
          title: 'HackTheBox',
          link: 'https://app.hackthebox.eu/profile/174098',
          logo: htbLogo,
        }, {
          title: 'Stack Overflow',
          link: 'https://stackoverflow.com/users/1689055/morten-olsen',
          logo: stackOverflowLogo,
        }, {
          title: 'Codingame',
          link: 'https://www.codingame.com/profile/8b34b1812baa75715c972bfe190c0aed4552622',
          logo: codinGameLogo,
        }, {
          title: 'Resumè',
          link: 'https://github.com/morten-olsen/morten-olsen.github.io/releases/',
          logo: resumeLogo,
        }, {
          title: 'Linkedin',
          link: 'https://www.linkedin.com/in/mortenolsendk',
          logo: linkedinLogo,
        }]}
      />
    </Wrapper>
  );
};

export default Frontpage;
