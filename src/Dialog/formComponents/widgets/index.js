import EmailWidget from './EmailWidget';
import CidrWidget from './CidrWidget';
import MacWidget from './MacWidget';
import UuidWidget from './UuidWidget';
import Ipv4Widget from './Ipv4Widget';

export default Object.freeze({
  email: EmailWidget,
  cidr: CidrWidget,
  mac: MacWidget,
  uuid: UuidWidget,
  ipv4: Ipv4Widget
});
