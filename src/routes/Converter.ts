export function any2PositiveInteger(value: any): number {
    let num = parseInt(value);
    if (num > 0 && Number.isInteger(num)) {
        return num;
    }
    return -1;
}

export function value2Red(value: number): number {
    return value & 0xff;
}

export function value2Green(value: number): number {
    return (value >> 8) & 0xff;
}

export function value2Blue(value: number): number {
    return (value >> 16) & 0xff;
}

export function value2Alpha(value: number): number {
    return (value >> 24) & 0xff;
}

export function value2voltage(value: number): string {
    let value2 = value & 0xFFFFFFFF;
    let alpha = value2Alpha(value2).toString(16);
    let blue = value2Blue(value2).toString(16);
    let green = value2Green(value2).toString(16);
    let red = value2Red(value2).toString(16);
    return ((alpha.length < 2 ? '0' : '') + alpha + (blue.length < 2 ? '0' : '') + blue + (green.length < 2 ? '0' : '') + green + (red.length < 2 ? '0' : '') + red).toUpperCase();
}

export function value2shortVoltage(value: number): string {
    let value2 = value & 0xFFFFFFFF;
    if (value2 < 0) value2 += 0x100000000;
    return (value2.toString(16)).toUpperCase();
}

export function value2Color(value: number): string {
    let value2 = value & 0xFFFFFFFF;
    let alpha = value2Alpha(value2).toString(16);
    let blue = value2Blue(value2).toString(16);
    let green = value2Green(value2).toString(16);
    let red = value2Red(value2).toString(16);
    return '#' + (red.length < 2 ? '0' : '') + red + (green.length < 2 ? '0' : '') + green + (blue.length < 2 ? '0' : '') + blue + (alpha.length < 2 ? '0' : '') + alpha;
}

export function voltage2Value(voltage: string): number {
    if (voltage.length > 8 || voltage.replace(/[0-9a-f]/gi, '').length > 0) {
        throw new Error("输入的电压有误");
    }
    let value = 0;
    for (let i = 0; i < voltage.length; i++) {
        value = value << 4;
        let temp = parseInt(voltage[i], 16);
        if (temp >= 0) {
            value = value | temp;
        } else {
            throw new Error("输入的电压有误");
        }
    }
    if (value < 0) value += 0x100000000;
    return value;
}

export function values2string(values: number[][]): string {
    let result = new Array<string>(values.length);
    for (let i = 0; i < values.length; i++) {
        let lastNotZero = -1;
        let row = values[i];
        for (let j = row.length - 1; j >= 0; j--) {
            if (row[j] && row[j] != 0) {
                lastNotZero = j;
                break;
            }
        }
        let rowString = ""
        for (let j = 0; j < lastNotZero; j++) {
            rowString += value2shortVoltage(row[j]) + ",";
        }
        if (lastNotZero > -1) {
            rowString += value2shortVoltage(row[lastNotZero]);
        }
        result[i] = rowString;
    }
    return result.join(";");
}

export function string2values(str: string, width: number = 0, height: number = 0) {
    let rowList: number[][] = new Array<Array<number>>();
    let maxColLength: number = 0;
    let rows: string[] = str.split(';');
    for (let row of rows) {
        let cols: string[] = row.split(',');
        if (cols.length > maxColLength) {
            maxColLength = cols.length;
        }
        let uints: number[] = new Array<number>(cols.length);
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].length > 0) {
                uints[i] = parseInt(cols[i], 16);
            }
        }
        rowList.push(uints);
    }
    height = height == 0 ? rows.length : height;
    width = width == 0 ? maxColLength : width;
    let image: number[][] = Array<Array<number>>(height);
    for (let i: number = 0; i < height; i++) {
        if (i == rowList.length) {
            break;
        }
        image[i] = new Array<number>(width);
        for (let j: number = 0; j < rowList[i].length; j++) {
            if (j == width) {
                break;
            }
            image[i][j] = rowList[i][j];
        }
    }
    return {
        width: width,
        height: height,
        values: image
    }
}

export function imageData2values(image: ImageData): number[][] {
    let values: number[][] = new Array<Array<number>>(image.height);
    for (let y = 0; y < image.height; y++) {
        values[y] = new Array<number>(image.width);
        for (let x = 0; x < image.width; x++) {
            let index = (y * image.width + x) * 4;
            values[y][x] = (image.data[index]) | (image.data[index + 1] << 8) | (image.data[index + 2] << 16) | (image.data[index + 3] << 24);
        }
    }
    return values;
}

export function values2imageData(values: number[][], width: number, height: number): ImageData {
    let image: ImageData = new ImageData(width, height);
    for (let y = 0; y < height; y++) {
        let row = values[y];
        if (row) {
            for (let x = 0; x < width; x++) {
                let value = row[x] ?? 0;
                let index = (y * width + x) * 4;
                image.data[index] = value2Red(value);
                image.data[index + 1] = value2Green(value);
                image.data[index + 2] = value2Blue(value);
                image.data[index + 3] = value2Alpha(value);
            }
        }
    }
    return image;
}