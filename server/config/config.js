// import cfgData from './config.json' with { type: "json" };

// const cfg = {
//   ...cfgData,
//   domainname: cfgData.DomainName,
  
// };

// export default cfg;

import cfgData from './config.json' assert { type: "json" };

const cfg = {
  ...cfgData,
  domainname: cfgData.DomainName,
};

export default cfg;

