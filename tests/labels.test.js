const core = require('@actions/core');

const {getLabelsToRemove} = require("./../index");


const labelsInputsCases = [
  ["duplicate", ["duplicate"]],
  ["duplicate\nneeds review", ["duplicate", "needs review"]],

  // trim
  ["bar \n foo   ", ["bar", "foo"]],
  ["   bar\n     foo", ["bar", "foo"]],

  // ignore empty lines
  ["   \n\n     bar", ["bar"]],
  ["\n \n     \n  \n\n \n", []],

  // sort
  ["foo\nbar", ["bar", "foo"]],
  ["c\nb\n\r\ta", ["a", "b", "c"]]
];

describe("Get labels to remove", () => {
  test.each(labelsInputsCases)(
    "%s ⇢ %p",
    (input, output) => {
      const getInputMock = jest.spyOn(core, 'getInput');
      getInputMock.mockImplementationOnce(() => input);
      expect(getLabelsToRemove()).toEqual(output);
      getInputMock.mockRestore();
    }
  );
});
