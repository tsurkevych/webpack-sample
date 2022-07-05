import { DirectiveOptions } from 'vue';
import { EpMaskTokens } from '_ts/types';

/**
 * @summary Маска
 */
class Mask {
	private el: HTMLInputElement|null; // елемент
	private mask: string; // маска

	/* правила */
	private tokens: EpMaskTokens = {
		'#': {
			pattern: /\d/
		},
		X: {
			pattern: /[0-9a-zA-Z]/
		},
		S: {
			pattern: /[a-zA-Z]/
		},
		A: {
			pattern:   /[a-zA-Z]/,
			transform: (v: string) => v.toLocaleUpperCase()
		},
		a: {
			pattern:   /[a-zA-Z]/,
			transform: (v: string) => v.toLocaleLowerCase()
		},
		F: {
			pattern:   /[А-яЁёҐґєЄіІїЇйЙ]/,
			transform: (v: string) => v.toLocaleUpperCase()
		},
		'!': {
			escape: true
		}
	};

	/**
	 * @param {HTMLInputElement} el елемент
	 * @param {string} mask маска
	 */
	constructor(el: HTMLInputElement|null, mask: string) {
		this.el = el;
		this.mask = mask;
	}

	/**
	 * @static
	 * @private
	 * @param {string} name назва івента
	 * @description Додаємо кастомний івент
	 * @returns {Event} Event
	 */
	private static event(name: string): Event {
		const evt = new Event(name);

		return evt;
	}

	/**
	 * @public
	 * @param {string} value вхідний рядок
	 * @description форматування рядка
	 * @returns {string} відформатований рядок
	 */
	public maskIt(value: string): string {
		let iMask = 0;
		let iValue = 0;
		let output = '';

		while (iMask < this.mask.length && iValue < value.length) {
			let cMask = this.mask[iMask];

			const masker = this.tokens[cMask];
			const cValue = value[iValue];

			if (masker && !masker.escape && masker.pattern) {
				if (masker.pattern.test(cValue)) {
					output += masker.transform ? masker.transform(cValue) : cValue;
					iMask++;
				}
				iValue++;
			}
			else {
				if (masker && masker.escape) {
					iMask++;
					cMask = this.mask[iMask];
				}
				output += cMask;
				if (cValue === cMask) iValue++;
				iMask++;
			}
		}

		let restOutput = '';

		while (iMask < this.mask.length) {
			const cMask = this.mask[iMask];

			if (this.tokens[`${cMask}`]) {
				restOutput = '';
				break;
			}
			restOutput += cMask;
			iMask++;
		}

		return output + restOutput;
	}

	/**
	 * @public
	 * @description форматування рядка
	 */
	public init(): void {
		const el = this.el;

		if (el) {
			el.addEventListener('input', (evt: Event) => {
				if (!evt.isTrusted) return;
				let position = Number(el.selectionEnd);
				const digit = el.value[position - 1];

				el.value = this.maskIt(el.value);
				while (position < el.value.length && el.value.charAt(position - 1) !== digit) position++;

				if (el === document.activeElement) el.setSelectionRange(position, position);

				el.dispatchEvent(Mask.event('input'));
			});

			const newDisplay = this.maskIt(el.value);

			if (newDisplay !== el.value) {
				el.value = newDisplay;
				el.dispatchEvent(Mask.event('input'));
			}
		}
	}
}

const maskDirective: DirectiveOptions = {
	inserted: (el: HTMLInputElement, { value }: any) => {
		const element = el as HTMLInputElement;

		if (value) new Mask(element, value).init();
	}
};

export default maskDirective;
