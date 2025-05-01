module.exports = {
  Group: jest.fn(() => ({
    add: jest.fn(),
  })),
  Line: jest.fn(() => ({
    points: jest.fn(),
  })),
  Shape: jest.fn(),
};
