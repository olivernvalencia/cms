import cfgData from '../config/config.json' with { type: "json" };

const cfg = {
  ...cfgData,
  domainname: cfgData.DomainName,
  ipaddress: "192.168.254.102",
};

export default cfg;