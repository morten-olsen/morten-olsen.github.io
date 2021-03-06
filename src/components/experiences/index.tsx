import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { Experience } from "../../data/repos/experiences"
import { SlideIn } from '../animations/slide-in';

type Props = {
  experiences: Experience[];
};

const OuterOuter = styled.div`
  margin-top: 100px;
`;

const Wrapper = styled.div`
  margin-bottom: 50px;
`;

const Outer = styled.div`
  position: relative;
`;

const ExperienceWrapper = styled.div`
  margin-left: 20px;
  padding: 20px 40px;
  border-left: solid 1px #eee;

  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: #ccc;
    border-radius: 50%;
    top: 50%;
    left: 15px;
    translate: transformY(-50%);
  }

  line-height: 1.8rem;
  letter-spacing: 0.5px;

  p + p:first-letter {
    padding-left: 20px;
  }
`;

const Inner = styled(SlideIn)`
  border: solid 1px #eee;
  padding: 20px;
`;

const CompanyName = styled.h5`

`;

const JobTitle = styled.h4`
  font-size: 1.3rem; 
`;

const Time = styled.div`
  font-size: 0.8rem;
`;

const Title = styled.h2`
  margin: 2rem 0;
  text-align: center;
`;

const More = styled.div`
  color: #3498db;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 10px;
`;

const Hidden = styled.div`
  overflow: hidden;
  transition: all 0.3s ease-out;
`;

const ExperienceRow = ({ experience }) => {
  const [visible, setVisible] = useState(false);
  return (
    <Outer>
      <ExperienceWrapper>
        <Inner>
          <CompanyName>{experience.company.name}</CompanyName>
          <JobTitle>{experience.title}</JobTitle>
          <Time>{experience.startDate} - {experience.endDate}</Time>
          <Hidden 
            style={{
              maxHeight: visible ? 1000 : 0,
              opacity: visible ? 1 : 0,
            }}
          >
            <ReactMarkdown>
              {experience.content}
            </ReactMarkdown>
          </Hidden>
          <More onClick={() => setVisible(!visible)}>Show {visible ? 'less' : 'more'}</More>        
        </Inner>
      </ExperienceWrapper>
    </Outer>
  );
}


const Experiences: React.FC<Props> = ({ experiences }) => (
  <OuterOuter>
    <Wrapper>
      <Title>Experiences</Title>
      {experiences.map((experience) => (
        <ExperienceRow experience={experience} key={experience.id} />
      ))}
    </Wrapper>
  </OuterOuter>
);

export { Experiences };
