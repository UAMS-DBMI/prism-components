export function sum (a, b) {
  return a + b
}

function mongoSane (values) {
  return (values && values.length !== 0)
}

function mongoInner (name, values) {
  const clauses = []
  for (const value of values) {
    const clause = {}
    clause[name] = value
    clauses.push(clause)
  }
  return clauses
}

export function mongoOr (name, values) {
  const ret = {}
  if (!mongoSane(values)) {
    return null
  }
  ret.$or = mongoInner(name, values)
  return ret
}

export function mongoAnd (name, values) {
  const ret = {}
  if (!mongoSane(values)) {
    return null
  }
  ret.$and = mongoInner(name, values)
  return ret
}

export function mongoText (name, text) {
  // let regx = new RegExp(text + '.*');
  const ret = {}
  ret[name] = { $regex: '^' + text }
  return ret
}
