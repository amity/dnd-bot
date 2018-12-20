export function dmToggle(userID: string): string {
  let returnMessage = "Error: userID not found.";
  global.dmSet.has(userID)
    ? (global.dmSet.delete(userID), (returnMessage = "no longer a DM."))
    : (global.dmSet.add(userID), (returnMessage = "now a DM."));
  return returnMessage;
}
