// __mocks__/quill.js

const testElement = document.createElement("div");
testElement.setAttribute("data-testid", "mock-body-element");
testElement.textContent = "Test Element";
document.body.appendChild(testElement);

let isWorked = false;

const QuillMock: any = jest.fn();

QuillMock.mockImplementation((container: HTMLElement, options: any) => {
  QuillMock.prototype.on = jest.fn(
    (event: string, callback: (text: string, text2: string) => void) => {
      if (!isWorked && event === "text-change") {
        isWorked = true;
        callback("text-change", "some changes");
      }
    },
  );

  const button = document.createElement("button");
  button.textContent = "Custom Button";
  button.classList.add("ql-custom-button");
  button.setAttribute("data-testid", "custom-button");
  button.onclick = () => {
    if (options.modules.toolbar?.handlers["custom-button-mocked-uuid"]) {
      return options.modules.toolbar.handlers["custom-button-mocked-uuid"]();
    }
  };
  testElement.onclick =
    options.modules.toolbar?.handlers &&
    options.modules.toolbar?.handlers["custom-button-mocked-uuid"]
      ? options.modules.toolbar.handlers["custom-button-mocked-uuid"]()
      : jest.fn();

  container.appendChild(button);

  return {
    root: container,
    addContainer: jest.fn((container: HTMLElement | string) => {
      return container instanceof HTMLElement
        ? container
        : document.createElement("div");
    }),
    blur: jest.fn(),
    deleteText: jest.fn(),
    getSelection: jest.fn().mockReturnValue({ index: 0 }),
    setSelection: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    clipboard: {
      dangerouslyPasteHTML: jest.fn(),
    },
    theme: { name: "bubble" },
    history: {},
    uploader: {},
  };
});

QuillMock.import = jest.fn().mockReturnValue({
  whitelist: [],
});

QuillMock.register = jest.fn();

module.exports = QuillMock;
