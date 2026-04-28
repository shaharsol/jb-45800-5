// how to set up environment variables data in Linux
// 1. set it in the sh level by editing a sh script (every new terminal that starts will have the data set)
// 2. export the data to the shell, relevant until the shell closes
// 3. set up the data for a single command

const port = 
console.log(`hello ${process.env.FIRST_NAME} ${process.env.LAST_NAME}`)


