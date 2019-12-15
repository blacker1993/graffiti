// node -r ts-node/register -r ./src/register.ts examples/mithril/counter.tsx

/* @jsx m */
import * as m from 'mithril'

class Counter {
  count = 0

  view() {
    return (
      <div style={styles.container}>
        <span>Count: {this.count}</span>

        <button onclick={() => this.count++}>++</button>
      </div>
    )
  }
}

const styles = {
  container: {
    padding: 20,
    flexDirection: 'column'
  }
}

m.mount(document.body, Counter)