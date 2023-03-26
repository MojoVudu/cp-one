const currencyFormatter = (value: string, type: string | null = null) => {
    const length = value.length;
    if(length >= 4 && length <= 6) {
        const idx = length - 3;
        value = `${value.substring(0, idx)},${value.substring(idx, length)}`;
    }else if(length >= 7 && length <= 9) {
        const idx = length - 6;
        const idy = length - 3;
        value = `${value.substring(0, idx)},${value.slice(idx, idy)},${value.slice(idy, length)}`;
    }

    if(type === "mobile") {
        value = `$${value}`;
    } else {
        if(value.length > 0) value = `$${value}.00`;
    }
    
    return value;
}

export default currencyFormatter;