
// TODO: Remove this `raf` polyfill once the below issue is sorted
// https://github.com/facebookincubator/create-react-app/issues/3199#issuecomment-332842582
const raf = (global as any).requestAnimationFrame = (cb: Function) => {
    setTimeout(cb, 0);
};

export default raf;
