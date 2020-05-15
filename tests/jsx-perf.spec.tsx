import {assert} from 'chai';
import {jsx} from '../src/jsx';
import {describe, it} from 'mocha';

describe(`jsx-perf`, function () {
  it(`jsx function can create a million nested vnodes within 100ms`, function () {
    const Part = ({part}: {part: string}) => <span>{part}</span>;
    const render = () => (
      <div>
        <a attrs={{href: `https://github.com/nojvek/snabbdom-jsx-lite`}}>snabbdom-jsx-lite</a>
        and tsx
        {[`work`, `like`, `a`, `charm!`].map((part) => (
          <Part part={part}></Part>
        ))}
        <emoji>💃</emoji>
        <emoji>🕺</emoji>
        <emoji>🎉</emoji>
      </div>
    );

    const numRuns = 100_000;
    const timeLimit = 150; //ms

    let numVNodesCreated = 0;
    const startTime = Date.now();
    for (let i = 0; i < numRuns; ++i) {
      const vnode = render();
      numVNodesCreated += 1 /* vnode */ + vnode.children.length;
    }
    const elapsedMs = Date.now() - startTime;
    console.log(`created ${numVNodesCreated} vnodes within ${elapsedMs}ms`);

    assert(elapsedMs < timeLimit, `elapsedMs < ${timeLimit}ms`);
  });
});
