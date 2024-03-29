const getToken = (req) => {
  const authHeader = re.headers.authorization;
  const token = authHeader.split(' ')[1]

}

module.exports = getToken