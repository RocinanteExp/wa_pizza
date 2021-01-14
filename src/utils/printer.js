const print = {};

print.grp = (label) => {
    console.group(label);
}

print.grpend = () => {
    console.groupEnd();
}

print.out = (message) => {
    console.log(message);
}

print.err = (message) => {
    console.error("ERRORE: " + message);
}

export default print;
