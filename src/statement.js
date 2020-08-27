const formatToUs = (thisAmount) => {  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(thisAmount / 100);
}

const getThisAmount = (play, perf) => {
  let thisAmount = 0;
  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount
}

const calVolumeCredits = (invoice, plays) => {
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
  }
  return volumeCredits
}

const calTotalAmount = (invoice, plays) => {
  let totalAmount = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    totalAmount += getThisAmount(play, perf);
  }
  return totalAmount
}

const generateResult = (invoice, plays) => {
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    result += ` ${play.name}: ${formatToUs(getThisAmount(play, perf))} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${formatToUs(calTotalAmount(invoice, plays))}\n`;
  result += `You earned ${calVolumeCredits(invoice, plays)} credits \n`;
  return result
}



function statement (invoice, plays) {
  return generateResult(invoice, plays);
}

const generateHtml = (invoice, plays) => {
  let result = `<h1>Statement for ${invoice.customer}</h1>\n` + '<table>\n' +
  '<tr><th>play</th><th>seats</th><th>cost</th></tr>';
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    result += ` <tr><td>${play.name}</td><td>${formatToUs(getThisAmount(play, perf))}</td><td>${perf.audience}</td></tr>\n`
  }
  result += '</table>\n'
  result += `<p>Amount owed is <em>${formatToUs(calTotalAmount(invoice, plays))}</em></p>\n`
  result += `<p>You earned <em>${calVolumeCredits(invoice, plays)}</em> credits</p>\n`
  return result
}

const invoice = {
  'customer': 'BigCo2',
  'performances': [
    {
      'playID': 'as-like',
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
console.log(generateHtml(invoice, plays))

module.exports = {
  statement,
  generateHtml
};
