/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  for(const character of allowedTypes) {
    yield new character(maxLevel);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];
  const iterator = characterGenerator(allowedTypes, maxLevel);
  for(let i = 0; i < characterCount; i++){
    team.push(iterator.next());
  }
  return team;
}
