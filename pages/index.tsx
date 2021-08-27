import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Head from 'next/head';
import Background from '../components/Background';
import Me from '../components/Me';
import Social from '../components/Social';
import htbLogo from '../public/images/logos/htb.svg';
import githubLogo from '../public/images/logos/github.svg';
import linkedinLogo from '../public/images/logos/linkedin.svg';
import stackOverflowLogo from '../public/images/logos/stackoverflow.svg';

const Globals = createGlobalStyle`
  body {
    background: #03544e;
  }

  @keyframes fadein {
    from {opacity: 0}
    to {opacity: 1}
  }
`;

const Frontpage: React.FC<{}> = () => {
  return (
    <>
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
          title: 'Linkedin',
          link: 'https://www.linkedin.com/in/mortenolsendk',
          logo: linkedinLogo,
        }]}
      />
    </>
  );
};

export default Frontpage;
