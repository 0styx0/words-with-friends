import raf from './tempPolyfills';
raf(() => { return; }); // need to call it for it to load

import * as dotEnv from 'dotenv-safe';
dotEnv.load({ path: '../' });

import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

