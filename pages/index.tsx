import React from 'react';
import Me from '../components/Me';
import Social from '../components/Social';

const Frontpage: React.FC<{}> = () => (
  <>
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

export default Frontpage;
