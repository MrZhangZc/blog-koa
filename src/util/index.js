
export const logJson = (level, msg, proj) => {
  console.log(JSON.stringify({ level: level, msg: msg, proj: proj }))
}