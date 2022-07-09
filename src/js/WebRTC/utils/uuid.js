const uuid4 = () => {
    var temp_url = URL.createObjectURL(new Blob());
    var uuid = temp_url.toString();

    URL.revokeObjectURL(temp_url);

    return uuid.split(/[:/]/g).pop().toLowerCase(); // remove prefixes
};

export { uuid4 };
