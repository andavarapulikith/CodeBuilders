import Quill from 'quill';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const Embed = Quill.import('blots/block/embed');

class FormulaBlot extends Embed {
  static create(value) {
    const node = super.create();
    katex.render(value, node, {
      throwOnError: false,
      displayMode: true
    });
    node.setAttribute('data-value', value);
    return node;
  }

  static value(node) {
    return node.getAttribute('data-value');
  }
}

FormulaBlot.blotName = 'formula';
FormulaBlot.tagName = 'div';
FormulaBlot.className = 'ql-formula';

Quill.register(FormulaBlot);

const Formula = {
  insertFormula(quill) {
    const range = quill.getSelection();
    if (range != null) {
      const value = prompt('Enter a formula:');
      if (value != null) {
        quill.insertEmbed(range.index, 'formula', value, 'user');
      }
    }
  },
};

export default Formula;
