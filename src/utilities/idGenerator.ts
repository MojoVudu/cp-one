const idGenerator = () => {
    let id = '';
    for(let i = 1; i <= 6; i += 1) {
        id += `${Math.floor((Math.random() * 9) + 1)}`;
    }
    return id;
}

export default idGenerator;