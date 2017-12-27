
export default (value: number = 0.5) => {

    const mockMath = Object.create(global.Math);
    mockMath.random = () => value;
    Object.defineProperty(global, 'Math', { value: mockMath });
};

