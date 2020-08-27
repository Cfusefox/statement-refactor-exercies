const test = require('ava');
const {statement} = require('../src/statement');

test('statement test case1', t => {
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 55,
      },
      {
        'playID': 'as-like',
        'audience': 35,
      },
      {
        'playID': 'othello',
        'audience': 40,
      },
    ],
  };

  const plays = {
    'hamlet': {
      'name': 'Hamlet',
      'type': 'tragedy',
    },
    'as-like': {
      'name': 'As You Like It',
      'type': 'comedy',
    },
    'othello': {
      'name': 'Othello',
      'type': 'tragedy',
    },
  }; 
  const result = statement(invoice, plays);
  t.is("Statement for BigCo\n"+
 " Hamlet: $650.00 (55 seats)\n"+
 " As You Like It: $580.00 (35 seats)\n"+
" Othello: $500.00 (40 seats)\n"+
"Amount owed is $1,730.00\n" +
"You earned 47 credits \n", result)
}); 

test('statement test case2', t => {
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 20,
      },
      {
        'playID': 'as-like',
        'audience': 19,
      },
      {
        'playID': 'othello',
        'audience': 20,
      },
    ],
  };

  const plays = {
    'hamlet': {
      'name': 'Hamlet',
      'type': 'tragedy',
    },
    'as-like': {
      'name': 'As You Like It',
      'type': 'comedy',
    },
    'othello': {
      'name': 'Othello',
      'type': 'tragedy',
    },
  }; 
  const result = statement(invoice, plays);
  t.is(`Statement for BigCo
 Hamlet: $400.00 (20 seats)
 As You Like It: $357.00 (19 seats)
 Othello: $400.00 (20 seats)
Amount owed is $1,157.00
You earned 3 credits 
`, result)
}); 

test('statement test case3', t => {
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      
    ],
  };

  const plays = {
    'hamlet': {
      'name': 'Hamlet',
      'type': 'tragedy',
    },
    'as-like': {
      'name': 'As You Like It',
      'type': 'comedy',
    },
    'othello': {
      'name': 'Othello',
      'type': 'tragedy',
    },
  }; 
  const result = statement(invoice, plays);
  t.is(`Statement for BigCo
Amount owed is $0.00
You earned 0 credits 
`, result)
}); 

test('statement test case4', t => {
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 31,
      },
      {
        'playID': 'as-like',
        'audience': 19,
      },
    ],
  };

  const plays = {
    'hamlet': {
      'name': 'Hamlet',
      'type': 'tragedy',
    },
    'as-like': {
      'name': 'As You Like It',
      'type': 'comedy',
    },
    'othello': {
      'name': 'Othello',
      'type': 'tragedy',
    },
  }; 
  const result = statement(invoice, plays);
  t.is(`Statement for BigCo
 Hamlet: $410.00 (31 seats)
 As You Like It: $357.00 (19 seats)
Amount owed is $767.00
You earned 4 credits 
`, result)
}); 



