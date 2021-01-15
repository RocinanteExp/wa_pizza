const print = {};

print.grp = (label) => {
    console.group(label);
};

print.grpend = () => {
    console.groupEnd();
};

print.out = (...message) => {
    console.log(...message);
};

print.tb = (array) => {
    console.table(array);
};

print.err = (message) => {
    console.error("ERRORE");
    console.error(...message);
};

export default print;
