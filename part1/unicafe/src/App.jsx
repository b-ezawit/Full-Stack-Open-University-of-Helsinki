import { useState } from 'react'
const Button = ({onClick, text}) => {
  return(
    <button onClick ={onClick}>
      {text}
    </button>
  )
}

const StatisticLine = ({text, val}) => {
  return(
    <>
        <tr>
          <td>{text}</td>
          <td>{val}</td>
        </tr>
    </>
  )
}

const Statistics = ({all,avg,postivePer,good,bad,neutral}) => {
  all = good + bad + neutral
  avg = all>0 ? (good-bad) / all : 0
  postivePer = all>0? (good/all) * 100 : 0

  if( all === 0) {
    return(
      <>
        <p>No feedbacks given</p>
      </>
    )
  }
  return(
      <>

        <table>
          <tbody>
            <StatisticLine text="good: " val={good}/>
            <StatisticLine text="neutral: " val={neutral}/>
            <StatisticLine text="bad: " val={bad}/>
            <StatisticLine text="all: " val={all}/>
            <StatisticLine text="average: " val={avg}/>
            <StatisticLine text="positive percentage: " val={`${postivePer}%`}/> 
          </tbody>
        </table>    
      </>
  )
}

const App = () => {
  const [ good, setGood ] = useState(0)
  const [ neutral, setNeutral ] = useState(0)
  const [ bad , setBad ] = useState(0)
  let [ all , setAll ] = useState(0) 
  let [ avg , setAvg ] = useState(0)
  let [ postivePer , setPer ] = useState(0)


  return(
    <>
      <h1>give feedback</h1>
      <br/>
      <Button onClick={ ()=>{setGood(good+1)} } text="good"/>
      <Button onClick={ () => { setNeutral(neutral+1)} } text="neutral"/>
      <Button onClick={ () => { setBad(bad+1)} } text="bad"/>
      <br/>
      <h2>statistics</h2>
      <br/>
      <Statistics all={all} avg={avg} postivePer={postivePer} good={good} bad={bad} neutral={neutral}/>
    </>
  )
}

export default App