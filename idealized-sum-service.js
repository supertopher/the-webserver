runExamples([

  [ 'get the documentation',
    { action: 'get', resource: [],
      accept: { meaning: 'document', encoding: 'text' }
    }
  ],

  // *** more examples go here

  [ 'add a number',
    { action: 'post', resource: ['nums'],
      body: '1', type: { meaning: 'number', encoding: 'csv' },
      accept: { meaning: 'number', encoding: 'csv' }
    }
  ],

])

// ---

function appServer(request) {

  // init global state on this fn object on first request
  appServer.numbers = appServer.numbers || []
  // grab a local ref to it for typing convenience
  var numbers = appServer.numbers

  var response = {}

  // the root resource
  if (!request.resource[0] && 'get' === request.action) {
    response.status = 'ok'
    response.type = { meaning: 'document', encoding: 'text' },
    response.body = [
      'Addition as a service',
      '',
      'get  []              - this document',
      'post ["nums"]        - add number to list in storage',
      'get  ["nums"]        - retreive list of numbers from storage',
      'get  ["nums", "sum"] - retreive sum of numbers in said list',
    ].join('\n')
    return response
  }

  if ('post' === request.action) {
    response.status = 'ok'
    response.type = { meaning: 'number', encoding: 'csv' }
    response.body = 1
    return response
  }

  //now we need to write code for when the request is a post

  // *** solution code goes here

}

// ---

function appClient(request) { return appServer(request) }

// ---

// Not part of the challenge, just driver support code to make
// visual testing easier

function runExamples(examples) {
  filterExamples(examples).forEach(function(args){
    var msg = args.shift()
    var req = args.shift()
    debugger


    console.log("the request is " + req)

    console.log()
    console.log(ansi(msg, 34))
    console.log()
    console.log(ansi('-->', 33), req)
    console.log()
    var res = appClient(req)
    if (!res) {
      console.error(ansi('server did not return response', 31))
      return
    }

    var body = res.body
    delete res.body
    console.log(ansi('<--', 33), res)
    console.log()
    console.log(ansi(body, 35))
    console.log()
    console.log('---')
  })
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#Colors
function ansi(str, code) {
  if (!(isNode() && process.stdout.isTTY)) return str
  code = code || 10
  return "\u001b[" + code + "m" + str + "\u001b[m"
}

// in node, allow the user to run just one example by providing it as an arg on the
// command line
function filterExamples(examples) {
  console.log("args in examples are " + process.argv)
  if (!isNode()) return examples
  var arg = process.argv[2]
  if (!arg) return examples
  return examples.filter(function(example){ return example[0] === arg })
}

function isNode() { return 'undefined' !== typeof process }