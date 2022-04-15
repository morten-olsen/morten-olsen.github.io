import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Profile } from '../../data/repos/profile';
import { SlideIn } from '../animations/slide-in';

type Props = {
  profile: Profile;
}

const Wrapper = styled.div`
  position: relative;
  min-height: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
`;

const Avatar = styled.div<{src: string}>`
  background-image: url('${({ src }) => src}');
  max-width: 400px;
  width: 100%;
  border-radius: 50%;
  background-size: cover;
  border: solid 5px #f0f0f0;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  transform: scaleX(-1);
  margin-bottom: -30px;
`;

const AvatarSpacer = styled.div`
  padding-bottom: 100%;
`;

const Name = styled.h1`
  background: #000;
  font-size: 3rem;
  line-height: 4rem;
  font-weight: 400;
  font-family: "Pacifico";
  color: #fff;
  margin: 0;
  padding: 10px;
  text-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  text-align: center;
  transform: rotate(-3deg);
`;

const Tagline = styled.h2`
  display: block;
  background: #f0f0f0;
  font-size: 1.5rem;
  font-weight: 100;
  font-family: "Pacifico";
  font-family: "Fredoka";
  color: #000;
  padding: 5px;
  margin: 0;
  text-align: center;
  border: solid 1px #000;
  transform: translateY(-5px) rotate(2deg);
`;

const Social = styled.div`
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const SocialItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #000;
`;

const SocialText = styled.div`
  margin-left: 20px;
  font-family: "Fredoka";
`;

const SocialLogo = styled.div<{ src: string }>`
  background-image: url('${({ src }) => src}');
  width: 50px;
  height: 50px;
  background-size: cover;
`

const Hero: React.FC<Props> = ({ profile }) => {
  const [background, setBackground] = useState<any>();
  useEffect(
    () => {
      import('./background').then(({ default: HeroBackground }) => {
        setBackground(<HeroBackground />);
      })
    },
    [],
  )
  return (
    <Wrapper>
      <Avatar src={profile.avatar}>
        <AvatarSpacer />
      </Avatar>
      <Name>
        {profile.name}
      </Name>
      <Tagline>{profile.tagline}</Tagline>
      <Social>
        <SlideIn>
          <SocialItem href={profile.resume} target="_blank">
            <SocialText>Resumé</SocialText>
          </SocialItem>
        </SlideIn>
        {profile.social.map((social) => (
          <SlideIn key={social.name}>
          <SocialItem key={social.name} href={social.link} target="_blank">
            <SocialLogo src={social.logo} />
            <SocialText>{social.name}</SocialText>
          </SocialItem>
          </SlideIn>
        ))}
      </Social>
      {background}
    </Wrapper>
  );
}

export { Hero };
