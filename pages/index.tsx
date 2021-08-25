import React, { useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Me from '../components/Me';
import Social from '../components/Social';

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  widht: 100%;
  height: 100%;
  z-index: -1;
`;

const Frontpage: React.FC<{}> = () => {
  useEffect(() => {
    const run = async () => {
      const { default: Particles } = await import('particlesjs');
      Particles.init({
        selector: '.background',
        connectParticles: true,
        color: '#dddddd',
        maxParticles: 200,
      });
      console.log(Particles);
    };
    run();
  });

  return (
    <>
      <Head>
        <title>Morten Olsen</title>
      </Head>
      <Me />
      <Canvas className="background" />
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
