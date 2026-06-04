(() => {
    const users = [
        {}, {}, {}, {}, {}
    ];
    function getCount() {
        return users.length;
    }
    function howManyUsers() {
        console.log(getCount());
    }
    document.getElementById('howManyUsersButton').addEventListener('click', () => {
        howManyUsers();
    });
    // in this case i could write a shorther version, but thats not the point...
    // document.getElementById('howManyUsersButton')!.addEventListener('click', howManyUsers)
})();
