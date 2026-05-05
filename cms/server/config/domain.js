import origin from './origin.js'
const domain = window.location.hostname;

const cfg = {
    domainname: domain,
    serverport: origin.serverport,
  };
  
  export default cfg;