const Header = (props) => {
  return (
    <>
      <h1>{props.courseName}</h1>
    </>
  )
}

const Part = (props) => {
  return (
    <>
      <p>{props.partName} {props.numOfTasks}</p>
    </>
  )
}

const Content = (props) => {
  const parts = props.parts // shows props has an attribute list and is given to the variable
  return(
    <>
      {parts.map((aPart)=>{
        return <Part
                  key = {aPart.id}
                  partName = {aPart.name}
                  numOfTasks = {aPart.exercises}
              />
      }) }
    </>
  )
}

const Total = (props) => {
  let parts = props.parts
  let total = parts.reduce( (sum,part) => {return sum + part.exercises}, 0)

  return (
    <>
      <h4>Total number of exercises: {total} </h4>
    </>
  )
}

const Course = ({courses}) => {
  return (
    <div>

      {courses.map( (course) => {
        return (
        <div key={course.id}>
          <Header courseName={course.name} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
          <br/>
        </div>)
      } )}
      
      
    </div>
  )
}

export default Course