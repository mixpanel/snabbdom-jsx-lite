import {assert} from 'chai';
import {jsx} from '../src/jsx';
import {describe, it} from 'mocha';

describe(`jsx-perf`, function () {
  const timeLimit = 200; //ms
  it(`jsx function can create a million nested vnodes within ${timeLimit}ms`, function () {
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

    let numVNodesCreated = 0;
    const startTime = Date.now();
    for (let i = 0; i < numRuns; ++i) {
      const vnode = render();
      numVNodesCreated += 1 /* vnode */ + vnode.children.length;
    }
    const elapsedMs = Date.now() - startTime;
    console.log(`created ${numVNodesCreated} vnodes in ${elapsedMs}ms`);

    assert(elapsedMs < timeLimit, `elapsedMs < ${timeLimit}ms`);
  });
});
