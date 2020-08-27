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


function statement (invoice, plays) {
  let volumeCredits = 0;
  let totalAmount = 0;
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = getThisAmount(play, perf)
    //print line for this order
    result += ` ${play.name}: ${formatToUs(thisAmount)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${formatToUs(totalAmount)}\n`;
  result += `You earned ${calVolumeCredits(invoice, plays)} credits \n`;
  return result;
}


module.exports = {
  statement,
};
