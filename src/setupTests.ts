import * as dotEnv from 'dotenv-safe';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import raf from './tempPolyfills';
import NotificationMock from './test/mocks/Notification';
import ConfirmMock from './test/mocks/window';

raf(() => { return; }); // need to call it for it to load

dotEnv.load({ path: '../' });

Enzyme.configure({ adapter: new Adapter() });

NotificationMock.requestPermission();
ConfirmMock();
