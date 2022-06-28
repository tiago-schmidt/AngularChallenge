import { TimeMaskPipe } from "./time-mask.pipe";

describe('TimeMaskPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeMaskPipe();
    expect(pipe).toBeTruthy();
  });
});
