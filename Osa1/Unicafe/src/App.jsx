import { useState } from 'react';

// Statistics-komponentti
const Statistics = ({ good, neutral, bad, total, average, positivePercentage }) => {
  return total > 0 ? (
    <p>
      Good: {good} <br />
      Neutral: {neutral} <br />
      Bad: {bad} <br />
      All: {total} <br />
      Average: {average} <br />
      Positive: {positivePercentage} %
    </p>
  ) : (
    <p>No feedback given</p>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const total = good + neutral + bad;
  const average = total > 0 ? (good - bad) / total : 0;
  const positivePercentage = total > 0 ? (good / total) * 100 : 0;

  return (
    <div>
      <h1>Give Feedback</h1>
      <div>
        <button onClick={() => setGood(good + 1)}>Good</button>
        <button onClick={() => setNeutral(neutral + 1)}>Neutral</button>
        <button onClick={() => setBad(bad + 1)}>Bad</button>
      </div>
      <h1>Statistics</h1>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positivePercentage={positivePercentage}
      />
    </div>
  );
};

export default App;


