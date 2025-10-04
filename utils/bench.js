const autocannon = require('autocannon');

function runBench() {
  console.log(`\n🚀 Starting benchmark: Successful login`);

  const instance = autocannon({
    url: 'http://localhost:5000/user/sign-in',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'vickykumar51@gmail.com',
      password: '6032Neelam'
    }),
    connections: 50,
    duration: 20,
    pipelining: 10
  });

  // 👇 enable status code tracking
  autocannon.track(instance, {
    renderProgressBar: true,
    renderStatusCodes: true,  // <-- important
  });

  instance.on('done', (result) => {
    console.log(`\n✅ Benchmark finished`);
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Latency (ms): ${result.latency.average}`);
    console.log(`Errors: ${result.errors}`);

    // statusCodes is not included in "result"
    // You can read them by listening to response events
  });

  // Collect status codes manually
  const codes = {};
  instance.on('response', (client, statusCode) => {
    codes[statusCode] = (codes[statusCode] || 0) + 1;
  });

  instance.on('done', () => {
    console.log('Status codes:', codes);
  });
}

runBench();
