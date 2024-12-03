import { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad
  const average = total > 0 ? (good - bad) / total : 0
  const positivePercentage = total > 0 ? (good / total) * 100 : 0

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>
      <h1>statistics</h1>
      {total > 0 ? (
        <p>
          good {good} <br />
          neutral {neutral} <br />
          bad {bad} <br />
          all {total} <br />
          average {average} <br />
          positive {positivePercentage} %
        </p>
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  )
}

export default App
