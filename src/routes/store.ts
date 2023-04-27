import {
    writable
} from 'svelte/store';
import {
    string2values
} from './Converter';

function createValues() {
    const {
        subscribe,
        set,
        update
    } = writable(new Array<Array<number>>(0));

    return {
        subscribe,
        initiate: (width: number, height: number, values: number[][] | null = null) => {
            if (values) {
                set(values);
            } else {
                let array = new Array<Array<number>>();
                for (let i = 0; i < height; i++) {
                    array.push(new Array<number>(width));
                }
                set(array);
            }
        },
        write: (x: number, y: number, value: number) => {
            update(oldValues => {
                oldValues[y][x] = value;
                return oldValues;
            })
        },
        import: (str: string, width: number = 0, height: number = 0) => {
            set(string2values(str, width, height).values);
        }
    };
}

export const storeValues = createValues();