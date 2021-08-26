import React from 'react';
import Head from 'next/head';
import Background from '../components/Background';
import Me from '../components/Me';
import Social from '../components/Social';

const Frontpage: React.FC<{}> = () => {
  return (
    <>
      <Head>
        <title>Morten Olsen</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300&display=swap" rel="stylesheet" />
      </Head>
      <Background />
      <Me />
      <Social
        sites={[{
          title: 'Github',
          link: 'https://github.com/morten-olsen',
          logo: 'github.svg',
        }, {
          title: 'HackTheBox',
          link: 'https://app.hackthebox.eu/profile/174098',
          logo: 'htb.svg',
        }, {
          title: 'Stack Overflow',
          link: 'https://stackoverflow.com/users/1689055/morten-olsen',
          logo: 'stackoverflow.svg',
        }, {
          title: 'Linkedin',
          link: 'https://www.linkedin.com/in/mortenolsendk',
          logo: 'linkedin.svg',
        }]}
      />
    </>
  );
};

export default Frontpage;
