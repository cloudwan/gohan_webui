import EmailWidget from './EmailWidget';
import CidrWidget from './CidrWidget';
import MacWidget from './MacWidget';
import UuidWidget from './UuidWidget';
import Ipv4Widget from './Ipv4Widget';
import Ipv6Widget from './Ipv6Widget';
import TextWidget from './TextWidget';
import SelectWidget from './SelectWidget';
import CodeWidget from './CodeWidget.jsx';

export default Object.freeze({
  select: SelectWidget,
  text: TextWidget,
  version: TextWidget,
  email: EmailWidget,
  cidr: CidrWidget,
  'cidr-or-ipv4': CidrWidget,
  mac: MacWidget,
  uuid: UuidWidget,
  ipv4: Ipv4Widget,
  'ipv4-network': Ipv4Widget,
  'ipv4-address-with-cidr': Ipv4Widget,
  ipv6: Ipv6Widget,
  js: CodeWidget,
  yaml: CodeWidget
});
