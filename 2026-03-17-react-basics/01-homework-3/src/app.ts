import Backup from './backup.js'
import Kitten from './kitten.js'

const b1 = new Backup('s1', 'string value')
const b2 = new Backup('s2', 2)
const b3 = new Backup('s3', false)
const b4 = new Backup('s4', new Date())
const b5 = new Backup('s5', new Kitten('mitzi', 'grey', 3))

b1.display()
b2.display()
b3.display()
b4.display()
b5.display()

document.getElementById('lidor')!.innerHTML = 'hjfsdhkjghsdkj'