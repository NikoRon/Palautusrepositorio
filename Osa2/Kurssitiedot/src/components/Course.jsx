import React from "react";

//Course.jsx:ään siirretään kaikki sen alikomponentit eli 
//alla olevat header, content ja total. Appiin jää vain 'data' ja return
const Course = ({ course }) => {
    return(
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    );
  };

//h2 muokkauksessa pienempi otsikko
const Header = ({ course }) => <h2>{course}</h2>;


const Content = ({ parts }) => (
    <div>
      {parts.map((part, index) => {
        console.log(part);
        return (
          <p key={index}>
            {part.name} {part.exercises}
          </p>
        );
      })}
    </div>
  );
  


const Total = ({ parts }) => {
    const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
    return <p><b>total of {totalExercises} exercises</b></p>;
};

export default Course;