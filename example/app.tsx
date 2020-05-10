import {h, Frag} from '../src/jsx';
import {init as snabbdomInit} from 'snabbdom/snabbdom';
import toVNode from 'snabbdom/tovnode';
import {VNode} from 'snabbdom/vnode';
import attrsModule from 'snabbdom/modules/attributes';
import classModule from 'snabbdom/modules/class';
import styleModule from 'snabbdom/modules/style';
import propsModule from 'snabbdom/modules/props';
import onModule from 'snabbdom/modules/eventlisteners';

// initialize snabbdom
const patch = snabbdomInit([attrsModule, classModule, styleModule, onModule, propsModule]);

interface ClockState {
  date?: Date;
}

interface ClockProps {
  renderCallback?: (vnode: VNode) => void;
}

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
  <Frag>
    <span sel=".hours">{String(hours).padStart(2, `0`)}</span>
    <span sel=".minutes">{String(minutes).padStart(2, `0`)}</span>
    <span sel=".seconds">{String(seconds).padStart(2, `0`)}</span>
    <span sel=".am_pm">{ampm}</span>
  </Frag>
);

class ClockApp {
  private props: ClockProps = {};
  private state: ClockState = {};

  constructor(props: ClockProps) {
    this.props = props;
    this.update({date: new Date()});

    // update date every second
    setInterval(() => this.update({date: new Date()}), 1000);
  }

  update(stateUpdate: any) {
    // simple update -> render -> callback loop
    this.state = Object.assign(this.state, stateUpdate);
    this.props.renderCallback(this.render());
  }

  render() {
    // inspired from https://codepen.io/prathameshkoshti/pen/Rwwaqgv
    const date = new Date();
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
          <Frag>
            <ProgressCircle unit="seconds" value={seconds} maxValue={60} />
            <ProgressCircle unit="minutes" value={minutes} maxValue={60} />
            <ProgressCircle unit="hours" value={hours} maxValue={12} />
          </Frag>
        </svg>
        <div sel=".text_grid">
          <TimeSpans {...{hours, minutes, seconds, ampm}} />
        </div>
      </div>
    );
  }
}

function bindRender(el: HTMLElement) {
  // append empty vnode
  let vnode = toVNode(document.createComment(``));
  el.appendChild(vnode.elm);

  function renderCallback(newVNode: VNode) {
    vnode = patch(vnode, newVNode);
  }

  return renderCallback;
}

new ClockApp({
  renderCallback: bindRender(document.body),
});
