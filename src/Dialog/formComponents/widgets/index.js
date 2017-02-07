import EmailWidget from './EmailWidget';
import CidrWidget from './CidrWidget';
import MacWidget from './MacWidget';
import UuidWidget from './UuidWidget';
import Ipv4Widget from './Ipv4Widget';
import TextWidget from './TextWidget';
import SelectWidget from './SelectWidget';
import CodeWidget from './CodeWidget.jsx';

export default Object.freeze({
  select: SelectWidget,
  text: TextWidget,
  email: EmailWidget,
  cidr: CidrWidget,
  mac: MacWidget,
  uuid: UuidWidget,
  ipv4: Ipv4Widget,
  js: CodeWidget,
  yaml: CodeWidget
});
