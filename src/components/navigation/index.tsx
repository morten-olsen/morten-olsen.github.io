import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { Content } from "../content";

type Props = {
  name: string;
};

const Menu = styled.aside`
  font-size: 2rem;
  padding: 1rem 0;
  margin-top: 50px;
  font-family: "Pacifico";
`;

const MenuItem = styled(Link)`
`;

const Navigation: React.FC<Props> = ({ name }) => (
  <Menu>
    <Content>
      by <MenuItem href="/">{name}</MenuItem>
    </Content>
  </Menu>
);

export { Navigation };
