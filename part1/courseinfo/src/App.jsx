const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )
}

const Part = (props) => {
  return (
    <>
      <p>{props.part} {props.numOfTasks}</p>
    </>
  )
}

const Content = (props) => {
  const parts = props.parts // shows props has an attribute list and is given to the variable
  return(
    <>
      {parts.map((item,index)=>{
        return <Part
                  key = {index}
                  part = {item.name}
                  numOfTasks = {item.exercises}
              />
      }) }
    </>
  )
}

const Total = (props) => {
  let total = 0
  let parts = props.parts

  for (let i = 0; i < parts.length; i++) {
    total += parts[i].exercises
  }

  return (
    <>
      <h4>Total number of exercises: {total} </h4>
    </>
  )
}

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

export default App