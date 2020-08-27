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
  let data = summaryData(invoice, plays)
  let result = `Statement for ${data.customer}\n`;
  for (let item of data.items) {
    result += ` ${item.name}: ${item.thisAmount} (${item.audience} seats)\n`;
  }
  result += `Amount owed is ${data.totalAmount}\n`;
  result += `You earned ${data.valumeCredits} credits \n`;
  return result
}

const summaryData = (invoice, plays) => {
  let data = {
    customer: '',
    items: [],
    totalAmount: '',
    valumeCredits: ''
  }
  data.customer = invoice.customer;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    data.items.push({
      name: play.name,
      thisAmount: formatToUs(getThisAmount(play, perf)),
      audience: perf.audience
    })
  }
  data.totalAmount = formatToUs(calTotalAmount(invoice, plays))
  data.valumeCredits = calVolumeCredits(invoice, plays)
  return data
}

function statement (invoice, plays) {
  return generateResult(invoice, plays);
}

const generateHtml = (invoice, plays) => {
  let data = summaryData(invoice, plays)
  let result = `<h1>Statement for ${data.customer}</h1>\n` + '<table>\n' +
  '<tr><th>play</th><th>seats</th><th>cost</th></tr>';
  for (let item of data.items) {
    result += ` <tr><td>${item.name}</td><td>${item.thisAmount}</td><td>${item.audience}</td></tr>\n`
  }
  result += '</table>\n'
  result += `<p>Amount owed is <em>${data.totalAmount}</em></p>\n`
  result += `<p>You earned <em>${data.valumeCredits}</em> credits</p>\n`
  return result
}

module.exports = {
  statement,
  generateHtml
};
