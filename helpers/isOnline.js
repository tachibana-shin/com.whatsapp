export default function isOnline(members) {
  return members.some(item => item["is-online"]);
}
