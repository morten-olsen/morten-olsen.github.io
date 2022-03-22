import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { Content } from "../content";

const Menu = styled.aside`
  font-size: 2rem;
  padding: 1rem 0;
  margin-top: 50px;
  font-family: "Pacifico";
`;

const MenuItem = styled(Link)`
`;

const Navigation: React.FC<{}> = () => (
  <Menu>
    <Content>
      by <MenuItem href="/">Morten Olsen</MenuItem>
    </Content>
  </Menu>
);

export { Navigation };
