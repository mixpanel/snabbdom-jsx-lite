import {jsx} from '../src/jsx';
import {render, Component} from './snabb-component';

import './app.css';

interface TimeUnitProps {
  unit: 'hours' | 'minutes' | 'seconds';
  value: number;
  maxValue?: number;
}

const ProgressCircle = ({unit, value, maxValue}: TimeUnitProps) => {
  const radiusForUnit = {
    seconds: 185,
    minutes: 150,
    hours: 115,
  };

  const radius = radiusForUnit[unit];
  const circumference = Math.PI * 2 * radius;
  const progress = 1 - value / maxValue;

  return (
    <circle
      attrs={{class: unit, r: radius, cx: 200, cy: 200}}
      style={{
        strokeDasharray: String(circumference),
        strokeDashoffset: String(progress * circumference),
      }}
    ></circle>
  );
};

const TimeSpans = ({
  hours,
  minutes,
  seconds,
  ampm,
}: {
  hours: number;
  minutes: number;
  seconds: number;
  ampm: string;
}) => (
  <>
    <span sel=".hours">{String(hours).padStart(2, `0`)}</span>
    <span sel=".minutes">{String(minutes).padStart(2, `0`)}</span>
    <span sel=".seconds">{String(seconds).padStart(2, `0`)}</span>
    <span sel=".am_pm">{ampm}</span>
  </>
);

interface ClockAppState {
  date?: Date;
}

class ClockApp extends Component<ClockAppState> {
  constructor() {
    super();

    this.update({date: new Date()});
    // update date every second
    setInterval(() => this.update({date: new Date()}), 1000);
  }

  render() {
    // inspired from https://codepen.io/prathameshkoshti/pen/Rwwaqgv
    const {date} = this.state;
    const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = date.getHours() >= 12 ? `PM` : `AM`;

    return (
      <div sel=".clock">
        <svg
          sel=".progress"
          attrs={{
            width: `400`,
            height: `400`,
            viewport: `0 0 400 400`,
          }}
        >
          <ProgressCircle unit="seconds" value={seconds} maxValue={60} />
          <ProgressCircle unit="minutes" value={minutes} maxValue={60} />
          <ProgressCircle unit="hours" value={hours} maxValue={12} />
        </svg>
        <div sel=".text_grid">
          <TimeSpans {...{hours, minutes, seconds, ampm}} />
        </div>
      </div>
    );
  }
}

render(ClockApp, document.body);
