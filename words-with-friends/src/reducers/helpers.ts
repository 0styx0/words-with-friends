
export function cloneClassInstance(instance: Object) {

    return Object.assign(Object.create(Object.getPrototypeOf(instance)), instance);
}